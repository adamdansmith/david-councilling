export const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const inline=value=>{
  const source=String(value),parts=[];let last=0;
  for(const match of source.matchAll(/\[([^\]]{1,120})\]\((https?:\/\/[^\s)]+)\)/g)){
    parts.push(format(source.slice(last,match.index)));
    parts.push(`<a href="${escapeHtml(match[2])}" rel="noopener noreferrer">${escapeHtml(match[1])}</a>`);
    last=match.index+match[0].length;
  }
  parts.push(format(source.slice(last)));return parts.join('');
};
const format=value=>escapeHtml(value).replace(/\*\*([^*\n]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*\n]+)\*/g,'<em>$1</em>');
export function renderMarkdown(source){const lines=String(source||'').replace(/\r\n?/g,'\n').split('\n'),out=[];let paragraph=[],list=[];
  const flush=()=>{if(paragraph.length){out.push(`<p>${inline(paragraph.join(' '))}</p>`);paragraph=[]}if(list.length){out.push(`<ul>${list.map(x=>`<li>${inline(x)}</li>`).join('')}</ul>`);list=[]}};
  for(const raw of lines){const line=raw.trim();if(!line){flush();continue}if(/^#{2,3} /.test(line)){flush();const level=line.startsWith('### ')?3:2;out.push(`<h${level}>${inline(line.slice(level+1))}</h${level}>`);continue}if(/^- /.test(line)){if(paragraph.length)flush();list.push(line.slice(2));continue}if(list.length)flush();paragraph.push(line)}flush();return out.join('\n')}
export async function allPosts(env){try{const data=await env.SITE_CONTENT?.get('blog:posts','json');return Array.isArray(data)?data:[]}catch{return []}}
export const publicPosts=posts=>posts.filter(p=>p.status==='published').sort((a,b)=>String(b.publishedAt).localeCompare(String(a.publishedAt)));
export const slugify=value=>String(value).normalize('NFKD').toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').slice(0,70)||'article';
export const pageHeaders={'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
export function shell({title,description,canonical,body}){const t=escapeHtml(title),d=escapeHtml(description),c=escapeHtml(canonical);return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#e9e9e2"><title>${t}</title><meta name="description" content="${d}"><link rel="canonical" href="${c}"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/blog.css"></head><body><a class="skip" href="#main">Skip to content</a><header class="header"><a class="brand" href="/">David Billington <span>Counselling</span></a><nav aria-label="Main navigation"><a href="/">Home</a><a href="/#sessions">Sessions &amp; fees</a><a href="/blog" aria-current="page">Blog</a><a class="nav-contact" href="/#contact">Get in touch</a></nav></header><main id="main">${body}</main><footer><span>© ${new Date().getFullYear()} David Billington · Registered Member MBACP</span><a href="https://www.bacp.co.uk/therapists/399649/david-billington/waterlooville-po8">View BACP profile</a><a href="/">Home</a></footer></body></html>`}
