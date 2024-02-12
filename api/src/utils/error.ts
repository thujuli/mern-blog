class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const createCustomError = (statusCode: number, message: string): Error => {
  return new CustomError(message, statusCode);
};

export default createCustomError;
