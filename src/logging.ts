import pino from "pino";
import { AsyncLocalStorage } from "async_hooks";

export const asyncLocalStorage = new AsyncLocalStorage<Record<string, any>>();

export const logger = pino({
  level: "debug",
  mixin: () => {
    const context = asyncLocalStorage.getStore();
    return context || {};
  },
});

export function addContext(data: Record<string, any>) {
  const store = asyncLocalStorage.getStore();
  if (store) {
    Object.assign(store, data);
  }
}

export function runWithContext(
  initialContext: Record<string, any>,
  callback: () => any
) {
  return asyncLocalStorage.run(initialContext || {}, callback);
}
