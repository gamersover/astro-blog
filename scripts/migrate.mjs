import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const source = process.argv[2];
if (!source) throw new Error('Usage: npm run migrate -- /path/to/hexo-blog');
const destination = 'src/content/posts';
fs.mkdirSync(destination, {recursive:true});
const report = [];
for (const file of fs.readdirSync(path.join(source,'source/_posts')).filter(f=>f.endsWith('.md'))) {
 const data=fs.readFileSync(path.join(source,'source/_posts',file));
 const target=path.join(destination,file);
 if (fs.existsSync(target) && !fs.readFileSync(target).equals(data)) throw new Error(`Refusing to overwrite edited article: ${file}`);
 fs.writeFileSync(target,data);
 report.push({file,sha256:crypto.createHash('sha256').update(data).digest('hex')});
}
fs.cpSync(path.join(source,'source/_ipynotebook_html'),'public/_ipynotebook_html',{recursive:true});
fs.writeFileSync('migration-manifest.json',JSON.stringify({posts:report},null,2)+'\n');
console.log(`Copied ${report.length} articles unchanged, plus notebook assets.`);
