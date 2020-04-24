export class CustomError extends Error {
  public statusCode?: number;
  public data?: any;
  public constructor(message: string, statusCode = 500, data?: any) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.data = data;
  }
}
