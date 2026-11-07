import {env} from 'cloudflare:workers';
import {database} from '@/lib/server/runtime';
import {commerceConfig} from '@/lib/server/store-catalog';
import {commerceAction} from '@/lib/server/commerce-http';
import {BackendError} from '@/lib/server/core';
export const dynamic='force-dynamic';
async function handle(request:Request,{params}:{params:Promise<{action:string}>}){try{return await commerceAction(database(),request,(await params).action,commerceConfig(),{origin:env.CUSTOMER_APP_ORIGIN});}catch(error){return Response.json({error:error instanceof BackendError?error.message:'The store could not complete this request. Please try again.',code:error instanceof BackendError?error.code:'COMMERCE_UNAVAILABLE'},{status:error instanceof BackendError?error.status:503,headers:{'Cache-Control':'no-store, private','Vary':'Cookie','X-Content-Type-Options':'nosniff'}});}}
export {handle as GET,handle as POST};
