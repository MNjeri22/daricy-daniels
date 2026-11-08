import {StoreHeader} from '@/components/storefront/store-header';
import {Footer,Icon} from '@/components/storefront/home-page';
import {collections} from '@/lib/commerce/catalog';
import '@/components/storefront/shop.css';
export const metadata={title:'Collections',alternates:{canonical:'/collections'}};
export default function Page(){return <><StoreHeader/><main id="main" className="editorial-page"><p className="eyebrow">CHAPTERS FROM OUR WORLD</p><h1>A point of view.<br/><em>In every collection.</em></h1><p className="lead">Distinct expressions of the Daricy Daniels world. Discover the edit that speaks to you.</p><div className="collection-list">{collections.map(c=><article key={c.slug}><a href={`/collections/${c.slug}`}><div className="collection-cover"><img src={c.image} alt={`${c.name} collection`} width="1254" height="1254"/></div><h2>{c.name}</h2></a><p>{c.description}</p><a href={`/collections/${c.slug}`} className="text-link">Explore the collection <Icon name="arrow"/></a></article>)}</div></main><Footer/></>;}
