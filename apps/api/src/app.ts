import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
  Router,
  Application,
} from 'express';
import cors from 'cors';
import { PORT } from './config';
import { authRouter } from './routers/auth.router';
import { ErrorHandler } from './helpers/response.handler';
import { uploadRouter } from './routers/upload.router';
import { UserTransactionRouter } from './routers/user-transactions.routes';
import { TenantTransactionRouter } from './routers/tenant-transaction-management.routes';
import { cityRouter } from './routers/city.router';
import { facilityRouter } from './routers/facility.router';
import { categoryRouter } from './routers/category.router';
import { userRouter } from './routers/user.router';
import { propertyRouter } from './routers/property.router';
import { tenantCategoryRouter } from './routers/ternant-category.router';
import { tenantPropertyRouter } from './routers/tenant-property.router';
import { verifyUser } from './middalewares/auth.middleware';
import { authorizeTenantAction } from './middalewares/authorizeTenantAction';
import reviewRouter from './routers/review.router';

export default class App {
  private app: Application;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(express.json());
    this.app.use(cors());
    // this.app.use(urlencoded({ extended: true }));
  }

  private handleError() {
    //not found handler
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.status(404).send('Not found !');
    });

    //error handler
    this.app.use(
      (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
        res.status(err.code || 500).send({
          message: err.message,
        });
      },
    );
  }

  private routes(): void {
    const usertransactionRouter = new UserTransactionRouter();
    const tenantTransactionManagementRouter = new TenantTransactionRouter();

    this.app.get('/api', (req: Request, res: Response) => {
      res.send('Hello, Purwadhika Student API!');
    });

    //global
    this.app.use('/api/auth', authRouter());
    this.app.use('/api/upload-image', uploadRouter());
    this.app.use('/api/city', cityRouter());
    this.app.use('/api/facility', facilityRouter());
    this.app.use('/api/user', userRouter());
    this.app.use('/api/category', categoryRouter());
    this.app.use('/api/property', propertyRouter());

    //tenant
    this.app.use('/api/tenant-category', verifyUser, tenantCategoryRouter());
    this.app.use(
      '/api/tenant-property',
      verifyUser,
      // authorizeTenantAction,
      tenantPropertyRouter(),
    );

    // review
    this.app.use('/api/review', reviewRouter());

    // transaction
    this.app.use('/api', usertransactionRouter.getRouter());
    this.app.use('/api', tenantTransactionManagementRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(` ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
