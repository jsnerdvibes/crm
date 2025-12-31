export function buildSearchOR(search?: string, fields: string[] = []) {
  if (!search) return undefined;

  return {
    OR: fields.map((field) => ({
      [field]: {
        contains: search,
      },
    })),
  };
}
