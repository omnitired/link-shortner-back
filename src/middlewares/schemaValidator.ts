import Ajv from 'ajv';
import { Request, Response } from 'express';
import { CustomError } from '../utils/CustomerError';

export function schemaValidator (schemaPath: string) {
  const schema = require(`${__dirname}/../schemas/${schemaPath}`);
  let customizedAjv = new Ajv({ allErrors: true, logger: false });
  customizedAjv.addFormat('url', /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/);
  customizedAjv.addFormat('username', /[a-zA-Z0-9-_]/);

  const validate = (customizedAjv).compile(schema);

  return async (request: Request, response: Response, next: (err?: any) => any) => {
    try {
      const isValid = validate(request.body);
      if (isValid === false) {
        next(new CustomError('Validation failed!', 422, validate.errors));
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
