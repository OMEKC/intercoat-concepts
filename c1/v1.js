/* Intercoat V1: news switcher (scroll-snap + arrows), company text toggle, menu, language select. No autoplay, no loop. */
(function(){
  var reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root=document.querySelector('[data-v5-news]');
  if(root){
    var track=root.querySelector('.track'),cards=[].slice.call(track.children),prev=root.querySelector('.prev'),next=root.querySelector('.next'),count=document.querySelector('.news-count'),bar=document.querySelector('.bar b');
    var pad=function(n){return(n<10?'0':'')+n};
    var step=function(){var a=cards[0].getBoundingClientRect(),b=cards[1]?cards[1].getBoundingClientRect():null;return b?b.left-a.left:a.width};
    var per=function(){return Math.max(1,Math.round(track.clientWidth/step()))};
    var update=function(){
      var s=step(),i=Math.round(track.scrollLeft/s),p=per(),end=track.scrollLeft+track.clientWidth>=track.scrollWidth-2;
      var from=i+1,to=Math.min(cards.length,i+p);if(end){to=cards.length;from=Math.max(1,to-p+1)}
      if(count)count.textContent=(from===to?pad(from):pad(from)+'–'+pad(to))+' / '+pad(cards.length);
      if(bar)bar.style.width=(to/cards.length*100)+'%';
      prev.disabled=track.scrollLeft<=2;next.disabled=end;
    };
    var go=function(d){track.scrollBy({left:d*step(),behavior:reduced?'auto':'smooth'})};
    prev.addEventListener('click',function(){go(-1)});next.addEventListener('click',function(){go(1)});
    track.addEventListener('scroll',function(){window.requestAnimationFrame(update)},{passive:true});
    track.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();go(1)}if(e.key==='ArrowLeft'){e.preventDefault();go(-1)}});
    window.addEventListener('resize',update);update();
  }
  [].forEach.call(document.querySelectorAll('.company-toggle'),function(btn){
    var box=document.querySelector('.co .long'),img=document.querySelector('.co .vis img'),label=btn.querySelector('.lbl');
    btn.addEventListener('click',function(){
      var open=box.hidden;box.hidden=!open;img.style.visibility=open?'hidden':'visible';
      btn.setAttribute('aria-expanded',String(open));label.textContent=open?btn.dataset.close:btn.dataset.open;
    });
  });
  var b=document.querySelector('.burger'),m=document.querySelector('.mnav');
  if(b&&m){
    b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',String(o))});
    m.addEventListener('click',function(e){if(e.target.closest('a')){m.classList.remove('open');b.setAttribute('aria-expanded','false')}});
  }
  /* language list: opens under the header, filters as you type, closes on Esc, outside click or the cross */
  var lt=document.querySelector('.language-trigger'),lp=document.getElementById('language-panel');
  if(lt&&lp){
    var ls=lp.querySelector('.language-search'),lo=[].slice.call(lp.querySelectorAll('.language-option')),le=lp.querySelector('.language-empty');
    var filt=function(){var q=ls.value.trim().toLowerCase(),n=0;lo.forEach(function(o){var hit=!q||(o.textContent+' '+o.dataset.search).toLowerCase().indexOf(q)>-1;o.hidden=!hit;if(hit)n++});le.hidden=n>0};
    var setL=function(open){lp.hidden=!open;lt.setAttribute('aria-expanded',String(open));if(open){if(m){m.classList.remove('open');if(b)b.setAttribute('aria-expanded','false')}ls.focus({preventScroll:true})}else{ls.value='';filt()}};
    lt.addEventListener('click',function(){setL(lp.hidden)});
    lp.querySelector('.close-language').addEventListener('click',function(){setL(false);lt.focus()});
    ls.addEventListener('input',filt);
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!lp.hidden){setL(false);lt.focus()}});
    document.addEventListener('click',function(e){if(!lp.hidden&&!lp.contains(e.target)&&!lt.contains(e.target))setL(false)});
    if(b)b.addEventListener('click',function(){if(!lp.hidden)setL(false)});
  }
  [].forEach.call(document.querySelectorAll('.cookie-settings'),function(x){x.addEventListener('click',function(e){e.preventDefault();});});
})();
