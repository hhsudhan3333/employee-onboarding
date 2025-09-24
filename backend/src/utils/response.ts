import { Response } from 'express';

export const success = (res: Response, data: any = null, message = 'OK', statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data, errors: null });

export const fail = (res: Response, message = 'Error', errors: any = null, statusCode = 400) =>
  res.status(statusCode).json({ success: false, message, data: null, errors });
