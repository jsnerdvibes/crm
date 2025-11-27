export const successResponse = (message: string, data: any = {}) => ({
  status: 'success',
  message,
  data,
  errors: [],
});

export const errorResponse = (message: string, errors: any[] = []) => ({
  status: 'error',
  message,
  data: {},
  errors,
});
