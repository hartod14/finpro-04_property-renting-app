import { Response } from "express";

export class ErrorHandler extends Error {
  code: number;
  constructor(message: string, code?: number) {
    super(message);
    this.code = code || 500;
  }
}

export const responseHandler = (
  res: Response,
  message: string,
  data?: any,
  code?: number
) => {
  return res.status(code || 200).send({
    message,
    data,
  });
};

export const responseHandlerPagination = (
  res: Response,
  message: String,
  data: any,
  total_data: number,
  code?: number,
) => {
  return res.status(code || 200).send({
    message,
    total_data,
    data
  })
}
