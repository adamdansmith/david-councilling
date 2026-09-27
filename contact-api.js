export async function onRequestPost({request,env}){
  if(!env.RESEND_API_KEY||!env.CONTACT_TO||!env.CONTACT_FROM)return Response.json({error:'Contact form is not configured'},{status:503});
  if(Number(request.headers.get('content-length'))>12000)return Response.json({error:'Too large'},{status:413});
  let body;try{body=await request.json()}catch{return Response.json({error:'Invalid request'},{status:400})}
  const {name,email,message,website}=body||{};
  if(website)return Response.json({ok:true});
  if(typeof name!=='string'||typeof email!=='string'||typeof message!=='string'||!name.trim()||name.length>100||!/^\S+@\S+\.\S+$/.test(email)||email.length>200||!message.trim()||message.length>4000)return Response.json({error:'Check your details'},{status:400});
  const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:env.CONTACT_FROM,to:[env.CONTACT_TO],reply_to:email,subject:'Website enquiry from '+name.replace(/[\r\n]/g,' '),text:`Name: ${name}\nEmail: ${email}\n\n${message}`})});
  if(!response.ok)return Response.json({error:'Delivery failed'},{status:502});return Response.json({ok:true});
}
