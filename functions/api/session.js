import {configured,validOrigin,passwordMatches,issueSession,clearSession} from '../lib/auth.js';
const json=(body,status=200,extra={})=>Response.json(body,{status,headers:{'Cache-Control':'no-store',...extra}});
export async function onRequestPost({request,env}){
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
