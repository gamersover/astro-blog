import {getPosts} from '../../lib/posts.mjs';
export const GET=()=>new Response(JSON.stringify({posts:getPosts().slice(0,10).map(p=>({title:p.title,date:p.date,href:new URL(p.url,'https://blog.caoqinping.com').href,summary:p.excerpt}))}),{headers:{'Content-Type':'application/json; charset=utf-8'}});
