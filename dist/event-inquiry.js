export async function sendEventInquiry(endpoint,payload,send=fetch) {
 const response=await send(endpoint,{method:'POST',body:payload,headers:{Accept:'application/json'},signal:AbortSignal.timeout(20000)});
 const result=await response.json();
 if(!response.ok||!result||typeof result!=='object'||Array.isArray(result)||result.ok===false||result.errors?.length)throw new Error('Inquiry was not accepted.');
}

const form=typeof document==='undefined'?null:document.querySelector('#event-inquiry-form');
if(form){
 const submit=form.querySelector('[type=submit]'),status=document.querySelector('#event-status'),error=document.querySelector('#event-error');
 const name=form.elements.namedItem('name'),details=form.elements.namedItem('message');
 let submitting=false;
 const show=(element,message)=>{element.textContent=message;element.hidden=false;element.focus();};
 for(const input of [name,details])input.addEventListener('input',()=>input.setCustomValidity(''));
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(submitting)return;
  status.hidden=true;error.hidden=true;
  name.setCustomValidity(name.value.trim()?'':'Please enter your full name.');
  details.setCustomValidity(details.value.trim()?'':'Please tell Amber about your event.');
  if(!form.reportValidity())return;
  if(form.dataset.mode!=='live'){
   show(status,'Preview checked. Your event inquiry has not been sent.');
   return;
  }
  const payload=new FormData(form);
  for(const key of ['name','email','organisation','message'])payload.set(key,String(payload.get(key)||'').trim());
  submitting=true;submit.disabled=true;submit.textContent='Sending…';form.setAttribute('aria-busy','true');
  try{
   await sendEventInquiry(form.dataset.endpoint,payload);
   form.reset();
   show(status,'Your event inquiry was accepted. Amber will review the details. This does not confirm a booking.');
  }catch{
   show(error,'We couldn’t confirm that your event inquiry was sent. Your details are still here. Please check your connection before trying again, or email Amber using the contact link.');
  }finally{
   submitting=false;submit.disabled=false;submit.textContent='Send event inquiry →';form.removeAttribute('aria-busy');
  }
 });
 form.inert=false;submit.disabled=false;
}
