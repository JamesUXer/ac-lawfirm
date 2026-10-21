export function serviceTemplates({asset,esc,label,primary,secondary,banner,services,icon,processMarkup}) {
 const breadcrumbs=s=>`<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a> &gt; <a href="/#services">Services</a> &gt; <span aria-current="page">${esc(s.label)}</span></nav>`;
 const heading=s=>`<h1>${esc(s.title)}${s.emphasis?`<em>${esc(s.emphasis)}</em>`:''}</h1>`;
 const checklist=(items,columns=false)=>`<ul class="service-checklist ${columns?'two-columns':''}">${items.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`;
 const process=dark=>`<section class="service-process ${dark?'service-process-dark':''}"><div class="container">${processMarkup()}</div></section>`;
 const page=s=>{
  const title=heading(s),image=`<span class="service-page-icon" data-practice-icon="${s.iconIndex}">${icon(s.iconIndex)}</span>`,intro=`<p class="service-intro-copy">${esc(s.intro)}</p>`;
  if(s.kind==='detailed')return `<div class="service-page detailed-service"><section class="service-hero"><div class="container">${breadcrumbs(s)}<div class="service-hero-grid"><div class="service-hero-copy"><div class="service-icon-small">${image}</div>${title}${intro}</div><aside class="service-glance"><h2>At a glance</h2>${checklist(s.glance)}</aside></div>${primary()}</div></section><section class="service-relevance"><div class="container">${label('About this service')}<h2>This service might be right for you if:</h2>${checklist(s.criteria,true)}</div></section><section class="service-coverage"><div class="container">${label('What we cover')}<h2>${esc(s.coverageTitle)}</h2><dl>${s.coverage.map(([term,definition])=>`<div><dt>${esc(term)}</dt><dd>${esc(definition)}</dd></div>`).join('')}</dl></div></section>${process(true)}${banner()}</div>`;
  if(s.kind==='unsure')return `<div class="service-page unsure-service"><section class="service-hero"><div class="container">${breadcrumbs(s)}<div class="service-icon-small">${image}</div>${title}${intro}${primary()}</div></section>${process(false)}</div>`;
  throw new Error('Unsupported service page format: '+s.kind);
 };
 const menuLink=(s,i)=>`<a href="/services/${s.slug}/"><span class="service-menu-heading"><span>${esc(s.label)}</span>${asset(i===2||i===4?'menu-imgArrow110.svg':'menu-imgArrow109.svg','class="service-menu-arrow" width="13" height="14.7279" alt=""')}</span><span class="service-menu-description">${esc(s.tagline)}</span></a>`;
 const menu=()=>`<div class="services-nav"><button id="services-toggle" class="nav-link" aria-expanded="false" aria-controls="services-dropdown">Services ${asset('menu-imgFrame1000007305.svg','class="services-chevron" width="14" height="13" alt=""')}</button><div id="services-dropdown" class="services-dropdown" hidden><ul>${services.filter(s=>s.kind!=='unsure').map((s,i)=>`<li>${menuLink(s,i)}</li>`).join('')}</ul><div class="service-menu-guidance">${menuLink(services.find(s=>s.kind==='unsure'),5)}</div></div></div>`;
 return {page,menu};
}
