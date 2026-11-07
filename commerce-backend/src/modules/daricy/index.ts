import {Module} from '@medusajs/framework/utils';
import DaricyModuleService from './service';
export const DARICY_MODULE='daricy';
export default Module(DARICY_MODULE,{service:DaricyModuleService});
