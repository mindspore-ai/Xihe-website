/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.98.1
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

typeof self>"u"&&(self={}),self.onmessage=function(r){var a=r.data;require(a.loaderConfig,[a.workerModule],function(c){self.onmessage=c,self.CESIUM_BASE_URL=a.loaderConfig.baseUrl})};function setTimeout(r){r()}/** vim: et:ts=4:sw=4:sts=4
 * @license RequireJS 2.1.20 Copyright (c) 2010-2015, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */var requirejs,require,define;(function(global){var req,s,head,baseElement,dataMain,src,interactiveScript,currentlyAddingScript,mainScript,subPath,version="2.1.20",commentRegExp=/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm,cjsRequireRegExp=/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,jsSuffixRegExp=/\.js$/,currDirRegExp=/^\.\//,op=Object.prototype,ostring=op.toString,hasOwn=op.hasOwnProperty,ap=Array.prototype,isBrowser=!!(typeof window<"u"&&typeof navigator<"u"&&window.document),isWebWorker=!isBrowser&&typeof importScripts<"u",readyRegExp=isBrowser&&navigator.platform==="PLAYSTATION 3"?/^complete$/:/^(complete|loaded)$/,defContextName="_",isOpera=typeof opera<"u"&&opera.toString()==="[object Opera]",contexts={},cfg={},globalDefQueue=[],useInteractive=!1;function isFunction(r){return ostring.call(r)==="[object Function]"}function isArray(r){return ostring.call(r)==="[object Array]"}function each(r,a){if(r){var c;for(c=0;c<r.length&&!(r[c]&&a(r[c],c,r));c+=1);}}function eachReverse(r,a){if(r){var c;for(c=r.length-1;c>-1&&!(r[c]&&a(r[c],c,r));c-=1);}}function hasProp(r,a){return hasOwn.call(r,a)}function getOwn(r,a){return hasProp(r,a)&&r[a]}function eachProp(r,a){var c;for(c in r)if(hasProp(r,c)&&a(r[c],c))break}function mixin(r,a,c,u){return a&&eachProp(a,function(d,q){(c||!hasProp(r,q))&&(u&&typeof d=="object"&&d&&!isArray(d)&&!isFunction(d)&&!(d instanceof RegExp)?(r[q]||(r[q]={}),mixin(r[q],d,c,u)):r[q]=d)}),r}function bind(r,a){return function(){return a.apply(r,arguments)}}function scripts(){return document.getElementsByTagName("script")}function defaultOnError(r){throw r}function getGlobal(r){if(!r)return r;var a=global;return each(r.split("."),function(c){a=a[c]}),a}function makeError(r,a,c,u){var d=new Error(a+`
http://requirejs.org/docs/errors.html#`+r);return d.requireType=r,d.requireModules=u,c&&(d.originalError=c),d}if(typeof define<"u")return;if(typeof requirejs<"u"){if(isFunction(requirejs))return;cfg=requirejs,requirejs=void 0}typeof require<"u"&&!isFunction(require)&&(cfg=require,require=void 0);function newContext(r){var a,c,u,d,q,g={waitSeconds:7,baseUrl:"./",paths:{},bundles:{},pkgs:{},shim:{},config:{}},v={},B={},I={},O=[],w={},D={},L={},H=1,K=1;function X(e){var i,o;for(i=0;i<e.length;i++)if(o=e[i],o===".")e.splice(i,1),i-=1;else if(o===".."){if(i===0||i===1&&e[2]===".."||e[i-1]==="..")continue;i>0&&(e.splice(i-1,2),i-=2)}}function C(e,i,o){var t,n,f,l,p,h,x,E,m,b,M,A,k=i&&i.split("/"),R=g.map,j=R&&R["*"];if(e&&(e=e.split("/"),x=e.length-1,g.nodeIdCompat&&jsSuffixRegExp.test(e[x])&&(e[x]=e[x].replace(jsSuffixRegExp,"")),e[0].charAt(0)==="."&&k&&(A=k.slice(0,k.length-1),e=A.concat(e)),X(e),e=e.join("/")),o&&R&&(k||j)){f=e.split("/");e:for(l=f.length;l>0;l-=1){if(h=f.slice(0,l).join("/"),k){for(p=k.length;p>0;p-=1)if(n=getOwn(R,k.slice(0,p).join("/")),n&&(n=getOwn(n,h),n)){E=n,m=l;break e}}!b&&j&&getOwn(j,h)&&(b=getOwn(j,h),M=l)}!E&&b&&(E=b,m=M),E&&(f.splice(0,m,E),e=f.join("/"))}return t=getOwn(g.pkgs,e),t||e}function W(e){isBrowser&&each(scripts(),function(i){if(i.getAttribute("data-requiremodule")===e&&i.getAttribute("data-requirecontext")===u.contextName)return i.parentNode.removeChild(i),!0})}function U(e){var i=getOwn(g.paths,e);if(i&&isArray(i)&&i.length>1)return i.shift(),u.require.undef(e),u.makeRequire(null,{skipMap:!0})([e]),!0}function G(e){var i,o=e?e.indexOf("!"):-1;return o>-1&&(i=e.substring(0,o),e=e.substring(o+1,e.length)),[i,e]}function S(e,i,o,t){var n,f,l,p,h=null,x=i?i.name:null,E=e,m=!0,b="";return e||(m=!1,e="_@r"+(H+=1)),p=G(e),h=p[0],e=p[1],h&&(h=C(h,x,t),f=getOwn(w,h)),e&&(h?f&&f.normalize?b=f.normalize(e,function(M){return C(M,x,t)}):b=e.indexOf("!")===-1?C(e,x,t):e:(b=C(e,x,t),p=G(b),h=p[0],b=p[1],o=!0,n=u.nameToUrl(b))),l=h&&!f&&!o?"_unnormalized"+(K+=1):"",{prefix:h,name:b,parentMap:i,unnormalized:!!l,url:n,originalName:E,isDefine:m,id:(h?h+"!"+b:b)+l}}function P(e){var i=e.id,o=getOwn(v,i);return o||(o=v[i]=new u.Module(e)),o}function T(e,i,o){var t=e.id,n=getOwn(v,t);hasProp(w,t)&&(!n||n.defineEmitComplete)?i==="defined"&&o(w[t]):(n=P(e),n.error&&i==="error"?o(n.error):n.on(i,o))}function y(e,i){var o=e.requireModules,t=!1;i?i(e):(each(o,function(n){var f=getOwn(v,n);f&&(f.error=e,f.events.error&&(t=!0,f.emit("error",e)))}),t||req.onError(e))}function Q(){globalDefQueue.length&&(each(globalDefQueue,function(e){var i=e[0];typeof i=="string"&&(u.defQueueMap[i]=!0),O.push(e)}),globalDefQueue=[])}d={require:function(e){return e.require?e.require:e.require=u.makeRequire(e.map)},exports:function(e){if(e.usingExports=!0,e.map.isDefine)return e.exports?w[e.map.id]=e.exports:e.exports=w[e.map.id]={}},module:function(e){return e.module?e.module:e.module={id:e.map.id,uri:e.map.url,config:function(){return getOwn(g.config,e.map.id)||{}},exports:e.exports||(e.exports={})}}};function F(e){delete v[e],delete B[e]}function $(e,i,o){var t=e.map.id;e.error?e.emit("error",e.error):(i[t]=!0,each(e.depMaps,function(n,f){var l=n.id,p=getOwn(v,l);p&&!e.depMatched[f]&&!o[l]&&(getOwn(i,l)?(e.defineDep(f,w[l]),e.check()):$(p,i,o))}),o[t]=!0)}function z(){var e,i,o=g.waitSeconds*1e3,t=o&&u.startTime+o<new Date().getTime(),n=[],f=[],l=!1,p=!0;if(!a){if(a=!0,eachProp(B,function(h){var x=h.map,E=x.id;if(!!h.enabled&&(x.isDefine||f.push(h),!h.error)){if(!h.inited&&t)U(E)?(i=!0,l=!0):(n.push(E),W(E));else if(!h.inited&&h.fetched&&x.isDefine&&(l=!0,!x.prefix))return p=!1}}),t&&n.length)return e=makeError("timeout","Load timeout for modules: "+n,null,n),e.contextName=u.contextName,y(e);p&&each(f,function(h){$(h,{},{})}),(!t||i)&&l&&(isBrowser||isWebWorker)&&!q&&(q=setTimeout(function(){q=0,z()},50)),a=!1}}c=function(e){this.events=getOwn(I,e.id)||{},this.map=e,this.shim=getOwn(g.shim,e.id),this.depExports=[],this.depMaps=[],this.depMatched=[],this.pluginMaps={},this.depCount=0},c.prototype={init:function(e,i,o,t){t=t||{},!this.inited&&(this.factory=i,o?this.on("error",o):this.events.error&&(o=bind(this,function(n){this.emit("error",n)})),this.depMaps=e&&e.slice(0),this.errback=o,this.inited=!0,this.ignore=t.ignore,t.enabled||this.enabled?this.enable():this.check())},defineDep:function(e,i){this.depMatched[e]||(this.depMatched[e]=!0,this.depCount-=1,this.depExports[e]=i)},fetch:function(){if(!this.fetched){this.fetched=!0,u.startTime=new Date().getTime();var e=this.map;if(this.shim)u.makeRequire(this.map,{enableBuildCallback:!0})(this.shim.deps||[],bind(this,function(){return e.prefix?this.callPlugin():this.load()}));else return e.prefix?this.callPlugin():this.load()}},load:function(){var e=this.map.url;D[e]||(D[e]=!0,u.load(this.map.id,e))},check:function(){if(!(!this.enabled||this.enabling)){var e,i,o=this.map.id,t=this.depExports,n=this.exports,f=this.factory;if(!this.inited)hasProp(u.defQueueMap,o)||this.fetch();else if(this.error)this.emit("error",this.error);else if(!this.defining){if(this.defining=!0,this.depCount<1&&!this.defined){if(isFunction(f)){if(this.events.error&&this.map.isDefine||req.onError!==defaultOnError)try{n=u.execCb(o,f,t,n)}catch(l){e=l}else n=u.execCb(o,f,t,n);if(this.map.isDefine&&n===void 0&&(i=this.module,i?n=i.exports:this.usingExports&&(n=this.exports)),e)return e.requireMap=this.map,e.requireModules=this.map.isDefine?[this.map.id]:null,e.requireType=this.map.isDefine?"define":"require",y(this.error=e)}else n=f;this.exports=n,this.map.isDefine&&!this.ignore&&(w[o]=n,req.onResourceLoad&&req.onResourceLoad(u,this.map,this.depMaps)),F(o),this.defined=!0}this.defining=!1,this.defined&&!this.defineEmitted&&(this.defineEmitted=!0,this.emit("defined",this.exports),this.defineEmitComplete=!0)}}},callPlugin:function(){var e=this.map,i=e.id,o=S(e.prefix);this.depMaps.push(o),T(o,"defined",bind(this,function(t){var n,f,l,p=getOwn(L,this.map.id),h=this.map.name,x=this.map.parentMap?this.map.parentMap.name:null,E=u.makeRequire(e.parentMap,{enableBuildCallback:!0});if(this.map.unnormalized){t.normalize&&(h=t.normalize(h,function(m){return C(m,x,!0)})||""),f=S(e.prefix+"!"+h,this.map.parentMap),T(f,"defined",bind(this,function(m){this.init([],function(){return m},null,{enabled:!0,ignore:!0})})),l=getOwn(v,f.id),l&&(this.depMaps.push(f),this.events.error&&l.on("error",bind(this,function(m){this.emit("error",m)})),l.enable());return}if(p){this.map.url=u.nameToUrl(p),this.load();return}n=bind(this,function(m){this.init([],function(){return m},null,{enabled:!0})}),n.error=bind(this,function(m){this.inited=!0,this.error=m,m.requireModules=[i],eachProp(v,function(b){b.map.id.indexOf(i+"_unnormalized")===0&&F(b.map.id)}),y(m)}),n.fromText=bind(this,function(m,b){var M=e.name,A=S(M),k=useInteractive;b&&(m=b),k&&(useInteractive=!1),P(A),hasProp(g.config,i)&&(g.config[M]=g.config[i]);try{req.exec(m)}catch(R){return y(makeError("fromtexteval","fromText eval for "+i+" failed: "+R,R,[i]))}k&&(useInteractive=!0),this.depMaps.push(A),u.completeLoad(M),E([M],n)}),t.load(e.name,E,n,g)})),u.enable(o,this),this.pluginMaps[o.id]=o},enable:function(){B[this.map.id]=this,this.enabled=!0,this.enabling=!0,each(this.depMaps,bind(this,function(e,i){var o,t,n;if(typeof e=="string"){if(e=S(e,this.map.isDefine?this.map:this.map.parentMap,!1,!this.skipMap),this.depMaps[i]=e,n=getOwn(d,e.id),n){this.depExports[i]=n(this);return}this.depCount+=1,T(e,"defined",bind(this,function(f){this.undefed||(this.defineDep(i,f),this.check())})),this.errback?T(e,"error",bind(this,this.errback)):this.events.error&&T(e,"error",bind(this,function(f){this.emit("error",f)}))}o=e.id,t=v[o],!hasProp(d,o)&&t&&!t.enabled&&u.enable(e,this)})),eachProp(this.pluginMaps,bind(this,function(e){var i=getOwn(v,e.id);i&&!i.enabled&&u.enable(e,this)})),this.enabling=!1,this.check()},on:function(e,i){var o=this.events[e];o||(o=this.events[e]=[]),o.push(i)},emit:function(e,i){each(this.events[e],function(o){o(i)}),e==="error"&&delete this.events[e]}};function _(e){hasProp(w,e[0])||P(S(e[0],null,!0)).init(e[1],e[2])}function J(e,i,o,t){e.detachEvent&&!isOpera?t&&e.detachEvent(t,i):e.removeEventListener(o,i,!1)}function V(e){var i=e.currentTarget||e.srcElement;return J(i,u.onScriptLoad,"load","onreadystatechange"),J(i,u.onScriptError,"error"),{node:i,id:i&&i.getAttribute("data-requiremodule")}}function Y(){var e;for(Q();O.length;){if(e=O.shift(),e[0]===null)return y(makeError("mismatch","Mismatched anonymous define() module: "+e[e.length-1]));_(e)}u.defQueueMap={}}return u={config:g,contextName:r,registry:v,defined:w,urlFetched:D,defQueue:O,defQueueMap:{},Module:c,makeModuleMap:S,nextTick:req.nextTick,onError:y,configure:function(e){e.baseUrl&&e.baseUrl.charAt(e.baseUrl.length-1)!=="/"&&(e.baseUrl+="/");var i=g.shim,o={paths:!0,bundles:!0,config:!0,map:!0};eachProp(e,function(t,n){o[n]?(g[n]||(g[n]={}),mixin(g[n],t,!0,!0)):g[n]=t}),e.bundles&&eachProp(e.bundles,function(t,n){each(t,function(f){f!==n&&(L[f]=n)})}),e.shim&&(eachProp(e.shim,function(t,n){isArray(t)&&(t={deps:t}),(t.exports||t.init)&&!t.exportsFn&&(t.exportsFn=u.makeShimExports(t)),i[n]=t}),g.shim=i),e.packages&&each(e.packages,function(t){var n,f;t=typeof t=="string"?{name:t}:t,f=t.name,n=t.location,n&&(g.paths[f]=t.location),g.pkgs[f]=t.name+"/"+(t.main||"main").replace(currDirRegExp,"").replace(jsSuffixRegExp,"")}),eachProp(v,function(t,n){!t.inited&&!t.map.unnormalized&&(t.map=S(n,null,!0))}),(e.deps||e.callback)&&u.require(e.deps||[],e.callback)},makeShimExports:function(e){function i(){var o;return e.init&&(o=e.init.apply(global,arguments)),o||e.exports&&getGlobal(e.exports)}return i},makeRequire:function(e,i){i=i||{};function o(t,n,f){var l,p,h;return i.enableBuildCallback&&n&&isFunction(n)&&(n.__requireJsBuild=!0),typeof t=="string"?isFunction(n)?y(makeError("requireargs","Invalid require call"),f):e&&hasProp(d,t)?d[t](v[e.id]):req.get?req.get(u,t,e,o):(p=S(t,e,!1,!0),l=p.id,hasProp(w,l)?w[l]:y(makeError("notloaded",'Module name "'+l+'" has not been loaded yet for context: '+r+(e?"":". Use require([])")))):(Y(),u.nextTick(function(){Y(),h=P(S(null,e)),h.skipMap=i.skipMap,h.init(t,n,f,{enabled:!0}),z()}),o)}return mixin(o,{isBrowser,toUrl:function(t){var n,f=t.lastIndexOf("."),l=t.split("/")[0],p=l==="."||l==="..";return f!==-1&&(!p||f>1)&&(n=t.substring(f,t.length),t=t.substring(0,f)),u.nameToUrl(C(t,e&&e.id,!0),n,!0)},defined:function(t){return hasProp(w,S(t,e,!1,!0).id)},specified:function(t){return t=S(t,e,!1,!0).id,hasProp(w,t)||hasProp(v,t)}}),e||(o.undef=function(t){Q();var n=S(t,e,!0),f=getOwn(v,t);f.undefed=!0,W(t),delete w[t],delete D[n.url],delete I[t],eachReverse(O,function(l,p){l[0]===t&&O.splice(p,1)}),delete u.defQueueMap[t],f&&(f.events.defined&&(I[t]=f.events),F(t))}),o},enable:function(e){var i=getOwn(v,e.id);i&&P(e).enable()},completeLoad:function(e){var i,o,t,n=getOwn(g.shim,e)||{},f=n.exports;for(Q();O.length;){if(o=O.shift(),o[0]===null){if(o[0]=e,i)break;i=!0}else o[0]===e&&(i=!0);_(o)}if(u.defQueueMap={},t=getOwn(v,e),!i&&!hasProp(w,e)&&t&&!t.inited){if(g.enforceDefine&&(!f||!getGlobal(f)))return U(e)?void 0:y(makeError("nodefine","No define call for "+e,null,[e]));_([e,n.deps||[],n.exportsFn])}z()},nameToUrl:function(e,i,o){var t,n,f,l,p,h,x,E=getOwn(g.pkgs,e);if(E&&(e=E),x=getOwn(L,e),x)return u.nameToUrl(x,i,o);if(req.jsExtRegExp.test(e))p=e+(i||"");else{for(t=g.paths,n=e.split("/"),f=n.length;f>0;f-=1)if(l=n.slice(0,f).join("/"),h=getOwn(t,l),h){isArray(h)&&(h=h[0]),n.splice(0,f,h);break}p=n.join("/"),p+=i||(/^data\:|\?/.test(p)||o?"":".js"),p=(p.charAt(0)==="/"||p.match(/^[\w\+\.\-]+:/)?"":g.baseUrl)+p}return g.urlArgs?p+((p.indexOf("?")===-1?"?":"&")+g.urlArgs):p},load:function(e,i){req.load(u,e,i)},execCb:function(e,i,o,t){return i.apply(t,o)},onScriptLoad:function(e){if(e.type==="load"||readyRegExp.test((e.currentTarget||e.srcElement).readyState)){interactiveScript=null;var i=V(e);u.completeLoad(i.id)}},onScriptError:function(e){var i=V(e);if(!U(i.id))return y(makeError("scripterror","Script error for: "+i.id,e,[i.id]))}},u.require=u.makeRequire(),u}req=requirejs=function(r,a,c,u){var d,q,g=defContextName;return!isArray(r)&&typeof r!="string"&&(q=r,isArray(a)?(r=a,a=c,c=u):r=[]),q&&q.context&&(g=q.context),d=getOwn(contexts,g),d||(d=contexts[g]=req.s.newContext(g)),q&&d.configure(q),d.require(r,a,c)},req.config=function(r){return req(r)},req.nextTick=typeof setTimeout<"u"?function(r){setTimeout(r,4)}:function(r){r()},require||(require=req),req.version=version,req.jsExtRegExp=/^\/|:|\?|\.js$/,req.isBrowser=isBrowser,s=req.s={contexts,newContext},req({}),each(["toUrl","undef","defined","specified"],function(r){req[r]=function(){var a=contexts[defContextName];return a.require[r].apply(a,arguments)}}),isBrowser&&(head=s.head=document.getElementsByTagName("head")[0],baseElement=document.getElementsByTagName("base")[0],baseElement&&(head=s.head=baseElement.parentNode)),req.onError=defaultOnError,req.createNode=function(r,a,c){var u=r.xhtml?document.createElementNS("http://www.w3.org/1999/xhtml","html:script"):document.createElement("script");return u.type=r.scriptType||"text/javascript",u.charset="utf-8",u.async=!0,u},req.load=function(r,a,c){var u=r&&r.config||{},d;if(isBrowser)return d=req.createNode(u,a,c),u.onNodeCreated&&u.onNodeCreated(d,u,a,c),d.setAttribute("data-requirecontext",r.contextName),d.setAttribute("data-requiremodule",a),d.attachEvent&&!(d.attachEvent.toString&&d.attachEvent.toString().indexOf("[native code")<0)&&!isOpera?(useInteractive=!0,d.attachEvent("onreadystatechange",r.onScriptLoad)):(d.addEventListener("load",r.onScriptLoad,!1),d.addEventListener("error",r.onScriptError,!1)),d.src=c,currentlyAddingScript=d,baseElement?head.insertBefore(d,baseElement):head.appendChild(d),currentlyAddingScript=null,d;if(isWebWorker)try{importScripts(c),r.completeLoad(a)}catch(q){r.onError(makeError("importscripts","importScripts failed for "+a+" at "+c,q,[a]))}};function getInteractiveScript(){return interactiveScript&&interactiveScript.readyState==="interactive"||eachReverse(scripts(),function(r){if(r.readyState==="interactive")return interactiveScript=r}),interactiveScript}isBrowser&&!cfg.skipDataMain&&eachReverse(scripts(),function(r){if(head||(head=r.parentNode),dataMain=r.getAttribute("data-main"),dataMain)return mainScript=dataMain,cfg.baseUrl||(src=mainScript.split("/"),mainScript=src.pop(),subPath=src.length?src.join("/")+"/":"./",cfg.baseUrl=subPath),mainScript=mainScript.replace(jsSuffixRegExp,""),req.jsExtRegExp.test(mainScript)&&(mainScript=dataMain),cfg.deps=cfg.deps?cfg.deps.concat(mainScript):[mainScript],!0}),define=function(r,a,c){var u,d;typeof r!="string"&&(c=a,a=r,r=null),isArray(a)||(c=a,a=null),!a&&isFunction(c)&&(a=[],c.length&&(c.toString().replace(commentRegExp,"").replace(cjsRequireRegExp,function(q,g){a.push(g)}),a=(c.length===1?["require"]:["require","exports","module"]).concat(a))),useInteractive&&(u=currentlyAddingScript||getInteractiveScript(),u&&(r||(r=u.getAttribute("data-requiremodule")),d=contexts[u.getAttribute("data-requirecontext")])),d?(d.defQueue.push([r,a,c]),d.defQueueMap[r]=!0):globalDefQueue.push([r,a,c])},define.amd={jQuery:!0},req.exec=function(text){return eval(text)},req(cfg)})(this);
