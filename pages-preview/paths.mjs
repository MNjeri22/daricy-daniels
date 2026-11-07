export function pagesUrl(value, base) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return value;
  const prefix=base.replace(/\/$/,'');
  if(value===prefix||value.startsWith(prefix+'/'))return value;
  return prefix+value;
}
export function pagesProps(type, props, base) {
  if(typeof type!=='string'||!props)return props;
  const next={...props};
  for(const key of ['href','src','poster','action'])if(key in next)next[key]=pagesUrl(next[key],base);
  if(typeof next.srcSet==='string')next.srcSet=next.srcSet.replace(/(^|,\s*)(\/[^\s,]+)/g,(_,sep,url)=>sep+pagesUrl(url,base));
  return next;
}
