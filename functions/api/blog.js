import {allPosts,publicPosts} from '../lib/blog.js';
export async function onRequestGet({env}){const posts=publicPosts(await allPosts(env)).map(({title,slug,excerpt,publishedAt})=>({title,slug,excerpt,publishedAt}));return Response.json(posts,{headers:{'Cache-Control':'no-store'}})}
