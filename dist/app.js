const menuButton=document.querySelector('.menu-toggle');
const menu=document.querySelector('#primary-nav');
const servicesToggle=document.querySelector('#services-toggle');
const servicesDropdown=document.querySelector('#services-dropdown');
function closeServices(restoreFocus=false){servicesToggle.setAttribute('aria-expanded','false');servicesDropdown.hidden=true;if(restoreFocus)servicesToggle.focus();}
function openServices(){servicesToggle.setAttribute('aria-expanded','true');servicesDropdown.hidden=false;}
function closeMenu(){menuButton.setAttribute('aria-expanded','false');menu.removeAttribute('data-open');closeServices();}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menu.toggleAttribute('data-open',open);if(!open)closeServices();});
servicesToggle.addEventListener('click',()=>{servicesDropdown.hidden?openServices():closeServices();});
servicesToggle.addEventListener('keydown',event=>{if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();openServices();const links=servicesDropdown.querySelectorAll('a');links[event.key==='ArrowUp'?links.length-1:0].focus();}});
servicesDropdown.addEventListener('keydown',event=>{const links=[...servicesDropdown.querySelectorAll('a')],i=links.indexOf(document.activeElement);if(i<0)return;let next;if(event.key==='ArrowDown')next=(i+1)%links.length;if(event.key==='ArrowUp')next=(i-1+links.length)%links.length;if(event.key==='Home')next=0;if(event.key==='End')next=links.length-1;if(next!==undefined){event.preventDefault();links[next].focus();}});
menu.querySelectorAll('a,button:not(#services-toggle)').forEach(el=>el.addEventListener('click',closeMenu));
document.addEventListener('click',event=>{if(!event.target.closest('.services-nav'))closeServices();});
document.addEventListener('focusin',event=>{if(!event.target.closest('.services-nav'))closeServices();});
document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;if(!servicesDropdown.hidden){closeServices(true);event.preventDefault();}else if(menu.hasAttribute('data-open')){closeMenu();menuButton.focus();}});
matchMedia('(min-width:801px)').addEventListener('change',closeMenu);
const form=document.querySelector('#resource-search');
if(form){
 const params=new URLSearchParams(location.search),input=document.querySelector('#query'),topics=[...document.querySelectorAll('[data-topic]')],cards=[...document.querySelectorAll('.resource-card')];
 let topic=topics.some(x=>x.dataset.topic===params.get('topic'))?params.get('topic'):'All';
 input.value=params.get('q')||'';
 const normalise=s=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 function update(sync=true){let count=0;const q=normalise(input.value.trim());for(const card of cards){card.hidden=!(topic==='All'||topic===card.dataset.category)||!normalise(card.dataset.search).includes(q);if(!card.hidden)count++;}topics.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.topic===topic)));document.querySelector('#results-title').textContent=topic==='All'?(q?'Search results':'All resources'):topic;document.querySelector('#results-count').textContent=`${count} resource${count===1?'':'s'}`;document.querySelector('.empty-results').hidden=count!==0;if(sync){const url=new URL(location.href);if(input.value.trim())url.searchParams.set('q',input.value.trim());else url.searchParams.delete('q');if(topic!=='All')url.searchParams.set('topic',topic);else url.searchParams.delete('topic');history.replaceState(null,'',url.pathname+url.search+url.hash);}}
 form.addEventListener('submit',e=>{e.preventDefault();update();});input.addEventListener('input',()=>update());topics.forEach(b=>b.addEventListener('click',()=>{topic=b.dataset.topic;update();}));document.querySelector('#reset-search').addEventListener('click',()=>{input.value='';topic='All';update();input.focus();});update(false);

}
const contents=document.querySelector('.contents details');
if(contents){const narrow=matchMedia('(max-width:1000px)');contents.open=!narrow.matches;narrow.addEventListener('change',e=>contents.open=!e.matches);contents.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{if(narrow.matches)contents.open=false;}));}

const enquiry=document.querySelector('#consultation-form');
if(enquiry){
 const submit=enquiry.querySelector('[type=submit]'),status=document.querySelector('#enquiry-status'),error=document.querySelector('#enquiry-error');
 const name=enquiry.elements.namedItem('name'),phone=enquiry.elements.namedItem('phone'),preferred=enquiry.elements.namedItem('preferred_contact');
 const deliveryMode=()=>enquiry.dataset.deliveryVerified==='true'?'live':enquiry.dataset.mode==='delivery-test'?'delivery-test':'preview';
 let submitting=false;
 const show=(element,message)=>{element.textContent=message;element.hidden=false;element.focus();};
 const phoneRequirement=()=>{phone.required=preferred.value==='Phone';phone.closest('label').querySelector('.optional').textContent=phone.required?'(required for phone replies)':'(optional)';};
 preferred.addEventListener('change',phoneRequirement);
 name.addEventListener('input',()=>name.setCustomValidity(''));
 enquiry.addEventListener('submit',async event=>{
  event.preventDefault();
  if(submitting)return;
  error.hidden=true;status.hidden=true;
  name.setCustomValidity(name.value.trim()?'':'Please enter your full name.');
  phoneRequirement();
  if(!enquiry.reportValidity())return;
  if(deliveryMode()==='preview'){
   show(status,'Preview checked. No enquiry has been sent. Delivery to Amber still needs to be verified.');
   return;
  }
  const testing=deliveryMode()==='delivery-test';
  const payload=new FormData(enquiry);
  if(testing){payload.set('_subject','[Website delivery test] AC Law Firm consultation enquiry');payload.set('submission_type','Website delivery test');payload.set('message','[Website delivery test]\n'+String(payload.get('message')||''));}
  payload.set('name',name.value.trim());
  payload.set('email',String(payload.get('email')).trim());
  submitting=true;submit.disabled=true;submit.textContent='Sending…';enquiry.setAttribute('aria-busy','true');
  try{
   const response=await fetch(enquiry.dataset.endpoint,{method:'POST',body:payload,headers:{Accept:'application/json'},signal:AbortSignal.timeout(20000)});
   const result=await response.json();
   if(!response.ok||result.errors?.length)throw new Error('Submission was not accepted.');
   enquiry.reset();phoneRequirement();
   show(status,testing?'Formspree accepted your test enquiry. Check the Formspree dashboard and confirm receipt with Amber before enabling normal enquiries.':'Your enquiry was accepted. Amber will review whether the firm can help. This does not confirm a consultation or create an attorney-client relationship.');
  }catch{
   show(error,'We couldn’t confirm that your enquiry was sent. Your details are still here. Please check your connection before trying again, or email Amber using the contact link.');
  }finally{
   submitting=false;submit.disabled=false;submit.textContent=testing?'Send test enquiry →':'Send enquiry →';enquiry.removeAttribute('aria-busy');
  }
 });
 // The inactive HTML form cannot submit if JavaScript fails or is unavailable.
 enquiry.inert=false;submit.disabled=false;
}
