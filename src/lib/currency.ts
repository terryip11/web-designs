export const CURRENCY_CODE = "HKD";
export const CURRENCY_SYMBOL = "HK$";
export const CURRENCY_LABEL = "港幣";

export function formatPrice(amount: number): string {
  return `${CURRENCY_SYMBOL}${amount.toLocaleString("en-HK")}`;
}

export const PRICE_DISCLAIMER =
  "所有價格以港幣（HKD）顯示，參考香港市場一般行情，實際報價依項目複雜度及需求調整";
