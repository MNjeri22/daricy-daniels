import {env} from 'cloudflare:workers';
import {database} from '@/lib/server/runtime';
import {newsletterAction} from '@/lib/server/newsletter';
import {BackendError} from '@/lib/server/core';
export const dynamic='force-dynamic';
export async function POST(request:Request,{params}:{params:Promise<{action:string}>}){try{return await newsletterAction(database(),request,(await params).action,{mode:env.NEWSLETTER_MODE,origin:env.CUSTOMER_APP_ORIGIN,emailKey:env.RESEND_API_KEY,emailFrom:env.NEWSLETTER_EMAIL_FROM,segmentId:env.NEWSLETTER_SEGMENT_ID});}catch(error){return Response.json({error:error instanceof BackendError?error.message:'Email is temporarily unavailable. Please try again later.',code:error instanceof BackendError?error.code:'NEWSLETTER_UNAVAILABLE'},{status:error instanceof BackendError?error.status:503,headers:{'Cache-Control':'no-store, private','Referrer-Policy':'no-referrer'}});}}
