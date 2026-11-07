import {model} from '@medusajs/framework/utils';
export const CartBinding=model.define('daricy_cart_binding',{id:model.id().primaryKey(),cart_id:model.text().unique(),owner_subject:model.text(),request_key:model.text().unique(),request_fingerprint:model.text(),revision:model.number().default(1)}).indexes([{on:['owner_subject']}]);
