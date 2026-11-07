import {MedusaService} from '@medusajs/framework/utils';
import {CartBinding} from './models/cart-binding';
class DaricyModuleService extends MedusaService({CartBinding}){}
export default DaricyModuleService;
