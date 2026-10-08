import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import crypto from 'node:crypto';import {getPosts} from '../src/lib/posts.mjs';
const manifest=JSON.parse(fs.readFileSync('migration-manifest.json','utf8'));const posts=getPosts();
if(process.argv.includes('--migration')) for(const p of manifest.posts){const bytes=fs.readFileSync(path.join('src/content/posts',p.file));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),p.sha256,`Article changed: ${p.file}`)}
const routes=new Set();let formulas=0,links=0;
for(const post of posts){assert(!routes.has(post.url),`Duplicate route ${post.url}`);routes.add(post.url);assert(!post.html.includes('katex-error'),`Math error in ${post.file}`);assert(!/{%/.test(post.html),`Unconverted Hexo tag ${post.file}`);formulas+=(post.html.match(/class="katex"/g)||[]).length;const output=path.join('dist',post.route,'index.html');assert(fs.existsSync(output),`Missing original URL ${post.url}`)}
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)])}
const broken=[];
for(const file of walk('dist').filter(f=>f.endsWith('.html')&&!f.includes('_ipynotebook_html'))){const html=fs.readFileSync(file,'utf8');for(const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)[^\"]*"/g)){let target;try{target=decodeURIComponent(m[1])}catch{continue}if(target.startsWith('//'))continue;const dest=path.join('dist',target);links++;if(!fs.existsSync(dest)&&!fs.existsSync(path.join(dest,'index.html')))broken.push({file,target});}}
assert.deepEqual(broken,[],'Broken local links');
const search=JSON.parse(fs.readFileSync('dist/search-index.json','utf8'));assert.equal(search.length,posts.length);assert(search.every(p=>routes.has(p.url)));assert(fs.readFileSync('dist/rss.xml','utf8').includes('心之学'));assert(fs.existsSync('dist/sitemap-index.xml'));
const report={articles:posts.length,unchangedOriginals:process.argv.includes('--migration')?manifest.posts.length:undefined,originalArticleURLs:routes.size,renderedFormulas:formulas,checkedLocalLinks:links,brokenLocalLinks:broken.length,mermaidArticles:posts.filter(p=>p.hasMermaid).length};
fs.writeFileSync('verification-report.json',JSON.stringify(report,null,2)+'\n');console.log(report);
