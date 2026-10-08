import rss from '@astrojs/rss';import {getPosts,site} from '../lib/posts.mjs';
export const GET=()=>rss({title:site.title,description:site.description,site:'https://blog.caoqinping.com',items:getPosts().map(p=>({title:p.title,pubDate:new Date(p.stamp.replace(' ','T')+'+08:00'),description:p.excerpt,link:p.url})),customData:'<language>zh-cn</language>'});
