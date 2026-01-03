import { TargetType, TargetTypes } from './dto';

export interface ActivityFilters {
  page: number;
  limit: number;
  targetType?: TargetType;
  targetId?: string;
  completed?: boolean;
}

export function isTargetType(value: unknown): value is TargetType {
  return typeof value === 'string' && TargetTypes.includes(value as TargetType);
}
