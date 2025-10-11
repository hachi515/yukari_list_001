/* ===== app.js（ES5/IE対応） ===== */
var DEFAULT_PRIO = 999;

/* NFKCもどき：全角→半角、カタカナ→ひらがな、空白圧縮、小文字化 */
function canon(s){
  if(!s) return '';
  var out = '';
  for(var i=0;i<s.length;i++){
    var c = s.charCodeAt(i);
    if(c===0x3000){ out+=' '; continue; }                 // 全角スペース→半角
    if(c>=0xFF01 && c<=0xFF5E){ out+=String.fromCharCode(c-0xFEE0); continue; } // 全角英数記号→半角
    if(c>=0x30A1 && c<=0x30F6){ out+=String.fromCharCode(c-0x60); continue; }   // カタカナ→ひらがな
    out += s.charAt(i);
  }
  out = out.toLowerCase();
  out = out.replace(/\s+/g,' ').replace(/^\s+|\s+$/g,'');
  return out;
}
/* 半角/全角スペースAND */
function tokensAnd(v){ 
  var t = canon(v).split(/[ \u3000]+/);
  var a = []; for(var i=0;i<t.length;i++){ if(t[i]) a.push(t[i]); }
  return a;
}
/* クエリ取得（URLSearchParams未使用） */
function qparam(name){
  var q = window.location.search.replace(/^\?/,''), i, kv;
  if(!q) return '';
  var parts = q.split('&');
  for(i=0;i<parts.length;i++){
    kv = parts[i].split('=');
    if(kv[0]===name){
      try{ return decodeURIComponent((kv[1]||'').replace(/\+/g,' ')); }catch(e){ return ''; }
    }
  }
  return '';
}
/* 外部PHP検索リンク化（青タイトルのみ） */
(function(){
  if(!document.querySelectorAll) return;
  var as = document.querySelectorAll('a[data-q]');
  for(var i=0;i<as.length;i++){
    try{
      var a = as[i];
      var q = a.getAttribute('data-q')||'';
      a.setAttribute('href', (window.SEARCH_BASE||'') + 'search.php?searchword=' + q);
      a.setAttribute('target','_blank');
      a.setAttribute('rel','noopener');
    }catch(e){}
  }
})();

/* 優先度ソート（可視カードのみ） */
function reorderByPriority(listId){
  var list = document.getElementById(listId); if(!list) return;
  var nodes = list.getElementsByClassName('card');
  var arr = [];
  for(var i=0;i<nodes.length;i++){
    if(nodes[i].style.display!=='none'){ arr.push(nodes[i]); }
  }
  arr.sort(function(a,b){
    var pa = parseInt(a.getAttribute('data-priority')||DEFAULT_PRIO,10);
    var pb = parseInt(b.getAttribute('data-priority')||DEFAULT_PRIO,10);
    if(pa!==pb) return pa-pb;
    var da = parseInt(a.getAttribute('data-updated')||'0',10);
    var db = parseInt(b.getAttribute('data-updated')||'0',10);
    return db-da;
  });
  var frag = document.createDocumentFragment();
  for(var j=0;j<arr.length;j++){ frag.appendChild(arr[j]); }
  list.appendChild(frag);
}
function setInitialCount(listId){
  var list = document.getElementById(listId);
  var cEl  = document.getElementById('count-'+listId);
  if(list && cEl){
    var total = list.getElementsByClassName('card').length;
    cEl.innerText = '表示件数: ' + total;
  }
}

/* インデックス（初回構築） */
var __els=null, __keys=null;
function ensureIndex(listId){
  if(__els && __keys) return;
  var list = document.getElementById(listId); if(!list) return;
  var nodes = list.getElementsByClassName('card');
  __els=[]; __keys=[];
  for(var i=0;i<nodes.length;i++){
    __els.push(nodes[i]);
    __keys.push(nodes[i].getAttribute('data-key')||'');
  }
}

/* ★ボタン押下でのみ実行（onchange等では動かない） */
function filterCardsAdv(listId, boxId, yearId){
  ensureIndex(listId);
  var list = document.getElementById(listId); if(!list) return;
  var ySel = document.getElementById(yearId);
  var y = ySel ? (ySel.value||'') : '';
  var box = document.getElementById(boxId);
  var tokens = tokensAnd(box ? (box.value||'') : '');

  list.style.display='none';
  var vis = 0;

  // いったん全部非表示
  for(var i=0;i<__els.length;i++){ __els[i].style.display='none'; }

  if(tokens.length===0){
    // 年のみ
    for(var k=0;k<__els.length;k++){
      var el = __els[k];
      var yr = el.getAttribute('data-year')||'';
      var band = el.getAttribute('data-yearband')||'';
      var show = (!y || yr===y || band===y);
      if(show){ el.style.display=''; vis++; }
    }
  }else{
    outer: for(var m=0;m<__els.length;m++){
      var el2 = __els[m];
      var key = __keys[m];
      for(var t=0;t<tokens.length;t++){
        if(key.indexOf(tokens[t])===-1) continue outer;
      }
      var yr2 = el2.getAttribute('data-year')||'';
      var bd2 = el2.getAttribute('data-yearband')||'';
      if(!y || yr2===y || bd2===y){ el2.style.display=''; vis++; }
    }
  }
  var cEl = document.getElementById('count-'+listId);
  if(cEl) cEl.innerText = '表示件数: ' + vis;

  reorderByPriority(listId);
  list.style.display='';
}
