import defaults from './content.json';
import {saveContent} from './admin-auth.js';
import {onRequestPost as contact} from './contact-api.js';
import {authenticated,clearSession,configured,issueSession,passwordMatches,validOrigin} from './auth.js';
const json=(body,status=200,extra={})=>Response.json(body,{status,headers:{'Cache-Control':'no-store',...extra}});
const loginPage=`<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Sign in | David Billington</title><link rel="stylesheet" href="/style.css"><style>main{max-width:560px;margin:auto;padding:80px 24px;min-height:70vh}h1{font-size:clamp(2.5rem,6vw,4rem)}input{color:#26332f;background:#fff;border-color:#9eaaa0}.error{color:#922}</style></head><body><main><a href="/">← View website</a><h1>Site editor</h1><p>Enter the editor password to change the website's text and prices.</p><form id="login"><label for="password">Password</label><input type="password" name="password" id="password" autocomplete="current-password" required><button class="button">Sign in →</button><p id="feedback" role="status" class="error"></p></form></main><script src="/admin/login.js"></script></body></html>`;
const headers={'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow','Content-Security-Policy':"default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'"};
export default {async fetch(request,env){const url=new URL(request.url),path=url.pathname;
  if(path==='/api/content'&&request.method==='GET'){let saved;try{saved=await env.SITE_CONTENT?.get('site','json')}catch{}return json({...defaults,...saved})}
  if(path==='/api/admin/content'&&request.method==='POST')return saveContent(request,env);
  if(path==='/api/contact'&&request.method==='POST')return contact({request,env});
  if(path==='/api/session'&&request.method==='POST'){
    if(!validOrigin(request))return json({error:'Invalid origin.'},403);
    if(!configured(env))return json({error:'Editor setup is incomplete.'},503);
    if(Number(request.headers.get('Content-Length'))>1024)return json({error:'Request too large.'},413);
    let body;try{body=await request.json()}catch{return json({error:'Invalid request.'},400)}
    if(body.action==='logout')return json({ok:true},200,{'Set-Cookie':clearSession});
    if(body.action!=='login'||typeof body.password!=='string'||body.password.length>256)return json({error:'Invalid request.'},400);
    const key='login:'+(request.headers.get('CF-Connecting-IP')||'unknown');const attempts=Number(await env.SITE_CONTENT.get(key)||0);
    if(attempts>=5)return json({error:'Too many attempts. Try again in 15 minutes.'},429);
    if(!await passwordMatches(body.password,env.EDITOR_PASSWORD)){await env.SITE_CONTENT.put(key,String(attempts+1),{expirationTtl:900});return json({error:'Incorrect password.'},401)}
    await env.SITE_CONTENT.delete(key);return json({ok:true},200,{'Set-Cookie':await issueSession(env)});
  }
  if(path==='/admin'||path==='/admin/'||path==='/admin/index.html'){
    if(!configured(env))return new Response('<h1>Editor setup is incomplete</h1><p>Configure the editor storage, password and session secret in Cloudflare.</p>',{status:503,headers});
    if(!await authenticated(request,env))return new Response(loginPage,{headers});
    const asset=await env.ASSETS.fetch(new Request(new URL('/admin/index.html',request.url),request));return new Response(asset.body,{status:asset.status,headers});
  }
  return env.ASSETS.fetch(request);
}};
