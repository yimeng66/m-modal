export function isPromise(data: any) {
  return data instanceof Promise || (typeof data === 'object' && 'then' in data && typeof data.then === 'function');
}
