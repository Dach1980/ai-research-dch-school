(function(){
  "use strict";
  var KEYWORDS=new Set("False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield".split(" "));
  var BUILTINS=new Set("int float str bool list dict tuple set len range enumerate zip map filter sum min max print isinstance super type object open".split(" "));
  var token=/#[^\n]*|(?:\"\"\"[\s\S]*?\"\"\"|'''[\s\S]*?'''|\"(?:\\.|[^\"\\])*\"|'(?:\\.|[^'\\])*')|\b\d+(?:\.\d+)?\b|\b[A-Za-z_]\w*(?=\s*\()|\b[A-Za-z_]\w*\b|==|!=|<=|>=|\+=|-=|\*=|\/=|->|:=|[+*/%=<>!&|^~:-]/g;
  function esc(s){return s.replace(/[&<>\"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]});}
  function highlight(line){
    token.lastIndex=0;var out="",last=0,m;
    while((m=token.exec(line))){out+=esc(line.slice(last,m.index));var t=m[0],cls="";
      if(t[0]==="#")cls="comment";
      else if(t[0]==="'"||t[0]==='"')cls="string";
      else if(/^\d/.test(t))cls="number";
      else if(KEYWORDS.has(t))cls="keyword";
      else if(BUILTINS.has(t))cls="function";
      else if(/^[A-Z][A-Za-z0-9_]*$/.test(t))cls="class";
      else if(/^[A-Za-z_]\w*$/.test(t)&&/\s*\(/.test(line.slice(m.index+t.length)))cls="function";
      else if(/^[+*/%=<>!&|^~:-]+$/.test(t))cls="operator";
      else cls="identifier";
      out+='<span class="code-token-'+cls+'">'+esc(t)+'</span>';last=token.lastIndex;
    }
    return out+esc(line.slice(last));
  }
  function enhance(pre){
    if(pre.dataset.codeEnhanced==="1")return;
    var code=pre.querySelector("code")||pre;
    var match=(pre.className+" "+code.className).match(/(?:language|lang)-([a-z0-9_-]+)/i);var lang=pre.dataset.language||code.dataset.language||(match&&match[1])||"";
    if(lang.toLowerCase()!=="python")return;
    var original=code.textContent;
    var lines=original.replace(/\n$/,"").split("\n");
    code.innerHTML=lines.map(function(line){return '<span class="lesson-code-line">'+(highlight(line)||" ")+"</span>";}).join("");
    var wrap=document.createElement("div");wrap.className="lesson-code-block";
    var toolbar=document.createElement("div");toolbar.className="lesson-code-toolbar";
    var locale=(document.documentElement.lang||"ru").toLowerCase();var words=locale.indexOf("zh")===0?{copy:"复制代码",done:"已复制",fail:"复制失败"}:locale.indexOf("en")===0?{copy:"Copy",done:"Copied",fail:"Copy failed"}:{copy:"Копировать",done:"Скопировано",fail:"Не удалось скопировать"};var label=document.createElement("span");label.textContent="PYTHON";
    var copy=document.createElement("button");copy.type="button";copy.className="lesson-code-copy";copy.textContent=words.copy;copy.setAttribute("aria-label","Скопировать исходный код Python");
    copy.addEventListener("click",function(){var done=function(){copy.textContent=words.done;window.setTimeout(function(){copy.textContent=words.copy},1400)};if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(original).then(done).catch(function(){copy.textContent=words.fail})}else{var area=document.createElement("textarea");area.value=original;document.body.appendChild(area);area.select();try{document.execCommand("copy");done()}catch(_){copy.textContent="Не удалось скопировать"}area.remove();}});
    toolbar.append(label,copy);var parent=pre.parentNode;parent.insertBefore(wrap,pre);wrap.append(toolbar,pre);pre.dataset.codeEnhanced="1";
  }
  function scan(root){var selector='pre[data-language="python"],pre.language-python,pre.lang-python,pre code.language-python,pre code.lang-python';var scope=root||document;if(scope.matches&&scope.matches(selector))enhance(scope.tagName==="PRE"?scope:scope.closest("pre"));scope.querySelectorAll(selector).forEach(function(node){enhance(node.tagName==="PRE"?node:node.closest("pre"));});}
  scan(document);
  if(window.MutationObserver){new MutationObserver(function(records){records.forEach(function(record){record.addedNodes.forEach(function(node){if(node.nodeType===1)scan(node);});});}).observe(document.body,{childList:true,subtree:true});}
})();
