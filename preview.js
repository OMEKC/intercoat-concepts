var VER='1792009986';
(function(){
var C={
 c1:{n:'Концепция V1',d:'Светлая гамма, очень крупный заголовок, оранжевые углы и мозаика фотографий.'},
 c2:{n:'Концепция V2',d:'Мягкие формы, скруглённые карточки и мягкая панель серий.'},
 c3:{n:'Концепция V3',d:'Строгая сетка без скруглений, тонкие линии и нумерация блоков.'},
 c4:{n:'Концепция V4',d:'Тёмный первый экран на всю ширину с узором из квадратов.'},
 c5:{n:'Концепция V5',d:'Воздушная подача: новости с переключением прямо на первом экране.'}
};
var ov=document.getElementById('overview'),vw=document.getElementById('viewer'),
fr=document.getElementById('frame'),st=document.getElementById('stage'),
tabs=document.querySelectorAll('.tabs a'),segs=document.querySelectorAll('.seg button'),
mode='desktop',cur=null;
function setMode(m){mode=m;st.classList.toggle('mobile',m==='mobile');segs.forEach(function(b){b.setAttribute('aria-pressed',b.dataset.mode===m?'true':'false')})}
segs.forEach(function(b){b.addEventListener('click',function(){setMode(b.dataset.mode)})});
document.querySelectorAll('[data-mobile]').forEach(function(a){a.addEventListener('click',function(){setMode('mobile')})});
function route(){
 var h=(location.hash||'#/overview').replace('#/','').split('?')[0];
 var key=C[h]?h:'overview';
 tabs.forEach(function(t){if(t.dataset.tab===key)t.setAttribute('aria-current','page');else t.removeAttribute('aria-current')});
 if(key==='overview'){vw.hidden=true;ov.hidden=false;fr.src='about:blank';cur=null;document.title='Intercoat — концепции главной страницы';
   if(location.hash.indexOf('#/overview')===0||!location.hash)window.scrollTo(0,0);return}
 ov.hidden=true;vw.hidden=false;
 document.getElementById('vname').textContent=C[key].n;document.getElementById('vdesc').textContent=C[key].d;
 document.getElementById('vopen').href=key+'/index.html?v='+VER;
 document.title='Intercoat — концепция '+C[key].n;
 if(cur!==key){fr.src=key+'/index.html?v='+VER;cur=key}
 window.scrollTo(0,0);
}
function setTop(){var t=document.querySelector('.note-strip').offsetHeight+document.getElementById('top').offsetHeight;document.documentElement.style.setProperty('--top',t+'px')}
window.addEventListener('hashchange',route);window.addEventListener('resize',setTop);
setTop();route();
document.querySelectorAll('.top a, .hero a').forEach(function(){});
})();
