import type { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export const notFound = (req: Request, res: Response) =>
  res.status(404).json({ error: `No route for ${req.method} ${req.path}` });

export const errors: ErrorRequestHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const e = error as Error & { status?: number; code?: string };
  const status = e.code === 'LIMIT_FILE_SIZE' ? 413 : e.name === 'MulterError' ? 400 : e.status || 500;
  const message =
    status >= 500 && !(error instanceof HttpError)
      ? 'The service could not complete your request. Please try again later.'
      : status === 413
        ? 'The uploaded image must be 5 MB or smaller.'
        : e.message;

  if (status >= 500) console.error(error);
  res.status(status).json({ error: message });
};
