goog.provide('webrepl');
goog.require('cljs.core');
goog.require('cljs.repl');
webrepl.dom = (function dom(o){
if(cljs.core.coll_QMARK_.call(null,o))
{var vec__3184 = o;
var tag = cljs.core.nth.call(null,vec__3184,0,null);
var attrs = cljs.core.nth.call(null,vec__3184,1,null);
var body = cljs.core.nthnext.call(null,vec__3184,2);
if(cljs.core.keyword_QMARK_.call(null,tag))
{var elem = document.createElement(cljs.core.name.call(null,tag));
if(cljs.core.map_QMARK_.call(null,attrs))
{var G__3185_3187 = cljs.core.seq.call(null,attrs);
while(true){
if(G__3185_3187)
{var vec__3186_3188 = cljs.core.first.call(null,G__3185_3187);
var k_3189 = cljs.core.nth.call(null,vec__3186_3188,0,null);
var v_3190 = cljs.core.nth.call(null,vec__3186_3188,1,null);
if(cljs.core.truth_(v_3190))
{elem.setAttribute(cljs.core.name.call(null,k_3189),v_3190);
} else
{}
{
var G__3191 = cljs.core.next.call(null,G__3185_3187);
G__3185_3187 = G__3191;
continue;
}
} else
{}
break;
}
} else
{}
return cljs.core.PersistentVector.fromArray([webrepl.append_dom.call(null,elem,((cljs.core.map_QMARK_.call(null,attrs))?body:cljs.core.cons.call(null,attrs,body)))], true);
} else
{return cljs.core.mapcat.call(null,dom,o);
}
} else
{if(cljs.core.truth_(o))
{return cljs.core.PersistentVector.fromArray([document.createTextNode([cljs.core.str(o)].join(''))], true);
} else
{return null;
}
}
});
webrepl.append_dom = (function append_dom(parent,v){
var G__3193_3194 = cljs.core.seq.call(null,webrepl.dom.call(null,v));
while(true){
if(G__3193_3194)
{var i_3195 = cljs.core.first.call(null,G__3193_3194);
parent.appendChild(i_3195);
{
var G__3196 = cljs.core.next.call(null,G__3193_3194);
G__3193_3194 = G__3196;
continue;
}
} else
{}
break;
}
return parent;
});
webrepl.repl_print = (function repl_print(log,text,cls){
var G__3198_3199 = cljs.core.seq.call(null,[cljs.core.str(text)].join('').split(/\n/));
while(true){
if(G__3198_3199)
{var line_3200 = cljs.core.first.call(null,G__3198_3199);
webrepl.append_dom.call(null,log,cljs.core.PersistentVector.fromArray(["\uFDD0'div",cljs.core.ObjMap.fromObject(["\uFDD0'class"],{"\uFDD0'class":[cljs.core.str("cg "),cljs.core.str((cljs.core.truth_(cls)?[cljs.core.str(" "),cljs.core.str(cls)].join(''):null))].join('')}),line_3200], true));
{
var G__3201 = cljs.core.next.call(null,G__3198_3199);
G__3198_3199 = G__3201;
continue;
}
} else
{}
break;
}
return log.scrollTop = log.scrollHeight;
});
webrepl.postexpr = (function postexpr(log,text){
return webrepl.append_dom.call(null,log,cljs.core.PersistentVector.fromArray(["\uFDD0'table",cljs.core.PersistentVector.fromArray(["\uFDD0'tbody",cljs.core.PersistentVector.fromArray(["\uFDD0'tr",cljs.core.PersistentVector.fromArray(["\uFDD0'td",cljs.core.ObjMap.fromObject(["\uFDD0'class"],{"\uFDD0'class":"cg"}),cljs.repl.prompt.call(null)], true),cljs.core.PersistentVector.fromArray(["\uFDD0'td",text.replace(/\n$/,"")], true)], true)], true)], true));
});
webrepl.pep = (function pep(log,text){
webrepl.postexpr.call(null,log,text);
return cljs.repl.eval_print.call(null,text);
});
window.onload = (function (){
cljs.repl.init.call(null);
var log = document.getElementById("log");
var input = document.getElementById("input");
var status1 = document.getElementById("status1");
var status2 = document.getElementById("status2");
cljs.core._STAR_out_STAR_ = (function (p1__3202_SHARP_){
return webrepl.repl_print.call(null,log,p1__3202_SHARP_,null);
});
cljs.core._STAR_rtn_STAR_ = (function (p1__3203_SHARP_){
return webrepl.repl_print.call(null,log,p1__3203_SHARP_,"rtn");
});
cljs.core._STAR_err_STAR_ = (function (p1__3204_SHARP_){
return webrepl.repl_print.call(null,log,p1__3204_SHARP_,"err");
});
cljs.core._STAR_print_fn_STAR_ = (function (p1__3205_SHARP_){
return cljs.core._STAR_out_STAR_.call(null,p1__3205_SHARP_);
});
cljs.core.println.call(null,";; ClojureScript");
webrepl.append_dom.call(null,log,cljs.core.PersistentVector.fromArray(["\uFDD0'div",cljs.core.ObjMap.fromObject(["\uFDD0'class"],{"\uFDD0'class":"cg"}),";;   - ",cljs.core.PersistentVector.fromArray(["\uFDD0'a",cljs.core.ObjMap.fromObject(["\uFDD0'href"],{"\uFDD0'href":"http://github.com/kanaka/clojurescript"}),"http://github.com/kanaka/clojurescript"], true)], true));
cljs.core.println.call(null,";;   - A port of the ClojureScript compiler to ClojureScript");
webrepl.pep.call(null,log,"(+ 1 2)");
webrepl.pep.call(null,log,"(defn cube [x] (* x x x))");
webrepl.pep.call(null,log,"(cube 8)");
webrepl.pep.call(null,log,"(defmacro unless [pred a b] `(if (not ~pred) ~a ~b))");
webrepl.pep.call(null,log,"(unless false :yep :nope)");
input.onkeypress = (function (ev){
if(((function (){var or__3824__auto__ = ev;
if(cljs.core.truth_(or__3824__auto__))
{return or__3824__auto__;
} else
{return webrepl.event;
}
})().keyCode === 13))
{var line = input.value;
if(cljs.core.truth_(cljs.repl.complete_form_QMARK_.call(null,line)))
{webrepl.pep.call(null,log,line);
setTimeout((function (){
return input.value = "";
}),0);
status1.style.visibility = "visible";
status2.style.visibility = "hidden";
return document.getElementById("ns").innerText = cljs.repl.prompt.call(null);
} else
{status1.style.visibility = "hidden";
return status2.style.visibility = "visible";
}
} else
{return null;
}
});
return input.focus();
});
