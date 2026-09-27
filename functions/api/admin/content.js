import {saveContent} from '../../lib/admin-auth.js';
export const onRequestPost=({request,env})=>saveContent(request,env);
