export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type AppContext<TParams = any> = {
  params: Promise<TParams>;
  token?: string;
  user?: any;
  t?: (key: string) => string;
};
