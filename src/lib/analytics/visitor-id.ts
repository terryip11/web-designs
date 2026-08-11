export const VISITOR_COOKIE = "dp_visitor_id";

const VISITOR_ID_PATTERN = /^[a-zA-Z0-9-]{8,64}$/;

export function isValidVisitorId(value: string): boolean {
  return VISITOR_ID_PATTERN.test(value);
}

export function createVisitorId(): string {
  return crypto.randomUUID();
}
