import { Router } from "express";
import { ReportController } from "@/controllers/report.controller";
import { verifyUser } from "@/middalewares/auth.middleware";

const reportController = new ReportController();

export const reportRouter = () => {
  const router = Router();

  // GET /api/report/sales/:tenantId?startDate=&endDate=&sortBy=&order=
  router.get("/sales/:tenantId", verifyUser, reportController.getSalesReport);

  // GET /api/report/calendar/:tenantId
  router.get("/calendar/:tenantId", verifyUser, reportController.getPropertyCalendar);

  return router;
};

export default reportRouter;
