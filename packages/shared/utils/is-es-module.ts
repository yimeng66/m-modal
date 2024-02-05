export function isESModule(obj: any): boolean {
  return obj.__esModule || obj[Symbol.toStringTag] === 'Module';
}
