(function(){
  var D=window.PACK, grid=document.getElementById('grid'), items=D.items, cur=0, vis=[];
  var ZOOM='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8v6M8 11h6"/></svg>';
  grid.innerHTML=items.map(function(it,i){
    return '<article class="card'+(it.feature?' feature':'')+'" data-i="'+i+'" data-cat="'+it.cat+'" tabindex="0">'+
    '<div class="ph"><img loading="lazy" src="'+D.dir+it.id+'-t.webp" alt="'+it.title+'"></div><span class="zoom">'+ZOOM+'</span>'+
    '<div class="meta"><div><h3>'+it.title+'</h3><p>'+it.desc+'</p></div><span class="tag">'+D.cats[it.cat]+'</span></div></article>';
  }).join('');
  var cards=[].slice.call(grid.children);

  // reveal
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var n=cards.indexOf(e.target);e.target.style.transitionDelay=(n%3)*70+'ms';e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.08});
  cards.forEach(function(c){io.observe(c)});

  // filters
  var chips=document.getElementById('chips');
  if(chips){
    var keys=Object.keys(D.cats), cnt={all:items.length};
    items.forEach(function(it){cnt[it.cat]=(cnt[it.cat]||0)+1});
    chips.innerHTML='<button class="chip on" data-f="all">Tất cả<small>'+cnt.all+'</small></button>'+keys.map(function(k){return '<button class="chip" data-f="'+k+'">'+D.cats[k]+'<small>'+cnt[k]+'</small></button>'}).join('');
    chips.addEventListener('click',function(e){var b=e.target.closest('.chip');if(!b)return;
      [].forEach.call(chips.children,function(c){c.classList.toggle('on',c===b)});
      var f=b.dataset.f;cards.forEach(function(c){c.classList.toggle('hide',f!=='all'&&c.dataset.cat!==f);if(!c.classList.contains('hide'))c.classList.add('in')})});
  }

  // lightbox
  var lb=document.getElementById('lb'),im=lb.querySelector('img'),cap=lb.querySelector('.lb-cap'),ct=lb.querySelector('.ct');
  function visible(){return cards.filter(function(c){return !c.classList.contains('hide')}).map(function(c){return +c.dataset.i})}
  function show(i){cur=i;var it=items[i];im.style.animation='none';void im.offsetWidth;im.style.animation='';im.src=D.dir+it.id+'.webp';im.alt=it.title;
    cap.innerHTML='<b>'+it.title+'</b><span>'+it.desc+'</span>';vis=visible();ct.textContent=(vis.indexOf(i)+1)+' / '+vis.length;
    var n=items[vis[(vis.indexOf(i)+1)%vis.length]];if(n){(new Image()).src=D.dir+n.id+'.webp'}}
  function step(d){vis=visible();var p=(vis.indexOf(cur)+d+vis.length)%vis.length;show(vis[p])}
  function open(i){lb.classList.add('open');document.body.style.overflow='hidden';show(i)}
  function close(){lb.classList.remove('open');document.body.style.overflow=''}
  grid.addEventListener('click',function(e){var c=e.target.closest('.card');if(c)open(+c.dataset.i)});
  grid.addEventListener('keydown',function(e){if(e.key==='Enter'){var c=e.target.closest('.card');if(c)open(+c.dataset.i)}});
  lb.querySelector('.x').onclick=close;lb.querySelector('.pv').onclick=function(){step(-1)};lb.querySelector('.nx').onclick=function(){step(1)};
  lb.addEventListener('click',function(e){if(e.target===lb)close()});
  document.addEventListener('keydown',function(e){if(!lb.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1)});
  var sx=null;lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)step(dx<0?1:-1);sx=null});
})();
