import {defineMiddlewares} from '@medusajs/framework/http';
// Only the ownership-enforcing bridge may operate checkout carts.
export default defineMiddlewares({routes:[{matcher:'/bridge/*',bodyParser:{sizeLimit:'32kb'}},{matcher:'/store',middlewares:[(req,res,next)=>{if(!/^\/store\/(carts|payment-collections)(\/|$)/.test(req.originalUrl.split('?')[0]))return next();res.status(503).json({code:'USE_STOREFRONT_CHECKOUT',message:'Use the storefront checkout. Direct cart and payment access is disabled.'});}]}]});
