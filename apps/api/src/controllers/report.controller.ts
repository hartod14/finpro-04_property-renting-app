import { Request, Response } from "express";
import { ReportService } from "@/services/report.service";

const reportService = new ReportService();

export class ReportController {
  async getSalesReport(req: Request, res: Response) {
    try {
      const tenantId = parseInt(req.params.tenantId);
      const { startDate, endDate, sortBy, order } = req.query;

      const filter: {
        startDate?: Date;
        endDate?: Date;
        sortBy?: "date" | "total_sales";
        order?: "asc" | "desc";
      } = {
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        sortBy: sortBy as "date" | "total_sales" || "date",
        order: order as "asc" | "desc" || "desc",
      };

      const report = await reportService.getSalesReport(tenantId, filter);

      res.status(200).json({ success: true, data: report });
    } catch (error) {
      console.error("Error fetching sales report:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  async getPropertyCalendar(req: Request, res: Response) {
    try {
      const tenantId = parseInt(req.params.tenantId);

      const calendar = await reportService.getPropertyCalendar(tenantId);

      res.status(200).json({ success: true, data: calendar });
    } catch (error) {
      console.error("Error fetching property calendar:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}
