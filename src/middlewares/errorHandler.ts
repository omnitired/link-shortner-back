import { Handler, ErrorRequestHandler } from 'express';
import { CustomError } from '../utils/CustomerError';

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {

  if (error.statusCode) {
    return res.status(error.statusCode).json({ error: error.message, data: error.data });
  }

  console.error('unhandled error', error);

  return res.status(500).json({ error: 'server error.' });
};
