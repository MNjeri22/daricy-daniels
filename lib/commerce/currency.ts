export const currencies=['KES','USD','GBP'] as const;
export type Currency=typeof currencies[number];
export const CURRENCY_KEY='dd-display-currency';
export const countries=[{code:'KE',name:'Kenya'},{code:'US',name:'USA'},{code:'GB',name:'UK'}] as const;
// Verified reference snapshot, not live settlement rates. Replace through the Phase 7 pricing adapter.
// https://open.er-api.com/v6/latest/USD — time_last_update_unix 1794009751.
export const exchangeRates:Record<Currency,number>={USD:1,KES:129.941015,GBP:0.747719};
export const rateDate='7 Nov 2026 (UTC)';
export const isCurrency=(value:unknown):value is Currency=>currencies.includes(value as Currency);
export function convertMinor(amount:number,currency:Currency){if(!isCurrency(currency))throw new Error('Choose KES, USD or GBP.');if(!Number.isSafeInteger(amount))throw new Error('Price must be an integer in minor units.');return Math.round(amount*exchangeRates[currency]);}
export function formatMinor(amount:number,currency:Currency){return new Intl.NumberFormat(currency==='KES'?'en-KE':currency==='GBP'?'en-GB':'en-US',{style:'currency',currency,minimumFractionDigits:amount%100===0?0:2,maximumFractionDigits:2}).format(amount/100);}
export function convertedMoney(amount:number,currency:Currency){return formatMinor(convertMinor(amount,currency),currency);}
export function toUsdMajor(value:string,currency:Currency){return value===''?'':String(Math.round(Number(value)*100/exchangeRates[currency])/100);}
