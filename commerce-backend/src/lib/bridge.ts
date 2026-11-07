import {timingSafeEqual} from 'node:crypto';
import {MedusaError} from '@medusajs/framework/utils';
import {z} from '@medusajs/framework/zod';
export function authorize(value:unknown){const secret=process.env.COMMERCE_BRIDGE_SECRET;if(!secret||secret.length<32)throw new MedusaError(MedusaError.Types.NOT_ALLOWED,'Commerce bridge is not configured.');const supplied=typeof value==='string'?value:'';if(Buffer.byteLength(supplied)!==Buffer.byteLength(secret)||!timingSafeEqual(Buffer.from(supplied),Buffer.from(secret)))throw new MedusaError(MedusaError.Types.UNAUTHORIZED,'Commerce bridge authorization required.');}
export const owner=z.string().regex(/^(user:[a-f0-9-]{36}|guest:[a-f0-9]{64})$/);
const id=z.string().regex(/^[a-z]+_[A-Za-z0-9_]+$/).max(100);
const address=z.object({first_name:z.string().min(1).max(150),last_name:z.string().min(1).max(150),address_1:z.string().min(1).max(150),address_2:z.string().max(150).optional(),city:z.string().min(1).max(150),province:z.string().max(150).optional(),postal_code:z.string().min(1).max(150),country_code:z.enum(['ke','us','gb'])}).strict();
export const createInput=z.object({owner_subject:owner,request_id:z.string().uuid(),region_id:id,items:z.array(z.object({variant_id:id,quantity:z.number().int().min(1).max(5)}).strict()).min(1).max(50).refine(items=>new Set(items.map(i=>i.variant_id)).size===items.length,'Use unique variants.')}).strict();
export const updateInput=z.object({owner_subject:owner,cart_id:id,revision:z.number().int().min(1),email:z.string().email().max(254),shipping_address:address,billing_address:address,promo_codes:z.array(z.string().max(40)).max(1).optional()}).strict();
export const shippingInput=z.object({owner_subject:owner,cart_id:id,revision:z.number().int().min(1),option_id:id}).strict();
export const ownedInput=z.object({owner_subject:owner,cart_id:id}).strict();
export function parse<T>(schema:z.ZodType<T>,data:unknown):T{const result=schema.safeParse(data);if(!result.success)throw new MedusaError(MedusaError.Types.INVALID_DATA,'The commerce request is invalid.');return result.data;}
