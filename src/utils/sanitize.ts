export const sanitizeObject = <T>(obj: T): T => {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const sanitizedObj: Record<string, unknown> = {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitizedObj[key] = sanitizeObject(
          (obj as Record<string, unknown>)[key]
        );
      }
    }

    return sanitizedObj as T;
  }

  if (typeof obj === 'string') {
    return obj.replace(/<[^>]*>/g, '') as unknown as T;
  }

  return obj;
};
