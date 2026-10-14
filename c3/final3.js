/* News banner: finite manual navigation; no autoplay and no wrap. Swipe advances one story. */
(function(){
  const root=document.querySelector('[data-news-banner]');if(!root)return;
  const slides=[...root.querySelectorAll('[data-news-slide]')],prev=root.querySelector('.banner-prev'),next=root.querySelector('.banner-next'),count=root.querySelector('.banner-count');let i=0;
  function go(n){i=Math.max(0,Math.min(n,slides.length-1));slides.forEach((s,k)=>s.hidden=k!==i);prev.disabled=i===0;next.disabled=i===slides.length-1;count.textContent='News '+(i+1)+' of '+slides.length;}
  prev.addEventListener('click',()=>go(i-1));next.addEventListener('click',()=>go(i+1));root.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();go(i-1)}if(e.key==='ArrowRight'){e.preventDefault();go(i+1)}});
  let x=null;root.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')x=e.clientX});root.addEventListener('pointerup',e=>{if(x===null)return;const d=e.clientX-x;x=null;if(Math.abs(d)>50)go(i+(d<0?1:-1))});root.addEventListener('pointercancel',()=>x=null);go(0);
})();
