import { ParsedQs } from 'qs';

export function getQueryString(
  value: string | ParsedQs | (string | ParsedQs)[] | undefined
): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

export function getQueryBoolean(
  value: string | ParsedQs | (string | ParsedQs)[] | undefined
): boolean | undefined {
  if (typeof value !== 'string') return undefined;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}
