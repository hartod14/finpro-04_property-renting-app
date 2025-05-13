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
import { tenantRoomAvailabilityRouter } from './routers/tenant-room-availability.router';
import { tenantSeasonRateRouter } from './routers/tenant-season-rate.router';
import reviewRouter from './routers/review.router';
import reportRouter from './routers/report.router';

const app = express();

// Configure
app.use(express.json());
app.use(cors());
// app.use(urlencoded({ extended: true }));

// Routes
const usertransactionRouter = new UserTransactionRouter();
const tenantTransactionManagementRouter = new TenantTransactionRouter();

app.get('/api', (req: Request, res: Response) => {
  res.send('Hello, Purwadhika Student API!');
});

//global
app.use('/api/auth', authRouter());
app.use('/api/upload-image', uploadRouter());
app.use('/api/city', cityRouter());
app.use('/api/facility', facilityRouter());
app.use('/api/user', userRouter());
app.use('/api/category', categoryRouter());
app.use('/api/property', propertyRouter());

//tenant
app.use('/api/tenant-category', verifyUser, tenantCategoryRouter());
app.use(
  '/api/tenant-property',
  verifyUser,
  // authorizeTenantAction,
  tenantPropertyRouter(),
);

app.use(
  '/api/tenant-room-availability',
  verifyUser,
  tenantRoomAvailabilityRouter(),
);

app.use('/api/tenant-season-rate', verifyUser, tenantSeasonRateRouter());

// review
app.use('/api/review', reviewRouter());

// report
app.use('/api/report', reportRouter());

// transaction
app.use('/api', usertransactionRouter.getRouter());
app.use('/api', tenantTransactionManagementRouter.getRouter());

// Error handling
//not found handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send('Not found !');
});

//error handler
app.use(
  (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    res.status(err.code || 500).send({
      message: err.message,
    });
  },
);

// Start server
app.listen(3000, () => {
  console.log(` ➜  run on port 3000`);
});

// app.listen(PORT, () => {
//   console.log(` ➜  [API] Local:   http://localhost:${PORT}/`);
// });
