/* HR/EN switch: translates text nodes, attributes and title from window.T_EN */
(function(){
var T=window.T_EN||{},K='nwa-lang',orig=new WeakMap(),oa=new WeakMap(),L='hr',A=['alt','title','placeholder','aria-label','value'];
function n(s){return s.replace(/\s+/g,' ').trim()}
function tr(root){
  var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),x;
  while(x=w.nextNode()){var p=x.parentNode;if(!p||/SCRIPT|STYLE/.test(p.nodeName))continue;
    if(!orig.has(x)||(L==='hr'&&x.nodeValue!==orig.get(x)&&n(x.nodeValue)!==T[n(orig.get(x))]))orig.set(x,x.nodeValue);
    var o=orig.get(x),k=n(o);
    if(L==='en'&&T[k]){var lead=o.match(/^\s*/)[0],tail=o.match(/\s*$/)[0];x.nodeValue=lead+T[k]+tail}else x.nodeValue=o}
  if(root.querySelectorAll)root.querySelectorAll('[alt],[title],[placeholder],[aria-label],input[type=button],input[type=submit]').forEach(function(e){
    A.forEach(function(a){if(!e.hasAttribute(a))return;var m=oa.get(e)||{};if(!(a in m))m[a]=e.getAttribute(a);oa.set(e,m);var v=n(m[a]);e.setAttribute(a,L==='en'&&T[v]?T[v]:m[a])})});
}
window.siteLang=function(){return L};
window.setSiteLang=function(l){L=l;try{localStorage.setItem(K,l)}catch(e){}document.documentElement.lang=l;
  if(document.__t0==null)document.__t0=document.title;document.title=l==='en'&&T[n(document.__t0)]?T[n(document.__t0)]:document.__t0;
  tr(document.body);document.querySelectorAll('.lang-sw button').forEach(function(b){b.classList.toggle('on',b.dataset.l===l)});
  document.dispatchEvent(new CustomEvent('sitelang',{detail:l}))};
try{L=localStorage.getItem(K)||'hr'}catch(e){}
new MutationObserver(function(ms){if(L!=='en')return;ms.forEach(function(m){m.addedNodes.forEach(function(d){if(d.nodeType===1)tr(d);else if(d.nodeType===3&&d.parentNode)tr(d.parentNode)})})}).observe(document.body,{childList:true,subtree:true});
setSiteLang(L);
})();
(function(){var s=document.createElement('style');s.textContent=".lang-sw{border-radius:0!important;border:1px solid #C9A85A!important;box-shadow:none!important;background:rgba(255,255,255,.85)}.lang-sw button{font-family:'Cormorant Garamond',serif!important;font-weight:600;letter-spacing:2px!important;color:#3A2E20!important;padding:8px 13px!important;border-radius:0!important}.lang-sw button.on{background:#3A2E20!important;color:#F6E7BE!important}";document.head.appendChild(s)})();
