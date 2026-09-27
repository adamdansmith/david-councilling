import defaults from '../lib/content.json';
export async function onRequestGet({env}){let saved;try{saved=await env.SITE_CONTENT?.get('site','json')}catch{}return Response.json({...defaults,...saved},{headers:{'Cache-Control':'no-store'}})}
