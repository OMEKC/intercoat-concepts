var VER='1792143735';
(function(){
  var ifr=document.getElementById('live'); if(!ifr) return;
  var vp=ifr.parentNode, tabs=document.querySelectorAll('.tabs [data-c]');
  function fit(){
    var k=vp.clientWidth/390; if(!k) return;
    ifr.style.transform='scale('+k+')';
    ifr.style.height=Math.ceil(vp.clientHeight/k)+'px';
  }
  Array.prototype.forEach.call(tabs,function(b){
    b.addEventListener('click',function(){
      Array.prototype.forEach.call(tabs,function(x){var on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-selected',on)});
      ifr.src='c'+b.getAttribute('data-c')+'/index.html';
    });
  });
  window.addEventListener('resize',fit); ifr.addEventListener('load',fit); fit();
})();
