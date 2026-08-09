export const INQUIRY_STATUS_LABELS = {
  new: "新詢價",
  contacted: "已聯絡",
  quoted: "已報價",
  won: "成交",
  lost: "流失",
} as const;

export type InquiryStatus = keyof typeof INQUIRY_STATUS_LABELS;

export const INQUIRY_STATUS_OPTIONS = (
  Object.entries(INQUIRY_STATUS_LABELS) as [InquiryStatus, string][]
).map(([value, label]) => ({ value, label }));
