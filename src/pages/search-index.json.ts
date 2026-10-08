import {getPosts} from '../lib/posts.mjs';
export const GET=()=>new Response(JSON.stringify(getPosts().map(p=>({title:p.title,url:p.url,date:p.date,excerpt:p.excerpt,tags:p.tags,text:p.body.replace(/<[^>]*>/g,'').replace(/```[\s\S]*?```/g,'')}))),{headers:{'Content-Type':'application/json; charset=utf-8'}});
