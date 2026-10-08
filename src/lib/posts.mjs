import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import texmath from 'markdown-it-texmath';
import katex from 'katex';
import hljs from 'highlight.js';

export const site = {title:'尘雨尘风', author:'陈华杰', description:'写数学与代码，也写诗与生活。在理性与诗意之间，记录心之所向。'};
export const topics = [
 {id:'mind',name:'心之学',mark:'心',caption:'向内探寻，向外生活',description:'关于所向、所归、良知，以及我们如何与世界相处。'},
 {id:'math',name:'数学之美',mark:'数',caption:'从一个问题，走向本质',description:'从点列极限到微积分，沿着定义、定理与证明慢慢前行。'},
 {id:'engineering',name:'代码与实践',mark:'码',caption:'让想法在现实中运行',description:'算法、Agent 与工程笔记，记录实践里得到的理解。'},
 {id:'poetry',name:'诗与片刻',mark:'诗',caption:'在文字里，留住片刻',description:'工程之外，收放一些生活里的感受与想象。'},
];
const list=value=>value==null?[]:Array.isArray(value)?value.flat().map(String):[String(value)];
export const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const slugify=s=>s.trim().toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu,'').replace(/\s+/g,'-');
const plain=s=>s.replace(/<!--[\s\S]*?-->/g,'').replace(/```[\s\S]*?```/g,'').replace(/{%[\s\S]*?%}/g,'').replace(/<[^>]*>/g,'').replace(/!\[[^\]]*\]\([^)]*\)/g,'').replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/[#*>`_~]/g,'').replace(/\s+/g,' ').trim();
let cached;
export function getPosts() {
 if(cached) return cached;
 const dir=path.join(process.cwd(),'src/content/posts');
 const raw=fs.readdirSync(dir).filter(f=>f.endsWith('.md')).map(file=>{
  const source=fs.readFileSync(path.join(dir,file),'utf8');
  const {data,content}=matter(source,{engines:{yaml:s=>yaml.load(s,{schema:yaml.JSON_SCHEMA})}});
  const stamp=String(data.date??'');
  if(!data.title||!/^\d{4}-\d{2}-\d{2}/.test(stamp)) throw new Error(`Missing title/date: ${file}`);
  const date=stamp.slice(0,10),slug=path.basename(file,'.md');
  const route=`${date.replaceAll('-','/')}/${slug}`;
  const tags=list(data.tags),categories=list(data.categories);
  const topic=tags.includes('心之学')?'mind':categories.includes('数学')?'math':tags.includes('诗集')?'poetry':'engineering';
  const excerpt=plain(content.split('<!--more-->')[0]);
  return {file,source,title:String(data.title),date,stamp,slug,route,url:`/${route.split('/').map(encodeURIComponent).join('/')}/`,tags,categories,topic,draft:data.draft===true||data.published===false,body:content,excerpt:excerpt.slice(0,120)+(excerpt.length>120?'…':''),minutes:Math.max(1,Math.ceil(plain(content).length/450))};
 });
 const published=raw.filter(p=>!p.draft);
 const bySlug=new Map(published.map(p=>[p.slug,p]));
 cached=published.map(post=>{
  const headings=[];
  const md=new MarkdownIt({html:true,breaks:true,linkify:true,highlight:(str,lang)=>lang&&hljs.getLanguage(lang)?hljs.highlight(str,{language:lang}).value:''});
  md.use(texmath,{engine:katex,delimiters:'dollars',katexOptions:{throwOnError:false,strict:false,trust:false}});
  md.use(anchor,{slugify,callback:(token,info)=>{if(Number(token.tag.slice(1))<=4)headings.push({level:Number(token.tag.slice(1)),slug:info.slug,title:info.title});}});
  const fence=md.renderer.rules.fence;
  md.renderer.rules.fence=(tokens,i,options,env,self)=>{
   const language=tokens[i].info.trim().split(/\s+/)[0];
   if(language==='mermaid')return `<pre class="mermaid">${escapeHtml(tokens[i].content)}</pre>`;
   const label=language||'text';
   return `<figure class="code-block"><figcaption class="code-toolbar"><span>${escapeHtml(label)}</span><button class="copy-code" type="button" aria-label="复制代码"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg><span aria-live="polite">复制</span></button></figcaption>${fence(tokens,i,options,env,self)}</figure>`;
  };
  let body=post.body.replace(/{%\s*post_link\s+(\S+)(?:\s+(.+?))?\s*%}/g,(_,slug,label)=>{
   const linked=bySlug.get(slug);if(!linked)throw new Error(`Broken post_link in ${post.file}: ${slug}`);
   return `[${label||linked.title}](${linked.url})`;
  }).replace(/{%\s*(?:cq|endcq)\s*%}/g,'');
  body=body.replace(/https:\/\/nbviewer\.org\/github\/gamersover\/gamersover\.github\.io\/blob\/hexo\/source\/_ipynotebook_html\//g,'/_ipynotebook_html/');
  // Pandoc accepts whitespace at inline TeX boundaries; normalize outside code fences.
  body=body.split(/(```[\s\S]*?```)/g).map((part,i)=>i%2?part:part.replace(/(?<![\\$])\$([^$\n]+?)\$(?!\$)/g,(_,math)=>'$'+math.trim()+'$').replace(/\\idotsint\s*\\limits/g,'\\mathop{\\idotsint}\\limits')).join('');
  const html=md.render(body);
  return {...post,html,headings,hasMermaid:body.includes('```mermaid')};
 }).sort((a,b)=>b.stamp.localeCompare(a.stamp)||a.title.localeCompare(b.title,'zh'));
 return cached;
}
export function getSeries(post){
 const all=getPosts();
 if(post.topic==='mind') return all.filter(p=>p.topic==='mind').sort((a,b)=>a.stamp.localeCompare(b.stamp));
 if(post.title.startsWith('Agent构建心得'))return all.filter(p=>p.title.startsWith('Agent构建心得')).sort((a,b)=>a.stamp.localeCompare(b.stamp));
 const prefix=post.slug.match(/^(点列极限|函数极限|函数导数|函数积分|数学试题|leetcode题解)/)?.[1];
 return prefix?all.filter(p=>p.slug.startsWith(prefix)).sort((a,b)=>Number(a.slug.slice(prefix.length))-Number(b.slug.slice(prefix.length))):[];
}
export const displayDate=date=>date.replaceAll('-','.');
