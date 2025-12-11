import { Response } from "express";

interface IApiResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
}

const sendResponse = <T>(res: Response, payload: IApiResponse<T>) => {
  res.status(payload.statusCode).json({
    success: payload.success,
    message: payload.message,
    data: payload.data,
  });
};

export default sendResponse;
