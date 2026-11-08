/// <reference types="vite/client" />
import {createRoot} from 'react-dom/client';
import {NewsletterPage} from '@/components/storefront/newsletter';
import {AccountPreview} from './account';
import {HomePage,Footer,SimpleHeader} from '@/components/storefront/home-page';
import {StoreHeader} from '@/components/storefront/store-header';
import {CurrencyProvider} from '@/components/storefront/currency';
import {Shop} from '@/components/storefront/shop';
import {ProductPage} from '@/components/storefront/product-page';
import {products,categories,collections,type CatalogContext} from '@/lib/commerce/catalog';
import {stories,carePages} from '@/lib/storefront-content';
import About from '@/app/about/page';
import Collections from '@/app/collections/page';
import Journal from '@/app/journal/page';
import SizeGuide from '@/app/size-guide/page';
import Cart from '@/app/cart/page';
import '@/app/globals.css';
import '@/components/storefront/checkout.css';
const base=import.meta.env.BASE_URL.replace(/\/$/,''),path=decodeURI(location.pathname).slice(base.length).replace(/\/$/,'')||'/';
function Shell({children}:{children:React.ReactNode}){return <><StoreHeader/><main id="main" className="editorial-page">{children}</main><Footer/></>;}
function App(){
 if(path==='/')return <HomePage/>;
 if(path==='/newsletter')return <><StoreHeader/><NewsletterPage/><Footer/></>;
 if(path==='/about')return <About/>;if(path==='/collections')return <Collections/>;if(path==='/journal')return <Journal/>;if(path==='/size-guide')return <SizeGuide/>;if(path==='/cart')return <Cart/>;
 if(path==='/account'||path==='/account/login')return <AccountPreview/>;
 if(path==='/account/register')return <AccountPreview view="register"/>;
 if(path==='/account/forgot-password')return <AccountPreview view="forgot-password"/>;
 if(path==='/account/reset-password')return <AccountPreview view="reset-password"/>;
 if(path==='/checkout'||path.startsWith('/checkout/')||path==='/account'||path.startsWith('/account/')||path==='/studio'||path.startsWith('/studio/'))return <Shell><p className="eyebrow">GITHUB PAGES / DESIGN PREVIEW</p><h1>{path.startsWith('/checkout')?'Checkout preview.':'Your customer account.'}</h1><p className="lead">This edition lets you explore the design and sample collection. Customer sign-in, saved addresses, checkout and orders require the hosted backend and are unavailable here.</p><p>No passwords, delivery details or payments are collected on this preview.</p><a className="button" href="/shop">Explore the collection</a></Shell>;
 if(path.startsWith('/products/')){const item=products.find(p=>p.slug===path.split('/')[2]);return item?<ProductPage product={item} items={products}/>:<Shell><h1>Piece not found.</h1><a href="/shop">Back to the collection</a></Shell>;}
 const category=path.startsWith('/categories/')?categories.find(c=>c.slug===path.split('/')[2]):undefined,collection=path.startsWith('/collections/')?collections.find(c=>c.slug===path.split('/')[2]):undefined;
 if(['/shop','/wishlist','/new-arrivals','/best-sellers','/ready-to-wear'].includes(path)||category||collection){const context:CatalogContext=category?{category:category.slug}:collection?{collection:collection.slug}:path==='/wishlist'?{wishlist:true}:path==='/new-arrivals'?{preset:'new'}:path==='/best-sellers'?{preset:'best'}:path==='/ready-to-wear'?{preset:'ready'}:{};return <Shop items={products} initialQuery={location.search.slice(1)} context={context} title={category?.name||collection?.name||(path==='/wishlist'?'Your personal edit.':undefined)}/>;}
 if(path.startsWith('/journal/')){const story=stories.find(s=>s.slug===path.split('/')[2]);if(story)return <><SimpleHeader/><main id="main" className="editorial-page"><p className="eyebrow">{story.category}</p><h1>{story.title}</h1><p className="lead">{story.excerpt}</p><img className="page-photo" src={`/assets/${story.image}-concept.webp`} alt={`${story.category}, concept editorial image`}/><div className="prose">{story.body.map(p=><p key={p}>{p}</p>)}<a href="/journal">Back to the journal</a></div></main><Footer/></>;}
 const care=carePages[path.slice(1)];if(care)return <Shell><p className="eyebrow">CLIENT SERVICES / PREVIEW</p><h1>{care.title}</h1><p className="lead">{care.intro}</p><div className="care-items">{care.items.map(([title,body])=><section key={title}><h2>{title}</h2><p>{body}</p></section>)}</div></Shell>;
 return <Shell><h1>Page not found.</h1><a className="button" href="/">Return to our world</a></Shell>;
}
createRoot(document.getElementById('root')!).render(<CurrencyProvider><div role="note" style={{padding:'9px 20px',background:'#481423',color:'#f8f4ed',textAlign:'center',fontSize:10}}>DESIGN PREVIEW · Sample products and prices · No purchasing or account sign-in</div><App/></CurrencyProvider>);
