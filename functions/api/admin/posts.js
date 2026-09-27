import {authenticated,validOrigin} from '../../lib/auth.js';
import {allPosts,slugify} from '../../lib/blog.js';
const error=(message,status)=>Response.json({error:message},{status,headers:{'Cache-Control':'no-store'}});
export async function onRequestGet({request,env}){if(!await authenticated(request,env))return error('Sign in first.',401);return Response.json(await allPosts(env),{headers:{'Cache-Control':'no-store'}})}
export async function onRequestPost({request,env}){
  if(!await authenticated(request,env))return error('Sign in first.',401);
  if(!validOrigin(request))return error('Invalid origin.',403);
  if(Number(request.headers.get('Content-Length'))>35000)return error('Post is too large.',413);
  let body;try{body=await request.json()}catch{return error('Invalid request.',400)}
  const {id,title,excerpt,content,status}=body||{};
  if(typeof title!=='string'||!title.trim()||title.length>140||typeof excerpt!=='string'||excerpt.length>300||typeof content!=='string'||content.length>20000||!['draft','published'].includes(status))return error('Check the post fields.',400);
  const posts=await allPosts(env);let post=typeof id==='string'?posts.find(p=>p.id===id):null;
  if(id&&!post)return error('Post not found.',404);
  if(posts.length>=100&&!post)return error('Post limit reached.',400);
  const now=new Date().toISOString();
  if(post){post.title=title.trim();post.excerpt=excerpt.trim();post.content=content.trim();post.status=status;post.updatedAt=now;if(status==='published'&&!post.publishedAt)post.publishedAt=now}
  else{let slug=slugify(title);if(posts.some(p=>p.slug===slug))slug+='-'+crypto.randomUUID().slice(0,6);post={id:crypto.randomUUID(),slug,title:title.trim(),excerpt:excerpt.trim(),content:content.trim(),status,createdAt:now,updatedAt:now,publishedAt:status==='published'?now:null};posts.push(post)}
  await env.SITE_CONTENT.put('blog:posts',JSON.stringify(posts));return Response.json(post,{headers:{'Cache-Control':'no-store'}})
}
