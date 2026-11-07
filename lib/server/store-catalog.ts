import {cache} from 'react';
import {env} from 'cloudflare:workers';
import {products} from '@/lib/commerce/catalog';
import {CommerceClient,commerceLive,type CommerceConfig} from './commerce';
export function commerceConfig():CommerceConfig{return {mode:env.COMMERCE_MODE,origin:env.MEDUSA_BACKEND_URL,publishableKey:env.MEDUSA_PUBLISHABLE_KEY,bridgeSecret:env.COMMERCE_BRIDGE_SECRET};}
export const storeCatalog=cache(async()=>{const config=commerceConfig();return {items:commerceLive(config)?await new CommerceClient(config).catalog():products,mode:commerceLive(config)?'live' as const:'preview' as const};});
