export function compose(...middlewares: any[]) {
  return (handler: any) =>
    middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
}
