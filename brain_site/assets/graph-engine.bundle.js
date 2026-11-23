/*! BrainGraph — sigma 4.0.6, graphology 0.26.0, graphology-layout-forceatlas2 0.10.1, graphology-shortest-path 2.1.0 and their dependencies, all MIT. Built by esbuild from brain_site/VENDOR.md; licences in graph-engine.LICENSES.txt. */
var BrainGraph=(()=>{var Es=Object.create;var Gn=Object.defineProperty;var Ss=Object.getOwnPropertyDescriptor;var As=Object.getOwnPropertyNames;var ws=Object.getPrototypeOf,Ds=Object.prototype.hasOwnProperty;var De=(a,n)=>()=>{try{return n||a((n={exports:{}}).exports,n),n.exports}catch(e){throw n=0,e}},Rs=(a,n)=>{for(var e in n)Gn(a,e,{get:n[e],enumerable:!0})},wr=(a,n,e,t)=>{if(n&&typeof n=="object"||typeof n=="function")for(let r of As(n))!Ds.call(a,r)&&r!==e&&Gn(a,r,{get:()=>n[r],enumerable:!(t=Ss(n,r))||t.enumerable});return a};var Qe=(a,n,e)=>(e=a!=null?Es(ws(a)):{},wr(n||!a||!a.__esModule?Gn(e,"default",{value:a,enumerable:!0}):e,a)),Ls=a=>wr(Gn({},"__esModule",{value:!0}),a);var sn=De((Nc,Ca)=>{"use strict";var Gt=typeof Reflect=="object"?Reflect:null,Dr=Gt&&typeof Gt.apply=="function"?Gt.apply:function(n,e,t){return Function.prototype.apply.call(n,e,t)},zn;Gt&&typeof Gt.ownKeys=="function"?zn=Gt.ownKeys:Object.getOwnPropertySymbols?zn=function(n){return Object.getOwnPropertyNames(n).concat(Object.getOwnPropertySymbols(n))}:zn=function(n){return Object.getOwnPropertyNames(n)};function Cs(a){console&&console.warn&&console.warn(a)}var Lr=Number.isNaN||function(n){return n!==n};function ue(){ue.init.call(this)}Ca.exports=ue;Ca.exports.once=Is;ue.EventEmitter=ue;ue.prototype._events=void 0;ue.prototype._eventsCount=0;ue.prototype._maxListeners=void 0;var Rr=10;function Nn(a){if(typeof a!="function")throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof a)}Object.defineProperty(ue,"defaultMaxListeners",{enumerable:!0,get:function(){return Rr},set:function(a){if(typeof a!="number"||a<0||Lr(a))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+a+".");Rr=a}});ue.init=function(){(this._events===void 0||this._events===Object.getPrototypeOf(this)._events)&&(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0};ue.prototype.setMaxListeners=function(n){if(typeof n!="number"||n<0||Lr(n))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+n+".");return this._maxListeners=n,this};function Cr(a){return a._maxListeners===void 0?ue.defaultMaxListeners:a._maxListeners}ue.prototype.getMaxListeners=function(){return Cr(this)};ue.prototype.emit=function(n){for(var e=[],t=1;t<arguments.length;t++)e.push(arguments[t]);var r=n==="error",i=this._events;if(i!==void 0)r=r&&i.error===void 0;else if(!r)return!1;if(r){var o;if(e.length>0&&(o=e[0]),o instanceof Error)throw o;var s=new Error("Unhandled error."+(o?" ("+o.message+")":""));throw s.context=o,s}var l=i[n];if(l===void 0)return!1;if(typeof l=="function")Dr(l,this,e);else for(var u=l.length,d=Gr(l,u),t=0;t<u;++t)Dr(d[t],this,e);return!0};function kr(a,n,e,t){var r,i,o;if(Nn(e),i=a._events,i===void 0?(i=a._events=Object.create(null),a._eventsCount=0):(i.newListener!==void 0&&(a.emit("newListener",n,e.listener?e.listener:e),i=a._events),o=i[n]),o===void 0)o=i[n]=e,++a._eventsCount;else if(typeof o=="function"?o=i[n]=t?[e,o]:[o,e]:t?o.unshift(e):o.push(e),r=Cr(a),r>0&&o.length>r&&!o.warned){o.warned=!0;var s=new Error("Possible EventEmitter memory leak detected. "+o.length+" "+String(n)+" listeners added. Use emitter.setMaxListeners() to increase limit");s.name="MaxListenersExceededWarning",s.emitter=a,s.type=n,s.count=o.length,Cs(s)}return a}ue.prototype.addListener=function(n,e){return kr(this,n,e,!1)};ue.prototype.on=ue.prototype.addListener;ue.prototype.prependListener=function(n,e){return kr(this,n,e,!0)};function ks(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length===0?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function Pr(a,n,e){var t={fired:!1,wrapFn:void 0,target:a,type:n,listener:e},r=ks.bind(t);return r.listener=e,t.wrapFn=r,r}ue.prototype.once=function(n,e){return Nn(e),this.on(n,Pr(this,n,e)),this};ue.prototype.prependOnceListener=function(n,e){return Nn(e),this.prependListener(n,Pr(this,n,e)),this};ue.prototype.removeListener=function(n,e){var t,r,i,o,s;if(Nn(e),r=this._events,r===void 0)return this;if(t=r[n],t===void 0)return this;if(t===e||t.listener===e)--this._eventsCount===0?this._events=Object.create(null):(delete r[n],r.removeListener&&this.emit("removeListener",n,t.listener||e));else if(typeof t!="function"){for(i=-1,o=t.length-1;o>=0;o--)if(t[o]===e||t[o].listener===e){s=t[o].listener,i=o;break}if(i<0)return this;i===0?t.shift():Ps(t,i),t.length===1&&(r[n]=t[0]),r.removeListener!==void 0&&this.emit("removeListener",n,s||e)}return this};ue.prototype.off=ue.prototype.removeListener;ue.prototype.removeAllListeners=function(n){var e,t,r;if(t=this._events,t===void 0)return this;if(t.removeListener===void 0)return arguments.length===0?(this._events=Object.create(null),this._eventsCount=0):t[n]!==void 0&&(--this._eventsCount===0?this._events=Object.create(null):delete t[n]),this;if(arguments.length===0){var i=Object.keys(t),o;for(r=0;r<i.length;++r)o=i[r],o!=="removeListener"&&this.removeAllListeners(o);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if(e=t[n],typeof e=="function")this.removeListener(n,e);else if(e!==void 0)for(r=e.length-1;r>=0;r--)this.removeListener(n,e[r]);return this};function Fr(a,n,e){var t=a._events;if(t===void 0)return[];var r=t[n];return r===void 0?[]:typeof r=="function"?e?[r.listener||r]:[r]:e?Fs(r):Gr(r,r.length)}ue.prototype.listeners=function(n){return Fr(this,n,!0)};ue.prototype.rawListeners=function(n){return Fr(this,n,!1)};ue.listenerCount=function(a,n){return typeof a.listenerCount=="function"?a.listenerCount(n):Ir.call(a,n)};ue.prototype.listenerCount=Ir;function Ir(a){var n=this._events;if(n!==void 0){var e=n[a];if(typeof e=="function")return 1;if(e!==void 0)return e.length}return 0}ue.prototype.eventNames=function(){return this._eventsCount>0?zn(this._events):[]};function Gr(a,n){for(var e=new Array(n),t=0;t<n;++t)e[t]=a[t];return e}function Ps(a,n){for(;n+1<a.length;n++)a[n]=a[n+1];a.pop()}function Fs(a){for(var n=new Array(a.length),e=0;e<n.length;++e)n[e]=a[e].listener||a[e];return n}function Is(a,n){return new Promise(function(e,t){function r(o){a.removeListener(n,i),t(o)}function i(){typeof a.removeListener=="function"&&a.removeListener("error",r),e([].slice.call(arguments))}zr(a,n,i,{once:!0}),n!=="error"&&Gs(a,r,{once:!0})})}function Gs(a,n,e){typeof a.on=="function"&&zr(a,"error",n,e)}function zr(a,n,e,t){if(typeof a.on=="function")t.once?a.once(n,e):a.on(n,e);else if(typeof a.addEventListener=="function")a.addEventListener(n,function r(i){t.once&&a.removeEventListener(n,r),e(i)});else throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof a)}});var jt=De((Zc,Li)=>{Li.exports=function(n){return n!==null&&typeof n=="object"&&typeof n.addUndirectedEdgeWithKey=="function"&&typeof n.dropNode=="function"&&typeof n.multi=="boolean"}});var br=De(wa=>{function dc(a){return typeof a!="number"||isNaN(a)?1:a}function hc(a,n){var e={},t=function(o){return typeof o=="undefined"?n:o};typeof n=="function"&&(t=n);var r=function(o){return t(o[a])},i=function(){return t(void 0)};return typeof a=="string"?(e.fromAttributes=r,e.fromGraph=function(o,s){return r(o.getNodeAttributes(s))},e.fromEntry=function(o,s){return r(s)}):typeof a=="function"?(e.fromAttributes=function(){throw new Error("graphology-utils/getters/createNodeValueGetter: irrelevant usage.")},e.fromGraph=function(o,s){return t(a(s,o.getNodeAttributes(s)))},e.fromEntry=function(o,s){return t(a(o,s))}):(e.fromAttributes=i,e.fromGraph=i,e.fromEntry=i),e}function jo(a,n){var e={},t=function(o){return typeof o=="undefined"?n:o};typeof n=="function"&&(t=n);var r=function(o){return t(o[a])},i=function(){return t(void 0)};return typeof a=="string"?(e.fromAttributes=r,e.fromGraph=function(o,s){return r(o.getEdgeAttributes(s))},e.fromEntry=function(o,s){return r(s)},e.fromPartialEntry=e.fromEntry,e.fromMinimalEntry=e.fromEntry):typeof a=="function"?(e.fromAttributes=function(){throw new Error("graphology-utils/getters/createEdgeValueGetter: irrelevant usage.")},e.fromGraph=function(o,s){var l=o.extremities(s);return t(a(s,o.getEdgeAttributes(s),l[0],l[1],o.getNodeAttributes(l[0]),o.getNodeAttributes(l[1]),o.isUndirected(s)))},e.fromEntry=function(o,s,l,u,d,h,c){return t(a(o,s,l,u,d,h,c))},e.fromPartialEntry=function(o,s,l,u){return t(a(o,s,l,u))},e.fromMinimalEntry=function(o,s){return t(a(o,s))}):(e.fromAttributes=i,e.fromGraph=i,e.fromEntry=i,e.fromMinimalEntry=i),e}wa.createNodeValueGetter=hc;wa.createEdgeValueGetter=jo;wa.createEdgeWeightGetter=function(a){return jo(a,dc)}});var Zo=De((zf,Ko)=>{var ye=0,ge=1,ie=2,oe=3,rt=4,it=5,le=6,qo=7,Da=8,Xo=9,cc=0,fc=1,gc=2,Te=0,Me=1,Re=2,Ct=3,ft=4,ve=5,Le=6,Ye=7,Ke=8,Yo=3,Ve=10,vc=3,we=9,_r=10;Ko.exports=function(n,e,t){var r,i,o,s,l,u,d,h,c,f,g=e.length,y=t.length,m=n.adjustSizes,v=n.barnesHutTheta*n.barnesHutTheta,p,b,T,_,E,w,A,S=[];for(o=0;o<g;o+=Ve)e[o+rt]=e[o+ie],e[o+it]=e[o+oe],e[o+ie]=0,e[o+oe]=0;if(n.outboundAttractionDistribution){for(p=0,o=0;o<g;o+=Ve)p+=e[o+le];p/=g/Ve}if(n.barnesHutOptimize){var k=1/0,z=-1/0,C=1/0,N=-1/0,L,G,M;for(o=0;o<g;o+=Ve)k=Math.min(k,e[o+ye]),z=Math.max(z,e[o+ye]),C=Math.min(C,e[o+ge]),N=Math.max(N,e[o+ge]);var F=z-k,x=N-C;for(F>x?(C-=(F-x)/2,N=C+F):(k-=(x-F)/2,z=k+x),S[0+Te]=-1,S[0+Me]=(k+z)/2,S[0+Re]=(C+N)/2,S[0+Ct]=Math.max(z-k,N-C),S[0+ft]=-1,S[0+ve]=-1,S[0+Le]=0,S[0+Ye]=0,S[0+Ke]=0,r=1,o=0;o<g;o+=Ve)for(i=0,M=Yo;;)if(S[i+ve]>=0){e[o+ye]<S[i+Me]?e[o+ge]<S[i+Re]?L=S[i+ve]:L=S[i+ve]+we:e[o+ge]<S[i+Re]?L=S[i+ve]+we*2:L=S[i+ve]+we*3,S[i+Ye]=(S[i+Ye]*S[i+Le]+e[o+ye]*e[o+le])/(S[i+Le]+e[o+le]),S[i+Ke]=(S[i+Ke]*S[i+Le]+e[o+ge]*e[o+le])/(S[i+Le]+e[o+le]),S[i+Le]+=e[o+le],i=L;continue}else if(S[i+Te]<0){S[i+Te]=o;break}else{if(S[i+ve]=r*we,h=S[i+Ct]/2,c=S[i+ve],S[c+Te]=-1,S[c+Me]=S[i+Me]-h,S[c+Re]=S[i+Re]-h,S[c+Ct]=h,S[c+ft]=c+we,S[c+ve]=-1,S[c+Le]=0,S[c+Ye]=0,S[c+Ke]=0,c+=we,S[c+Te]=-1,S[c+Me]=S[i+Me]-h,S[c+Re]=S[i+Re]+h,S[c+Ct]=h,S[c+ft]=c+we,S[c+ve]=-1,S[c+Le]=0,S[c+Ye]=0,S[c+Ke]=0,c+=we,S[c+Te]=-1,S[c+Me]=S[i+Me]+h,S[c+Re]=S[i+Re]-h,S[c+Ct]=h,S[c+ft]=c+we,S[c+ve]=-1,S[c+Le]=0,S[c+Ye]=0,S[c+Ke]=0,c+=we,S[c+Te]=-1,S[c+Me]=S[i+Me]+h,S[c+Re]=S[i+Re]+h,S[c+Ct]=h,S[c+ft]=S[i+ft],S[c+ve]=-1,S[c+Le]=0,S[c+Ye]=0,S[c+Ke]=0,r+=4,e[S[i+Te]+ye]<S[i+Me]?e[S[i+Te]+ge]<S[i+Re]?L=S[i+ve]:L=S[i+ve]+we:e[S[i+Te]+ge]<S[i+Re]?L=S[i+ve]+we*2:L=S[i+ve]+we*3,S[i+Le]=e[S[i+Te]+le],S[i+Ye]=e[S[i+Te]+ye],S[i+Ke]=e[S[i+Te]+ge],S[L+Te]=S[i+Te],S[i+Te]=-1,e[o+ye]<S[i+Me]?e[o+ge]<S[i+Re]?G=S[i+ve]:G=S[i+ve]+we:e[o+ge]<S[i+Re]?G=S[i+ve]+we*2:G=S[i+ve]+we*3,L===G)if(M--){i=L;continue}else{M=Yo;break}S[G+Te]=o;break}}if(n.barnesHutOptimize)for(b=n.scalingRatio,o=0;o<g;o+=Ve)for(i=0;;)if(S[i+ve]>=0)if(w=Math.pow(e[o+ye]-S[i+Ye],2)+Math.pow(e[o+ge]-S[i+Ke],2),f=S[i+Ct],4*f*f/w<v){if(T=e[o+ye]-S[i+Ye],_=e[o+ge]-S[i+Ke],m===!0?w>0?(A=b*e[o+le]*S[i+Le]/w,e[o+ie]+=T*A,e[o+oe]+=_*A):w<0&&(A=-b*e[o+le]*S[i+Le]/Math.sqrt(w),e[o+ie]+=T*A,e[o+oe]+=_*A):w>0&&(A=b*e[o+le]*S[i+Le]/w,e[o+ie]+=T*A,e[o+oe]+=_*A),i=S[i+ft],i<0)break;continue}else{i=S[i+ve];continue}else{if(u=S[i+Te],u>=0&&u!==o&&(T=e[o+ye]-e[u+ye],_=e[o+ge]-e[u+ge],w=T*T+_*_,m===!0?w>0?(A=b*e[o+le]*e[u+le]/w,e[o+ie]+=T*A,e[o+oe]+=_*A):w<0&&(A=-b*e[o+le]*e[u+le]/Math.sqrt(w),e[o+ie]+=T*A,e[o+oe]+=_*A):w>0&&(A=b*e[o+le]*e[u+le]/w,e[o+ie]+=T*A,e[o+oe]+=_*A)),i=S[i+ft],i<0)break;continue}else for(b=n.scalingRatio,s=0;s<g;s+=Ve)for(l=0;l<s;l+=Ve)T=e[s+ye]-e[l+ye],_=e[s+ge]-e[l+ge],m===!0?(w=Math.sqrt(T*T+_*_)-e[s+Da]-e[l+Da],w>0?(A=b*e[s+le]*e[l+le]/w/w,e[s+ie]+=T*A,e[s+oe]+=_*A,e[l+ie]-=T*A,e[l+oe]-=_*A):w<0&&(A=100*b*e[s+le]*e[l+le],e[s+ie]+=T*A,e[s+oe]+=_*A,e[l+ie]-=T*A,e[l+oe]-=_*A)):(w=Math.sqrt(T*T+_*_),w>0&&(A=b*e[s+le]*e[l+le]/w/w,e[s+ie]+=T*A,e[s+oe]+=_*A,e[l+ie]-=T*A,e[l+oe]-=_*A));for(c=n.gravity/n.scalingRatio,b=n.scalingRatio,o=0;o<g;o+=Ve)A=0,T=e[o+ye],_=e[o+ge],w=Math.sqrt(Math.pow(T,2)+Math.pow(_,2)),n.strongGravityMode?w>0&&(A=b*e[o+le]*c):w>0&&(A=b*e[o+le]*c/w),e[o+ie]-=T*A,e[o+oe]-=_*A;for(b=1*(n.outboundAttractionDistribution?p:1),d=0;d<y;d+=vc)s=t[d+cc],l=t[d+fc],h=t[d+gc],E=Math.pow(h,n.edgeWeightInfluence),T=e[s+ye]-e[l+ye],_=e[s+ge]-e[l+ge],m===!0?(w=Math.sqrt(T*T+_*_)-e[s+Da]-e[l+Da],n.linLogMode?n.outboundAttractionDistribution?w>0&&(A=-b*E*Math.log(1+w)/w/e[s+le]):w>0&&(A=-b*E*Math.log(1+w)/w):n.outboundAttractionDistribution?w>0&&(A=-b*E/e[s+le]):w>0&&(A=-b*E)):(w=Math.sqrt(Math.pow(T,2)+Math.pow(_,2)),n.linLogMode?n.outboundAttractionDistribution?w>0&&(A=-b*E*Math.log(1+w)/w/e[s+le]):w>0&&(A=-b*E*Math.log(1+w)/w):n.outboundAttractionDistribution?(w=1,A=-b*E/e[s+le]):(w=1,A=-b*E)),w>0&&(e[s+ie]+=T*A,e[s+oe]+=_*A,e[l+ie]-=T*A,e[l+oe]-=_*A);var P,B,I,R,V,$;if(m===!0)for(o=0;o<g;o+=Ve)e[o+Xo]!==1&&(P=Math.sqrt(Math.pow(e[o+ie],2)+Math.pow(e[o+oe],2)),P>_r&&(e[o+ie]=e[o+ie]*_r/P,e[o+oe]=e[o+oe]*_r/P),B=e[o+le]*Math.sqrt((e[o+rt]-e[o+ie])*(e[o+rt]-e[o+ie])+(e[o+it]-e[o+oe])*(e[o+it]-e[o+oe])),I=Math.sqrt((e[o+rt]+e[o+ie])*(e[o+rt]+e[o+ie])+(e[o+it]+e[o+oe])*(e[o+it]+e[o+oe]))/2,R=.1*Math.log(1+I)/(1+Math.sqrt(B)),V=e[o+ye]+e[o+ie]*(R/n.slowDown),e[o+ye]=V,$=e[o+ge]+e[o+oe]*(R/n.slowDown),e[o+ge]=$);else for(o=0;o<g;o+=Ve)e[o+Xo]!==1&&(B=e[o+le]*Math.sqrt((e[o+rt]-e[o+ie])*(e[o+rt]-e[o+ie])+(e[o+it]-e[o+oe])*(e[o+it]-e[o+oe])),I=Math.sqrt((e[o+rt]+e[o+ie])*(e[o+rt]+e[o+ie])+(e[o+it]+e[o+oe])*(e[o+it]+e[o+oe]))/2,R=e[o+qo]*Math.log(1+I)/(1+Math.sqrt(B)),e[o+qo]=Math.min(1,Math.sqrt(R*(Math.pow(e[o+ie],2)+Math.pow(e[o+oe],2))/(1+Math.sqrt(B)))),V=e[o+ye]+e[o+ie]*(R/n.slowDown),e[o+ye]=V,$=e[o+ge]+e[o+oe]*(R/n.slowDown),e[o+ge]=$);return{}}});var xr=De(gt=>{var Dn=10,Qo=3;gt.assign=function(a){a=a||{};var n=Array.prototype.slice.call(arguments).slice(1),e,t,r;for(e=0,r=n.length;e<r;e++)if(n[e])for(t in n[e])a[t]=n[e][t];return a};gt.validateSettings=function(a){return"linLogMode"in a&&typeof a.linLogMode!="boolean"?{message:"the `linLogMode` setting should be a boolean."}:"outboundAttractionDistribution"in a&&typeof a.outboundAttractionDistribution!="boolean"?{message:"the `outboundAttractionDistribution` setting should be a boolean."}:"adjustSizes"in a&&typeof a.adjustSizes!="boolean"?{message:"the `adjustSizes` setting should be a boolean."}:"edgeWeightInfluence"in a&&typeof a.edgeWeightInfluence!="number"?{message:"the `edgeWeightInfluence` setting should be a number."}:"scalingRatio"in a&&!(typeof a.scalingRatio=="number"&&a.scalingRatio>=0)?{message:"the `scalingRatio` setting should be a number >= 0."}:"strongGravityMode"in a&&typeof a.strongGravityMode!="boolean"?{message:"the `strongGravityMode` setting should be a boolean."}:"gravity"in a&&!(typeof a.gravity=="number"&&a.gravity>=0)?{message:"the `gravity` setting should be a number >= 0."}:"slowDown"in a&&!(typeof a.slowDown=="number"||a.slowDown>=0)?{message:"the `slowDown` setting should be a number >= 0."}:"barnesHutOptimize"in a&&typeof a.barnesHutOptimize!="boolean"?{message:"the `barnesHutOptimize` setting should be a boolean."}:"barnesHutTheta"in a&&!(typeof a.barnesHutTheta=="number"&&a.barnesHutTheta>=0)?{message:"the `barnesHutTheta` setting should be a number >= 0."}:null};gt.graphToByteArrays=function(a,n){var e=a.order,t=a.size,r={},i,o=new Float32Array(e*Dn),s=new Float32Array(t*Qo);return i=0,a.forEachNode(function(l,u){r[l]=i,o[i]=u.x,o[i+1]=u.y,o[i+2]=0,o[i+3]=0,o[i+4]=0,o[i+5]=0,o[i+6]=1,o[i+7]=1,o[i+8]=u.size||1,o[i+9]=u.fixed?1:0,i+=Dn}),i=0,a.forEachEdge(function(l,u,d,h,c,f,g){var y=r[d],m=r[h],v=n(l,u,d,h,c,f,g);o[y+6]+=v,o[m+6]+=v,s[i]=y,s[i+1]=m,s[i+2]=v,i+=Qo}),{nodes:o,edges:s}};gt.assignLayoutChanges=function(a,n,e){var t=0;a.updateEachNodeAttributes(function(r,i){return i.x=n[t],i.y=n[t+1],t+=Dn,e?e(r,i):i})};gt.readGraphPositions=function(a,n){var e=0;a.forEachNode(function(t,r){n[e]=r.x,n[e+1]=r.y,e+=Dn})};gt.collectLayoutChanges=function(a,n,e){for(var t=a.nodes(),r={},i=0,o=0,s=n.length;i<s;i+=Dn){if(e){var l=Object.assign({},a.getNodeAttributes(t[o]));l.x=n[i],l.y=n[i+1],l=e(t[o],l),r[t[o]]={x:l.x,y:l.y}}else r[t[o]]={x:n[i],y:n[i+1]};o++}return r};gt.createWorker=function(n){var e=window.URL||window.webkitURL,t=n.toString(),r=e.createObjectURL(new Blob(["("+t+").call(this);"],{type:"text/javascript"})),i=new Worker(r);return e.revokeObjectURL(r),i}});var Tr=De((Wf,Jo)=>{Jo.exports={linLogMode:!1,outboundAttractionDistribution:!1,adjustSizes:!1,edgeWeightInfluence:1,scalingRatio:1,strongGravityMode:!1,gravity:1,slowDown:1,barnesHutOptimize:!1,barnesHutTheta:.5}});var ns=De((Bf,ts)=>{var pc=jt(),mc=br().createEdgeWeightGetter,yc=Zo(),Rn=xr(),bc=Tr();function es(a,n,e){if(!pc(n))throw new Error("graphology-layout-forceatlas2: the given graph is not a valid graphology instance.");typeof e=="number"&&(e={iterations:e});var t=e.iterations;if(typeof t!="number")throw new Error("graphology-layout-forceatlas2: invalid number of iterations.");if(t<=0)throw new Error("graphology-layout-forceatlas2: you should provide a positive number of iterations.");var r=mc("getEdgeWeight"in e?e.getEdgeWeight:"weight").fromEntry,i=typeof e.outputReducer=="function"?e.outputReducer:null,o=Rn.assign({},bc,e.settings),s=Rn.validateSettings(o);if(s)throw new Error("graphology-layout-forceatlas2: "+s.message);var l=Rn.graphToByteArrays(n,r),u;for(u=0;u<t;u++)yc(o,l.nodes,l.edges);if(a){Rn.assignLayoutChanges(n,l.nodes,i);return}return Rn.collectLayoutChanges(n,l.nodes)}function _c(a){var n=typeof a=="number"?a:a.order;return{barnesHutOptimize:n>2e3,strongGravityMode:!0,gravity:.05,scalingRatio:10,slowDown:1+Math.log(n)}}var Er=es.bind(null,!1);Er.assign=es.bind(null,!0);Er.inferSettings=_c;ts.exports=Er});var rs=De((Mf,as)=>{as.exports=function(){var n,e,t={};(function(){var i=0,o=1,s=2,l=3,u=4,d=5,h=6,c=7,f=8,g=9,y=0,m=1,v=2,p=0,b=1,T=2,_=3,E=4,w=5,A=6,S=7,k=8,z=3,C=10,N=3,L=9,G=10;t.exports=function(F,x,P){var B,I,R,V,$,Y,xe,se,X,je,Se=x.length,pt=P.length,Ue=F.adjustSizes,Ra=F.barnesHutTheta*F.barnesHutTheta,kt,he,ae,re,Oe,Q,q,W=[];for(R=0;R<Se;R+=C)x[R+u]=x[R+s],x[R+d]=x[R+l],x[R+s]=0,x[R+l]=0;if(F.outboundAttractionDistribution){for(kt=0,R=0;R<Se;R+=C)kt+=x[R+h];kt/=Se/C}if(F.barnesHutOptimize){var mt=1/0,Pt=-1/0,yt=1/0,Ft=-1/0,Fe,It,La;for(R=0;R<Se;R+=C)mt=Math.min(mt,x[R+i]),Pt=Math.max(Pt,x[R+i]),yt=Math.min(yt,x[R+o]),Ft=Math.max(Ft,x[R+o]);var Ln=Pt-mt,Cn=Ft-yt;for(Ln>Cn?(yt-=(Ln-Cn)/2,Ft=yt+Ln):(mt-=(Cn-Ln)/2,Pt=mt+Cn),W[0+p]=-1,W[0+b]=(mt+Pt)/2,W[0+T]=(yt+Ft)/2,W[0+_]=Math.max(Pt-mt,Ft-yt),W[0+E]=-1,W[0+w]=-1,W[0+A]=0,W[0+S]=0,W[0+k]=0,B=1,R=0;R<Se;R+=C)for(I=0,La=z;;)if(W[I+w]>=0){x[R+i]<W[I+b]?x[R+o]<W[I+T]?Fe=W[I+w]:Fe=W[I+w]+L:x[R+o]<W[I+T]?Fe=W[I+w]+L*2:Fe=W[I+w]+L*3,W[I+S]=(W[I+S]*W[I+A]+x[R+i]*x[R+h])/(W[I+A]+x[R+h]),W[I+k]=(W[I+k]*W[I+A]+x[R+o]*x[R+h])/(W[I+A]+x[R+h]),W[I+A]+=x[R+h],I=Fe;continue}else if(W[I+p]<0){W[I+p]=R;break}else{if(W[I+w]=B*L,se=W[I+_]/2,X=W[I+w],W[X+p]=-1,W[X+b]=W[I+b]-se,W[X+T]=W[I+T]-se,W[X+_]=se,W[X+E]=X+L,W[X+w]=-1,W[X+A]=0,W[X+S]=0,W[X+k]=0,X+=L,W[X+p]=-1,W[X+b]=W[I+b]-se,W[X+T]=W[I+T]+se,W[X+_]=se,W[X+E]=X+L,W[X+w]=-1,W[X+A]=0,W[X+S]=0,W[X+k]=0,X+=L,W[X+p]=-1,W[X+b]=W[I+b]+se,W[X+T]=W[I+T]-se,W[X+_]=se,W[X+E]=X+L,W[X+w]=-1,W[X+A]=0,W[X+S]=0,W[X+k]=0,X+=L,W[X+p]=-1,W[X+b]=W[I+b]+se,W[X+T]=W[I+T]+se,W[X+_]=se,W[X+E]=W[I+E],W[X+w]=-1,W[X+A]=0,W[X+S]=0,W[X+k]=0,B+=4,x[W[I+p]+i]<W[I+b]?x[W[I+p]+o]<W[I+T]?Fe=W[I+w]:Fe=W[I+w]+L:x[W[I+p]+o]<W[I+T]?Fe=W[I+w]+L*2:Fe=W[I+w]+L*3,W[I+A]=x[W[I+p]+h],W[I+S]=x[W[I+p]+i],W[I+k]=x[W[I+p]+o],W[Fe+p]=W[I+p],W[I+p]=-1,x[R+i]<W[I+b]?x[R+o]<W[I+T]?It=W[I+w]:It=W[I+w]+L:x[R+o]<W[I+T]?It=W[I+w]+L*2:It=W[I+w]+L*3,Fe===It)if(La--){I=Fe;continue}else{La=z;break}W[It+p]=R;break}}if(F.barnesHutOptimize)for(he=F.scalingRatio,R=0;R<Se;R+=C)for(I=0;;)if(W[I+w]>=0)if(Q=Math.pow(x[R+i]-W[I+S],2)+Math.pow(x[R+o]-W[I+k],2),je=W[I+_],4*je*je/Q<Ra){if(ae=x[R+i]-W[I+S],re=x[R+o]-W[I+k],Ue===!0?Q>0?(q=he*x[R+h]*W[I+A]/Q,x[R+s]+=ae*q,x[R+l]+=re*q):Q<0&&(q=-he*x[R+h]*W[I+A]/Math.sqrt(Q),x[R+s]+=ae*q,x[R+l]+=re*q):Q>0&&(q=he*x[R+h]*W[I+A]/Q,x[R+s]+=ae*q,x[R+l]+=re*q),I=W[I+E],I<0)break;continue}else{I=W[I+w];continue}else{if(Y=W[I+p],Y>=0&&Y!==R&&(ae=x[R+i]-x[Y+i],re=x[R+o]-x[Y+o],Q=ae*ae+re*re,Ue===!0?Q>0?(q=he*x[R+h]*x[Y+h]/Q,x[R+s]+=ae*q,x[R+l]+=re*q):Q<0&&(q=-he*x[R+h]*x[Y+h]/Math.sqrt(Q),x[R+s]+=ae*q,x[R+l]+=re*q):Q>0&&(q=he*x[R+h]*x[Y+h]/Q,x[R+s]+=ae*q,x[R+l]+=re*q)),I=W[I+E],I<0)break;continue}else for(he=F.scalingRatio,V=0;V<Se;V+=C)for($=0;$<V;$+=C)ae=x[V+i]-x[$+i],re=x[V+o]-x[$+o],Ue===!0?(Q=Math.sqrt(ae*ae+re*re)-x[V+f]-x[$+f],Q>0?(q=he*x[V+h]*x[$+h]/Q/Q,x[V+s]+=ae*q,x[V+l]+=re*q,x[$+s]-=ae*q,x[$+l]-=re*q):Q<0&&(q=100*he*x[V+h]*x[$+h],x[V+s]+=ae*q,x[V+l]+=re*q,x[$+s]-=ae*q,x[$+l]-=re*q)):(Q=Math.sqrt(ae*ae+re*re),Q>0&&(q=he*x[V+h]*x[$+h]/Q/Q,x[V+s]+=ae*q,x[V+l]+=re*q,x[$+s]-=ae*q,x[$+l]-=re*q));for(X=F.gravity/F.scalingRatio,he=F.scalingRatio,R=0;R<Se;R+=C)q=0,ae=x[R+i],re=x[R+o],Q=Math.sqrt(Math.pow(ae,2)+Math.pow(re,2)),F.strongGravityMode?Q>0&&(q=he*x[R+h]*X):Q>0&&(q=he*x[R+h]*X/Q),x[R+s]-=ae*q,x[R+l]-=re*q;for(he=1*(F.outboundAttractionDistribution?kt:1),xe=0;xe<pt;xe+=N)V=P[xe+y],$=P[xe+m],se=P[xe+v],Oe=Math.pow(se,F.edgeWeightInfluence),ae=x[V+i]-x[$+i],re=x[V+o]-x[$+o],Ue===!0?(Q=Math.sqrt(ae*ae+re*re)-x[V+f]-x[$+f],F.linLogMode?F.outboundAttractionDistribution?Q>0&&(q=-he*Oe*Math.log(1+Q)/Q/x[V+h]):Q>0&&(q=-he*Oe*Math.log(1+Q)/Q):F.outboundAttractionDistribution?Q>0&&(q=-he*Oe/x[V+h]):Q>0&&(q=-he*Oe)):(Q=Math.sqrt(Math.pow(ae,2)+Math.pow(re,2)),F.linLogMode?F.outboundAttractionDistribution?Q>0&&(q=-he*Oe*Math.log(1+Q)/Q/x[V+h]):Q>0&&(q=-he*Oe*Math.log(1+Q)/Q):F.outboundAttractionDistribution?(Q=1,q=-he*Oe/x[V+h]):(Q=1,q=-he*Oe)),Q>0&&(x[V+s]+=ae*q,x[V+l]+=re*q,x[$+s]-=ae*q,x[$+l]-=re*q);var kn,on,Pn,bt,Fn,In;if(Ue===!0)for(R=0;R<Se;R+=C)x[R+g]!==1&&(kn=Math.sqrt(Math.pow(x[R+s],2)+Math.pow(x[R+l],2)),kn>G&&(x[R+s]=x[R+s]*G/kn,x[R+l]=x[R+l]*G/kn),on=x[R+h]*Math.sqrt((x[R+u]-x[R+s])*(x[R+u]-x[R+s])+(x[R+d]-x[R+l])*(x[R+d]-x[R+l])),Pn=Math.sqrt((x[R+u]+x[R+s])*(x[R+u]+x[R+s])+(x[R+d]+x[R+l])*(x[R+d]+x[R+l]))/2,bt=.1*Math.log(1+Pn)/(1+Math.sqrt(on)),Fn=x[R+i]+x[R+s]*(bt/F.slowDown),x[R+i]=Fn,In=x[R+o]+x[R+l]*(bt/F.slowDown),x[R+o]=In);else for(R=0;R<Se;R+=C)x[R+g]!==1&&(on=x[R+h]*Math.sqrt((x[R+u]-x[R+s])*(x[R+u]-x[R+s])+(x[R+d]-x[R+l])*(x[R+d]-x[R+l])),Pn=Math.sqrt((x[R+u]+x[R+s])*(x[R+u]+x[R+s])+(x[R+d]+x[R+l])*(x[R+d]+x[R+l]))/2,bt=x[R+c]*Math.log(1+Pn)/(1+Math.sqrt(on)),x[R+c]=Math.min(1,Math.sqrt(bt*(Math.pow(x[R+s],2)+Math.pow(x[R+l],2))/(1+Math.sqrt(on)))),Fn=x[R+i]+x[R+s]*(bt/F.slowDown),x[R+i]=Fn,In=x[R+o]+x[R+l]*(bt/F.slowDown),x[R+o]=In);return{}}})();var r=t.exports;self.addEventListener("message",function(i){var o=i.data;n=new Float32Array(o.nodes),o.edges&&(e=new Float32Array(o.edges)),r(o.settings,n,e),self.postMessage({nodes:n.buffer},[n.buffer])})}});var os=De((Uf,is)=>{var xc=rs(),Tc=jt(),Ec=br().createEdgeWeightGetter,an=xr(),Sc=Tr();function vt(a,n){if(n=n||{},!Tc(a))throw new Error("graphology-layout-forceatlas2/worker: the given graph is not a valid graphology instance.");var e=Ec("getEdgeWeight"in n?n.getEdgeWeight:"weight").fromEntry,t=an.assign({},Sc,n.settings),r=an.validateSettings(t);if(r)throw new Error("graphology-layout-forceatlas2/worker: "+r.message);this.worker=null,this.graph=a,this.settings=t,this.getEdgeWeight=e,this.matrices=null,this.running=!1,this.killed=!1,this.outputReducer=typeof n.outputReducer=="function"?n.outputReducer:null,this.handleMessage=this.handleMessage.bind(this);var i=void 0,o=this;this.handleGraphUpdate=function(){o.worker&&o.worker.terminate(),i&&clearTimeout(i),i=setTimeout(function(){i=void 0,o.spawnWorker()},0)},a.on("nodeAdded",this.handleGraphUpdate),a.on("edgeAdded",this.handleGraphUpdate),a.on("nodeDropped",this.handleGraphUpdate),a.on("edgeDropped",this.handleGraphUpdate),this.spawnWorker()}vt.prototype.isRunning=function(){return this.running};vt.prototype.spawnWorker=function(){this.worker&&this.worker.terminate(),this.worker=an.createWorker(xc),this.worker.addEventListener("message",this.handleMessage),this.running&&(this.running=!1,this.start())};vt.prototype.handleMessage=function(a){if(this.running){var n=new Float32Array(a.data.nodes);an.assignLayoutChanges(this.graph,n,this.outputReducer),this.outputReducer&&an.readGraphPositions(this.graph,n),this.matrices.nodes=n,this.askForIterations()}};vt.prototype.askForIterations=function(a){var n=this.matrices,e={settings:this.settings,nodes:n.nodes.buffer},t=[n.nodes.buffer];return a&&(e.edges=n.edges.buffer,t.push(n.edges.buffer)),this.worker.postMessage(e,t),this};vt.prototype.start=function(){if(this.killed)throw new Error("graphology-layout-forceatlas2/worker.start: layout was killed.");return this.running?this:(this.matrices=an.graphToByteArrays(this.graph,this.getEdgeWeight),this.running=!0,this.askForIterations(!0),this)};vt.prototype.stop=function(){return this.running=!1,this};vt.prototype.kill=function(){if(this.killed)return this;this.running=!1,this.killed=!0,this.matrices=null,this.worker.terminate(),this.graph.removeListener("nodeAdded",this.handleGraphUpdate),this.graph.removeListener("edgeAdded",this.handleGraphUpdate),this.graph.removeListener("nodeDropped",this.handleGraphUpdate),this.graph.removeListener("edgeDropped",this.handleGraphUpdate)};is.exports=vt});var ls=De((Of,ss)=>{function Ze(a){if(typeof a!="function")throw new Error("obliterator/iterator: expecting a function!");this.next=a}typeof Symbol!="undefined"&&(Ze.prototype[Symbol.iterator]=function(){return this});Ze.of=function(){var a=arguments,n=a.length,e=0;return new Ze(function(){return e>=n?{done:!0}:{done:!1,value:a[e++]}})};Ze.empty=function(){var a=new Ze(function(){return{done:!0}});return a};Ze.fromSequence=function(a){var n=0,e=a.length;return new Ze(function(){return n>=e?{done:!0}:{done:!1,value:a[n++]}})};Ze.is=function(a){return a instanceof Ze?!0:typeof a=="object"&&a!==null&&typeof a.next=="function"};ss.exports=Ze});var us=De(Sr=>{Sr.ARRAY_BUFFER_SUPPORT=typeof ArrayBuffer!="undefined";Sr.SYMBOL_SUPPORT=typeof Symbol!="undefined"});var cs=De(($f,hs)=>{var ds=us(),Ac=ds.ARRAY_BUFFER_SUPPORT,wc=ds.SYMBOL_SUPPORT;hs.exports=function(n,e){var t,r,i,o,s;if(!n)throw new Error("obliterator/forEach: invalid iterable.");if(typeof e!="function")throw new Error("obliterator/forEach: expecting a callback.");if(Array.isArray(n)||Ac&&ArrayBuffer.isView(n)||typeof n=="string"||n.toString()==="[object Arguments]"){for(i=0,o=n.length;i<o;i++)e(n[i],i);return}if(typeof n.forEach=="function"){n.forEach(e);return}if(wc&&Symbol.iterator in n&&typeof n.next!="function"&&(n=n[Symbol.iterator]()),typeof n.next=="function"){for(t=n,i=0;s=t.next(),s.done!==!0;)e(s.value,i),i++;return}for(r in n)n.hasOwnProperty(r)&&e(n[r],r)}});var vs=De((Vf,gs)=>{var fs=ls(),Dc=cs();function pe(){this.clear()}pe.prototype.clear=function(){this.items=[],this.offset=0,this.size=0};pe.prototype.enqueue=function(a){return this.items.push(a),++this.size};pe.prototype.dequeue=function(){if(this.size){var a=this.items[this.offset];return++this.offset*2>=this.items.length&&(this.items=this.items.slice(this.offset),this.offset=0),this.size--,a}};pe.prototype.peek=function(){if(this.size)return this.items[this.offset]};pe.prototype.forEach=function(a,n){n=arguments.length>1?n:this;for(var e=this.offset,t=0,r=this.items.length;e<r;e++,t++)a.call(n,this.items[e],t,this)};pe.prototype.toArray=function(){return this.items.slice(this.offset)};pe.prototype.values=function(){var a=this.items,n=this.offset;return new fs(function(){if(n>=a.length)return{done:!0};var e=a[n];return n++,{value:e,done:!1}})};pe.prototype.entries=function(){var a=this.items,n=this.offset,e=0;return new fs(function(){if(n>=a.length)return{done:!0};var t=a[n];return n++,{value:[e++,t],done:!1}})};typeof Symbol!="undefined"&&(pe.prototype[Symbol.iterator]=pe.prototype.values);pe.prototype.toString=function(){return this.toArray().join(",")};pe.prototype.toJSON=function(){return this.toArray()};pe.prototype.inspect=function(){var a=this.toArray();return Object.defineProperty(a,"constructor",{value:pe,enumerable:!1}),a};typeof Symbol!="undefined"&&(pe.prototype[Symbol.for("nodejs.util.inspect.custom")]=pe.prototype.inspect);pe.from=function(a){var n=new pe;return Dc(a,function(e){n.enqueue(e)}),n};pe.of=function(){return pe.from(arguments)};gs.exports=pe});var ms=De((jf,ps)=>{ps.exports=function(n,e){var t=e.length;if(t!==0){var r=n.length;n.length+=t;for(var i=0;i<t;i++)n[r+i]=e[i]}}});var bs=De(rn=>{var Ar=jt(),Rc=vs(),Lc=ms();function Cc(a,n,e){if(!Ar(a))throw new Error("graphology-shortest-path: invalid graphology instance.");if(arguments.length<3)throw new Error("graphology-shortest-path: invalid number of arguments. Expecting at least 3.");if(!a.hasNode(n))throw new Error('graphology-shortest-path: the "'+n+'" source node does not exist in the given graph.');if(!a.hasNode(e))throw new Error('graphology-shortest-path: the "'+e+'" target node does not exist in the given graph.');if(n=""+n,e=""+e,n===e)return[n];var t=a.inboundNeighbors.bind(a),r=a.outboundNeighbors.bind(a),i={},o={};i[n]=null,o[e]=null;var s=[n],l=[e],u,d,h,c,f,g,y,m,v=!1;e:for(;s.length&&l.length;)if(s.length<=l.length){for(u=s,s=[],f=0,y=u.length;f<y;f++)for(d=u[f],h=r(d),g=0,m=h.length;g<m;g++)if(c=h[g],c in i||(s.push(c),i[c]=d),c in o){v=!0;break e}}else for(u=l,l=[],f=0,y=u.length;f<y;f++)for(d=u[f],h=t(d),g=0,m=h.length;g<m;g++)if(c=h[g],c in o||(l.push(c),o[c]=d),c in i){v=!0;break e}if(!v)return null;for(var p=[];c;)p.unshift(c),c=i[c];for(c=o[p[p.length-1]];c;)p.push(c),c=o[c];return p.length?p:null}function kc(a,n){if(!Ar(a))throw new Error("graphology-shortest-path: invalid graphology instance.");if(arguments.length<2)throw new Error("graphology-shortest-path: invalid number of arguments. Expecting at least 2.");if(!a.hasNode(n))throw new Error('graphology-shortest-path: the "'+n+'" source node does not exist in the given graph.');n=""+n;var e={},t={},r,i,o,s,l,u;for(e[n]=!0,t[n]=[n];Object.keys(e).length;){r=e,e={};for(o in r)for(i=a.outboundNeighbors(o),l=0,u=i.length;l<u;l++)s=i[l],t[s]||(t[s]=t[o].concat(s),e[s]=!0)}return t}function ys(a,n,e){if(!Ar(n))throw new Error("graphology-shortest-path: invalid graphology instance.");if(!n.hasNode(e))throw new Error('graphology-shortest-path: the "'+e+'" source node does not exist in the given graph.');e=""+e;var t=new Set,r={},i=0;r[e]=0;for(var o=[e],s,l,u;o.length!==0;){var d=[];for(s=0,l=o.length;s<l;s++)u=o[s],!t.has(u)&&(t.add(u),Lc(d,n[a](u)),r[u]=i);i++,o=d}return r}var Pc=ys.bind(null,"outboundNeighbors"),Fc=ys.bind(null,"neighbors");function Ic(a,n){n=""+n;var e=[],t={},r={},i=a.nodes(),o,s,l,u,d,h,c,f,g;for(h=0,f=i.length;h<f;h++)u=i[h],t[u]=[],r[u]=0;var y={};r[n]=1,y[n]=0;for(var m=Rc.of(n);m.size;)for(u=m.dequeue(),e.push(u),o=y[u],s=r[u],l=a.outboundNeighbors(u),c=0,g=l.length;c<g;c++)d=l[c],d in y||(m.enqueue(d),y[d]=o+1),y[d]===o+1&&(r[d]+=s,t[d].push(u));return[e,t,r]}rn.bidirectional=Cc;rn.singleSource=kc;rn.singleSourceLength=Pc;rn.undirectedSingleSourceLength=Fc;rn.brandes=Ic});var Gc={};Rs(Gc,{FA2Layout:()=>xs.default,Graph:()=>de,Sigma:()=>Vo,bidirectional:()=>Ts.bidirectional,forceAtlas2:()=>_s.default});var Mr=Qe(sn(),1);function zs(){let a=arguments[0];for(let n=1,e=arguments.length;n<e;n++)if(arguments[n])for(let t in arguments[n])a[t]=arguments[n][t];return a}var be=zs;typeof Object.assign=="function"&&(be=Object.assign);function Ge(a,n,e,t){let r=a._nodes.get(n),i=null;return r&&(t==="mixed"?i=r.out&&r.out[e]||r.undirected&&r.undirected[e]:t==="directed"?i=r.out&&r.out[e]:i=r.undirected&&r.undirected[e]),i}function Ee(a){return typeof a=="object"&&a!==null}function Ur(a){let n;for(n in a)return!1;return!0}function Ie(a,n,e){Object.defineProperty(a,n,{enumerable:!1,configurable:!1,writable:!0,value:e})}function He(a,n,e){let t={enumerable:!0,configurable:!0};typeof e=="function"?t.get=e:(t.value=e,t.writable=!1),Object.defineProperty(a,n,t)}function Nr(a){return!(!Ee(a)||a.attributes&&!Array.isArray(a.attributes))}function Ns(){let a=Math.floor(Math.random()*256)&255;return()=>a++}function Je(){let a=arguments,n=null,e=-1;return{[Symbol.iterator](){return this},next(){let t=null;do{if(n===null){if(e++,e>=a.length)return{done:!0};n=a[e][Symbol.iterator]()}if(t=n.next(),t.done){n=null;continue}break}while(!0);return t}}}function Nt(){return{[Symbol.iterator](){return this},next(){return{done:!0}}}}var dn=class extends Error{constructor(n){super(),this.name="GraphError",this.message=n}},j=class a extends dn{constructor(n){super(n),this.name="InvalidArgumentsGraphError",typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,a.prototype.constructor)}},H=class a extends dn{constructor(n){super(n),this.name="NotFoundGraphError",typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,a.prototype.constructor)}},Z=class a extends dn{constructor(n){super(n),this.name="UsageGraphError",typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,a.prototype.constructor)}};function Or(a,n){this.key=a,this.attributes=n,this.clear()}Or.prototype.clear=function(){this.inDegree=0,this.outDegree=0,this.undirectedDegree=0,this.undirectedLoops=0,this.directedLoops=0,this.in={},this.out={},this.undirected={}};function Hr(a,n){this.key=a,this.attributes=n,this.clear()}Hr.prototype.clear=function(){this.inDegree=0,this.outDegree=0,this.directedLoops=0,this.in={},this.out={}};function $r(a,n){this.key=a,this.attributes=n,this.clear()}$r.prototype.clear=function(){this.undirectedDegree=0,this.undirectedLoops=0,this.undirected={}};function Wt(a,n,e,t,r){this.key=n,this.attributes=r,this.undirected=a,this.source=e,this.target=t}Wt.prototype.attach=function(){let a="out",n="in";this.undirected&&(a=n="undirected");let e=this.source.key,t=this.target.key;this.source[a][t]=this,!(this.undirected&&e===t)&&(this.target[n][e]=this)};Wt.prototype.attachMulti=function(){let a="out",n="in",e=this.source.key,t=this.target.key;this.undirected&&(a=n="undirected");let r=this.source[a],i=r[t];if(typeof i=="undefined"){r[t]=this,this.undirected&&e===t||(this.target[n][e]=this);return}i.previous=this,this.next=i,r[t]=this,this.target[n][e]=this};Wt.prototype.detach=function(){let a=this.source.key,n=this.target.key,e="out",t="in";this.undirected&&(e=t="undirected"),delete this.source[e][n],delete this.target[t][a]};Wt.prototype.detachMulti=function(){let a=this.source.key,n=this.target.key,e="out",t="in";this.undirected&&(e=t="undirected"),this.previous===void 0?this.next===void 0?(delete this.source[e][n],delete this.target[t][a]):(this.next.previous=void 0,this.source[e][n]=this.next,this.target[t][a]=this.next):(this.previous.next=this.next,this.next!==void 0&&(this.next.previous=this.previous))};var Vr=0,jr=1,Ws=2,qr=3;function et(a,n,e,t,r,i,o){let s,l,u,d;if(t=""+t,e===Vr){if(s=a._nodes.get(t),!s)throw new H(`Graph.${n}: could not find the "${t}" node in the graph.`);u=r,d=i}else if(e===qr){if(r=""+r,l=a._edges.get(r),!l)throw new H(`Graph.${n}: could not find the "${r}" edge in the graph.`);let h=l.source.key,c=l.target.key;if(t===h)s=l.target;else if(t===c)s=l.source;else throw new H(`Graph.${n}: the "${t}" node is not attached to the "${r}" edge (${h}, ${c}).`);u=i,d=o}else{if(l=a._edges.get(t),!l)throw new H(`Graph.${n}: could not find the "${t}" edge in the graph.`);e===jr?s=l.source:s=l.target,u=r,d=i}return[s,u,d]}function Bs(a,n,e){a.prototype[n]=function(t,r,i){let[o,s]=et(this,n,e,t,r,i);return o.attributes[s]}}function Ms(a,n,e){a.prototype[n]=function(t,r){let[i]=et(this,n,e,t,r);return i.attributes}}function Us(a,n,e){a.prototype[n]=function(t,r,i){let[o,s]=et(this,n,e,t,r,i);return o.attributes.hasOwnProperty(s)}}function Os(a,n,e){a.prototype[n]=function(t,r,i,o){let[s,l,u]=et(this,n,e,t,r,i,o);return s.attributes[l]=u,this.emit("nodeAttributesUpdated",{key:s.key,type:"set",attributes:s.attributes,name:l}),this}}function Hs(a,n,e){a.prototype[n]=function(t,r,i,o){let[s,l,u]=et(this,n,e,t,r,i,o);if(typeof u!="function")throw new j(`Graph.${n}: updater should be a function.`);let d=s.attributes,h=u(d[l]);return d[l]=h,this.emit("nodeAttributesUpdated",{key:s.key,type:"set",attributes:s.attributes,name:l}),this}}function $s(a,n,e){a.prototype[n]=function(t,r,i){let[o,s]=et(this,n,e,t,r,i);return delete o.attributes[s],this.emit("nodeAttributesUpdated",{key:o.key,type:"remove",attributes:o.attributes,name:s}),this}}function Vs(a,n,e){a.prototype[n]=function(t,r,i){let[o,s]=et(this,n,e,t,r,i);if(!Ee(s))throw new j(`Graph.${n}: provided attributes are not a plain object.`);return o.attributes=s,this.emit("nodeAttributesUpdated",{key:o.key,type:"replace",attributes:o.attributes}),this}}function js(a,n,e){a.prototype[n]=function(t,r,i){let[o,s]=et(this,n,e,t,r,i);if(!Ee(s))throw new j(`Graph.${n}: provided attributes are not a plain object.`);return be(o.attributes,s),this.emit("nodeAttributesUpdated",{key:o.key,type:"merge",attributes:o.attributes,data:s}),this}}function qs(a,n,e){a.prototype[n]=function(t,r,i){let[o,s]=et(this,n,e,t,r,i);if(typeof s!="function")throw new j(`Graph.${n}: provided updater is not a function.`);return o.attributes=s(o.attributes),this.emit("nodeAttributesUpdated",{key:o.key,type:"update",attributes:o.attributes}),this}}var Xs=[{name:a=>`get${a}Attribute`,attacher:Bs},{name:a=>`get${a}Attributes`,attacher:Ms},{name:a=>`has${a}Attribute`,attacher:Us},{name:a=>`set${a}Attribute`,attacher:Os},{name:a=>`update${a}Attribute`,attacher:Hs},{name:a=>`remove${a}Attribute`,attacher:$s},{name:a=>`replace${a}Attributes`,attacher:Vs},{name:a=>`merge${a}Attributes`,attacher:js},{name:a=>`update${a}Attributes`,attacher:qs}];function Ys(a){Xs.forEach(function({name:n,attacher:e}){e(a,n("Node"),Vr),e(a,n("Source"),jr),e(a,n("Target"),Ws),e(a,n("Opposite"),qr)})}function Ks(a,n,e){a.prototype[n]=function(t,r){let i;if(this.type!=="mixed"&&e!=="mixed"&&e!==this.type)throw new Z(`Graph.${n}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new Z(`Graph.${n}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let o=""+t,s=""+r;if(r=arguments[2],i=Ge(this,o,s,e),!i)throw new H(`Graph.${n}: could not find an edge for the given path ("${o}" - "${s}").`)}else{if(e!=="mixed")throw new Z(`Graph.${n}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(t=""+t,i=this._edges.get(t),!i)throw new H(`Graph.${n}: could not find the "${t}" edge in the graph.`)}return i.attributes[r]}}function Zs(a,n,e){a.prototype[n]=function(t){let r;if(this.type!=="mixed"&&e!=="mixed"&&e!==this.type)throw new Z(`Graph.${n}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>1){if(this.multi)throw new Z(`Graph.${n}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let i=""+t,o=""+arguments[1];if(r=Ge(this,i,o,e),!r)throw new H(`Graph.${n}: could not find an edge for the given path ("${i}" - "${o}").`)}else{if(e!=="mixed")throw new Z(`Graph.${n}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(t=""+t,r=this._edges.get(t),!r)throw new H(`Graph.${n}: could not find the "${t}" edge in the graph.`)}return r.attributes}}function Qs(a,n,e){a.prototype[n]=function(t,r){let i;if(this.type!=="mixed"&&e!=="mixed"&&e!==this.type)throw new Z(`Graph.${n}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new Z(`Graph.${n}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let o=""+t,s=""+r;if(r=arguments[2],i=Ge(this,o,s,e),!i)throw new H(`Graph.${n}: could not find an edge for the given path ("${o}" - "${s}").`)}else{if(e!=="mixed")throw new Z(`Graph.${n}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(t=""+t,i=this._edges.get(t),!i)throw new H(`Graph.${n}: could not find the "${t}" edge in the graph.`)}return i.attributes.hasOwnProperty(r)}}function Js(a,n,e){a.prototype[n]=function(t,r,i){let o;if(this.type!=="mixed"&&e!=="mixed"&&e!==this.type)throw new Z(`Graph.${n}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>3){if(this.multi)throw new Z(`Graph.${n}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let s=""+t,l=""+r;if(r=arguments[2],i=arguments[3],o=Ge(this,s,l,e),!o)throw new H(`Graph.${n}: could not find an edge for the given path ("${s}" - "${l}").`)}else{if(e!=="mixed")throw new Z(`Graph.${n}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(t=""+t,o=this._edges.get(t),!o)throw new H(`Graph.${n}: could not find the "${t}" edge in the graph.`)}return o.attributes[r]=i,this.emit("edgeAttributesUpdated",{key:o.key,type:"set",attributes:o.attributes,name:r}),this}}function el(a,n,e){a.prototype[n]=function(t,r,i){let o;if(this.type!=="mixed"&&e!=="mixed"&&e!==this.type)throw new Z(`Graph.${n}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>3){if(this.multi)throw new Z(`Graph.${n}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let s=""+t,l=""+r;if(r=arguments[2],i=arguments[3],o=Ge(this,s,l,e),!o)throw new H(`Graph.${n}: could not find an edge for the given path ("${s}" - "${l}").`)}else{if(e!=="mixed")throw new Z(`Graph.${n}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(t=""+t,o=this._edges.get(t),!o)throw new H(`Graph.${n}: could not find the "${t}" edge in the graph.`)}if(typeof i!="function")throw new j(`Graph.${n}: updater should be a function.`);return o.attributes[r]=i(o.attributes[r]),this.emit("edgeAttributesUpdated",{key:o.key,type:"set",attributes:o.attributes,name:r}),this}}function tl(a,n,e){a.prototype[n]=function(t,r){let i;if(this.type!=="mixed"&&e!=="mixed"&&e!==this.type)throw new Z(`Graph.${n}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new Z(`Graph.${n}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let o=""+t,s=""+r;if(r=arguments[2],i=Ge(this,o,s,e),!i)throw new H(`Graph.${n}: could not find an edge for the given path ("${o}" - "${s}").`)}else{if(e!=="mixed")throw new Z(`Graph.${n}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(t=""+t,i=this._edges.get(t),!i)throw new H(`Graph.${n}: could not find the "${t}" edge in the graph.`)}return delete i.attributes[r],this.emit("edgeAttributesUpdated",{key:i.key,type:"remove",attributes:i.attributes,name:r}),this}}function nl(a,n,e){a.prototype[n]=function(t,r){let i;if(this.type!=="mixed"&&e!=="mixed"&&e!==this.type)throw new Z(`Graph.${n}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new Z(`Graph.${n}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let o=""+t,s=""+r;if(r=arguments[2],i=Ge(this,o,s,e),!i)throw new H(`Graph.${n}: could not find an edge for the given path ("${o}" - "${s}").`)}else{if(e!=="mixed")throw new Z(`Graph.${n}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(t=""+t,i=this._edges.get(t),!i)throw new H(`Graph.${n}: could not find the "${t}" edge in the graph.`)}if(!Ee(r))throw new j(`Graph.${n}: provided attributes are not a plain object.`);return i.attributes=r,this.emit("edgeAttributesUpdated",{key:i.key,type:"replace",attributes:i.attributes}),this}}function al(a,n,e){a.prototype[n]=function(t,r){let i;if(this.type!=="mixed"&&e!=="mixed"&&e!==this.type)throw new Z(`Graph.${n}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new Z(`Graph.${n}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let o=""+t,s=""+r;if(r=arguments[2],i=Ge(this,o,s,e),!i)throw new H(`Graph.${n}: could not find an edge for the given path ("${o}" - "${s}").`)}else{if(e!=="mixed")throw new Z(`Graph.${n}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(t=""+t,i=this._edges.get(t),!i)throw new H(`Graph.${n}: could not find the "${t}" edge in the graph.`)}if(!Ee(r))throw new j(`Graph.${n}: provided attributes are not a plain object.`);return be(i.attributes,r),this.emit("edgeAttributesUpdated",{key:i.key,type:"merge",attributes:i.attributes,data:r}),this}}function rl(a,n,e){a.prototype[n]=function(t,r){let i;if(this.type!=="mixed"&&e!=="mixed"&&e!==this.type)throw new Z(`Graph.${n}: cannot find this type of edges in your ${this.type} graph.`);if(arguments.length>2){if(this.multi)throw new Z(`Graph.${n}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);let o=""+t,s=""+r;if(r=arguments[2],i=Ge(this,o,s,e),!i)throw new H(`Graph.${n}: could not find an edge for the given path ("${o}" - "${s}").`)}else{if(e!=="mixed")throw new Z(`Graph.${n}: calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type.`);if(t=""+t,i=this._edges.get(t),!i)throw new H(`Graph.${n}: could not find the "${t}" edge in the graph.`)}if(typeof r!="function")throw new j(`Graph.${n}: provided updater is not a function.`);return i.attributes=r(i.attributes),this.emit("edgeAttributesUpdated",{key:i.key,type:"update",attributes:i.attributes}),this}}var il=[{name:a=>`get${a}Attribute`,attacher:Ks},{name:a=>`get${a}Attributes`,attacher:Zs},{name:a=>`has${a}Attribute`,attacher:Qs},{name:a=>`set${a}Attribute`,attacher:Js},{name:a=>`update${a}Attribute`,attacher:el},{name:a=>`remove${a}Attribute`,attacher:tl},{name:a=>`replace${a}Attributes`,attacher:nl},{name:a=>`merge${a}Attributes`,attacher:al},{name:a=>`update${a}Attributes`,attacher:rl}];function ol(a){il.forEach(function({name:n,attacher:e}){e(a,n("Edge"),"mixed"),e(a,n("DirectedEdge"),"directed"),e(a,n("UndirectedEdge"),"undirected")})}var sl=[{name:"edges",type:"mixed"},{name:"inEdges",type:"directed",direction:"in"},{name:"outEdges",type:"directed",direction:"out"},{name:"inboundEdges",type:"mixed",direction:"in"},{name:"outboundEdges",type:"mixed",direction:"out"},{name:"directedEdges",type:"directed"},{name:"undirectedEdges",type:"undirected"}];function ll(a,n,e,t){let r=!1;for(let i in n){if(i===t)continue;let o=n[i];if(r=e(o.key,o.attributes,o.source.key,o.target.key,o.source.attributes,o.target.attributes,o.undirected),a&&r)return o.key}}function ul(a,n,e,t){let r,i,o,s=!1;for(let l in n)if(l!==t){r=n[l];do{if(i=r.source,o=r.target,s=e(r.key,r.attributes,i.key,o.key,i.attributes,o.attributes,r.undirected),a&&s)return r.key;r=r.next}while(r!==void 0)}}function ka(a,n){let e=Object.keys(a),t=e.length,r,i=0;return{[Symbol.iterator](){return this},next(){do if(r)r=r.next;else{if(i>=t)return{done:!0};let o=e[i++];if(o===n){r=void 0;continue}r=a[o]}while(!r);return{done:!1,value:{edge:r.key,attributes:r.attributes,source:r.source.key,target:r.target.key,sourceAttributes:r.source.attributes,targetAttributes:r.target.attributes,undirected:r.undirected}}}}}function dl(a,n,e,t){let r=n[e];if(!r)return;let i=r.source,o=r.target;if(t(r.key,r.attributes,i.key,o.key,i.attributes,o.attributes,r.undirected)&&a)return r.key}function hl(a,n,e,t){let r=n[e];if(!r)return;let i=!1;do{if(i=t(r.key,r.attributes,r.source.key,r.target.key,r.source.attributes,r.target.attributes,r.undirected),a&&i)return r.key;r=r.next}while(r!==void 0)}function Pa(a,n){let e=a[n];if(e.next!==void 0)return{[Symbol.iterator](){return this},next(){if(!e)return{done:!0};let r={edge:e.key,attributes:e.attributes,source:e.source.key,target:e.target.key,sourceAttributes:e.source.attributes,targetAttributes:e.target.attributes,undirected:e.undirected};return e=e.next,{done:!1,value:r}}};let t=!1;return{[Symbol.iterator](){return this},next(){return t===!0?{done:!0}:(t=!0,{done:!1,value:{edge:e.key,attributes:e.attributes,source:e.source.key,target:e.target.key,sourceAttributes:e.source.attributes,targetAttributes:e.target.attributes,undirected:e.undirected}})}}}function cl(a,n){if(a.size===0)return[];if(n==="mixed"||n===a.type)return Array.from(a._edges.keys());let e=n==="undirected"?a.undirectedSize:a.directedSize,t=new Array(e),r=n==="undirected",i=a._edges.values(),o=0,s,l;for(;s=i.next(),s.done!==!0;)l=s.value,l.undirected===r&&(t[o++]=l.key);return t}function Xr(a,n,e,t){if(n.size===0)return;let r=e!=="mixed"&&e!==n.type,i=e==="undirected",o,s,l=!1,u=n._edges.values();for(;o=u.next(),o.done!==!0;){if(s=o.value,r&&s.undirected!==i)continue;let{key:d,attributes:h,source:c,target:f}=s;if(l=t(d,h,c.key,f.key,c.attributes,f.attributes,s.undirected),a&&l)return d}}function fl(a,n){if(a.size===0)return Nt();let e=n!=="mixed"&&n!==a.type,t=n==="undirected",r=a._edges.values();return{[Symbol.iterator](){return this},next(){let i,o;for(;;){if(i=r.next(),i.done)return i;if(o=i.value,!(e&&o.undirected!==t))break}return{value:{edge:o.key,attributes:o.attributes,source:o.source.key,target:o.target.key,sourceAttributes:o.source.attributes,targetAttributes:o.target.attributes,undirected:o.undirected},done:!1}}}}function Fa(a,n,e,t,r,i){let o=n?ul:ll,s;if(e!=="undirected"&&(t!=="out"&&(s=o(a,r.in,i),a&&s)||t!=="in"&&(s=o(a,r.out,i,t?void 0:r.key),a&&s))||e!=="directed"&&(s=o(a,r.undirected,i),a&&s))return s}function gl(a,n,e,t){let r=[];return Fa(!1,a,n,e,t,function(i){r.push(i)}),r}function vl(a,n,e){let t=Nt();return a!=="undirected"&&(n!=="out"&&typeof e.in!="undefined"&&(t=Je(t,ka(e.in))),n!=="in"&&typeof e.out!="undefined"&&(t=Je(t,ka(e.out,n?void 0:e.key)))),a!=="directed"&&typeof e.undirected!="undefined"&&(t=Je(t,ka(e.undirected))),t}function Ia(a,n,e,t,r,i,o){let s=e?hl:dl,l;if(n!=="undirected"&&(typeof r.in!="undefined"&&t!=="out"&&(l=s(a,r.in,i,o),a&&l)||typeof r.out!="undefined"&&t!=="in"&&(t||r.key!==i)&&(l=s(a,r.out,i,o),a&&l))||n!=="directed"&&typeof r.undirected!="undefined"&&(l=s(a,r.undirected,i,o),a&&l))return l}function pl(a,n,e,t,r){let i=[];return Ia(!1,a,n,e,t,r,function(o){i.push(o)}),i}function ml(a,n,e,t){let r=Nt();return a!=="undirected"&&(typeof e.in!="undefined"&&n!=="out"&&t in e.in&&(r=Je(r,Pa(e.in,t))),typeof e.out!="undefined"&&n!=="in"&&t in e.out&&(n||e.key!==t)&&(r=Je(r,Pa(e.out,t)))),a!=="directed"&&typeof e.undirected!="undefined"&&t in e.undirected&&(r=Je(r,Pa(e.undirected,t))),r}function yl(a,n){let{name:e,type:t,direction:r}=n;a.prototype[e]=function(i,o){if(t!=="mixed"&&this.type!=="mixed"&&t!==this.type)return[];if(!arguments.length)return cl(this,t);if(arguments.length===1){i=""+i;let s=this._nodes.get(i);if(typeof s=="undefined")throw new H(`Graph.${e}: could not find the "${i}" node in the graph.`);return gl(this.multi,t==="mixed"?this.type:t,r,s)}if(arguments.length===2){i=""+i,o=""+o;let s=this._nodes.get(i);if(!s)throw new H(`Graph.${e}:  could not find the "${i}" source node in the graph.`);if(!this._nodes.has(o))throw new H(`Graph.${e}:  could not find the "${o}" target node in the graph.`);return pl(t,this.multi,r,s,o)}throw new j(`Graph.${e}: too many arguments (expecting 0, 1 or 2 and got ${arguments.length}).`)}}function bl(a,n){let{name:e,type:t,direction:r}=n,i="forEach"+e[0].toUpperCase()+e.slice(1,-1);a.prototype[i]=function(u,d,h){if(!(t!=="mixed"&&this.type!=="mixed"&&t!==this.type)){if(arguments.length===1)return h=u,Xr(!1,this,t,h);if(arguments.length===2){u=""+u,h=d;let c=this._nodes.get(u);if(typeof c=="undefined")throw new H(`Graph.${i}: could not find the "${u}" node in the graph.`);return Fa(!1,this.multi,t==="mixed"?this.type:t,r,c,h)}if(arguments.length===3){u=""+u,d=""+d;let c=this._nodes.get(u);if(!c)throw new H(`Graph.${i}:  could not find the "${u}" source node in the graph.`);if(!this._nodes.has(d))throw new H(`Graph.${i}:  could not find the "${d}" target node in the graph.`);return Ia(!1,t,this.multi,r,c,d,h)}throw new j(`Graph.${i}: too many arguments (expecting 1, 2 or 3 and got ${arguments.length}).`)}};let o="map"+e[0].toUpperCase()+e.slice(1);a.prototype[o]=function(){let u=Array.prototype.slice.call(arguments),d=u.pop(),h;if(u.length===0){let c=0;t!=="directed"&&(c+=this.undirectedSize),t!=="undirected"&&(c+=this.directedSize),h=new Array(c);let f=0;u.push((g,y,m,v,p,b,T)=>{h[f++]=d(g,y,m,v,p,b,T)})}else h=[],u.push((c,f,g,y,m,v,p)=>{h.push(d(c,f,g,y,m,v,p))});return this[i].apply(this,u),h};let s="filter"+e[0].toUpperCase()+e.slice(1);a.prototype[s]=function(){let u=Array.prototype.slice.call(arguments),d=u.pop(),h=[];return u.push((c,f,g,y,m,v,p)=>{d(c,f,g,y,m,v,p)&&h.push(c)}),this[i].apply(this,u),h};let l="reduce"+e[0].toUpperCase()+e.slice(1);a.prototype[l]=function(){let u=Array.prototype.slice.call(arguments);if(u.length<2||u.length>4)throw new j(`Graph.${l}: invalid number of arguments (expecting 2, 3 or 4 and got ${u.length}).`);if(typeof u[u.length-1]=="function"&&typeof u[u.length-2]!="function")throw new j(`Graph.${l}: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.`);let d,h;u.length===2?(d=u[0],h=u[1],u=[]):u.length===3?(d=u[1],h=u[2],u=[u[0]]):u.length===4&&(d=u[2],h=u[3],u=[u[0],u[1]]);let c=h;return u.push((f,g,y,m,v,p,b)=>{c=d(c,f,g,y,m,v,p,b)}),this[i].apply(this,u),c}}function _l(a,n){let{name:e,type:t,direction:r}=n,i="find"+e[0].toUpperCase()+e.slice(1,-1);a.prototype[i]=function(l,u,d){if(t!=="mixed"&&this.type!=="mixed"&&t!==this.type)return!1;if(arguments.length===1)return d=l,Xr(!0,this,t,d);if(arguments.length===2){l=""+l,d=u;let h=this._nodes.get(l);if(typeof h=="undefined")throw new H(`Graph.${i}: could not find the "${l}" node in the graph.`);return Fa(!0,this.multi,t==="mixed"?this.type:t,r,h,d)}if(arguments.length===3){l=""+l,u=""+u;let h=this._nodes.get(l);if(!h)throw new H(`Graph.${i}:  could not find the "${l}" source node in the graph.`);if(!this._nodes.has(u))throw new H(`Graph.${i}:  could not find the "${u}" target node in the graph.`);return Ia(!0,t,this.multi,r,h,u,d)}throw new j(`Graph.${i}: too many arguments (expecting 1, 2 or 3 and got ${arguments.length}).`)};let o="some"+e[0].toUpperCase()+e.slice(1,-1);a.prototype[o]=function(){let l=Array.prototype.slice.call(arguments),u=l.pop();return l.push((h,c,f,g,y,m,v)=>u(h,c,f,g,y,m,v)),!!this[i].apply(this,l)};let s="every"+e[0].toUpperCase()+e.slice(1,-1);a.prototype[s]=function(){let l=Array.prototype.slice.call(arguments),u=l.pop();return l.push((h,c,f,g,y,m,v)=>!u(h,c,f,g,y,m,v)),!this[i].apply(this,l)}}function xl(a,n){let{name:e,type:t,direction:r}=n,i=e.slice(0,-1)+"Entries";a.prototype[i]=function(o,s){if(t!=="mixed"&&this.type!=="mixed"&&t!==this.type)return Nt();if(!arguments.length)return fl(this,t);if(arguments.length===1){o=""+o;let l=this._nodes.get(o);if(!l)throw new H(`Graph.${i}: could not find the "${o}" node in the graph.`);return vl(t,r,l)}if(arguments.length===2){o=""+o,s=""+s;let l=this._nodes.get(o);if(!l)throw new H(`Graph.${i}:  could not find the "${o}" source node in the graph.`);if(!this._nodes.has(s))throw new H(`Graph.${i}:  could not find the "${s}" target node in the graph.`);return ml(t,r,l,s)}throw new j(`Graph.${i}: too many arguments (expecting 0, 1 or 2 and got ${arguments.length}).`)}}function Tl(a){sl.forEach(n=>{yl(a,n),bl(a,n),_l(a,n),xl(a,n)})}var El=[{name:"neighbors",type:"mixed"},{name:"inNeighbors",type:"directed",direction:"in"},{name:"outNeighbors",type:"directed",direction:"out"},{name:"inboundNeighbors",type:"mixed",direction:"in"},{name:"outboundNeighbors",type:"mixed",direction:"out"},{name:"directedNeighbors",type:"directed"},{name:"undirectedNeighbors",type:"undirected"}];function $n(){this.A=null,this.B=null}$n.prototype.wrap=function(a){this.A===null?this.A=a:this.B===null&&(this.B=a)};$n.prototype.has=function(a){return this.A!==null&&a in this.A||this.B!==null&&a in this.B};function ln(a,n,e,t,r){for(let i in t){let o=t[i],s=o.source,l=o.target,u=s===e?l:s;if(n&&n.has(u.key))continue;let d=r(u.key,u.attributes);if(a&&d)return u.key}}function Ga(a,n,e,t,r){if(n!=="mixed"){if(n==="undirected")return ln(a,null,t,t.undirected,r);if(typeof e=="string")return ln(a,null,t,t[e],r)}let i=new $n,o;if(n!=="undirected"){if(e!=="out"){if(o=ln(a,null,t,t.in,r),a&&o)return o;i.wrap(t.in)}if(e!=="in"){if(o=ln(a,i,t,t.out,r),a&&o)return o;i.wrap(t.out)}}if(n!=="directed"&&(o=ln(a,i,t,t.undirected,r),a&&o))return o}function Sl(a,n,e){if(a!=="mixed"){if(a==="undirected")return Object.keys(e.undirected);if(typeof n=="string")return Object.keys(e[n])}let t=[];return Ga(!1,a,n,e,function(r){t.push(r)}),t}function un(a,n,e){let t=Object.keys(e),r=t.length,i=0;return{[Symbol.iterator](){return this},next(){let o=null;do{if(i>=r)return a&&a.wrap(e),{done:!0};let s=e[t[i++]],l=s.source,u=s.target;if(o=l===n?u:l,a&&a.has(o.key)){o=null;continue}}while(o===null);return{done:!1,value:{neighbor:o.key,attributes:o.attributes}}}}}function Al(a,n,e){if(a!=="mixed"){if(a==="undirected")return un(null,e,e.undirected);if(typeof n=="string")return un(null,e,e[n])}let t=Nt(),r=new $n;return a!=="undirected"&&(n!=="out"&&(t=Je(t,un(r,e,e.in))),n!=="in"&&(t=Je(t,un(r,e,e.out)))),a!=="directed"&&(t=Je(t,un(r,e,e.undirected))),t}function wl(a,n){let{name:e,type:t,direction:r}=n;a.prototype[e]=function(i){if(t!=="mixed"&&this.type!=="mixed"&&t!==this.type)return[];i=""+i;let o=this._nodes.get(i);if(typeof o=="undefined")throw new H(`Graph.${e}: could not find the "${i}" node in the graph.`);return Sl(t==="mixed"?this.type:t,r,o)}}function Dl(a,n){let{name:e,type:t,direction:r}=n,i="forEach"+e[0].toUpperCase()+e.slice(1,-1);a.prototype[i]=function(u,d){if(t!=="mixed"&&this.type!=="mixed"&&t!==this.type)return;u=""+u;let h=this._nodes.get(u);if(typeof h=="undefined")throw new H(`Graph.${i}: could not find the "${u}" node in the graph.`);Ga(!1,t==="mixed"?this.type:t,r,h,d)};let o="map"+e[0].toUpperCase()+e.slice(1);a.prototype[o]=function(u,d){let h=[];return this[i](u,(c,f)=>{h.push(d(c,f))}),h};let s="filter"+e[0].toUpperCase()+e.slice(1);a.prototype[s]=function(u,d){let h=[];return this[i](u,(c,f)=>{d(c,f)&&h.push(c)}),h};let l="reduce"+e[0].toUpperCase()+e.slice(1);a.prototype[l]=function(u,d,h){if(arguments.length<3)throw new j(`Graph.${l}: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.`);let c=h;return this[i](u,(f,g)=>{c=d(c,f,g)}),c}}function Rl(a,n){let{name:e,type:t,direction:r}=n,i=e[0].toUpperCase()+e.slice(1,-1),o="find"+i;a.prototype[o]=function(u,d){if(t!=="mixed"&&this.type!=="mixed"&&t!==this.type)return;u=""+u;let h=this._nodes.get(u);if(typeof h=="undefined")throw new H(`Graph.${o}: could not find the "${u}" node in the graph.`);return Ga(!0,t==="mixed"?this.type:t,r,h,d)};let s="some"+i;a.prototype[s]=function(u,d){return!!this[o](u,d)};let l="every"+i;a.prototype[l]=function(u,d){return!this[o](u,(c,f)=>!d(c,f))}}function Ll(a,n){let{name:e,type:t,direction:r}=n,i=e.slice(0,-1)+"Entries";a.prototype[i]=function(o){if(t!=="mixed"&&this.type!=="mixed"&&t!==this.type)return Nt();o=""+o;let s=this._nodes.get(o);if(typeof s=="undefined")throw new H(`Graph.${i}: could not find the "${o}" node in the graph.`);return Al(t==="mixed"?this.type:t,r,s)}}function Cl(a){El.forEach(n=>{wl(a,n),Dl(a,n),Rl(a,n),Ll(a,n)})}function Wn(a,n,e,t,r){let i=t._nodes.values(),o=t.type,s,l,u,d,h,c,f;for(;s=i.next(),s.done!==!0;){let g=!1;if(l=s.value,o!=="undirected"){d=l.out;for(u in d){h=d[u];do{if(c=h.target,g=!0,f=r(l.key,c.key,l.attributes,c.attributes,h.key,h.attributes,h.undirected),a&&f)return h;h=h.next}while(h)}}if(o!=="directed"){d=l.undirected;for(u in d)if(!(n&&l.key>u)){h=d[u];do{if(c=h.target,c.key!==u&&(c=h.source),g=!0,f=r(l.key,c.key,l.attributes,c.attributes,h.key,h.attributes,h.undirected),a&&f)return h;h=h.next}while(h)}}if(e&&!g&&(f=r(l.key,null,l.attributes,null,null,null,null),a&&f))return null}}function kl(a,n){let e={key:a};return Ur(n.attributes)||(e.attributes=be({},n.attributes)),e}function Pl(a,n,e){let t={key:n,source:e.source.key,target:e.target.key};return Ur(e.attributes)||(t.attributes=be({},e.attributes)),a==="mixed"&&e.undirected&&(t.undirected=!0),t}function Fl(a){if(!Ee(a))throw new j('Graph.import: invalid serialized node. A serialized node should be a plain object with at least a "key" property.');if(!("key"in a))throw new j("Graph.import: serialized node is missing its key.");if("attributes"in a&&(!Ee(a.attributes)||a.attributes===null))throw new j("Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.")}function Il(a){if(!Ee(a))throw new j('Graph.import: invalid serialized edge. A serialized edge should be a plain object with at least a "source" & "target" property.');if(!("source"in a))throw new j("Graph.import: serialized edge is missing its source.");if(!("target"in a))throw new j("Graph.import: serialized edge is missing its target.");if("attributes"in a&&(!Ee(a.attributes)||a.attributes===null))throw new j("Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.");if("undirected"in a&&typeof a.undirected!="boolean")throw new j("Graph.import: invalid undirectedness information. Undirected should be boolean or omitted.")}var Gl=Ns(),zl=new Set(["directed","undirected","mixed"]),Wr=new Set(["domain","_events","_eventsCount","_maxListeners"]),Nl=[{name:a=>`${a}Edge`,generateKey:!0},{name:a=>`${a}DirectedEdge`,generateKey:!0,type:"directed"},{name:a=>`${a}UndirectedEdge`,generateKey:!0,type:"undirected"},{name:a=>`${a}EdgeWithKey`},{name:a=>`${a}DirectedEdgeWithKey`,type:"directed"},{name:a=>`${a}UndirectedEdgeWithKey`,type:"undirected"}],Wl={allowSelfLoops:!0,multi:!1,type:"mixed"};function Bl(a,n,e){if(e&&!Ee(e))throw new j(`Graph.addNode: invalid attributes. Expecting an object but got "${e}"`);if(n=""+n,e=e||{},a._nodes.has(n))throw new Z(`Graph.addNode: the "${n}" node already exist in the graph.`);let t=new a.NodeDataClass(n,e);return a._nodes.set(n,t),a.emit("nodeAdded",{key:n,attributes:e}),t}function Br(a,n,e){let t=new a.NodeDataClass(n,e);return a._nodes.set(n,t),a.emit("nodeAdded",{key:n,attributes:e}),t}function Yr(a,n,e,t,r,i,o,s){if(!t&&a.type==="undirected")throw new Z(`Graph.${n}: you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead.`);if(t&&a.type==="directed")throw new Z(`Graph.${n}: you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead.`);if(s&&!Ee(s))throw new j(`Graph.${n}: invalid attributes. Expecting an object but got "${s}"`);if(i=""+i,o=""+o,s=s||{},!a.allowSelfLoops&&i===o)throw new Z(`Graph.${n}: source & target are the same ("${i}"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false.`);let l=a._nodes.get(i),u=a._nodes.get(o);if(!l)throw new H(`Graph.${n}: source node "${i}" not found.`);if(!u)throw new H(`Graph.${n}: target node "${o}" not found.`);let d={key:null,undirected:t,source:i,target:o,attributes:s};if(e)r=a._edgeKeyGenerator();else if(r=""+r,a._edges.has(r))throw new Z(`Graph.${n}: the "${r}" edge already exists in the graph.`);if(!a.multi&&(t?typeof l.undirected[o]!="undefined":typeof l.out[o]!="undefined"))throw new Z(`Graph.${n}: an edge linking "${i}" to "${o}" already exists. If you really want to add multiple edges linking those nodes, you should create a multi graph by using the 'multi' option.`);let h=new Wt(t,r,l,u,s);a._edges.set(r,h);let c=i===o;return t?(l.undirectedDegree++,u.undirectedDegree++,c&&(l.undirectedLoops++,a._undirectedSelfLoopCount++)):(l.outDegree++,u.inDegree++,c&&(l.directedLoops++,a._directedSelfLoopCount++)),a.multi?h.attachMulti():h.attach(),t?a._undirectedSize++:a._directedSize++,d.key=r,a.emit("edgeAdded",d),r}function Ml(a,n,e,t,r,i,o,s,l){if(!t&&a.type==="undirected")throw new Z(`Graph.${n}: you cannot merge/update a directed edge to an undirected graph. Use the #.mergeEdge/#.updateEdge or #.addUndirectedEdge instead.`);if(t&&a.type==="directed")throw new Z(`Graph.${n}: you cannot merge/update an undirected edge to a directed graph. Use the #.mergeEdge/#.updateEdge or #.addDirectedEdge instead.`);if(s){if(l){if(typeof s!="function")throw new j(`Graph.${n}: invalid updater function. Expecting a function but got "${s}"`)}else if(!Ee(s))throw new j(`Graph.${n}: invalid attributes. Expecting an object but got "${s}"`)}i=""+i,o=""+o;let u;if(l&&(u=s,s=void 0),!a.allowSelfLoops&&i===o)throw new Z(`Graph.${n}: source & target are the same ("${i}"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false.`);let d=a._nodes.get(i),h=a._nodes.get(o),c,f;if(!e&&(c=a._edges.get(r),c)){if((c.source.key!==i||c.target.key!==o)&&(!t||c.source.key!==o||c.target.key!==i))throw new Z(`Graph.${n}: inconsistency detected when attempting to merge the "${r}" edge with "${i}" source & "${o}" target vs. ("${c.source.key}", "${c.target.key}").`);f=c}if(!f&&!a.multi&&d&&(f=t?d.undirected[o]:d.out[o]),f){let p=[f.key,!1,!1,!1];if(l?!u:!s)return p;if(l){let b=f.attributes;f.attributes=u(b),a.emit("edgeAttributesUpdated",{type:"replace",key:f.key,attributes:f.attributes})}else be(f.attributes,s),a.emit("edgeAttributesUpdated",{type:"merge",key:f.key,attributes:f.attributes,data:s});return p}s=s||{},l&&u&&(s=u(s));let g={key:null,undirected:t,source:i,target:o,attributes:s};if(e)r=a._edgeKeyGenerator();else if(r=""+r,a._edges.has(r))throw new Z(`Graph.${n}: the "${r}" edge already exists in the graph.`);let y=!1,m=!1;d||(d=Br(a,i,{}),y=!0,i===o&&(h=d,m=!0)),h||(h=Br(a,o,{}),m=!0),c=new Wt(t,r,d,h,s),a._edges.set(r,c);let v=i===o;return t?(d.undirectedDegree++,h.undirectedDegree++,v&&(d.undirectedLoops++,a._undirectedSelfLoopCount++)):(d.outDegree++,h.inDegree++,v&&(d.directedLoops++,a._directedSelfLoopCount++)),a.multi?c.attachMulti():c.attach(),t?a._undirectedSize++:a._directedSize++,g.key=r,a.emit("edgeAdded",g),[r,!0,y,m]}function zt(a,n){a._edges.delete(n.key);let{source:e,target:t,attributes:r}=n,i=n.undirected,o=e===t;i?(e.undirectedDegree--,t.undirectedDegree--,o&&(e.undirectedLoops--,a._undirectedSelfLoopCount--)):(e.outDegree--,t.inDegree--,o&&(e.directedLoops--,a._directedSelfLoopCount--)),a.multi?n.detachMulti():n.detach(),i?a._undirectedSize--:a._directedSize--,a.emit("edgeDropped",{key:n.key,attributes:r,source:e.key,target:t.key,undirected:i})}var de=class a extends Mr.EventEmitter{constructor(n){if(super(),n=be({},Wl,n),typeof n.multi!="boolean")throw new j(`Graph.constructor: invalid 'multi' option. Expecting a boolean but got "${n.multi}".`);if(!zl.has(n.type))throw new j(`Graph.constructor: invalid 'type' option. Should be one of "mixed", "directed" or "undirected" but got "${n.type}".`);if(typeof n.allowSelfLoops!="boolean")throw new j(`Graph.constructor: invalid 'allowSelfLoops' option. Expecting a boolean but got "${n.allowSelfLoops}".`);let e=n.type==="mixed"?Or:n.type==="directed"?Hr:$r;Ie(this,"NodeDataClass",e);let t="geid_"+Gl()+"_",r=0,i=()=>{let o;do o=t+r++;while(this._edges.has(o));return o};Ie(this,"_attributes",{}),Ie(this,"_nodes",new Map),Ie(this,"_edges",new Map),Ie(this,"_directedSize",0),Ie(this,"_undirectedSize",0),Ie(this,"_directedSelfLoopCount",0),Ie(this,"_undirectedSelfLoopCount",0),Ie(this,"_edgeKeyGenerator",i),Ie(this,"_options",n),Wr.forEach(o=>Ie(this,o,this[o])),He(this,"order",()=>this._nodes.size),He(this,"size",()=>this._edges.size),He(this,"directedSize",()=>this._directedSize),He(this,"undirectedSize",()=>this._undirectedSize),He(this,"selfLoopCount",()=>this._directedSelfLoopCount+this._undirectedSelfLoopCount),He(this,"directedSelfLoopCount",()=>this._directedSelfLoopCount),He(this,"undirectedSelfLoopCount",()=>this._undirectedSelfLoopCount),He(this,"multi",this._options.multi),He(this,"type",this._options.type),He(this,"allowSelfLoops",this._options.allowSelfLoops),He(this,"implementation",()=>"graphology")}_resetInstanceCounters(){this._directedSize=0,this._undirectedSize=0,this._directedSelfLoopCount=0,this._undirectedSelfLoopCount=0}hasNode(n){return this._nodes.has(""+n)}hasDirectedEdge(n,e){if(this.type==="undirected")return!1;if(arguments.length===1){let t=""+n,r=this._edges.get(t);return!!r&&!r.undirected}else if(arguments.length===2){n=""+n,e=""+e;let t=this._nodes.get(n);return t?t.out.hasOwnProperty(e):!1}throw new j(`Graph.hasDirectedEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`)}hasUndirectedEdge(n,e){if(this.type==="directed")return!1;if(arguments.length===1){let t=""+n,r=this._edges.get(t);return!!r&&r.undirected}else if(arguments.length===2){n=""+n,e=""+e;let t=this._nodes.get(n);return t?t.undirected.hasOwnProperty(e):!1}throw new j(`Graph.hasDirectedEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`)}hasEdge(n,e){if(arguments.length===1){let t=""+n;return this._edges.has(t)}else if(arguments.length===2){n=""+n,e=""+e;let t=this._nodes.get(n);return t?typeof t.out!="undefined"&&t.out.hasOwnProperty(e)||typeof t.undirected!="undefined"&&t.undirected.hasOwnProperty(e):!1}throw new j(`Graph.hasEdge: invalid arity (${arguments.length}, instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.`)}directedEdge(n,e){if(this.type==="undirected")return;if(n=""+n,e=""+e,this.multi)throw new Z("Graph.directedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.directedEdges instead.");let t=this._nodes.get(n);if(!t)throw new H(`Graph.directedEdge: could not find the "${n}" source node in the graph.`);if(!this._nodes.has(e))throw new H(`Graph.directedEdge: could not find the "${e}" target node in the graph.`);let r=t.out&&t.out[e]||void 0;if(r)return r.key}undirectedEdge(n,e){if(this.type==="directed")return;if(n=""+n,e=""+e,this.multi)throw new Z("Graph.undirectedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.undirectedEdges instead.");let t=this._nodes.get(n);if(!t)throw new H(`Graph.undirectedEdge: could not find the "${n}" source node in the graph.`);if(!this._nodes.has(e))throw new H(`Graph.undirectedEdge: could not find the "${e}" target node in the graph.`);let r=t.undirected&&t.undirected[e]||void 0;if(r)return r.key}edge(n,e){if(this.multi)throw new Z("Graph.edge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.edges instead.");n=""+n,e=""+e;let t=this._nodes.get(n);if(!t)throw new H(`Graph.edge: could not find the "${n}" source node in the graph.`);if(!this._nodes.has(e))throw new H(`Graph.edge: could not find the "${e}" target node in the graph.`);let r=t.out&&t.out[e]||t.undirected&&t.undirected[e]||void 0;if(r)return r.key}areDirectedNeighbors(n,e){n=""+n,e=""+e;let t=this._nodes.get(n);if(!t)throw new H(`Graph.areDirectedNeighbors: could not find the "${n}" node in the graph.`);return this.type==="undirected"?!1:e in t.in||e in t.out}areOutNeighbors(n,e){n=""+n,e=""+e;let t=this._nodes.get(n);if(!t)throw new H(`Graph.areOutNeighbors: could not find the "${n}" node in the graph.`);return this.type==="undirected"?!1:e in t.out}areInNeighbors(n,e){n=""+n,e=""+e;let t=this._nodes.get(n);if(!t)throw new H(`Graph.areInNeighbors: could not find the "${n}" node in the graph.`);return this.type==="undirected"?!1:e in t.in}areUndirectedNeighbors(n,e){n=""+n,e=""+e;let t=this._nodes.get(n);if(!t)throw new H(`Graph.areUndirectedNeighbors: could not find the "${n}" node in the graph.`);return this.type==="directed"?!1:e in t.undirected}areNeighbors(n,e){n=""+n,e=""+e;let t=this._nodes.get(n);if(!t)throw new H(`Graph.areNeighbors: could not find the "${n}" node in the graph.`);return this.type!=="undirected"&&(e in t.in||e in t.out)||this.type!=="directed"&&e in t.undirected}areInboundNeighbors(n,e){n=""+n,e=""+e;let t=this._nodes.get(n);if(!t)throw new H(`Graph.areInboundNeighbors: could not find the "${n}" node in the graph.`);return this.type!=="undirected"&&e in t.in||this.type!=="directed"&&e in t.undirected}areOutboundNeighbors(n,e){n=""+n,e=""+e;let t=this._nodes.get(n);if(!t)throw new H(`Graph.areOutboundNeighbors: could not find the "${n}" node in the graph.`);return this.type!=="undirected"&&e in t.out||this.type!=="directed"&&e in t.undirected}inDegree(n){n=""+n;let e=this._nodes.get(n);if(!e)throw new H(`Graph.inDegree: could not find the "${n}" node in the graph.`);return this.type==="undirected"?0:e.inDegree}outDegree(n){n=""+n;let e=this._nodes.get(n);if(!e)throw new H(`Graph.outDegree: could not find the "${n}" node in the graph.`);return this.type==="undirected"?0:e.outDegree}directedDegree(n){n=""+n;let e=this._nodes.get(n);if(!e)throw new H(`Graph.directedDegree: could not find the "${n}" node in the graph.`);return this.type==="undirected"?0:e.inDegree+e.outDegree}undirectedDegree(n){n=""+n;let e=this._nodes.get(n);if(!e)throw new H(`Graph.undirectedDegree: could not find the "${n}" node in the graph.`);return this.type==="directed"?0:e.undirectedDegree}inboundDegree(n){n=""+n;let e=this._nodes.get(n);if(!e)throw new H(`Graph.inboundDegree: could not find the "${n}" node in the graph.`);let t=0;return this.type!=="directed"&&(t+=e.undirectedDegree),this.type!=="undirected"&&(t+=e.inDegree),t}outboundDegree(n){n=""+n;let e=this._nodes.get(n);if(!e)throw new H(`Graph.outboundDegree: could not find the "${n}" node in the graph.`);let t=0;return this.type!=="directed"&&(t+=e.undirectedDegree),this.type!=="undirected"&&(t+=e.outDegree),t}degree(n){n=""+n;let e=this._nodes.get(n);if(!e)throw new H(`Graph.degree: could not find the "${n}" node in the graph.`);let t=0;return this.type!=="directed"&&(t+=e.undirectedDegree),this.type!=="undirected"&&(t+=e.inDegree+e.outDegree),t}inDegreeWithoutSelfLoops(n){n=""+n;let e=this._nodes.get(n);if(!e)throw new H(`Graph.inDegreeWithoutSelfLoops: could not find the "${n}" node in the graph.`);return this.type==="undirected"?0:e.inDegree-e.directedLoops}outDegreeWithoutSelfLoops(n){n=""+n;let e=this._nodes.get(n);if(!e)throw new H(`Graph.outDegreeWithoutSelfLoops: could not find the "${n}" node in the graph.`);return this.type==="undirected"?0:e.outDegree-e.directedLoops}directedDegreeWithoutSelfLoops(n){n=""+n;let e=this._nodes.get(n);if(!e)throw new H(`Graph.directedDegreeWithoutSelfLoops: could not find the "${n}" node in the graph.`);return this.type==="undirected"?0:e.inDegree+e.outDegree-e.directedLoops*2}undirectedDegreeWithoutSelfLoops(n){n=""+n;let e=this._nodes.get(n);if(!e)throw new H(`Graph.undirectedDegreeWithoutSelfLoops: could not find the "${n}" node in the graph.`);return this.type==="directed"?0:e.undirectedDegree-e.undirectedLoops*2}inboundDegreeWithoutSelfLoops(n){n=""+n;let e=this._nodes.get(n);if(!e)throw new H(`Graph.inboundDegreeWithoutSelfLoops: could not find the "${n}" node in the graph.`);let t=0,r=0;return this.type!=="directed"&&(t+=e.undirectedDegree,r+=e.undirectedLoops*2),this.type!=="undirected"&&(t+=e.inDegree,r+=e.directedLoops),t-r}outboundDegreeWithoutSelfLoops(n){n=""+n;let e=this._nodes.get(n);if(!e)throw new H(`Graph.outboundDegreeWithoutSelfLoops: could not find the "${n}" node in the graph.`);let t=0,r=0;return this.type!=="directed"&&(t+=e.undirectedDegree,r+=e.undirectedLoops*2),this.type!=="undirected"&&(t+=e.outDegree,r+=e.directedLoops),t-r}degreeWithoutSelfLoops(n){n=""+n;let e=this._nodes.get(n);if(!e)throw new H(`Graph.degreeWithoutSelfLoops: could not find the "${n}" node in the graph.`);let t=0,r=0;return this.type!=="directed"&&(t+=e.undirectedDegree,r+=e.undirectedLoops*2),this.type!=="undirected"&&(t+=e.inDegree+e.outDegree,r+=e.directedLoops*2),t-r}source(n){n=""+n;let e=this._edges.get(n);if(!e)throw new H(`Graph.source: could not find the "${n}" edge in the graph.`);return e.source.key}target(n){n=""+n;let e=this._edges.get(n);if(!e)throw new H(`Graph.target: could not find the "${n}" edge in the graph.`);return e.target.key}extremities(n){n=""+n;let e=this._edges.get(n);if(!e)throw new H(`Graph.extremities: could not find the "${n}" edge in the graph.`);return[e.source.key,e.target.key]}opposite(n,e){n=""+n,e=""+e;let t=this._edges.get(e);if(!t)throw new H(`Graph.opposite: could not find the "${e}" edge in the graph.`);let r=t.source.key,i=t.target.key;if(n===r)return i;if(n===i)return r;throw new H(`Graph.opposite: the "${n}" node is not attached to the "${e}" edge (${r}, ${i}).`)}hasExtremity(n,e){n=""+n,e=""+e;let t=this._edges.get(n);if(!t)throw new H(`Graph.hasExtremity: could not find the "${n}" edge in the graph.`);return t.source.key===e||t.target.key===e}isUndirected(n){n=""+n;let e=this._edges.get(n);if(!e)throw new H(`Graph.isUndirected: could not find the "${n}" edge in the graph.`);return e.undirected}isDirected(n){n=""+n;let e=this._edges.get(n);if(!e)throw new H(`Graph.isDirected: could not find the "${n}" edge in the graph.`);return!e.undirected}isSelfLoop(n){n=""+n;let e=this._edges.get(n);if(!e)throw new H(`Graph.isSelfLoop: could not find the "${n}" edge in the graph.`);return e.source===e.target}addNode(n,e){return Bl(this,n,e).key}mergeNode(n,e){if(e&&!Ee(e))throw new j(`Graph.mergeNode: invalid attributes. Expecting an object but got "${e}"`);n=""+n,e=e||{};let t=this._nodes.get(n);return t?(e&&(be(t.attributes,e),this.emit("nodeAttributesUpdated",{type:"merge",key:n,attributes:t.attributes,data:e})),[n,!1]):(t=new this.NodeDataClass(n,e),this._nodes.set(n,t),this.emit("nodeAdded",{key:n,attributes:e}),[n,!0])}updateNode(n,e){if(e&&typeof e!="function")throw new j(`Graph.updateNode: invalid updater function. Expecting a function but got "${e}"`);n=""+n;let t=this._nodes.get(n);if(t){if(e){let i=t.attributes;t.attributes=e(i),this.emit("nodeAttributesUpdated",{type:"replace",key:n,attributes:t.attributes})}return[n,!1]}let r=e?e({}):{};return t=new this.NodeDataClass(n,r),this._nodes.set(n,t),this.emit("nodeAdded",{key:n,attributes:r}),[n,!0]}dropNode(n){n=""+n;let e=this._nodes.get(n);if(!e)throw new H(`Graph.dropNode: could not find the "${n}" node in the graph.`);let t;if(this.type!=="undirected"){for(let r in e.out){t=e.out[r];do zt(this,t),t=t.next;while(t)}for(let r in e.in){t=e.in[r];do zt(this,t),t=t.next;while(t)}}if(this.type!=="directed")for(let r in e.undirected){t=e.undirected[r];do zt(this,t),t=t.next;while(t)}this._nodes.delete(n),this.emit("nodeDropped",{key:n,attributes:e.attributes})}dropEdge(n){let e;if(arguments.length>1){let t=""+arguments[0],r=""+arguments[1];if(e=Ge(this,t,r,this.type),!e)throw new H(`Graph.dropEdge: could not find the "${t}" -> "${r}" edge in the graph.`)}else if(n=""+n,e=this._edges.get(n),!e)throw new H(`Graph.dropEdge: could not find the "${n}" edge in the graph.`);return zt(this,e),this}dropDirectedEdge(n,e){if(arguments.length<2)throw new Z("Graph.dropDirectedEdge: it does not make sense to try and drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead.");if(this.multi)throw new Z("Graph.dropDirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones.");n=""+n,e=""+e;let t=Ge(this,n,e,"directed");if(!t)throw new H(`Graph.dropDirectedEdge: could not find a "${n}" -> "${e}" edge in the graph.`);return zt(this,t),this}dropUndirectedEdge(n,e){if(arguments.length<2)throw new Z("Graph.dropUndirectedEdge: it does not make sense to drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead.");if(this.multi)throw new Z("Graph.dropUndirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones.");let t=Ge(this,n,e,"undirected");if(!t)throw new H(`Graph.dropUndirectedEdge: could not find a "${n}" -> "${e}" edge in the graph.`);return zt(this,t),this}clear(){this._edges.clear(),this._nodes.clear(),this._resetInstanceCounters(),this.emit("cleared")}clearEdges(){let n=this._nodes.values(),e;for(;e=n.next(),e.done!==!0;)e.value.clear();this._edges.clear(),this._resetInstanceCounters(),this.emit("edgesCleared")}getAttribute(n){return this._attributes[n]}getAttributes(){return this._attributes}hasAttribute(n){return this._attributes.hasOwnProperty(n)}setAttribute(n,e){return this._attributes[n]=e,this.emit("attributesUpdated",{type:"set",attributes:this._attributes,name:n}),this}updateAttribute(n,e){if(typeof e!="function")throw new j("Graph.updateAttribute: updater should be a function.");let t=this._attributes[n];return this._attributes[n]=e(t),this.emit("attributesUpdated",{type:"set",attributes:this._attributes,name:n}),this}removeAttribute(n){return delete this._attributes[n],this.emit("attributesUpdated",{type:"remove",attributes:this._attributes,name:n}),this}replaceAttributes(n){if(!Ee(n))throw new j("Graph.replaceAttributes: provided attributes are not a plain object.");return this._attributes=n,this.emit("attributesUpdated",{type:"replace",attributes:this._attributes}),this}mergeAttributes(n){if(!Ee(n))throw new j("Graph.mergeAttributes: provided attributes are not a plain object.");return be(this._attributes,n),this.emit("attributesUpdated",{type:"merge",attributes:this._attributes,data:n}),this}updateAttributes(n){if(typeof n!="function")throw new j("Graph.updateAttributes: provided updater is not a function.");return this._attributes=n(this._attributes),this.emit("attributesUpdated",{type:"update",attributes:this._attributes}),this}updateEachNodeAttributes(n,e){if(typeof n!="function")throw new j("Graph.updateEachNodeAttributes: expecting an updater function.");if(e&&!Nr(e))throw new j("Graph.updateEachNodeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}");let t=this._nodes.values(),r,i;for(;r=t.next(),r.done!==!0;)i=r.value,i.attributes=n(i.key,i.attributes);this.emit("eachNodeAttributesUpdated",{hints:e||null})}updateEachEdgeAttributes(n,e){if(typeof n!="function")throw new j("Graph.updateEachEdgeAttributes: expecting an updater function.");if(e&&!Nr(e))throw new j("Graph.updateEachEdgeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}");let t=this._edges.values(),r,i,o,s;for(;r=t.next(),r.done!==!0;)i=r.value,o=i.source,s=i.target,i.attributes=n(i.key,i.attributes,o.key,s.key,o.attributes,s.attributes,i.undirected);this.emit("eachEdgeAttributesUpdated",{hints:e||null})}forEachAdjacencyEntry(n){if(typeof n!="function")throw new j("Graph.forEachAdjacencyEntry: expecting a callback.");Wn(!1,!1,!1,this,n)}forEachAdjacencyEntryWithOrphans(n){if(typeof n!="function")throw new j("Graph.forEachAdjacencyEntryWithOrphans: expecting a callback.");Wn(!1,!1,!0,this,n)}forEachAssymetricAdjacencyEntry(n){if(typeof n!="function")throw new j("Graph.forEachAssymetricAdjacencyEntry: expecting a callback.");Wn(!1,!0,!1,this,n)}forEachAssymetricAdjacencyEntryWithOrphans(n){if(typeof n!="function")throw new j("Graph.forEachAssymetricAdjacencyEntryWithOrphans: expecting a callback.");Wn(!1,!0,!0,this,n)}nodes(){return Array.from(this._nodes.keys())}forEachNode(n){if(typeof n!="function")throw new j("Graph.forEachNode: expecting a callback.");let e=this._nodes.values(),t,r;for(;t=e.next(),t.done!==!0;)r=t.value,n(r.key,r.attributes)}findNode(n){if(typeof n!="function")throw new j("Graph.findNode: expecting a callback.");let e=this._nodes.values(),t,r;for(;t=e.next(),t.done!==!0;)if(r=t.value,n(r.key,r.attributes))return r.key}mapNodes(n){if(typeof n!="function")throw new j("Graph.mapNode: expecting a callback.");let e=this._nodes.values(),t,r,i=new Array(this.order),o=0;for(;t=e.next(),t.done!==!0;)r=t.value,i[o++]=n(r.key,r.attributes);return i}someNode(n){if(typeof n!="function")throw new j("Graph.someNode: expecting a callback.");let e=this._nodes.values(),t,r;for(;t=e.next(),t.done!==!0;)if(r=t.value,n(r.key,r.attributes))return!0;return!1}everyNode(n){if(typeof n!="function")throw new j("Graph.everyNode: expecting a callback.");let e=this._nodes.values(),t,r;for(;t=e.next(),t.done!==!0;)if(r=t.value,!n(r.key,r.attributes))return!1;return!0}filterNodes(n){if(typeof n!="function")throw new j("Graph.filterNodes: expecting a callback.");let e=this._nodes.values(),t,r,i=[];for(;t=e.next(),t.done!==!0;)r=t.value,n(r.key,r.attributes)&&i.push(r.key);return i}reduceNodes(n,e){if(typeof n!="function")throw new j("Graph.reduceNodes: expecting a callback.");if(arguments.length<2)throw new j("Graph.reduceNodes: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.");let t=e,r=this._nodes.values(),i,o;for(;i=r.next(),i.done!==!0;)o=i.value,t=n(t,o.key,o.attributes);return t}nodeEntries(){let n=this._nodes.values();return{[Symbol.iterator](){return this},next(){let e=n.next();if(e.done)return e;let t=e.value;return{value:{node:t.key,attributes:t.attributes},done:!1}}}}export(){let n=new Array(this._nodes.size),e=0;this._nodes.forEach((r,i)=>{n[e++]=kl(i,r)});let t=new Array(this._edges.size);return e=0,this._edges.forEach((r,i)=>{t[e++]=Pl(this.type,i,r)}),{options:{type:this.type,multi:this.multi,allowSelfLoops:this.allowSelfLoops},attributes:this.getAttributes(),nodes:n,edges:t}}import(n,e=!1){if(n instanceof a)return n.forEachNode((l,u)=>{e?this.mergeNode(l,u):this.addNode(l,u)}),n.forEachEdge((l,u,d,h,c,f,g)=>{e?g?this.mergeUndirectedEdgeWithKey(l,d,h,u):this.mergeDirectedEdgeWithKey(l,d,h,u):g?this.addUndirectedEdgeWithKey(l,d,h,u):this.addDirectedEdgeWithKey(l,d,h,u)}),this;if(!Ee(n))throw new j("Graph.import: invalid argument. Expecting a serialized graph or, alternatively, a Graph instance.");if(n.attributes){if(!Ee(n.attributes))throw new j("Graph.import: invalid attributes. Expecting a plain object.");e?this.mergeAttributes(n.attributes):this.replaceAttributes(n.attributes)}let t,r,i,o,s;if(n.nodes){if(i=n.nodes,!Array.isArray(i))throw new j("Graph.import: invalid nodes. Expecting an array.");for(t=0,r=i.length;t<r;t++){o=i[t],Fl(o);let{key:l,attributes:u}=o;e?this.mergeNode(l,u):this.addNode(l,u)}}if(n.edges){let l=!1;if(this.type==="undirected"&&(l=!0),i=n.edges,!Array.isArray(i))throw new j("Graph.import: invalid edges. Expecting an array.");for(t=0,r=i.length;t<r;t++){s=i[t],Il(s);let{source:u,target:d,attributes:h,undirected:c=l}=s,f;"key"in s?(f=e?c?this.mergeUndirectedEdgeWithKey:this.mergeDirectedEdgeWithKey:c?this.addUndirectedEdgeWithKey:this.addDirectedEdgeWithKey,f.call(this,s.key,u,d,h)):(f=e?c?this.mergeUndirectedEdge:this.mergeDirectedEdge:c?this.addUndirectedEdge:this.addDirectedEdge,f.call(this,u,d,h))}}return this}nullCopy(n){let e=new a(be({},this._options,n));return e.replaceAttributes(be({},this.getAttributes())),e}emptyCopy(n){let e=this.nullCopy(n);return this._nodes.forEach((t,r)=>{let i=be({},t.attributes);t=new e.NodeDataClass(r,i),e._nodes.set(r,t)}),e}copy(n){if(n=n||{},typeof n.type=="string"&&n.type!==this.type&&n.type!=="mixed")throw new Z(`Graph.copy: cannot create an incompatible copy from "${this.type}" type to "${n.type}" because this would mean losing information about the current graph.`);if(typeof n.multi=="boolean"&&n.multi!==this.multi&&n.multi!==!0)throw new Z("Graph.copy: cannot create an incompatible copy by downgrading a multi graph to a simple one because this would mean losing information about the current graph.");if(typeof n.allowSelfLoops=="boolean"&&n.allowSelfLoops!==this.allowSelfLoops&&n.allowSelfLoops!==!0)throw new Z("Graph.copy: cannot create an incompatible copy from a graph allowing self loops to one that does not because this would mean losing information about the current graph.");let e=this.emptyCopy(n),t=this._edges.values(),r,i;for(;r=t.next(),r.done!==!0;)i=r.value,Yr(e,"copy",!1,i.undirected,i.key,i.source.key,i.target.key,be({},i.attributes));return e}toJSON(){return this.export()}toString(){return"[object Graph]"}inspect(){let n={};this._nodes.forEach((i,o)=>{n[o]=i.attributes});let e={},t={};this._edges.forEach((i,o)=>{let s=i.undirected?"--":"->",l="",u=i.source.key,d=i.target.key,h;i.undirected&&u>d&&(h=u,u=d,d=h);let c=`(${u})${s}(${d})`;o.startsWith("geid_")?this.multi&&(typeof t[c]=="undefined"?t[c]=0:t[c]++,l+=`${t[c]}. `):l+=`[${o}]: `,l+=c,e[l]=i.attributes});let r={};for(let i in this)this.hasOwnProperty(i)&&!Wr.has(i)&&typeof this[i]!="function"&&typeof i!="symbol"&&(r[i]=this[i]);return r.attributes=this._attributes,r.nodes=n,r.edges=e,Ie(r,"constructor",this.constructor),r}};typeof Symbol!="undefined"&&(de.prototype[Symbol.for("nodejs.util.inspect.custom")]=de.prototype.inspect);Nl.forEach(a=>{["add","merge","update"].forEach(n=>{let e=a.name(n),t=n==="add"?Yr:Ml;a.generateKey?de.prototype[e]=function(r,i,o){return t(this,e,!0,(a.type||this.type)==="undirected",null,r,i,o,n==="update")}:de.prototype[e]=function(r,i,o,s){return t(this,e,!1,(a.type||this.type)==="undirected",r,i,o,s,n==="update")}})});Ys(de);ol(de);Tl(de);Cl(de);var Bn=class extends de{constructor(n){let e=be({type:"directed"},n);if("multi"in e&&e.multi!==!1)throw new j("DirectedGraph.from: inconsistent indication that the graph should be multi in given options!");if(e.type!=="directed")throw new j('DirectedGraph.from: inconsistent "'+e.type+'" type in given options!');super(e)}},Mn=class extends de{constructor(n){let e=be({type:"undirected"},n);if("multi"in e&&e.multi!==!1)throw new j("UndirectedGraph.from: inconsistent indication that the graph should be multi in given options!");if(e.type!=="undirected")throw new j('UndirectedGraph.from: inconsistent "'+e.type+'" type in given options!');super(e)}},Un=class extends de{constructor(n){let e=be({multi:!0},n);if("multi"in e&&e.multi!==!0)throw new j("MultiGraph.from: inconsistent indication that the graph should be simple in given options!");super(e)}},On=class extends de{constructor(n){let e=be({type:"directed",multi:!0},n);if("multi"in e&&e.multi!==!0)throw new j("MultiDirectedGraph.from: inconsistent indication that the graph should be simple in given options!");if(e.type!=="directed")throw new j('MultiDirectedGraph.from: inconsistent "'+e.type+'" type in given options!');super(e)}},Hn=class extends de{constructor(n){let e=be({type:"undirected",multi:!0},n);if("multi"in e&&e.multi!==!0)throw new j("MultiUndirectedGraph.from: inconsistent indication that the graph should be simple in given options!");if(e.type!=="undirected")throw new j('MultiUndirectedGraph.from: inconsistent "'+e.type+'" type in given options!');super(e)}};function Bt(a){a.from=function(n,e){let t=be({},n.options,e),r=new a(t);return r.import(n),r}}Bt(de);Bt(Bn);Bt(Mn);Bt(Un);Bt(On);Bt(Hn);de.Graph=de;de.DirectedGraph=Bn;de.UndirectedGraph=Mn;de.MultiGraph=Un;de.MultiDirectedGraph=On;de.MultiUndirectedGraph=Hn;de.InvalidArgumentsGraphError=j;de.NotFoundGraphError=H;de.UsageGraphError=Z;function qn(a,n){(n==null||n>a.length)&&(n=a.length);for(var e=0,t=Array(n);e<n;e++)t[e]=a[e];return t}function Xn(a,n){if(a){if(typeof a=="string")return qn(a,n);var e={}.toString.call(a).slice(8,-1);return e==="Object"&&a.constructor&&(e=a.constructor.name),e==="Map"||e==="Set"?Array.from(a):e==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?qn(a,n):void 0}}function Ul(a){if(Array.isArray(a))return a}function Ol(a,n){var e=a==null?null:typeof Symbol!="undefined"&&a[Symbol.iterator]||a["@@iterator"];if(e!=null){var t,r,i,o,s=[],l=!0,u=!1;try{if(i=(e=e.call(a)).next,n===0){if(Object(e)!==e)return;l=!1}else for(;!(l=(t=i.call(e)).done)&&(s.push(t.value),s.length!==n);l=!0);}catch(d){u=!0,r=d}finally{try{if(!l&&e.return!=null&&(o=e.return(),Object(o)!==o))return}finally{if(u)throw r}}return s}}function Hl(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function ne(a,n){return Ul(a)||Ol(a,n)||Xn(a,n)||Hl()}function U(a,n){var e=typeof Symbol!="undefined"&&a[Symbol.iterator]||a["@@iterator"];if(!e){if(Array.isArray(a)||(e=Xn(a))||n&&a&&typeof a.length=="number"){e&&(a=e);var t=0,r=function(){};return{s:r,n:function(){return t>=a.length?{done:!0}:{done:!1,value:a[t++]}},e:function(l){throw l},f:r}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var i,o=!0,s=!1;return{s:function(){e=e.call(a)},n:function(){var l=e.next();return o=l.done,l},e:function(l){s=!0,i=l},f:function(){try{o||e.return==null||e.return()}finally{if(s)throw i}}}}function ze(){return Float32Array.of(1,0,0,0,1,0,0,0,1)}function Vn(a,n,e){return a[0]=n,a[4]=typeof e=="number"?e:n,a}function Kr(a,n){var e=Math.sin(n),t=Math.cos(n);return a[0]=t,a[1]=e,a[3]=-e,a[4]=t,a}function Zr(a,n,e){return a[6]=n,a[7]=e,a}function ot(a,n){var e=a[0],t=a[1],r=a[2],i=a[3],o=a[4],s=a[5],l=a[6],u=a[7],d=a[8],h=n[0],c=n[1],f=n[2],g=n[3],y=n[4],m=n[5],v=n[6],p=n[7],b=n[8];return a[0]=h*e+c*i+f*l,a[1]=h*t+c*o+f*u,a[2]=h*r+c*s+f*d,a[3]=g*e+y*i+m*l,a[4]=g*t+y*o+m*u,a[5]=g*r+y*s+m*d,a[6]=v*e+p*i+b*l,a[7]=v*t+p*o+b*u,a[8]=v*r+p*s+b*d,a}function za(a,n){var e=Math.cos(n),t=Math.sin(n);return{x:e*a.x+t*a.y,y:-t*a.x+e*a.y}}function Ut(a,n){var e=arguments.length>2&&arguments[2]!==void 0?arguments[2]:1,t=a[0],r=a[1],i=a[3],o=a[4],s=a[6],l=a[7],u=n.x,d=n.y;return{x:u*t+d*i+s*e,y:u*r+d*o+l*e}}function $l(a,n){var e=a.height/a.width,t=n.height/n.width;return e<1&&t>1||e>1&&t<1?1:Math.min(Math.max(t,1/t),Math.max(1/e,e))}function st(a,n,e,t,r){var i=a.angle,o=a.ratio,s=a.x,l=a.y,u=n.width,d=n.height,h=ze(),c=Math.min(u,d)-2*t,f=$l(n,e);return r?(ot(h,Zr(ze(),s,l)),ot(h,Vn(ze(),o)),ot(h,Kr(ze(),i)),ot(h,Vn(ze(),u/c/2/f,d/c/2/f))):(ot(h,Vn(ze(),2*(c/u)*f,2*(c/d)*f)),ot(h,Kr(ze(),-i)),ot(h,Vn(ze(),1/o)),ot(h,Zr(ze(),-s,-l))),h}function Qr(a,n,e){var t=Ut(a,{x:Math.cos(n.angle),y:Math.sin(n.angle)},0),r=t.x,i=t.y;return 1/Math.sqrt(Math.pow(r,2)+Math.pow(i,2))/e.width}function Na(a,n,e,t,r){var i=Math.floor(n/r*t),o=Math.floor(a.drawingBufferHeight/r-e/r*t);return[i,o]}var cn={black:"#000000",silver:"#C0C0C0",gray:"#808080",grey:"#808080",white:"#FFFFFF",maroon:"#800000",red:"#FF0000",purple:"#800080",fuchsia:"#FF00FF",green:"#008000",lime:"#00FF00",olive:"#808000",yellow:"#FFFF00",navy:"#000080",blue:"#0000FF",teal:"#008080",aqua:"#00FFFF",darkblue:"#00008B",mediumblue:"#0000CD",darkgreen:"#006400",darkcyan:"#008B8B",deepskyblue:"#00BFFF",darkturquoise:"#00CED1",mediumspringgreen:"#00FA9A",springgreen:"#00FF7F",cyan:"#00FFFF",midnightblue:"#191970",dodgerblue:"#1E90FF",lightseagreen:"#20B2AA",forestgreen:"#228B22",seagreen:"#2E8B57",darkslategray:"#2F4F4F",darkslategrey:"#2F4F4F",limegreen:"#32CD32",mediumseagreen:"#3CB371",turquoise:"#40E0D0",royalblue:"#4169E1",steelblue:"#4682B4",darkslateblue:"#483D8B",mediumturquoise:"#48D1CC",indigo:"#4B0082",darkolivegreen:"#556B2F",cadetblue:"#5F9EA0",cornflowerblue:"#6495ED",rebeccapurple:"#663399",mediumaquamarine:"#66CDAA",dimgray:"#696969",dimgrey:"#696969",slateblue:"#6A5ACD",olivedrab:"#6B8E23",slategray:"#708090",slategrey:"#708090",lightslategray:"#778899",lightslategrey:"#778899",mediumslateblue:"#7B68EE",lawngreen:"#7CFC00",chartreuse:"#7FFF00",aquamarine:"#7FFFD4",skyblue:"#87CEEB",lightskyblue:"#87CEFA",blueviolet:"#8A2BE2",darkred:"#8B0000",darkmagenta:"#8B008B",saddlebrown:"#8B4513",darkseagreen:"#8FBC8F",lightgreen:"#90EE90",mediumpurple:"#9370DB",darkviolet:"#9400D3",palegreen:"#98FB98",darkorchid:"#9932CC",yellowgreen:"#9ACD32",sienna:"#A0522D",brown:"#A52A2A",darkgray:"#A9A9A9",darkgrey:"#A9A9A9",lightblue:"#ADD8E6",greenyellow:"#ADFF2F",paleturquoise:"#AFEEEE",lightsteelblue:"#B0C4DE",powderblue:"#B0E0E6",firebrick:"#B22222",darkgoldenrod:"#B8860B",mediumorchid:"#BA55D3",rosybrown:"#BC8F8F",darkkhaki:"#BDB76B",mediumvioletred:"#C71585",indianred:"#CD5C5C",peru:"#CD853F",chocolate:"#D2691E",tan:"#D2B48C",lightgray:"#D3D3D3",lightgrey:"#D3D3D3",thistle:"#D8BFD8",orchid:"#DA70D6",goldenrod:"#DAA520",palevioletred:"#DB7093",crimson:"#DC143C",gainsboro:"#DCDCDC",plum:"#DDA0DD",burlywood:"#DEB887",lightcyan:"#E0FFFF",lavender:"#E6E6FA",darksalmon:"#E9967A",violet:"#EE82EE",palegoldenrod:"#EEE8AA",lightcoral:"#F08080",khaki:"#F0E68C",aliceblue:"#F0F8FF",honeydew:"#F0FFF0",azure:"#F0FFFF",sandybrown:"#F4A460",wheat:"#F5DEB3",beige:"#F5F5DC",whitesmoke:"#F5F5F5",mintcream:"#F5FFFA",ghostwhite:"#F8F8FF",salmon:"#FA8072",antiquewhite:"#FAEBD7",linen:"#FAF0E6",lightgoldenrodyellow:"#FAFAD2",oldlace:"#FDF5E6",magenta:"#FF00FF",deeppink:"#FF1493",orangered:"#FF4500",tomato:"#FF6347",hotpink:"#FF69B4",coral:"#FF7F50",darkorange:"#FF8C00",lightsalmon:"#FFA07A",orange:"#FFA500",lightpink:"#FFB6C1",pink:"#FFC0CB",gold:"#FFD700",peachpuff:"#FFDAB9",navajowhite:"#FFDEAD",moccasin:"#FFE4B5",bisque:"#FFE4C4",mistyrose:"#FFE4E1",blanchedalmond:"#FFEBCD",papayawhip:"#FFEFD5",lavenderblush:"#FFF0F5",seashell:"#FFF5EE",cornsilk:"#FFF8DC",lemonchiffon:"#FFFACD",floralwhite:"#FFFAF0",snow:"#FFFAFA",lightyellow:"#FFFFE0",ivory:"#FFFFF0"},Jr=new Int8Array(4),jn=new Int32Array(Jr.buffer,0,1),ei=new Float32Array(Jr.buffer,0,1),Vl=/^\s*rgba?\s*\(/,jl=/^\s*rgba?\s*\(\s*([0-9]*)\s*,\s*([0-9]*)\s*,\s*([0-9]*)(?:\s*,\s*(.*)?)?\)\s*$/;function Yn(a){var n=0,e=0,t=0,r=1,i=a.toLowerCase();if(i==="transparent")return{r:0,g:0,b:0,a:0};if(i in cn)return Yn(cn[i]);if(a[0]==="#")a.length===4?(n=parseInt(a.charAt(1)+a.charAt(1),16),e=parseInt(a.charAt(2)+a.charAt(2),16),t=parseInt(a.charAt(3)+a.charAt(3),16)):(n=parseInt(a.charAt(1)+a.charAt(2),16),e=parseInt(a.charAt(3)+a.charAt(4),16),t=parseInt(a.charAt(5)+a.charAt(6),16)),a.length===9&&(r=parseInt(a.charAt(7)+a.charAt(8),16)/255);else if(Vl.test(a)){var o=a.match(jl);o&&(n=+o[1],e=+o[2],t=+o[3],o[4]&&(r=+o[4]))}return{r:n,g:e,b:t,a:r}}function ti(a){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,e=Yn(a),t=e.r,r=e.g,i=e.b,o=e.a;return n?[t/255*o,r/255*o,i/255*o,o]:[t/255,r/255,i/255,o]}var Mt={};for(hn in cn)Mt[hn]=Ne(cn[hn]),Mt[cn[hn]]=Mt[hn];var hn;function ql(a,n,e,t,r){return jn[0]=t<<24|e<<16|n<<8|a,r&&(jn[0]=jn[0]&4278190079),ei[0]}function Ne(a){if(a=a.toLowerCase(),typeof Mt[a]!="undefined")return Mt[a];var n=Yn(a),e=n.r,t=n.g,r=n.b,i=n.a;i=i*255|0;var o=ql(e,t,r,i,!0);return Mt[a]=o,o}function lt(a,n){ei[0]=Ne(a);var e=jn[0];n&&(e=e|16777216);var t=e&255,r=e>>8&255,i=e>>16&255,o=e>>24&255;return[t,r,i,o]}function Ot(a){var n=a>>>8&255,e=a>>>16&255,t=a>>>24&255,r=a&255;return(r<<24|t<<16|e<<8|n)>>>0}function Wa(a,n,e,t){return(e<<24|n<<16|a<<8|t)>>>0}function ni(a,n,e,t,r,i){var o=Na(a,e,t,r,i),s=ne(o,2),l=s[0],u=s[1],d=new Uint8Array(4);a.bindFramebuffer(a.FRAMEBUFFER,n),a.readPixels(l,u,1,1,a.RGBA,a.UNSIGNED_BYTE,d);var h=ne(d,4),c=h[0],f=h[1],g=h[2],y=h[3];return[c,f,g,y]}function ai(a){var n=Yn(a),e=n.r,t=n.g,r=n.b,i=n.a,o=(e/255).toFixed(6),s=(t/255).toFixed(6),l=(r/255).toFixed(6),u=i.toFixed(6);return"vec4(".concat(o,", ").concat(s,", ").concat(l,", ").concat(u,")")}function Xl(a,n){if(typeof a!="object"||!a)return a;var e;if(typeof Symbol!="undefined"&&(e=a[Symbol.toPrimitive])!==void 0){var t=e.call(a,n||"default");if(typeof t!="object")return t;throw new TypeError("@@toPrimitive must return a primitive value.")}return(n==="string"?String:Number)(a)}function oi(a){var n=Xl(a,"string");return typeof n=="symbol"?n:n+""}function D(a,n,e){return(n=oi(n))in a?Object.defineProperty(a,n,{value:e,enumerable:!0,configurable:!0,writable:!0}):a[n]=e,a}function ri(a,n){var e=Object.keys(a);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(a);n&&(t=t.filter(function(r){return Object.getOwnPropertyDescriptor(a,r).enumerable})),e.push.apply(e,t)}return e}function O(a){for(var n=1;n<arguments.length;n++){var e=arguments[n]!=null?arguments[n]:{};n%2?ri(Object(e),!0).forEach(function(t){D(a,t,e[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(a,Object.getOwnPropertyDescriptors(e)):ri(Object(e)).forEach(function(t){Object.defineProperty(a,t,Object.getOwnPropertyDescriptor(e,t))})}return a}function J(a,n){if(!(a instanceof n))throw new TypeError("Cannot call a class as a function")}function ii(a,n){for(var e=0;e<n.length;e++){var t=n[e];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(a,oi(t.key),t)}}function ee(a,n,e){return n&&ii(a.prototype,n),e&&ii(a,e),Object.defineProperty(a,"prototype",{writable:!1}),a}function _t(a){return _t=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(n){return n.__proto__||Object.getPrototypeOf(n)},_t(a)}function si(){try{var a=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}))}catch{}return(si=function(){return!!a})()}function Yl(a){if(a===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function Kl(a,n){if(n&&(typeof n=="object"||typeof n=="function"))return n;if(n!==void 0)throw new TypeError("Derived constructors may only return object or undefined");return Yl(a)}function ce(a,n,e){return n=_t(n),Kl(a,si()?Reflect.construct(n,e||[],_t(a).constructor):n.apply(a,e))}function Ba(a,n){return Ba=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},Ba(a,n)}function fe(a,n){if(typeof n!="function"&&n!==null)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(n&&n.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),Object.defineProperty(a,"prototype",{writable:!1}),n&&Ba(a,n)}function Zl(a){if(Array.isArray(a))return qn(a)}function Ql(a){if(typeof Symbol!="undefined"&&a[Symbol.iterator]!=null||a["@@iterator"]!=null)return Array.from(a)}function Jl(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function K(a){return Zl(a)||Ql(a)||Xn(a)||Jl()}function te(a){"@babel/helpers - typeof";return te=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},te(a)}function tt(a){return te(a)==="object"&&a!==null&&"attribute"in a}function li(){var a=`
float sdf_circle(vec2 uv, float size) {
  return length(uv) - size;
}
`;return{name:"circle",glsl:a,uniforms:[]}}function ui(a){var n,e=WebGL2RenderingContext,t=e.UNSIGNED_BYTE,r=(n=a==null?void 0:a.color)!==null&&n!==void 0?n:{attribute:"color"};if(!tt(r)){var i=r,o=`
vec4 layer_fill() {
  return `.concat(ai(i),`;
}
`);return{name:"fill",uniforms:[],attributes:[],glsl:o}}var s=r.attribute,l=`
vec4 layer_fill(vec4 v_fillColor) {
  return v_fillColor;
}
`;return{name:"fill",uniforms:[],attributes:[{name:"fillColor",size:4,type:t,normalized:!0,source:s}],glsl:l}}function eu(a,n){if(typeof a=="string"){var e=ti(a).map(function(u){return u.toFixed(6)}),t=ne(e,4),r=t[0],i=t[1],o=t[2],s=t[3];return{glsl:"vec4(".concat(r,", ").concat(i,", ").concat(o,", ").concat(s,")"),attributes:[],needsNodeColors:!1}}if("node"in a&&a.node)return{glsl:a.node==="source"?"v_sourceColor":"v_targetColor",attributes:[],needsNodeColors:!0};var l=a;return{glsl:"v_".concat(n),attributes:[{name:"a_".concat(n),size:4,type:WebGL2RenderingContext.UNSIGNED_BYTE,normalized:!0,source:l.attribute,defaultValue:l.default}],needsNodeColors:!1}}function xt(a){var n=a==null?void 0:a.color;if(n===void 0){var e=`
// Plain solid color layer
vec4 layer_plain(EdgeContext ctx) {
  return v_color;
}
`;return{name:"plain",glsl:e,uniforms:[],attributes:[]}}var t=eu(n,"plainColor"),r=`
// Plain solid color layer
vec4 layer_plain(EdgeContext ctx) {
  return `.concat(t.glsl,`;
}
`);return{name:"plain",glsl:r,uniforms:[],attributes:t.attributes,needsNodeColors:t.needsNodeColors}}function di(){var a=`
// Position at parameter t \u2208 [0, 1]
vec2 path_straight_position(float t, vec2 source, vec2 target) {
  return mix(source, target, t);
}

// Total length of the path (analytical - more efficient than sampling)
float path_straight_length(vec2 source, vec2 target) {
  return length(target - source);
}
`;return{name:"straight",segments:1,minBodyLengthRatio:0,linearParameterization:!0,glsl:a,uniforms:[],attributes:[]}}function hi(a){var n=a!=null?a:{},e=n.segments,t=e===void 0?32:e,r=`
const float LOOP_PI = 3.141592653589793;

float loopWorldRadius() {
  float nodeWorldRadius = v_sourceNodeSize * u_correctionRatio / u_sizeRatio;
  return max(v_loopRadius * nodeWorldRadius, 0.001);
}

// Cubic B\xE9zier with P0 = P3 = source.
// Control points extend outward orthogonal to the node surface at exit/entry angles.
vec2 path_loop_position(float t, vec2 source, vec2 target) {
  float R = loopWorldRadius();
  float angle = v_loopAngle + (v_loopFixedOrientation > 0.5 ? u_cameraAngle : 0.0);
  float halfSpread = v_loopSpread * 0.5;

  float exitAngle = angle - halfSpread;
  float entryAngle = angle + halfSpread;

  // Control point distance: at t=0.5 the B\xE9zier reaches 0.75 * cpDist * cos(halfSpread)
  // from source. Solve for cpDist so the loop tip reaches exactly R.
  float cpDist = R / (0.75 * cos(halfSpread));

  vec2 cp1 = source + cpDist * vec2(cos(exitAngle), sin(exitAngle));
  vec2 cp2 = source + cpDist * vec2(cos(entryAngle), sin(entryAngle));

  float u = 1.0 - t;
  vec2 d1 = cp1 - source;
  vec2 d2 = cp2 - source;
  return source + 3.0 * t * u * (u * d1 + t * d2);
}

// Approximate arc length via chord sampling
float path_loop_length(vec2 source, vec2 target) {
  float len = 0.0;
  vec2 prev = path_loop_position(0.0, source, target);
  const int STEPS = 16;
  for (int i = 1; i <= STEPS; i++) {
    float t = float(i) / float(STEPS);
    vec2 cur = path_loop_position(t, source, target);
    len += length(cur - prev);
    prev = cur;
  }
  return len;
}
`;return{name:"loop",segments:t,glsl:r,needsNodeSize:!0,uniforms:[],attributes:[{name:"loopRadius",size:1,type:WebGL2RenderingContext.FLOAT},{name:"loopAngle",size:1,type:WebGL2RenderingContext.FLOAT},{name:"loopSpread",size:1,type:WebGL2RenderingContext.FLOAT},{name:"loopFixedOrientation",size:1,type:WebGL2RenderingContext.FLOAT}],variables:{loopRadius:{type:"number",default:4},loopAngle:{type:"number",default:Math.PI/4},loopSpread:{type:"number",default:80*Math.PI/180},loopFixedOrientation:{type:"number",default:0}},spread:{variable:"loopRadius",compute:function(o){return o+4}}}}var mi=Qe(sn());function ci(a){return te(a)==="object"&&"glsl"in a&&!("attributes"in a)}function fi(a){return te(a)==="object"&&"glsl"in a&&!("attributes"in a)}var fn={shapes:[li()],variables:{},layers:[ui()],label:{},backdrop:{},labelAttachments:{}},Ht={paths:[di(),hi()],extremities:[],variables:{},layers:[xt()],defaultHead:"none",defaultTail:"none",label:{}},Kn=["nodes","topNodes"],Zn=["edges","topEdges"],Qn=[].concat(Zn,Kn),gi={nodes:fn,edges:Ht,depthLayers:K(Qn)};var tu=function(n){return n},nu=function(n){return n*n},au=function(n){return n*(2-n)},ru=function(n){return(n*=2)<1?.5*n*n:-.5*(--n*(n-2)-1)},iu=function(n){return n*n*n},ou=function(n){return--n*n*n+1},su=function(n){return(n*=2)<1?.5*n*n*n:.5*((n-=2)*n*n+2)},lu=function(n){return n===0?0:Math.pow(2,10*(n-1))},uu=function(n){return n===1?1:1-Math.pow(2,-10*n)},du=function(n){return n===0?0:n===1?1:n<.5?Math.pow(2,10*(2*n-1))/2:(2-Math.pow(2,-10*(2*n-1)))/2},Ma={linear:tu,quadraticIn:nu,quadraticOut:au,quadraticInOut:ru,cubicIn:iu,cubicOut:ou,cubicInOut:su,exponentialIn:lu,exponentialOut:uu,exponentialInOut:du};function Jn(a){return a?typeof a=="function"?a:Ma[a]:Ma.linear}function Oa(a){return te(a)==="object"&&a!==null&&"attribute"in a}function yi(a){return typeof a=="function"}function bi(a){return te(a)==="object"&&a!==null&&"when"in a&&typeof a.when=="function"&&"then"in a}function _i(a){return te(a)==="object"&&a!==null&&"whenState"in a&&"then"in a}function xi(a){return te(a)==="object"&&a!==null&&"whenData"in a&&"then"in a}var hu={isHovered:!1,isLabelHovered:!1,isHidden:!1,isHighlighted:!1,isDragged:!1},cu={isHovered:!1,isLabelHovered:!1,isHidden:!1,isHighlighted:!1,parallelIndex:0,parallelCount:1},fu={isIdle:!0,isPanning:!1,isZooming:!1,isDragging:!1,hasHovered:!1,hasHighlighted:!1};function Ti(a){return O(O({},hu),a)}function Ei(a){return O(O({},cu),a)}function Ha(a){return O(O({},fu),a)}var gu={x:{attribute:"x"},y:{attribute:"y"},size:{whenState:"isHovered",then:{attribute:"size",defaultValue:12},else:{attribute:"size",defaultValue:10}},color:{attribute:"color",defaultValue:"#666"},label:{attribute:"label"},visibility:{whenState:"isHidden",then:"hidden",else:"visible"},labelVisibility:{whenState:"isHovered",then:"visible",else:"auto"},backdropVisibility:{whenState:"isHovered",then:"visible",else:"hidden"},backdropColor:"#ffffff",backdropShadowColor:"rgba(0, 0, 0, 0.5)",backdropShadowBlur:12,backdropPadding:6},vu={size:{attribute:"size",defaultValue:1},color:{attribute:"color",defaultValue:"#ccc"},label:{attribute:"label"},visibility:{whenState:"isHidden",then:"hidden",else:"visible"}};var ta={nodes:O(O({},gu),{},{depth:{whenState:"isHovered",then:"topNodes",else:"nodes"}}),edges:O(O({},vu),{},{depth:{whenState:["isHighlighted","isHovered"],then:"topEdges",else:"edges"}})};function pu(a){return"min"in a||"max"in a||"minValue"in a||"maxValue"in a||"easing"in a}function mu(a){return"dict"in a}function na(a,n){return typeof a=="string"?n[a]===!0:Array.isArray(a)?a.every(function(e){return n[e]===!0}):te(a)==="object"&&a!==null?Object.entries(a).every(function(e){var t=ne(e,2),r=t[0],i=t[1];return n[r]===i}):!1}function yu(a,n){var e=n[a.attribute];return e===void 0?a.defaultValue:e}function bu(a,n,e){var t,r,i,o,s=n[a.attribute];if(s===void 0)return a.defaultValue;var l=Number(s);if(isNaN(l))return a.defaultValue;if(a.min===void 0&&a.max===void 0)return l;var u=(t=a.minValue)!==null&&t!==void 0?t:l,d=(r=a.maxValue)!==null&&r!==void 0?r:l;if(d===u){var h;return(h=a.min)!==null&&h!==void 0?h:l}var c=(l-u)/(d-u);c=Math.max(0,Math.min(1,c));var f=Jn(a.easing);c=f(c);var g=(i=a.min)!==null&&i!==void 0?i:0,y=(o=a.max)!==null&&o!==void 0?o:1;return g+c*(y-g)}function _u(a,n){var e=n[a.attribute];if(e===void 0)return a.defaultValue;var t=String(e);return t in a.dict?a.dict[t]:a.defaultValue}function xu(a,n,e){return mu(a)?_u(a,n):pu(a)?bu(a,n):yu(a,n)}function Si(a,n){return typeof a=="string"?!!n[a]:Array.isArray(a)?a.every(function(e){return!!n[e]}):te(a)==="object"&&a!==null?Object.entries(a).every(function(e){var t=ne(e,2),r=t[0],i=t[1];return n[r]===i}):!1}function ea(a,n,e,t,r,i){if(a==null)return i;if(te(a)!=="object"&&typeof a!="function")return a;if(bi(a)){var o=a.when(n,e,t,r)?a.then:a.else;return o===void 0?i:ea(o,n,e,t,r,i)}if(_i(a)){var s=na(a.whenState,e)?a.then:a.else;return s===void 0?i:ea(s,n,e,t,r,i)}if(xi(a)){var l=Si(a.whenData,n)?a.then:a.else;return l===void 0?i:ea(l,n,e,t,r,i)}if(yi(a)){var u=a(n,e,t,r);return u!=null?u:i}if(Oa(a)){var d=xu(a,n);return d!=null?d:i}return a}function $e(a){if(a==null)return"static";if(bi(a))return"graph-state";if(_i(a)){var n=$e(a.then),e=a.else!==void 0?$e(a.else):"static";return We("item-state",We(n,e))}if(xi(a)){var t=$e(a.then),r=a.else!==void 0?$e(a.else):"static";return We(t,r)}return yi(a)?"graph-state":(Oa(a),"static")}function We(a,n){return a==="graph-state"||n==="graph-state"?"graph-state":a==="item-state"||n==="item-state"?"item-state":"static"}function $a(a){if(!a)return{dependency:"static",xAttribute:null,yAttribute:null};var n=Array.isArray(a)?a:[a],e="static",t=null,r=null,i=U(n),o;try{for(i.s();!(o=i.n()).done;){var s=o.value;if("matchData"in s&&"cases"in s)for(var l=s.cases,u=0,d=Object.values(l);u<d.length;u++)for(var h=d[u],c=0,f=Object.values(h);c<f.length;c++){var g=f[c];e=We(e,$e(g))}else if("matchState"in s&&"cases"in s){e=We(e,"item-state");for(var y=s.cases,m=0,v=Object.values(y);m<v.length;m++)for(var p=v[m],b=0,T=Object.values(p);b<T.length;b++){var _=T[b];e=We(e,$e(_))}}else if("when"in s&&"then"in s)e="graph-state";else if("whenState"in s){e=We(e,"item-state");var E=s.then;if(E&&te(E)==="object")for(var w=0,A=Object.values(E);w<A.length;w++){var S=A[w];e=We(e,$e(S))}var k=s.else;if(k&&te(k)==="object")for(var z=0,C=Object.values(k);z<C.length;z++){var N=C[z];e=We(e,$e(N))}}else if("whenData"in s){var L=s.then;if(L&&te(L)==="object")for(var G=0,M=Object.values(L);G<M.length;G++){var F=M[G];e=We(e,$e(F))}var x=s.else;if(x&&te(x)==="object")for(var P=0,B=Object.values(x);P<B.length;P++){var I=B[P];e=We(e,$e(I))}}else for(var R=0,V=Object.entries(s);R<V.length;R++){var $=ne(V[R],2),Y=$[0],xe=$[1];if(!ja.has(Y)&&(e=We(e,$e(xe)),(Y==="x"||Y==="y")&&Oa(xe))){var se=xe.attribute;Y==="x"&&!t&&(t=se),Y==="y"&&!r&&(r=se)}}}}catch(X){i.e(X)}finally{i.f()}return{dependency:e,xAttribute:t,yAttribute:r}}var nt={size:10,color:"#666",opacity:1,shape:"circle",rotationAlignment:"viewport",labelRotationAlignment:"viewport",visibility:"visible",depth:"nodes",zIndex:0,label:"",labelColor:"#000",labelSize:12,labelFont:"sans-serif",labelVisibility:"auto",labelPosition:"right",labelAngle:0,labelDepth:"nodes",backdropVisibility:"hidden",backdropColor:"transparent",backdropShadowColor:"transparent",backdropShadowBlur:0,backdropPadding:0,backdropBorderColor:"transparent",backdropBorderWidth:0,backdropCornerRadius:0,backdropLabelPadding:-1,backdropArea:"both",labelAttachment:null,labelAttachmentPlacement:"below"},Va={size:1,color:"#ccc",opacity:1,path:"straight",selfLoopPath:"loop",parallelSpread:.25,tail:"none",head:"none",visibility:"visible",depth:"edges",zIndex:0,label:"",labelColor:"#666",labelVisibility:"auto",labelDepth:"edges"},ja=new Set(["when","whenState","whenData","then","else"]),vi=Object.keys(nt),Tu=Object.values(nt),pi=Object.keys(Va),Eu=Object.values(Va);function $t(a,n,e,t,r,i,o){for(var s in n){var l;if(!ja.has(s)){var u=(l=a[s])!==null&&l!==void 0?l:o[s];a[s]=ea(n[s],e,t,r,i,u)}}"depth"in n&&!("labelDepth"in n)&&(a.labelDepth=a.depth)}function Ai(a,n,e,t,r,i,o){var s=U(n),l;try{for(s.s();!(l=s.n()).done;){var u=l.value;if("matchData"in u&&"cases"in u){var d,h=String((d=e[u.matchData])!==null&&d!==void 0?d:""),c=u.cases;h in c&&$t(a,c[h],e,t,r,i,o)}else if("matchState"in u&&"cases"in u){var f,g=String((f=t[u.matchState])!==null&&f!==void 0?f:""),y=u.cases;g in y&&$t(a,y[g],e,t,r,i,o)}else if("when"in u&&"then"in u){var m=u.when;if(!m(e,t,r,i))continue;$t(a,u.then,e,t,r,i,o)}else if("whenState"in u&&"then"in u){if(!na(u.whenState,t))continue;$t(a,u.then,e,t,r,i,o)}else if("whenData"in u&&"then"in u){if(!Si(u.whenData,e))continue;$t(a,u.then,e,t,r,i,o)}else $t(a,u,e,t,r,i,o)}}catch(v){s.e(v)}finally{s.f()}}function qa(a,n,e,t,r,i){for(var o=i||{},s=o,l=0,u=vi.length;l<u;l++)s[vi[l]]=Tu[l];if(s.x=void 0,s.y=void 0,s.labelBackgroundColor=void 0,s.labelBackgroundPadding=void 0,s.labelCursor=void 0,!a){var d,h,c,f,g;return s.x=(d=n.x)!==null&&d!==void 0?d:0,s.y=(h=n.y)!==null&&h!==void 0?h:0,o.size=(c=n.size)!==null&&c!==void 0?c:10,o.color=(f=n.color)!==null&&f!==void 0?f:"#666",o.label=(g=n.label)!==null&&g!==void 0?g:"",o}var y=Array.isArray(a)?a:[a];return Ai(s,y,n,e,t,r,nt),o}function Xa(a,n,e,t,r,i){for(var o=i||{},s=o,l=0,u=pi.length;l<u;l++)s[pi[l]]=Eu[l];if(!a){var d,h,c;return o.size=(d=n.size)!==null&&d!==void 0?d:1,o.color=(h=n.color)!==null&&h!==void 0?h:"#ccc",o.label=(c=n.label)!==null&&c!==void 0?c:"",o}var f=Array.isArray(a)?a:[a];return Ai(s,f,n,e,t,r,Va),typeof s.labelPosition=="number"&&(s.labelPosition=void 0),o}function Su(a,n,e){var t,r;if(a==null)return e;if(typeof a=="function")return(t=a(n))!==null&&t!==void 0?t:e;if(te(a)==="object"&&"when"in a){var i,o=a,s=o.when(n),l=s?o.then:o.else;return l===void 0?e:typeof l=="function"?(i=l(n))!==null&&i!==void 0?i:e:l!=null?l:e}if(te(a)==="object"&&"whenState"in a){var u,d=a,h=na(d.whenState,n),c=h?d.then:d.else;return c===void 0?e:typeof c=="function"?(u=c(n))!==null&&u!==void 0?u:e:c!=null?c:e}return(r=a)!==null&&r!==void 0?r:e}function Ya(a,n){var e={};if(!a)return e;var t=Array.isArray(a)?a:[a],r=U(t),i;try{for(r.s();!(i=r.n()).done;){var o=i.value;if("when"in o&&"then"in o){var s=o.when(n),l=s?o.then:o.else;l&&te(l)==="object"&&Ua(e,l,n)}else if("whenState"in o&&"then"in o){var u=na(o.whenState,n),d=u?o.then:o.else;d&&te(d)==="object"&&Ua(e,d,n)}else Ua(e,o,n)}}catch(h){r.e(h)}finally{r.f()}return e}function Ua(a,n,e){for(var t=0,r=Object.entries(n);t<r.length;t++){var i=ne(r[t],2),o=i[0],s=i[1];ja.has(o)||(a[o]=Su(s,e))}}var aa=(function(a){function n(){var e;return J(this,n),e=ce(this,n),e.rawEmitter=e,e}return fe(n,a),ee(n)})(mi.EventEmitter);var wi=gi;function Ka(a,n){var e=n.size;if(e!==0){var t=a.length;a.length+=e;var r=0;n.forEach(function(i){a[t+r]=i,r++})}}function Di(a){a=a||{};for(var n=0,e=arguments.length<=1?0:arguments.length-1;n<e;n++){var t=n+1<1||arguments.length<=n+1?void 0:arguments[n+1];t&&Object.assign(a,t)}return a}function Vt(a,n){for(var e in n)if(Object.prototype.hasOwnProperty.call(n,e)&&n[e]!==a[e])return!0;return!1}function Ri(a,n){var e=a,t=n;for(var r in e)if(Object.prototype.hasOwnProperty.call(e,r)&&e[r]!==t[r])return!1;for(var i in t)if(Object.prototype.hasOwnProperty.call(t,i)&&t[i]!==e[i])return!1;return!0}function Tt(a,n,e){e?a.add(n):a.delete(n)}var Ci=Qe(jt());var ki={easing:"quadraticInOut",duration:150};function ut(a){return a.labelVisibility==="visible"&&a.visibility!=="hidden"}function Za(a){return a.backdropVisibility==="visible"&&a.visibility!=="hidden"}function ra(a){return[a.rotationAlignment==="graph"?1:0,a.labelRotationAlignment==="graph"?1:0]}function Qa(a,n,e){var t=a[n];if(t)for(var r=0;r<t.length;r++){var i=t[r];if(!(e<i.offset||e>=i.offset+i.count)){if(i.count===1)t.splice(r,1);else if(e===i.offset)i.offset++,i.count--;else if(e===i.offset+i.count-1)i.count--;else{var o=e+1,s=i.offset+i.count-o;i.count=e-i.offset,t.splice(r+1,0,{offset:o,count:s})}return}}}function Ja(a,n,e){if(!a[n]){a[n]=[{offset:e,count:1}];return}for(var t=a[n],r=t.length,i=0;i<t.length;i++)if(e<t[i].offset){r=i;break}var o=r>0?t[r-1]:null,s=r<t.length?t[r]:null,l=o&&o.offset+o.count===e,u=s&&e+1===s.offset;l&&u?(o.count+=1+s.count,t.splice(r,1)):l?o.count++:u?(s.offset--,s.count++):t.splice(r,0,{offset:e,count:1})}function Pi(a){if(!(0,Ci.default)(a))throw new Error("Sigma: invalid graph instance.")}function ia(a){var n=ne(a.x,2),e=n[0],t=n[1],r=ne(a.y,2),i=r[0],o=r[1],s=Math.max(t-e,o-i),l=(t+e)/2,u=(o+i)/2;(s===0||Math.abs(s)===1/0||isNaN(s))&&(s=1),isNaN(l)&&(l=0),isNaN(u)&&(u=0);var d=function(c){return{x:.5+(c.x-l)/s,y:.5+(c.y-u)/s}};return d.applyTo=function(h){h.x=.5+(h.x-l)/s,h.y=.5+(h.y-u)/s},d.inverse=function(h){return{x:l+s*(h.x-.5),y:u+s*(h.y-.5)}},d.ratio=s,d}var oa={hideEdgesOnMove:!1,hideLabelsOnMove:!1,renderLabels:!0,renderEdgeLabels:!1,edgeLabelAnchors:"nodeLabels",enableEdgeEvents:!1,nodeLabelEvents:!1,edgeLabelEvents:!1,pickingDownSizingRatio:2,nodePickingPadding:0,edgePickingPadding:4,labelPickingPadding:10,stagePadding:30,minEdgeThickness:1.7,antiAliasingFeather:1,antialiasEdges:!0,antialiasNodes:!0,dragTimeout:100,draggedEventsTolerance:3,inertiaDuration:200,inertiaRatio:3,zoomDuration:250,zoomingRatio:1.7,doubleClickTimeout:300,doubleClickZoomingRatio:2.2,doubleClickZoomingDuration:200,tapMoveTolerance:10,zoomToSizeRatioFunction:Math.sqrt,itemSizesReference:"positions",autoRescale:!0,autoRescaleContent:"positions",enableNodeDrag:!1,getDraggedNodes:function(n){return[n]},dragPositionToAttributes:null,labelDensity:1,labelGridCellSize:100,labelRenderedSizeThreshold:6,labelPixelSnapping:!0,minCameraRatio:null,maxCameraRatio:null,enableCameraZooming:!0,enableCameraPanning:!0,enableCameraRotation:!0,enableCameraMouseRotation:!0,cameraPanBoundaries:null,gestureTarget:"graph",sharedGestureWheelMessage:"Use Ctrl + scroll to zoom the graph",sharedGestureAppleWheelMessage:"Use \u2318 + scroll to zoom the graph",sharedGestureTouchMessage:"Use two fingers to move the graph",allowInvalidContainer:!1,DEBUG_displayPickingLayer:!1,DEBUG_logShaders:!1,DEBUG_logRenderStats:!1,DEBUG_gpuTimerQueries:!1};function sa(a){if(typeof a.labelDensity!="number"||a.labelDensity<0)throw new Error("Settings: invalid `labelDensity`. Expecting a positive number.");var n=a.minCameraRatio,e=a.maxCameraRatio;if(typeof n=="number"&&typeof e=="number"&&e<n)throw new Error("Settings: invalid camera ratio boundaries. Expecting `maxCameraRatio` to be greater than `minCameraRatio`.")}function Fi(a){return Di({},oa,a)}var Au=new Set(["italic","oblique"]),wu=new Set(["bold","bolder","lighter"]);function la(a){for(var n="normal",e="normal",t=a.trim(),r=t.split(/\s+/),i=0,o=0;o<r.length;o++){var s=r[o].toLowerCase();if(Au.has(s))e=s,i=o+1;else if(wu.has(s)||/^\d{3}$/.test(s))n=s,i=o+1;else if(s==="normal")i=o+1;else break}var l=r.slice(i).join(" ");return{family:l||t,weight:n,style:e}}function qt(a,n,e){var t=document.createElement(a);if(n)for(var r in n)t.style[r]=n[r];if(e)for(var i in e)t.setAttribute(i,e[i]);return t}function gn(){return typeof window.devicePixelRatio!="undefined"?window.devicePixelRatio:1}var Hi=Qe(sn());function Du(a){var n=a.type===WebGL2RenderingContext.FLOAT&&!a.normalized,e=a.type===WebGL2RenderingContext.UNSIGNED_BYTE&&a.size===4&&a.normalized;if(!n&&!e)throw new Error('Attribute "'.concat(a.name,'" is invalid: only non-normalized FLOAT and normalized UNSIGNED_BYTE with size 4 are supported.'));return a.normalized?1:a.size}function er(a){var n=0;return a.forEach(function(e){return n+=Du(e)}),n}function $i(a,n,e){var t=a==="VERTEX"?n.VERTEX_SHADER:n.FRAGMENT_SHADER,r=n.createShader(t);if(r===null)throw new Error("loadShader: error while creating the shader");n.shaderSource(r,e),n.compileShader(r);var i=n.getShaderParameter(r,n.COMPILE_STATUS);if(!i){var o=n.getShaderInfoLog(r);throw n.deleteShader(r),new Error(`loadShader: error while compiling the shader:
`.concat(o,`
`).concat(e))}return r}function nr(a,n){return $i("VERTEX",a,n)}function ar(a,n){return $i("FRAGMENT",a,n)}function rr(a,n){var e=a.createProgram();if(e===null)throw new Error("loadProgram: error while creating the program.");var t,r;for(t=0,r=n.length;t<r;t++)a.attachShader(e,n[t]);a.linkProgram(e);var i=a.getProgramParameter(e,a.LINK_STATUS);if(!i){var o=a.getProgramInfoLog(e);throw a.deleteProgram(e),new Error("loadProgram: error while linking the program: ".concat(o))}return e}function Ii(a){var n=a.gl,e=a.buffer,t=a.program,r=a.vertexShader,i=a.fragmentShader;n.deleteShader(r),n.deleteShader(i),n.deleteProgram(t),n.deleteBuffer(e)}function me(a){return a%1===0?a.toFixed(1):a.toString()}var ga=new Map,Vi=new Map,Ru=0;function ji(a,n){var e,t=(e=a.variables)===null||e===void 0||(e=e[n.source||n.name.replace(/^a_/,"")])===null||e===void 0?void 0:e.default,r=typeof t=="number"?t:typeof n.defaultValue=="number"?n.defaultValue:0;return me(r)}function va(a,n,e){var t,r=arguments.length>3&&arguments[3]!==void 0?arguments[3]:function(o){return"v_".concat(o.name.replace(/^a_/,""))},i=[n,e].concat(K(a.uniforms.filter(function(o){return o.type==="float"}).map(function(o){var s;return me((s=o.value)!==null&&s!==void 0?s:0)})),K(((t=a.attributes)!==null&&t!==void 0?t:[]).map(r)));return"sdf_".concat(a.name,"(").concat(i.join(", "),")")}function Lu(a){var n,e=a.name,t=a.uniforms.filter(function(o){return o.type==="float"&&o.value!==void 0&&o.value!==0}).map(function(o){return"".concat(o.name.replace("u_",""),"=").concat(o.value)}).sort(),r=((n=a.attributes)!==null&&n!==void 0?n:[]).map(function(o){var s;return"".concat(o.name,"@").concat((s=o.source)!==null&&s!==void 0?s:"","=").concat(ji(a,o))}),i=[].concat(K(t),K(r));return i.length>0&&(e+="#"+i.join("#")),e}function Cu(a){var n=Lu(a);if(!ga.has(n)){var e={},t=U(a.uniforms),r;try{for(t.s();!(r=t.n()).done;){var i=r.value;i.type==="float"&&i.value!==void 0&&(e[i.name]=i.value)}}catch(o){t.e(o)}finally{t.f()}ga.set(n,{shape:a,uniformValues:e,slug:n}),Vi.set(n,Ru++)}return n}function bn(a){var n;return(n=Vi.get(a))!==null&&n!==void 0?n:-1}function qi(a){var n=[],e=new Set,t=new Set,r=/mat2 rotate2D\(float angle\)\s*\{[^}]+\}/,i=U(a),o;try{for(i.s();!(o=i.n()).done;){var s=o.value;if(!t.has(s.name)){t.add(s.name);var l=s.glsl;r.test(l)&&(e.has("rotate2D")?l=l.replace(r,""):e.add("rotate2D")),n.push(l)}}}catch(u){i.e(u)}finally{i.f()}return n.join(`
`)}function ku(){return qi(Array.from(ga.values()).map(function(a){return a.shape}))}function Pu(a){var n=Array.from(ga.entries());if(n.length===0)return`
float querySDF(int shapeId, vec2 uv, float size) {
  return length(uv) - size;
}
`;var e=n.map(function(t,r){var i=ne(t,2),o=i[0],s=i[1].shape,l=va(s,"uv","size",function(u){var d=u.name.replace(/^a_/,"");return a!=null&&a.has(d)?"g_".concat(d):ji(s,u)});return"    case ".concat(r,": return ").concat(l,"; // ").concat(o)}).join(`
`);return`
float querySDF(int shapeId, vec2 uv, float size) {
  switch (shapeId) {
`.concat(e,`
    default: return length(uv) - size;
  }
}
`)}function ir(a){return qi(a)}function _n(a){return K(new Map(a.flatMap(function(n){return n.uniforms}).map(function(n){return[n.name,n]})).values())}function Fu(a,n){if(a.length===0)return`
void queryNodeSDF(int shapeId, vec2 uv, float size) {
  context.sdf = length(uv) - size;
  context.inradiusFactor = 1.0;
}
`;var e=function(h){return va(h,"uv","size")},t=function(h){var c,f;return(c=h.inradiusFactorGLSL)!==null&&c!==void 0?c:me((f=h.inradiusFactor)!==null&&f!==void 0?f:1)};if(a.length===1){var r=a[0];return`
void queryNodeSDF(int shapeId, vec2 uv, float size) {
  context.sdf = `.concat(e(r),`;
  context.inradiusFactor = `).concat(t(r),`;
}
`)}var i=a.map(function(d,h){return"    case ".concat(h,": // ").concat(d.name,`
      context.sdf = `).concat(e(d),`;
      context.inradiusFactor = `).concat(t(d),`;
      break;`)}).join(`
`),o=a[0],s="",l="shapeId";if(n&&n.length>1){var u=n.map(function(d,h){return"    case ".concat(d,": return ").concat(h,"; // ").concat(a[h].name)}).join(`
`);s=`
int globalToLocalShapeId(int globalId) {
  switch (globalId) {
`.concat(u,`
    default: return 0;
  }
}
`),l="globalToLocalShapeId(shapeId)"}return"".concat(s,`
void queryNodeSDF(int shapeId, vec2 uv, float size) {
  switch (`).concat(l,`) {
`).concat(i,`
    default:
      context.sdf = `).concat(e(o),`;
      context.inradiusFactor = `).concat(t(o),`;
  }
}
`)}var Yt={right:0,left:1,above:2,below:3,over:4},Kt=5,or=3,Xi=`
float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
float nodeRadiusGraphSpace = nodeSize * u_correctionRatio / u_sizeRatio * 2.0;
float nodeRadiusNDC = nodeRadiusGraphSpace * matrixScaleX;
float nodeRadiusPixels = nodeRadiusNDC * u_resolution.x / 2.0;
`,Iu=`
mat2 rotate2D(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}
`,Yi=`
vec2 getLabelDirection(float positionMode) {
  if (positionMode < 0.5) return vec2(1.0, 0.0);   // Right
  if (positionMode < 1.5) return vec2(-1.0, 0.0);  // Left
  if (positionMode < 2.5) return vec2(0.0, -1.0);  // Above
  if (positionMode < 3.5) return vec2(0.0, 1.0);   // Below
  return vec2(0.0);                                 // Over (centered)
}
`,Gu=`
float sdfBox(vec2 p, vec2 halfSize) {
  vec2 d = abs(p) - halfSize;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}
`,zu=`
float sdfRotatedBox(vec2 p, vec2 halfSize, float angle) {
  float c = cos(-angle);
  float s = sin(-angle);
  vec2 rotatedP = mat2(c, -s, s, c) * p;
  return sdfBox(rotatedP, halfSize);
}
`,Nu=`
float sdfRoundedBox(vec2 p, vec2 halfSize, float radius) {
  vec2 d = abs(p) - halfSize + radius;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - radius;
}
`,Wu=`
float sdfRoundedRotatedBox(vec2 p, vec2 halfSize, float angle, float radius) {
  float c = cos(-angle);
  float s = sin(-angle);
  vec2 rotatedP = mat2(c, -s, s, c) * p;
  return sdfRoundedBox(rotatedP, halfSize, radius);
}
`,Ki=`
vec2 labelBoxCenter(float positionMode, float labelStart, vec2 halfSize, float textHalfY) {
  if (positionMode < 0.5) return vec2(labelStart + halfSize.x, 0.0);    // right
  if (positionMode < 1.5) return vec2(-(labelStart + halfSize.x), 0.0); // left
  if (positionMode < 2.5) return vec2(0.0, -(labelStart + textHalfY));  // above
  if (positionMode < 3.5) return vec2(0.0, labelStart + textHalfY);     // below
  return vec2(0.0);                                                     // over
}
`,sr=2,at=`
vec4 readNodeData(sampler2D nodeDataTexture, int nodeDataTextureWidth, int nodeIndex) {
  int t = nodeIndex * `.concat(sr,`;
  ivec2 coord = ivec2(t % nodeDataTextureWidth, t / nodeDataTextureWidth);
  return texelFetch(nodeDataTexture, coord, 0);
}
`),St=`
vec4 readNodeFlags(sampler2D nodeDataTexture, int nodeDataTextureWidth, int nodeIndex) {
  int t = nodeIndex * `.concat(sr,` + 1;
  ivec2 coord = ivec2(t % nodeDataTextureWidth, t / nodeDataTextureWidth);
  return texelFetch(nodeDataTexture, coord, 0);
}
`),Bu=`
vec4 readNodeColor(sampler2D nodeDataTexture, int nodeDataTextureWidth, int nodeIndex) {
  int t = nodeIndex * `.concat(sr,` + 1;
  ivec2 coord = ivec2(t % nodeDataTextureWidth, t / nodeDataTextureWidth);
  vec4 texel = texelFetch(nodeDataTexture, coord, 0);
  float r = floor(texel.b / 65536.0);
  float g = floor(mod(texel.b, 65536.0) / 256.0);
  float b = mod(texel.b, 256.0);
  return vec4(r / 255.0, g / 255.0, b / 255.0, texel.a);
}
`),Zt=`
vec4 readFrameTexel(sampler2D frameTexture, int frameTextureWidth, int index) {
  ivec2 coord = ivec2(index % frameTextureWidth, index / frameTextureWidth);
  return texelFetch(frameTexture, coord, 0);
}
`;function Mu(a,n){var e=function(o){return va(o,"uv","size")};if(a.length===1)return{code:Gi(e(a[0])),multiShape:!1};var t=a.map(function(i,o){return"    case ".concat(n?n[o]:o,": return ").concat(e(i),";")}).join(`
`),r=`
float queryShapeSDF(int shapeId, vec2 uv, float size) {
  switch (shapeId) {
`.concat(t,`
    default: return `).concat(e(a[0]),`;
  }
}
int g_shapeId;
`).concat(Gi("queryShapeSDF(g_shapeId, uv, size)"),`
`);return{code:r,multiShape:!0}}function Gi(a){return`
float findEdgeDistance(vec2 direction, float size) {
  float lo = 0.0, hi = 2.0;
  for (int i = 0; i < 8; i++) {
    float mid = (lo + hi) * 0.5;
    vec2 uv = direction * mid;
    if (`.concat(a,` < 0.0) lo = mid; else hi = mid;
  }
  return (lo + hi) * 0.5;
}
`)}function Uu(a,n){for(;!{}.hasOwnProperty.call(a,n)&&(a=_t(a))!==null;);return a}function tr(){return tr=typeof Reflect!="undefined"&&Reflect.get?Reflect.get.bind():function(a,n,e){var t=Uu(a,n);if(t){var r=Object.getOwnPropertyDescriptor(t,n);return r.get?r.get.call(arguments.length<3?a:e):r.value}},tr.apply(null,arguments)}function _e(a,n,e,t){var r=tr(_t(1&t?a.prototype:a),n,e);return 2&t&&typeof r=="function"?function(i){return r.apply(e,i)}:r}var Ou=1024,Hu=1.5,Zi=-1,pa=(function(){function a(n,e){var t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Ou;J(this,a),D(this,"texture",null),D(this,"dirty",!1),D(this,"dirtyRangeStart",1/0),D(this,"dirtyRangeEnd",-1),D(this,"indexMap",new Map),D(this,"freeIndices",[]),D(this,"nextIndex",0),this.gl=n,this.maxTextureSize=n.getParameter(n.MAX_TEXTURE_SIZE),this.TEXELS_PER_ITEM=e,this.capacity=this.roundUpToPowerOfTwo(t);var r=this.computeTextureDimensions(this.capacity);this.textureWidth=r.width,this.textureHeight=r.height,this.data=new Float32Array(this.textureWidth*this.textureHeight*4),this.createTexture()}return ee(a,[{key:"computeTextureDimensions",value:function(e){var t=e*this.TEXELS_PER_ITEM,r=Math.min(t,this.maxTextureSize),i=Math.ceil(t/r);return{width:r,height:i}}},{key:"roundUpToPowerOfTwo",value:function(e){return Math.pow(2,Math.ceil(Math.log2(Math.max(1,e))))}},{key:"createTexture",value:function(){var e=this.gl;this.texture=e.createTexture(),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.texture),e.texImage2D(e.TEXTURE_2D,0,e.RGBA32F,this.textureWidth,this.textureHeight,0,e.RGBA,e.FLOAT,this.data),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindTexture(e.TEXTURE_2D,null)}},{key:"resize",value:function(e){if(!(e<=this.capacity)){var t=this.roundUpToPowerOfTwo(Math.ceil(e*Hu)),r=this.gl,i=this.computeTextureDimensions(t),o=new Float32Array(i.width*i.height*4);o.set(this.data),this.texture&&r.deleteTexture(this.texture),this.data=o,this.capacity=t,this.textureWidth=i.width,this.textureHeight=i.height,this.createTexture(),this.dirty=!0,this.dirtyRangeStart=0,this.dirtyRangeEnd=this.nextIndex}}},{key:"allocate",value:function(e){var t=this.indexMap.get(e);if(t!==void 0)return t;var r;return this.freeIndices.length>0?r=this.freeIndices.pop():(r=this.nextIndex++,r>=this.capacity&&this.resize(r+1)),this.indexMap.set(e,r),r}},{key:"free",value:function(e){var t=this.indexMap.get(e);if(t!==void 0){this.indexMap.delete(e),this.freeIndices.push(t);for(var r=t*this.TEXELS_PER_ITEM*4,i=0;i<this.TEXELS_PER_ITEM*4;i++)this.data[r+i]=0;this.markDirty(t)}}},{key:"getIndex",value:function(e){var t;return(t=this.indexMap.get(e))!==null&&t!==void 0?t:-1}},{key:"has",value:function(e){return this.indexMap.has(e)}},{key:"markDirty",value:function(e){this.dirty=!0,this.dirtyRangeStart=Math.min(this.dirtyRangeStart,e),this.dirtyRangeEnd=Math.max(this.dirtyRangeEnd,e+1)}},{key:"upload",value:function(){if(!(!this.dirty||!this.texture)){var e=this.gl,t=this.textureWidth;e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.texture);var r=this.dirtyRangeStart*this.TEXELS_PER_ITEM,i=Math.min(this.dirtyRangeEnd*this.TEXELS_PER_ITEM,this.capacity*this.TEXELS_PER_ITEM);if(r<i)for(var o=Math.floor(r/t),s=Math.floor((i-1)/t),l=o;l<=s;l++){var u=l*t,d=Math.min(u+t,this.capacity*this.TEXELS_PER_ITEM),h=Math.max(r,u),c=Math.min(i,d);if(h<c){var f=h-u,g=c-h,y=this.data.subarray(h*4,c*4);e.texSubImage2D(e.TEXTURE_2D,0,f,l,g,1,e.RGBA,e.FLOAT,y)}}e.bindTexture(e.TEXTURE_2D,null),this.dirty=!1,this.dirtyRangeStart=1/0,this.dirtyRangeEnd=-1}}},{key:"bind",value:function(e){var t=this.gl;t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D,this.texture)}},{key:"getTexture",value:function(){return this.texture}},{key:"getCapacity",value:function(){return this.capacity}},{key:"getTextureWidth",value:function(){return this.textureWidth}},{key:"getTextureHeight",value:function(){return this.textureHeight}},{key:"getTexelsPerItem",value:function(){return this.TEXELS_PER_ITEM}},{key:"getCount",value:function(){return this.indexMap.size}},{key:"getHighWaterMark",value:function(){return this.nextIndex}},{key:"isDirty",value:function(){return this.dirty}},{key:"clear",value:function(){this.indexMap.clear(),this.freeIndices=[],this.nextIndex=0,this.data.fill(0),this.dirty=!0,this.dirtyRangeStart=0,this.dirtyRangeEnd=this.capacity}},{key:"restore",value:function(){this.createTexture(),this.dirty=!1,this.dirtyRangeStart=1/0,this.dirtyRangeEnd=-1}},{key:"kill",value:function(){this.texture&&(this.gl.deleteTexture(this.texture),this.texture=null),this.indexMap.clear(),this.freeIndices=[]}}])})();function Be(a){var n={},e={},t=0,r=U(a),i;try{for(r.s();!(i=r.n()).done;){var o=i.value,s=U(o.attributes),l;try{for(s.s();!(l=s.n()).done;){var u=l.value,d=u.name.replace(/^a_/,"");d in n||(n[d]=t,e[d]=u,t+=u.size)}}catch(h){s.e(h)}finally{s.f()}}}catch(h){r.e(h)}finally{r.f()}return{floatsPerItem:t,texelsPerItem:Math.max(1,Math.ceil(t/4)),offsets:n,specs:e}}var ma=(function(a){function n(e,t,r){var i;return J(this,n),i=ce(this,n,[e,t.texelsPerItem,r]),i.floatsPerItem=t.floatsPerItem,i}return fe(n,a),ee(n,[{key:"updateAllAttributes",value:function(t,r){var i=this.indexMap.get(t);i===void 0&&(i=this.allocate(t));for(var o=i*this.TEXELS_PER_ITEM*4,s=Math.min(r.length,this.floatsPerItem),l=0;l<s;l++)this.data[o+l]=r[l];this.markDirty(i)}},{key:"updateAllAttributesAtRow",value:function(t,r){t>=this.capacity&&this.resize(t+1);for(var i=t*this.TEXELS_PER_ITEM*4,o=Math.min(r.length,this.floatsPerItem),s=0;s<o;s++)this.data[i+s]=r[s];this.markDirty(t)}}])})(pa);function ya(a,n,e){for(var t=[],r=new Set,i=0;i<a.length;i++){var o=a[i],s=U(o.attributes),l;try{for(s.s();!(l=s.n()).done;){var u=l.value,d=u.name.replace(/^a_/,"");if(!r.has(d)){r.add(d);var h=n.offsets[d];if(h!==void 0){var c=e==null?void 0:e.get(i);t.push({sourceKey:u.source||d,packedOffset:h,size:u.size,isColor:u.size===4&&!!u.normalized,defaultNum:typeof u.defaultValue=="number"?u.defaultValue:u.defaultValue===!0?1:0,defaultColor:typeof u.defaultValue=="string"?u.defaultValue:"",sourceIndex:i,hasLifecycleHook:!!(c!=null&&c.getAttributeData)})}}}}catch(f){s.e(f)}finally{s.f()}}return t}function ba(a,n,e,t,r,i){e.fill(0);for(var o=0,s=a.length;o<s;o++){var l=a[o],u=l.packedOffset,d=void 0;if(l.hasLifecycleHook){var h=r.get(l.sourceIndex-i);d=h.getAttributeData(n,l.sourceKey),d===null&&(d=n[l.sourceKey])}else d=n[l.sourceKey];if(l.isColor){var c=typeof d=="string"?d:l.defaultColor||t,f=lt(c),g=ne(f,4),y=g[0],m=g[1],v=g[2],p=g[3];e[u]=y/255,e[u+1]=m/255,e[u+2]=v/255,e[u+3]=p/255}else if(l.size===1)e[u]=typeof d=="number"?d:typeof d=="boolean"?d?1:0:l.defaultNum;else{var b=Array.isArray(d)?d:null;if(b)for(var T=0;T<l.size;T++){var _;e[u+T]=(_=b[T])!==null&&_!==void 0?_:0}}}}var ua=["r","g","b","a"];function Xt(a,n){var e=a.offsets,t=a.specs,r=a.texelsPerItem,i=a.floatsPerItem,o=Object.keys(e);if(o.length===0||i===0)return{fetchCode:"",varyingAssignments:""};var s=n.varPrefix,l=n.baseTexelExpr,u=n.textureWidthUniform,d=n.textureSamplerUniform,h=n.outputPrefix,c=h===void 0?"v_":h,f=[];f.push("  int ".concat(s,"BaseTexel = ").concat(l,";")),f.push("");for(var g=0;g<r;g++)f.push("  ivec2 ".concat(s,"Coord").concat(g," = ivec2((").concat(s,"BaseTexel + ").concat(g,") % ").concat(u,", (").concat(s,"BaseTexel + ").concat(g,") / ").concat(u,");")),f.push("  vec4 ".concat(s,"Texel").concat(g," = texelFetch(").concat(d,", ").concat(s,"Coord").concat(g,", 0);"));f.push("");for(var y=[],m=function(){var T=p[v],_=t[T],E=e[T],w=Math.floor(E/4),A=E%4,S="".concat(s,"Texel").concat(w),k="".concat(s,"Texel").concat(w+1),z="".concat(s,"Fetched_").concat(T);if(_.size===1)f.push("  float ".concat(z," = ").concat(S,".").concat(ua[A],";"));else if(_.size===4&&A===0)f.push("  vec4 ".concat(z," = ").concat(S,";"));else{var C=A+_.size;if(C<=4){var N="vec".concat(_.size),L=ua.slice(A,C).join("");f.push("  ".concat(N," ").concat(z," = ").concat(S,".").concat(L,";"))}else{var G=_.size===4?"vec4":"vec".concat(_.size),M=ua.slice(A).map(function(P){return"".concat(S,".").concat(P)}),F=ua.slice(0,C-4).map(function(P){return"".concat(k,".").concat(P)}),x=[].concat(K(M),K(F)).join(", ");f.push("  ".concat(G," ").concat(z," = ").concat(G,"(").concat(x,");"))}}y.push("  ".concat(c).concat(T," = ").concat(z,";"))},v=0,p=o;v<p.length;v++)m();return{fetchCode:f.join(`
`),varyingAssignments:y.join(`
`)}}function lr(a,n,e){if(!(!n||e.type==="sampler2D"))switch(e.type){case"float":a.uniform1f(n,e.value);break;case"int":case"bool":a.uniform1i(n,e.value);break;case"vec2":a.uniform2fv(n,e.value);break;case"vec3":a.uniform3fv(n,e.value);break;case"vec4":a.uniform4fv(n,e.value);break;case"mat3":a.uniformMatrix3fv(n,!1,e.value);break;case"mat4":a.uniformMatrix4fv(n,!1,e.value);break}}var $u=D(D(D(D(D(D(D(D({},WebGL2RenderingContext.BOOL,1),WebGL2RenderingContext.BYTE,1),WebGL2RenderingContext.UNSIGNED_BYTE,1),WebGL2RenderingContext.SHORT,2),WebGL2RenderingContext.UNSIGNED_SHORT,2),WebGL2RenderingContext.INT,4),WebGL2RenderingContext.UNSIGNED_INT,4),WebGL2RenderingContext.FLOAT,4);function da(a){var n=a.match(/^(#version[^\n]*\n)/);return n?n[1]+`#define PICKING_MODE
`+a.slice(n[1].length):`#define PICKING_MODE
`+a}var At=(function(){function a(n,e,t){J(this,a),D(this,"floats",new Float32Array),D(this,"ints",new Uint32Array),D(this,"constantArray",new Float32Array),D(this,"capacity",0),D(this,"verticesCount",0),D(this,"bufferGeneration",0),D(this,"uploadedGeneration",new Map),D(this,"constantBufferGeneration",0),D(this,"uploadedConstantGeneration",new Map),D(this,"renderOffset",0),D(this,"renderCount",-1),D(this,"debugStats",{drawCalls:0,verticesDrawn:0,bufferUploadBytes:0}),D(this,"shadersLogged",!1),D(this,"pickProgram",null);var r=this.getDefinition();if(this.VERTICES=r.VERTICES,this.VERTEX_SHADER_SOURCE=r.VERTEX_SHADER_SOURCE,this.FRAGMENT_SHADER_SOURCE=r.FRAGMENT_SHADER_SOURCE,this.UNIFORMS=r.UNIFORMS,this.ATTRIBUTES=r.ATTRIBUTES,this.METHOD=r.METHOD,this.CONSTANT_ATTRIBUTES="CONSTANT_ATTRIBUTES"in r?r.CONSTANT_ATTRIBUTES:[],this.CONSTANT_DATA="CONSTANT_DATA"in r?r.CONSTANT_DATA:[],this.isInstanced="CONSTANT_ATTRIBUTES"in r,this.ATTRIBUTES_ITEMS_COUNT=er(this.ATTRIBUTES),this.STRIDE=this.VERTICES*this.ATTRIBUTES_ITEMS_COUNT,this.renderer=t,this.normalProgram=this.getProgramInfo("normal",n,r.VERTEX_SHADER_SOURCE,r.FRAGMENT_SHADER_SOURCE,null),this.pickProgram=this.getProgramInfo("pick",n,da(r.VERTEX_SHADER_SOURCE),da(r.FRAGMENT_SHADER_SOURCE),null),this.isInstanced){var i=er(this.CONSTANT_ATTRIBUTES);if(this.CONSTANT_DATA.length!==this.VERTICES)throw new Error("Program: error while getting constant data (expected ".concat(this.VERTICES," items, received ").concat(this.CONSTANT_DATA.length," instead)"));this.constantArray=new Float32Array(this.CONSTANT_DATA.length*i);for(var o=0;o<this.CONSTANT_DATA.length;o++){var s=this.CONSTANT_DATA[o];if(s.length!==i)throw new Error("Program: error while getting constant data (one vector has ".concat(s.length," items instead of ").concat(i,")"));for(var l=0;l<s.length;l++)this.constantArray[o*i+l]=s[l]}this.STRIDE=this.ATTRIBUTES_ITEMS_COUNT}}return ee(a,[{key:"kill",value:function(){Ii(this.normalProgram),this.pickProgram&&Ii(this.pickProgram)}},{key:"resetDebugStats",value:function(){this.debugStats.drawCalls=0,this.debugStats.verticesDrawn=0,this.debugStats.bufferUploadBytes=0}},{key:"getProgramInfo",value:function(e,t,r,i,o){var s=t.createBuffer();if(s===null)throw new Error("Program: error while creating the WebGL buffer.");var l=nr(t,r),u=ar(t,i),d=rr(t,[l,u]),h={};this.UNIFORMS.forEach(function(g){var y=t.getUniformLocation(d,g);y&&(h[g]=y)});var c={};this.ATTRIBUTES.forEach(function(g){c[g.name]=t.getAttribLocation(d,g.name)});var f;if(this.isInstanced&&(this.CONSTANT_ATTRIBUTES.forEach(function(g){c[g.name]=t.getAttribLocation(d,g.name)}),f=t.createBuffer(),f===null))throw new Error("Program: error while creating the WebGL constant buffer.");return{name:e,program:d,gl:t,frameBuffer:o,buffer:s,constantBuffer:f||{},uniformLocations:h,attributeLocations:c,isPicking:e==="pick",vertexShader:l,fragmentShader:u}}},{key:"bindProgram",value:function(e){var t=this,r=0,i=e.gl,o=e.buffer;if(this.isInstanced){if(i.bindBuffer(i.ARRAY_BUFFER,e.constantBuffer),r=0,this.CONSTANT_ATTRIBUTES.forEach(function(d){return r+=t.bindAttribute(d,e,r,!1)}),this.uploadedConstantGeneration.get(e.constantBuffer)!==this.constantBufferGeneration){var l;i.bufferData(i.ARRAY_BUFFER,this.constantArray,i.STATIC_DRAW),this.uploadedConstantGeneration.set(e.constantBuffer,this.constantBufferGeneration),(l=this.renderer)!==null&&l!==void 0&&l.getSetting("DEBUG_logRenderStats")&&(this.debugStats.bufferUploadBytes+=this.constantArray.byteLength)}if(i.bindBuffer(i.ARRAY_BUFFER,e.buffer),r=this.renderOffset*this.ATTRIBUTES_ITEMS_COUNT*Float32Array.BYTES_PER_ELEMENT,this.ATTRIBUTES.forEach(function(d){return r+=t.bindAttribute(d,e,r,!0)}),this.uploadedGeneration.get(o)!==this.bufferGeneration){var u;i.bufferData(i.ARRAY_BUFFER,this.floats,i.DYNAMIC_DRAW),this.uploadedGeneration.set(o,this.bufferGeneration),(u=this.renderer)!==null&&u!==void 0&&u.getSetting("DEBUG_logRenderStats")&&(this.debugStats.bufferUploadBytes+=this.floats.byteLength)}}else if(i.bindBuffer(i.ARRAY_BUFFER,o),r=0,this.ATTRIBUTES.forEach(function(d){return r+=t.bindAttribute(d,e,r)}),this.uploadedGeneration.get(o)!==this.bufferGeneration){var s;i.bufferData(i.ARRAY_BUFFER,this.floats,i.DYNAMIC_DRAW),this.uploadedGeneration.set(o,this.bufferGeneration),(s=this.renderer)!==null&&s!==void 0&&s.getSetting("DEBUG_logRenderStats")&&(this.debugStats.bufferUploadBytes+=this.floats.byteLength)}i.bindBuffer(i.ARRAY_BUFFER,null)}},{key:"unbindProgram",value:function(e){var t=this;this.isInstanced?(this.CONSTANT_ATTRIBUTES.forEach(function(r){return t.unbindAttribute(r,e,!1)}),this.ATTRIBUTES.forEach(function(r){return t.unbindAttribute(r,e,!0)})):this.ATTRIBUTES.forEach(function(r){return t.unbindAttribute(r,e)})}},{key:"bindAttribute",value:function(e,t,r,i){var o=$u[e.type];if(typeof o!="number")throw new Error('Program.bind: yet unsupported attribute type "'.concat(e.type,'"'));var s=t.attributeLocations[e.name],l=t.gl;if(s!==-1){l.enableVertexAttribArray(s);var u=this.isInstanced?(i?this.ATTRIBUTES_ITEMS_COUNT:er(this.CONSTANT_ATTRIBUTES))*Float32Array.BYTES_PER_ELEMENT:this.ATTRIBUTES_ITEMS_COUNT*Float32Array.BYTES_PER_ELEMENT;l.vertexAttribPointer(s,e.size,e.type,e.normalized||!1,u,r),this.isInstanced&&i&&l.vertexAttribDivisor(s,1)}return e.size*o}},{key:"unbindAttribute",value:function(e,t,r){var i=t.attributeLocations[e.name],o=t.gl;i!==-1&&(o.disableVertexAttribArray(i),this.isInstanced&&r&&o.vertexAttribDivisor(i,0))}},{key:"reallocate",value:function(e){e!==this.capacity&&(this.capacity=e,this.verticesCount=this.VERTICES*e,this.floats=new Float32Array(this.isInstanced?this.capacity*this.ATTRIBUTES_ITEMS_COUNT:this.verticesCount*this.ATTRIBUTES_ITEMS_COUNT),this.ints=new Uint32Array(this.floats.buffer),this.invalidateBuffers())}},{key:"invalidateBuffers",value:function(){this.bufferGeneration++,this.constantBufferGeneration++}},{key:"hasNothingToRender",value:function(){return this.verticesCount===0}},{key:"setTypedUniform",value:function(e,t){var r;lr(t.gl,(r=t.uniformLocations[e.name])!==null&&r!==void 0?r:null,e)}},{key:"renderProgram",value:function(e,t){var r=t.gl,i=t.program,o=t.isPicking;o?r.disable(r.BLEND):r.enable(r.BLEND),r.useProgram(i),this.setUniforms(e,t),this.drawWebGL(this.METHOD,t)}},{key:"render",value:function(e,t,r){var i;if(!this.shadersLogged&&(i=this.renderer)!==null&&i!==void 0&&i.getSetting("DEBUG_logShaders")&&(this.shadersLogged=!0,console.log("[sigma] DEBUG_logShaders: ".concat(this.constructor.name),{normal:{vertexShaderSource:this.VERTEX_SHADER_SOURCE,fragmentShaderSource:this.FRAGMENT_SHADER_SOURCE},pick:{vertexShaderSource:da(this.VERTEX_SHADER_SOURCE),fragmentShaderSource:da(this.FRAGMENT_SHADER_SOURCE)}})),!this.hasNothingToRender()){this.renderOffset=t!=null?t:0,this.renderCount=r!=null?r:-1;var o=this.normalProgram.gl;if(o.bindFramebuffer(o.FRAMEBUFFER,null),o.viewport(0,0,e.width*e.pixelRatio,e.height*e.pixelRatio),this.bindProgram(this.normalProgram),this.renderProgram(e,this.normalProgram),this.unbindProgram(this.normalProgram),this.pickProgram&&e.pickingFrameBuffer){var s=Math.ceil(e.width*e.pixelRatio/e.downSizingRatio),l=Math.ceil(e.height*e.pixelRatio/e.downSizingRatio);o.bindFramebuffer(o.FRAMEBUFFER,e.pickingFrameBuffer),o.viewport(0,0,s,l),this.bindProgram(this.pickProgram),this.renderProgram(e,this.pickProgram),this.unbindProgram(this.pickProgram),o.bindFramebuffer(o.FRAMEBUFFER,null),o.viewport(0,0,e.width*e.pixelRatio,e.height*e.pixelRatio)}}}},{key:"drawWebGL",value:function(e,t){var r,i=t.gl,o=this.renderCount>=0?this.renderCount:this.capacity;(r=this.renderer)!==null&&r!==void 0&&r.getSetting("DEBUG_logRenderStats")&&(this.debugStats.drawCalls++,this.debugStats.verticesDrawn+=o*this.VERTICES),this.isInstanced?i.drawArraysInstanced(e,0,this.VERTICES,o):i.drawArrays(e,this.renderOffset*this.VERTICES,o*this.VERTICES)}}])})(),ct=2,xn=7,Qi={below:0,above:1,left:2,right:3};function Vu(){var a=`#version 300 es
precision highp float;

uniform mat3 u_matrix;
uniform vec2 u_resolution;
uniform float u_labelPixelSnapping;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform float u_pixelRatio;
uniform float u_labelMargin;
uniform float u_zoomLabelSizeRatio;

uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_nodeFrameTexture;
uniform int u_nodeFrameTextureWidth;

// Atlas size is fixed at 2048\xD72048 \u2014 matches AttachmentManager.ATLAS_SIZE.
uniform sampler2D u_atlasTexture;
const vec2 u_atlasSize = vec2(2048.0);

// Per-instance
in float a_nodeIndex;           // node-data texture index
in vec4 a_atlasRect;            // x, y, width, height in atlas pixels
in vec2 a_attachmentSize;       // attachment dimensions (CSS px)
in float a_positionMode;        // label position: 0=right 1=left 2=above 3=below 4=over
in float a_attachmentPlacement; // 0=below 1=above 2=left 3=right (relative to label)
in float a_labelWidth;          // label width (CSS px)
in float a_labelHeight;         // label height: font line box (CSS px)
in float a_textHeight;          // actual glyph height (CSS px)
in float a_labelAngle;          // label rotation angle (radians)

// Per-vertex (constant)
in vec2 a_quadCorner;           // [-1,-1], [1,-1], [-1,1], [1,1]

out vec2 v_texCoord;

`.concat(at,`
`).concat(St,`
`).concat(Zt,`
`).concat(Ki,`
`).concat(Iu,`

void main() {
  int nodeIdx = int(a_nodeIndex);

  // Node data: (x, y, size, shapeId).
  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 nodePos = nodeData.xy;
  float nodeSize = nodeData.z;

  // Normalized edge distance from the shared frame texture (the frame-pass ran
  // the SDF search once; we just read the result).
  float edgeDist = readFrameTexel(u_nodeFrameTexture, u_nodeFrameTextureWidth, nodeIdx).r;

  // Per-node label rotation alignment: 0 = viewport, 1 = label turns with camera.
  float labelRotation = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx).g;

  vec3 nodeClip = u_matrix * vec3(nodePos, 1.0);

  // Node radius in physical pixels (matches label/background).
  float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
  float nodeRadiusGraphSpace = nodeSize * u_correctionRatio / u_sizeRatio * 2.0;
  float nodeRadiusPixels = nodeRadiusGraphSpace * matrixScaleX * u_resolution.x / 2.0;

  // CSS-px inputs -> physical px, scaled by the zoom-dependent label ratio, so
  // the attachment stays glued to the label box exactly as the label scales.
  float zoomScale = u_zoomLabelSizeRatio;
  vec2 labelHalf = vec2(a_labelWidth, a_labelHeight) * 0.5 * zoomScale * u_pixelRatio;
  vec2 attachHalf = a_attachmentSize * 0.5 * zoomScale * u_pixelRatio;
  float gap = `).concat(ct.toFixed(1),` * zoomScale * u_pixelRatio;
  float labelMargin = u_labelMargin * zoomScale * u_pixelRatio;

  // Graph-aligned labels add the camera angle so the attachment orbits with the box.
  mat2 labelRotMat = rotate2D(a_labelAngle - labelRotation * u_cameraAngle);

  // Label box center relative to the node center (pre-rotation). The shape-aware
  // edge distance comes from the frame texture, so placement matches the label.
  vec2 boxCenter = vec2(0.0);
  if (a_positionMode < 4.0) {
    float labelStart = nodeRadiusPixels * edgeDist + labelMargin;
    float textHalf = a_textHeight * 0.5 * zoomScale * u_pixelRatio;
    boxCenter = labelBoxCenter(a_positionMode, labelStart, labelHalf, textHalf);
  }

  // Horizontal anchor of below/above attachments tracks the label position, so
  // the attachment hangs from the label edge nearest the node (or is centered
  // when the label itself is node-centered): right->left, left->right, else center.
  float anchorX = 0.0;
  if (a_positionMode < 0.5) anchorX = -labelHalf.x + attachHalf.x;       // right label
  else if (a_positionMode < 1.5) anchorX = labelHalf.x - attachHalf.x;   // left label

  // Attachment center relative to the box (pre-rotation, Y-down). This offset
  // depends only on the box, the gap and the attachment size \u2014 never the shape.
  vec2 attachCenter;
  if (a_attachmentPlacement < 0.5) {
    // below
    attachCenter = boxCenter + vec2(anchorX, labelHalf.y + gap + attachHalf.y);
  } else if (a_attachmentPlacement < 1.5) {
    // above
    attachCenter = boxCenter + vec2(anchorX, -(labelHalf.y + gap + attachHalf.y));
  } else if (a_attachmentPlacement < 2.5) {
    // left, top-aligned
    attachCenter = boxCenter + vec2(-(labelHalf.x + gap + attachHalf.x), -labelHalf.y + attachHalf.y);
  } else {
    // right, top-aligned
    attachCenter = boxCenter + vec2(labelHalf.x + gap + attachHalf.x, -labelHalf.y + attachHalf.y);
  }

  // Rotate the whole assembly by the label angle, around the node center.
  vec2 rotatedCenter = labelRotMat * attachCenter;
  vec2 cornerOffset = labelRotMat * (a_quadCorner * attachHalf);

  // Node center in screen px (Y-down).
  vec2 nodeScreen = vec2(
    (nodeClip.x + 1.0) * u_resolution.x,
    (1.0 - nodeClip.y) * u_resolution.y
  ) * 0.5;

  // Snap node center to the pixel grid so label/backdrop/attachment move as one.
  vec2 snapDelta = (round(nodeScreen) - nodeScreen) * u_labelPixelSnapping;

  // Snap the quad's top-left to integer pixels so atlas texels map 1:1.
  vec2 centerScreen = nodeScreen + rotatedCenter + snapDelta;
  vec2 topLeft = centerScreen - attachHalf;
  topLeft = mix(topLeft, round(topLeft), u_labelPixelSnapping);
  centerScreen = topLeft + attachHalf;

  vec2 vertexScreen = centerScreen + cornerOffset;
  gl_Position = vec4(
    vertexScreen.x * 2.0 / u_resolution.x - 1.0,
    1.0 - vertexScreen.y * 2.0 / u_resolution.y,
    0.0, 1.0
  );

  vec2 texOrigin = a_atlasRect.xy / u_atlasSize;
  vec2 texSize = a_atlasRect.zw / u_atlasSize;
  vec2 uv = (a_quadCorner + 1.0) / 2.0;
  v_texCoord = texOrigin + uv * texSize;
}
`);return a}var ju=`#version 300 es
precision highp float;

uniform sampler2D u_atlasTexture;

in vec2 v_texCoord;

layout(location = 0) out vec4 fragColor;
#ifdef PICKING_MODE
layout(location = 1) out vec4 pickColor;
#endif

void main() {
  // Canvas textures are premultiplied; output directly for (ONE, 1-SRC_ALPHA) blending
  vec4 color = texture(u_atlasTexture, v_texCoord);
  if (color.a < 0.01) discard;
  fragColor = color;
#ifdef PICKING_MODE
  pickColor = vec4(0.0); // Attachments are not pickable
#endif
}
`;function qu(a,n,e,t){var r,i,o=t.label,s=o===void 0?{}:o,l=(r=s.margin)!==null&&r!==void 0?r:Kt,u=(i=s.zoomToLabelSizeRatioFunction)!==null&&i!==void 0?i:function(){return 1},d=Vu(),h=ju,c=(function(f){function g(){var y;J(this,g);for(var m=arguments.length,v=new Array(m),p=0;p<m;p++)v[p]=arguments[p];return y=ce(this,g,[].concat(v)),D(y,"totalCount",0),D(y,"bufferCapacity",0),y}return fe(g,f),ee(g,[{key:"getDefinition",value:function(){var m=WebGL2RenderingContext,v=m.FLOAT,p=m.TRIANGLE_STRIP;return{VERTICES:4,VERTEX_SHADER_SOURCE:d,FRAGMENT_SHADER_SOURCE:h,METHOD:p,UNIFORMS:["u_matrix","u_resolution","u_labelPixelSnapping","u_sizeRatio","u_correctionRatio","u_cameraAngle","u_pixelRatio","u_labelMargin","u_zoomLabelSizeRatio","u_nodeDataTexture","u_nodeDataTextureWidth","u_nodeFrameTexture","u_nodeFrameTextureWidth","u_atlasTexture"],ATTRIBUTES:[{name:"a_nodeIndex",size:1,type:v},{name:"a_atlasRect",size:4,type:v},{name:"a_attachmentSize",size:2,type:v},{name:"a_positionMode",size:1,type:v},{name:"a_attachmentPlacement",size:1,type:v},{name:"a_labelWidth",size:1,type:v},{name:"a_labelHeight",size:1,type:v},{name:"a_textHeight",size:1,type:v},{name:"a_labelAngle",size:1,type:v}],CONSTANT_ATTRIBUTES:[{name:"a_quadCorner",size:2,type:v}],CONSTANT_DATA:[[-1,-1],[1,-1],[-1,1],[1,1]]}}},{key:"processAttachment",value:function(m,v){var p=this.floats,b=m*this.STRIDE;p[b++]=v.nodeIndex,p[b++]=v.atlasX,p[b++]=v.atlasY,p[b++]=v.atlasW,p[b++]=v.atlasH,p[b++]=v.attachWidth,p[b++]=v.attachHeight,p[b++]=v.positionMode,p[b++]=v.attachmentPlacement,p[b++]=v.labelWidth,p[b++]=v.labelHeight,p[b++]=v.textHeight,p[b++]=v.labelAngle}},{key:"setUniforms",value:function(m,v){var p=v.gl,b=v.uniformLocations;p.uniformMatrix3fv(b.u_matrix,!1,m.matrix),p.uniform2f(b.u_resolution,m.width*m.pixelRatio,m.height*m.pixelRatio),p.uniform1f(b.u_labelPixelSnapping,m.labelPixelSnapping),p.uniform1f(b.u_sizeRatio,m.sizeRatio),p.uniform1f(b.u_correctionRatio,m.correctionRatio),p.uniform1f(b.u_cameraAngle,m.cameraAngle),p.uniform1f(b.u_pixelRatio,m.pixelRatio),p.uniform1f(b.u_labelMargin,g.labelMargin),p.uniform1f(b.u_zoomLabelSizeRatio,1/u(m.zoomRatio)),p.uniform1i(b.u_nodeDataTexture,m.nodeDataTextureUnit),p.uniform1i(b.u_nodeDataTextureWidth,m.nodeDataTextureWidth),p.uniform1i(b.u_nodeFrameTexture,m.nodeFrameTextureUnit),p.uniform1i(b.u_nodeFrameTextureWidth,m.nodeFrameTextureWidth),p.uniform1i(b.u_atlasTexture,xn)}},{key:"reallocateAttachments",value:function(m){this.totalCount=m,m>this.bufferCapacity&&(this.bufferCapacity=Math.max(m,Math.ceil(this.bufferCapacity*1.5)||10),_e(g,"reallocate",this,3)([this.bufferCapacity]))}},{key:"hasNothingToRender",value:function(){return this.totalCount===0}},{key:"drawWebGL",value:function(m,v){var p=v.gl;this.totalCount!==0&&p.drawArraysInstanced(m,0,this.VERTICES,this.totalCount)}}])})(At);return D(c,"labelMargin",l),new c(a,n,e)}var dt=5;function _a(a,n){return[].concat(K(n),K(a.map(function(e){var t;return{attributes:(t=e.attributes)!==null&&t!==void 0?t:[]}})))}function Qt(a,n){var e=Be(_a(a,n)),t=new Set(a.flatMap(function(u){var d;return(d=u.attributes)!==null&&d!==void 0?d:[]}).map(function(u){return u.name.replace(/^a_/,"")})),r={},i={},o=U(t),s;try{for(o.s();!(s=o.n()).done;){var l=s.value;r[l]=e.offsets[l],i[l]=e.specs[l]}}catch(u){o.e(u)}finally{o.f()}return O(O({},e),{},{offsets:r,specs:i})}function Xu(a,n){var e=new Set(["u_matrix","u_sizeRatio","u_correctionRatio","u_cameraAngle","u_pickingPadding","u_nodeDataTexture","u_layerAttributeTexture"]),t=new Set,r=a.flatMap(function(f){return f.uniforms}).filter(function(f){return e.has(f.name)||t.has(f.name)?!1:(t.add(f.name),!0)}).map(function(f){return"uniform ".concat(f.type," ").concat(f.name,";")}).join(`
`),i=n.flatMap(function(f){return f.uniforms}).filter(function(f){return e.has(f.name)||t.has(f.name)?!1:(t.add(f.name),!0)}).map(function(f){return"uniform ".concat(f.type," ").concat(f.name,";")}).join(`
`),o=_a(a,n),s=new Set,l=o.flatMap(function(f){return f.attributes}).filter(function(f){var g=f.name.replace(/^a_/,"");return s.has(g)?!1:(s.add(g),!0)}).map(function(f){var g=f.name.replace(/^a_/,""),y=f.size===1?"float":"vec".concat(f.size);return"out ".concat(y," v_").concat(g,";")}).join(`
`),u=Xt(Be(o),{varPrefix:"layer",baseTexelExpr:"nodeIdx * u_layerAttributeTexelsPerNode",textureWidthUniform:"u_layerAttributeTextureWidth",textureSamplerUniform:"u_layerAttributeTexture"}),d=u.fetchCode,h=u.varyingAssignments,c=`#version 300 es

// Standard node attributes (per instance) - minimal buffer usage
in float a_nodeIndex;  // Index into node data texture AND layer attribute texture
in vec4 a_id;          // Node ID for picking
in float a_opacity;    // Node opacity, applied once to the final fragment

// Constant attributes (per vertex, same for all instances)
in vec2 a_quadCorner;  // (-1,-1), (1,-1), (1,1), (-1,1) for quad corners

// Standard uniforms
uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
#ifdef PICKING_MODE
uniform float u_pickingPadding;
#endif
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;

// Layer attribute texture uniforms
uniform sampler2D u_layerAttributeTexture;
uniform int u_layerAttributeTextureWidth;
uniform int u_layerAttributeTexelsPerNode;

`.concat(r,`
`).concat(i,`

// Standard varyings
out vec2 v_uv;                    // Normalized coordinates [-1, 1]
out vec4 v_id;
out float v_opacity;
out float v_antialiasingWidth;    // Width for antialiasing in UV space
out float v_pixelSize;            // Node size in pixels (for pixel-mode borders)
out float v_pixelToUV;            // Conversion factor: multiply by this to convert screen pixels to UV units
out float v_shapeId;              // Shape ID for multi-shape programs

// Layer varyings
`).concat(l,`

// Node-data fetch helpers (geometry texel + rotation-flags texel)
`).concat(at,`
`).concat(St,`

void main() {
  // Fetch node geometry: vec4(x, y, size, shapeId).
  int nodeIdx = int(a_nodeIndex);

  // Hidden nodes are flagged with a negative row by NodeProgram.process(). Push
  // the whole quad outside the clip volume: every vertex lands at the same
  // out-of-range position, so the primitive is fully clipped and rasterizes
  // nothing \u2014 neither to the frame buffer nor to the picking buffer.
  if (nodeIdx < 0) {
    gl_Position = vec4(2.0, 0.0, 0.0, 1.0);
    v_id = vec4(0.0);
    return;
  }

  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 a_position = nodeData.xy;
  float a_size = nodeData.z;
  v_shapeId = nodeData.w;  // Pass shape ID to fragment shader

  // Per-node rotation alignment: 0 = viewport (screen-upright), 1 = graph.
  float nodeRotation = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx).r;

`).concat(d,`

  // Calculate the actual size in pixels
  float size = a_size * u_correctionRatio / u_sizeRatio * 2.0;

  // In PICKING_MODE, inflate the quad by nodePickingPadding pixels on each side
  #ifdef PICKING_MODE
    float paddedSize = size + u_pickingPadding * u_correctionRatio;
    vec2 offset = a_quadCorner * paddedSize;
  #else
    vec2 offset = a_quadCorner * size;
  #endif
  // Counter-rotate the quad offset so viewport-aligned nodes stay upright as the
  // camera turns. Graph-aligned nodes (nodeRotation=1) skip it and turn with the
  // camera. The angle scales by (1 - nodeRotation) so both fall out of one path.
  {
    float ca = u_cameraAngle * (1.0 - nodeRotation);
    float c = cos(ca);
    float s = sin(ca);
    offset = mat2(c, s, -s, c) * offset;
  }
  vec2 position = a_position + offset;

  gl_Position = vec4(
    (u_matrix * vec3(position, 1)).xy,
    0,
    1
  );

  // In PICKING_MODE, UV is scaled beyond [-1, 1] to match the inflated quad
  #ifdef PICKING_MODE
    v_uv = a_quadCorner * (paddedSize / size);
  #else
    v_uv = a_quadCorner;
  #endif

  // Pass ID to fragment shader
  v_id = a_id;
  v_opacity = a_opacity;

  // Pass pixel size for layers that need pixel-mode calculations
  // Multiply by 2 because 'size' is half-width (offset from center), not full diameter
  v_pixelSize = size * 2.0;

  // Conversion factor from screen pixels to UV units
  // Same derivation as v_antialiasingWidth which represents ~1 pixel in UV space
  // P pixels in UV space = P * u_correctionRatio / size
  v_pixelToUV = u_correctionRatio / size;

  // We use an antialiasing width of 1px (so v_pixelToUV)
  v_antialiasingWidth = v_pixelToUV;

  // Pass layer attributes to fragment shader (fetched from texture)
`).concat(h,`
}
`);return c}function Yu(a,n,e){var t=arguments.length>3&&arguments[3]!==void 0?arguments[3]:!0,r=n.map(function(g,y){var m="layer_".concat(g.name),v=[].concat(K(g.attributes.map(function(p){return"v_".concat(p.name.replace(/^a_/,""))})),K(g.uniforms.map(function(p){return p.name}))).join(", ");return"  // Layer ".concat(y+1,": ").concat(g.name,`
  color = blendOver(color, `).concat(m,"(").concat(v,"));")}).join(`

`),i=new Set(["u_correctionRatio"]),o=new Set,s=a.flatMap(function(g){return g.uniforms}).filter(function(g){return i.has(g.name)||o.has(g.name)?!1:(o.add(g.name),!0)}).map(function(g){return"uniform ".concat(g.type," ").concat(g.name,";")}).join(`
`),l=n.flatMap(function(g){return g.uniforms}).filter(function(g){return i.has(g.name)||o.has(g.name)?!1:(o.add(g.name),!0)}).map(function(g){return"uniform ".concat(g.type," ").concat(g.name,";")}).join(`
`),u=new Set,d=_a(a,n).flatMap(function(g){return g.attributes}).filter(function(g){var y=g.name.replace(/^a_/,"");return u.has(y)?!1:(u.add(y),!0)}).map(function(g){var y=g.name.replace(/^a_/,""),m=g.size===1?"float":"vec".concat(g.size);return"in ".concat(m," v_").concat(y,";")}).join(`
`),h=ir(a),c=Fu(a,e),f=`#version 300 es
precision highp float;

// Standard varyings
in vec2 v_uv;
in vec4 v_id;
in float v_opacity;
in float v_antialiasingWidth;
in float v_pixelSize;
in float v_pixelToUV;
in float v_shapeId;  // Shape ID for multi-shape programs

// Standard uniforms (needed for some layer calculations like pixel-mode borders)
uniform float u_correctionRatio;
#ifdef PICKING_MODE
uniform float u_pickingPadding;
#endif

// Shape uniforms
`.concat(s,`

// Layer uniforms
`).concat(l,`

// Layer varyings
`).concat(d,`

// Fragment output (single target - picking handled via separate pass)
out vec4 fragColor;

// LayerContext struct - provides rendering context to all layers
struct LayerContext {
  float sdf;             // Signed distance from shape boundary (negative inside)
  vec2 uv;               // UV coordinates [-1, 1], center at (0,0)
  float shapeSize;       // Effective shape size (~diameter) in UV space (1.0 - aaWidth)
  float shapeHalfSize;   // Effective shape half size (~radius) in UV space
  float pixelSize;       // Node full size (~diameter) in screen pixels
  float aaWidth;         // Anti-aliasing width for smooth transitions
  float correctionRatio; // Scaling factor for consistent rendering across zoom levels
  float pixelToUV;       // Conversion factor: multiply screen pixels by this to get UV units
  float inradiusFactor;  // Ratio of inradius to circumradius (shape depth factor)
};

LayerContext context;  // Global instance, populated before layer calls

// Alpha "over" compositing for layer blending
vec4 blendOver(vec4 bg, vec4 fg) {
  float a = fg.a;
  return vec4(mix(bg.rgb, fg.rgb, a), bg.a + a * (1.0 - bg.a));
}

// SDF shape functions
`).concat(h,`

// Shape selector function (sets context.sdf and context.inradiusFactor)
`).concat(c,`

// Layer functions
`).concat(n.map(function(g){return g.glsl}).join(`

`),`

void main() {
  // 1. Setup LayerContext (available to all layer functions)
  context.shapeSize = 1.0 - v_antialiasingWidth;
  context.shapeHalfSize = context.shapeSize * 0.5;
  context.pixelSize = v_pixelSize;
  context.uv = v_uv;
  context.aaWidth = v_antialiasingWidth;
  context.correctionRatio = u_correctionRatio;
  context.pixelToUV = v_pixelToUV;

  // Query shape SDF based on shapeId (sets context.sdf and context.inradiusFactor)
  queryNodeSDF(int(v_shapeId), v_uv, context.shapeSize);

  // 2. Early discard for pixels fully outside the shape (with AA margin)
  // In PICKING_MODE, allow extra fragments up to the picking padding distance
  #ifdef PICKING_MODE
    if (context.sdf > u_pickingPadding * v_pixelToUV + context.aaWidth) discard;
  #else
    if (context.sdf > context.aaWidth) discard;
  #endif

  // 3. Apply layers sequentially with "over" compositing
  vec4 color = vec4(0.0);

`).concat(r,`

  #ifdef PICKING_MODE
    // Picking pass: output node ID for pixels within the picking area.
    if (context.sdf > u_pickingPadding * v_pixelToUV) discard;
    fragColor = v_id;
  #else
`).concat(t?`    // Visual pass: apply antialiasing at shape boundary, node opacity once
    // smoothstep provides smooth transition from opaque to transparent
    float alpha = smoothstep(context.aaWidth, -context.aaWidth, context.sdf) * v_opacity;`:`    // Visual pass: hard-edged (no anti-aliasing gradient) shape boundary, node opacity applied once
    float alpha = (context.sdf < 0.0 ? 1.0 : 0.0) * v_opacity;`,`
    // Mix with transparent to fade both color AND alpha together (avoids bright halo)
    fragColor = mix(vec4(0.0), color, alpha);
  #endif
}
`);return f}function Ku(a,n){var e=new Set;return e.add("u_matrix"),e.add("u_sizeRatio"),e.add("u_correctionRatio"),e.add("u_cameraAngle"),e.add("u_pickingPadding"),e.add("u_nodeDataTexture"),e.add("u_nodeDataTextureWidth"),e.add("u_layerAttributeTexture"),e.add("u_layerAttributeTextureWidth"),e.add("u_layerAttributeTexelsPerNode"),a.forEach(function(t){t.uniforms.forEach(function(r){return e.add(r.name)})}),n.forEach(function(t){t.uniforms.forEach(function(r){return e.add(r.name)})}),Array.from(e)}function Zu(a){var n=WebGL2RenderingContext,e=n.UNSIGNED_BYTE,t=n.FLOAT;return[{name:"a_nodeIndex",size:1,type:t},{name:"a_id",size:4,type:e,normalized:!0},{name:"a_opacity",size:1,type:t}]}function zi(a){var n=a.shapes,e=a.layers,t=a.shapeGlobalIds,r=a.antialias,i=r===void 0?!0:r;return{vertexShader:Xu(n,e),fragmentShader:Yu(n,e,t,i),uniforms:Ku(n,e),attributes:Zu()}}function Ji(a,n,e){var t=Qt(a,n),r=t.specs;return Object.keys(r).map(function(i){return"flat ".concat(e," ").concat(r[i].size===1?"float":"vec".concat(r[i].size)," v_").concat(i,";")}).join(`
`)}function Qu(a){var n,e,t=a.shapes,r=a.layers,i=a.shapeGlobalIds,o=Xt(Qt(t,r),{varPrefix:"nodeAttr",baseTexelExpr:"nodeIdx * u_layerAttributeTexelsPerNode",textureWidthUniform:"u_layerAttributeTextureWidth",textureSamplerUniform:"u_layerAttributeTexture"}),s=t.length===1?"float inradiusFactor = ".concat(me((n=t[0].inradiusFactor)!==null&&n!==void 0?n:1),";"):"float inradiusFactor = ".concat(me((e=t[0].inradiusFactor)!==null&&e!==void 0?e:1),`;
  switch (int(shapeId)) {
`).concat(t.map(function(u,d){var h,c=i?i[d]:d;return"    case ".concat(c,": inradiusFactor = ").concat(me((h=u.inradiusFactor)!==null&&h!==void 0?h:1),"; break;")}).join(`
`),`
    default: break;
  }`),l=`#version 300 es

in float a_nodeIndex;
in float a_labelWidth;
in float a_labelHeight;
in float a_textHeight;
in float a_positionMode;
in float a_labelAngle;
in vec4 a_backdropColor;
in vec4 a_backdropShadowColor;
in float a_backdropShadowBlur;
in float a_backdropPadding;
in vec4 a_backdropBorderColor;
in vec4 a_backdropExtra; // [borderWidth, cornerRadius, labelPadding, area]
in vec2 a_labelBoxOffset;
in vec2 a_quadCorner;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_labelMargin;
uniform float u_zoomLabelSizeRatio;
uniform float u_labelPixelSnapping;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_nodeFrameTexture;
uniform int u_nodeFrameTextureWidth;
uniform sampler2D u_layerAttributeTexture;
uniform int u_layerAttributeTextureWidth;
uniform int u_layerAttributeTexelsPerNode;

out vec2 v_uv;
out vec2 v_nodeCenter;
out float v_nodeRadius;
out vec2 v_labelCenter;
out vec2 v_labelHalfSize;
out float v_aaWidth;
out float v_shapeId;
out float v_nodeRotation;
out float v_labelAngle;
out vec4 v_backdropColor;
out vec4 v_backdropShadowColor;
out float v_backdropShadowBlur;
out float v_backdropPadding;
out vec4 v_backdropBorderColor;
out float v_backdropBorderWidth;
out float v_backdropCornerRadius;
out float v_backdropArea;
`.concat(Ji(t,r,"out"),`

`).concat(at,`
`).concat(St,`
`).concat(Zt,`

void main() {
  int nodeIdx = int(a_nodeIndex);
`).concat(o.fetchCode,`
`).concat(o.varyingAssignments,`

  // Node data: (x, y, size, shapeId). shapeId (global) is forwarded to the
  // fragment shader, which keeps the shape SDF for the outline.
  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 nodePosition = nodeData.xy;
  float nodeSize = nodeData.z;
  float shapeId = nodeData.w;

  // Per-node rotation alignment (0 = viewport, 1 = graph). nodeRotation drives
  // the fragment's shape outline; labelRotation turns the label box with camera.
  vec4 nodeFlags = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  float nodeRotation = nodeFlags.r;
  float labelRotation = nodeFlags.g;
  v_nodeRotation = nodeRotation;

  `).concat(Xi,`
  // CSS pixel attributes are multiplied by u_pixelRatio to match nodeRadiusPixels,
  // which is already in physical pixels (nodeRadiusNDC * u_resolution.x / 2.0).
  float padding = a_backdropPadding * u_pixelRatio;
  float shadowBlur = a_backdropShadowBlur * u_pixelRatio;
  // Unpack a_backdropExtra: [borderWidth, cornerRadius, labelPadding, area]
  float borderWidth = a_backdropExtra.x * u_pixelRatio;
  float cornerRadius = a_backdropExtra.y * u_pixelRatio;
  float labelPad = a_backdropExtra.z * u_pixelRatio;
  float backdropArea = a_backdropExtra.w;
  // Use 2x shadowBlur so the Gaussian fully decays before the quad edge
  float totalExpansion = shadowBlur * 2.0 + borderWidth;
  float enlargedRadius = nodeRadiusPixels + padding;

  // Circumscribed radius for the quad bounds. Non-circular shapes reach past
  // their inradius out to their circumradius (= enlargedRadius / inradiusFactor),
  // in any direction once rotated. The axis-aligned quad must contain that, or
  // the fill/shadow gets clipped (square corners, triangle tip, etc.).
  `).concat(s,`
  float boundRadius = enlargedRadius / inradiusFactor;

  // Apply zoom-dependent label size scaling
  float zoomScale = u_zoomLabelSizeRatio;
  float labelW = a_labelWidth * zoomScale * u_pixelRatio;
  float labelH = a_labelHeight * zoomScale * u_pixelRatio;
  float labelMargin = u_labelMargin * zoomScale * u_pixelRatio;

  // Only apply labelPad when a label is actually present
  float effectiveLabelPad = labelW > 0.0 ? labelPad : 0.0;
  vec2 labelHalfSize = vec2(labelW * 0.5 + effectiveLabelPad, labelH * 0.5 + effectiveLabelPad);
  vec2 labelOffset = vec2(0.0);

  // Effective label angle: intrinsic angle plus the camera angle when the label
  // is graph-aligned, so the box orbits the node in lockstep with the frame-pass.
  float labelAngle = a_labelAngle - labelRotation * u_cameraAngle;
  float la_c = cos(labelAngle);
  float la_s = sin(labelAngle);
  mat2 labelRotMat = mat2(la_c, -la_s, la_s, la_c);

  vec3 nodeClip = u_matrix * vec3(nodePosition, 1.0);
  vec2 snapDelta = vec2(0.0);

  if (labelW > 0.0) {
    // labelW > 0.0 means this node's label is displayed, so the frame-pass wrote
    // its edge distance this frame.
    float edgeDistPixels = nodeRadiusPixels * readFrameTexel(u_nodeFrameTexture, u_nodeFrameTextureWidth, nodeIdx).r;
    // labelMargin matches the label shader's margin (gap from node edge to text)
    float labelStart = edgeDistPixels + labelMargin;
    // Above/below center on the actual glyph height, not the font line box, so
    // the box stays aligned with the rendered text (matches labelBoxCenter()).
    float textHalf = a_textHeight * zoomScale * u_pixelRatio * 0.5;

    // Snap node center to pixel grid so label/backdrop/attachment move as a unit
    vec2 nodeScreen = vec2(
      (nodeClip.x + 1.0) * u_resolution.x,
      (1.0 - nodeClip.y) * u_resolution.y
    ) * 0.5;
    snapDelta = (round(nodeScreen) - nodeScreen) * u_labelPixelSnapping;

    if (a_positionMode < 0.5) {
      // Right: box spans from node center to text end + padding
      float boxRightEdge = labelStart + labelW + labelPad;
      labelOffset = vec2(boxRightEdge * 0.5, 0.0);
      labelHalfSize.x = boxRightEdge * 0.5;
    } else if (a_positionMode < 1.5) {
      // Left: mirror of right
      float boxLeftEdge = labelStart + labelW + labelPad;
      labelOffset = vec2(-boxLeftEdge * 0.5, 0.0);
      labelHalfSize.x = boxLeftEdge * 0.5;
    } else if (a_positionMode < 2.5) {
      // Above: text bottom at labelStart, centered horizontally
      labelOffset = vec2(0.0, -(labelStart + textHalf));
    } else if (a_positionMode < 3.5) {
      // Below: text top at labelStart, centered horizontally
      labelOffset = vec2(0.0, labelStart + textHalf);
    }
    // over (>=4): labelOffset stays (0,0) \u2014 text centered on the node.

    // The attachment-cover shift is in label space (like the attachment itself),
    // so rotate it together with the position offset \u2014 otherwise the box drifts
    // off the attachment as the label angle grows.
    labelOffset = labelRotMat * (labelOffset + a_labelBoxOffset * zoomScale * u_pixelRatio);
  }

  // For node-only mode, zero out label dimensions
  if (backdropArea > 0.5 && backdropArea < 1.5) {
    labelHalfSize = vec2(0.0);
    labelOffset = vec2(0.0);
  }

  vec2 minBound, maxBound;

  bool hasLabelBounds = labelW > 0.0 && (backdropArea > 1.5 || backdropArea < 0.5);

  if (hasLabelBounds) {
    // Union with label bounds (area=both) or label-only bounds (area=label)
    vec2 labelMin, labelMax;

    if (a_labelAngle != 0.0) {
      vec2 corner1 = labelOffset + labelRotMat * vec2(-labelHalfSize.x, -labelHalfSize.y);
      vec2 corner2 = labelOffset + labelRotMat * vec2(labelHalfSize.x, -labelHalfSize.y);
      vec2 corner3 = labelOffset + labelRotMat * vec2(labelHalfSize.x, labelHalfSize.y);
      vec2 corner4 = labelOffset + labelRotMat * vec2(-labelHalfSize.x, labelHalfSize.y);
      labelMin = min(min(corner1, corner2), min(corner3, corner4));
      labelMax = max(max(corner1, corner2), max(corner3, corner4));
    } else {
      labelMin = labelOffset - labelHalfSize;
      labelMax = labelOffset + labelHalfSize;
    }

    if (backdropArea > 1.5) {
      // Label-only: bounds from label rect only
      minBound = labelMin - totalExpansion;
      maxBound = labelMax + totalExpansion;
    } else {
      // Both: union of node + label
      minBound = min(-vec2(boundRadius), labelMin) - totalExpansion;
      maxBound = max(vec2(boundRadius), labelMax) + totalExpansion;
    }
  } else {
    // Node-only or no visible label
    float totalRadius = boundRadius + totalExpansion;
    minBound = -vec2(totalRadius);
    maxBound = vec2(totalRadius);
  }

  vec2 quadSize = maxBound - minBound;
  vec2 quadCenter = (minBound + maxBound) * 0.5;

  vec2 localPos = quadCenter + a_quadCorner * quadSize * 0.5 + snapDelta;
  vec2 ndcOffset = localPos * 2.0 / u_resolution;
  ndcOffset.y = -ndcOffset.y;

  gl_Position = vec4(nodeClip.xy + ndcOffset, 0.0, 1.0);

  v_uv = localPos;
  v_nodeCenter = vec2(0.0);
  v_nodeRadius = nodeRadiusPixels;
  v_labelCenter = labelOffset;
  v_labelHalfSize = labelHalfSize;
  v_aaWidth = 1.0;
  v_shapeId = shapeId;
  v_labelAngle = labelAngle;
  v_backdropColor = a_backdropColor;
  v_backdropShadowColor = a_backdropShadowColor;
  v_backdropShadowBlur = a_backdropShadowBlur;
  v_backdropPadding = a_backdropPadding;
  v_backdropBorderColor = a_backdropBorderColor;
  v_backdropBorderWidth = borderWidth;
  v_backdropCornerRadius = cornerRadius;
  v_backdropArea = backdropArea;
}
`);return l}function Ju(a){var n=a.shapes,e=a.layers,t=a.shapeGlobalIds,r=ir(n),i=_n(n).map(function(c){return"uniform ".concat(c.type," ").concat(c.name,";")}).join(`
`),o=function(f){return va(f,"nodeUV","1.0")},s;if(n.length===1)s="float nodeSdfNormalized = ".concat(o(n[0]),";");else{var l=n.map(function(c,f){var g=t?t[f]:f;return"    case ".concat(g,": nodeSdfNormalized = ").concat(o(c),"; break;")}).join(`
`),u=o(n[0]);s=`float nodeSdfNormalized;
  int shapeId = int(v_shapeId);
  switch (shapeId) {
`.concat(l,`
    default: nodeSdfNormalized = `).concat(u,`;
  }`)}var d=`float effectiveRadius = max(enlargedRadius - cornerRadius, 0.01);
  float ca = u_cameraAngle * v_nodeRotation;
  float ca_c = cos(ca);
  float ca_s = sin(ca);
  vec2 rotatedScreenUV = mat2(ca_c, -ca_s, ca_s, ca_c) * screenUV;
  vec2 nodeUV = vec2(rotatedScreenUV.x, -rotatedScreenUV.y) / effectiveRadius;`,h=`#version 300 es
precision highp float;

in vec2 v_uv;
in vec2 v_nodeCenter;
in float v_nodeRadius;
in vec2 v_labelCenter;
in vec2 v_labelHalfSize;
in float v_aaWidth;
in float v_shapeId;
in float v_nodeRotation;
in float v_labelAngle;
in vec4 v_backdropColor;
in vec4 v_backdropShadowColor;
in float v_backdropShadowBlur;
in float v_backdropPadding;
in vec4 v_backdropBorderColor;
in float v_backdropBorderWidth;
in float v_backdropCornerRadius;
in float v_backdropArea;
`.concat(Ji(n,e,"in"),`

uniform float u_cameraAngle;
`).concat(i,`

layout(location = 0) out vec4 fragColor;
layout(location = 1) out vec4 fragPicking;

`).concat(r,`
`).concat(Gu,`
`).concat(zu,`
`).concat(Nu,`
`).concat(Wu,`

void main() {
  vec4 backdropColor = v_backdropColor;
  vec4 shadowColor = v_backdropShadowColor;
  float shadowBlur = v_backdropShadowBlur;
  float padding = v_backdropPadding;
  vec4 borderColor = v_backdropBorderColor;
  float borderWidth = v_backdropBorderWidth;
  float cornerRadius = v_backdropCornerRadius;

  float enlargedRadius = v_nodeRadius + padding;
  vec2 screenUV = v_uv - v_nodeCenter;
  `).concat(d,`

  // Query the correct shape SDF based on shapeId
  `).concat(s,`
  float nodeSdfPixels = nodeSdfNormalized * effectiveRadius - cornerRadius;

  // Label SDF with optional corner radius and rotation
  float labelSdfPixels;
  if (v_labelHalfSize.x > 0.0) {
    vec2 labelP = v_uv - v_labelCenter;
    labelSdfPixels = sdfRoundedRotatedBox(labelP, v_labelHalfSize, v_labelAngle, cornerRadius);
  } else {
    labelSdfPixels = 10000.0;
  }

  // Select area: 0=both, 1=node, 2=label
  float combinedSdf;
  if (v_backdropArea > 1.5) {
    combinedSdf = labelSdfPixels;
  } else if (v_backdropArea > 0.5) {
    combinedSdf = nodeSdfPixels;
  } else {
    combinedSdf = min(nodeSdfPixels, labelSdfPixels);
  }

  // Fill + border composite
  float outerEdge = smoothstep(v_aaWidth, -v_aaWidth, combinedSdf);
  vec4 background;
  if (borderWidth > 0.5) {
    float innerEdge = smoothstep(v_aaWidth, -v_aaWidth, combinedSdf + borderWidth);
    float fillAlpha = innerEdge * backdropColor.a;
    vec4 fill = vec4(backdropColor.rgb * fillAlpha, fillAlpha);
    float borderAlpha = (outerEdge - innerEdge) * borderColor.a;
    vec4 border = vec4(borderColor.rgb * borderAlpha, borderAlpha);
    background = fill + border * (1.0 - fill.a);
  } else {
    float fillAlpha = outerEdge * backdropColor.a;
    background = vec4(backdropColor.rgb * fillAlpha, fillAlpha);
  }

  // Gaussian-like shadow falloff (mimics canvas shadowBlur)
  vec4 shadow = vec4(0.0);
  float sigma = shadowBlur / 2.5;
  if (sigma > 0.001) {
    float shadowDist = max(0.0, combinedSdf);
    float shadowAlpha = exp(-(shadowDist * shadowDist) / (2.0 * sigma * sigma)) * shadowColor.a;
    shadow = vec4(shadowColor.rgb * shadowAlpha, shadowAlpha);
  }

  fragColor = background + shadow * (1.0 - background.a);
  fragPicking = vec4(0.0);
}
`);return h}function ed(a){var n=["u_matrix","u_sizeRatio","u_correctionRatio","u_cameraAngle","u_resolution","u_pixelRatio","u_labelMargin","u_zoomLabelSizeRatio","u_labelPixelSnapping","u_nodeDataTexture","u_nodeDataTextureWidth","u_nodeFrameTexture","u_nodeFrameTextureWidth","u_layerAttributeTexture","u_layerAttributeTextureWidth","u_layerAttributeTexelsPerNode"],e=U(_n(a)),t;try{for(e.s();!(t=e.n()).done;){var r=t.value;n.includes(r.name)||n.push(r.name)}}catch(i){e.e(i)}finally{e.f()}return n}function td(a){return{vertexShader:Qu(a),fragmentShader:Ju(a),uniforms:ed(a.shapes)}}function nd(a,n,e,t){var r,i,o=t.label,s=o===void 0?{}:o,l=t.shapes,u=t.layers,d=t.getAttributeTexture,h=t.shapeGlobalIds;if(l.length===0)throw new Error("createBackdropProgram: at least one shape must be provided in 'shapes'");var c=(r=s.margin)!==null&&r!==void 0?r:5,f=(i=s.zoomToLabelSizeRatioFunction)!==null&&i!==void 0?i:function(){return 1},g={shapes:l,layers:u,shapeGlobalIds:h},y=td(g),m=(function(v){function p(){var b;J(this,p);for(var T=arguments.length,_=new Array(T),E=0;E<T;E++)_[E]=arguments[E];return b=ce(this,p,[].concat(_)),D(b,"totalBackdropCount",0),D(b,"bufferCapacity",0),b}return fe(p,v),ee(p,[{key:"getDefinition",value:function(){var T=WebGL2RenderingContext,_=T.FLOAT,E=T.TRIANGLE_STRIP;return{VERTICES:4,VERTEX_SHADER_SOURCE:y.vertexShader,FRAGMENT_SHADER_SOURCE:y.fragmentShader,METHOD:E,UNIFORMS:y.uniforms,ATTRIBUTES:[{name:"a_nodeIndex",size:1,type:_},{name:"a_labelWidth",size:1,type:_},{name:"a_labelHeight",size:1,type:_},{name:"a_textHeight",size:1,type:_},{name:"a_positionMode",size:1,type:_},{name:"a_labelAngle",size:1,type:_},{name:"a_backdropColor",size:4,type:_},{name:"a_backdropShadowColor",size:4,type:_},{name:"a_backdropShadowBlur",size:1,type:_},{name:"a_backdropPadding",size:1,type:_},{name:"a_backdropBorderColor",size:4,type:_},{name:"a_backdropExtra",size:4,type:_},{name:"a_labelBoxOffset",size:2,type:_}],CONSTANT_ATTRIBUTES:[{name:"a_quadCorner",size:2,type:_}],CONSTANT_DATA:[[-1,-1],[1,-1],[-1,1],[1,1]]}}},{key:"processBackdrop",value:function(T,_){var E=this.floats,w=this.STRIDE,A=T*w;E[A++]=_.nodeIndex,E[A++]=_.labelWidth,E[A++]=_.labelHeight,E[A++]=_.textHeight,E[A++]=Yt[_.position],E[A++]=_.labelAngle,E[A++]=_.backdropColor[0],E[A++]=_.backdropColor[1],E[A++]=_.backdropColor[2],E[A++]=_.backdropColor[3],E[A++]=_.backdropShadowColor[0],E[A++]=_.backdropShadowColor[1],E[A++]=_.backdropShadowColor[2],E[A++]=_.backdropShadowColor[3],E[A++]=_.backdropShadowBlur,E[A++]=_.backdropPadding,E[A++]=_.backdropBorderColor[0],E[A++]=_.backdropBorderColor[1],E[A++]=_.backdropBorderColor[2],E[A++]=_.backdropBorderColor[3],E[A++]=_.backdropBorderWidth,E[A++]=_.backdropCornerRadius,E[A++]=_.backdropLabelPadding,E[A++]=_.backdropArea,E[A++]=_.labelBoxOffset[0],E[A++]=_.labelBoxOffset[1]}},{key:"setUniforms",value:function(T,_){var E=_.gl,w=_.uniformLocations;E.uniformMatrix3fv(w.u_matrix,!1,T.matrix),E.uniform1f(w.u_sizeRatio,T.sizeRatio),E.uniform1f(w.u_correctionRatio,T.correctionRatio),E.uniform1f(w.u_cameraAngle,T.cameraAngle),E.uniform2f(w.u_resolution,T.width*T.pixelRatio,T.height*T.pixelRatio),E.uniform1f(w.u_pixelRatio,T.pixelRatio),E.uniform1f(w.u_labelMargin,p.labelMargin),E.uniform1f(w.u_zoomLabelSizeRatio,1/f(T.zoomRatio)),E.uniform1f(w.u_labelPixelSnapping,T.labelPixelSnapping),E.uniform1i(w.u_nodeDataTexture,T.nodeDataTextureUnit),E.uniform1i(w.u_nodeDataTextureWidth,T.nodeDataTextureWidth),E.uniform1i(w.u_nodeFrameTexture,T.nodeFrameTextureUnit),E.uniform1i(w.u_nodeFrameTextureWidth,T.nodeFrameTextureWidth);var A=d();w.u_layerAttributeTexture&&A&&(A.bind(dt),E.uniform1i(w.u_layerAttributeTexture,dt),E.uniform1i(w.u_layerAttributeTextureWidth,A.getTextureWidth()),E.uniform1i(w.u_layerAttributeTexelsPerNode,A.getTexelsPerItem()));var S=U(_n(l)),k;try{for(S.s();!(k=S.n()).done;){var z=k.value;this.setTypedUniform(z,_)}}catch(C){S.e(C)}finally{S.f()}}},{key:"hasNothingToRender",value:function(){return this.totalBackdropCount===0}},{key:"drawWebGL",value:function(T,_){var E=_.gl;this.totalBackdropCount!==0&&(this.isInstanced?E.drawArraysInstanced(T,0,this.VERTICES,this.totalBackdropCount):E.drawArrays(T,0,this.totalBackdropCount*this.VERTICES))}},{key:"reallocate",value:function(T){this.totalBackdropCount=T,T>this.bufferCapacity&&(this.bufferCapacity=Math.max(T,Math.ceil(this.bufferCapacity*1.5)||10),_e(p,"reallocate",this,3)([this.bufferCapacity]))}}])})(At);return D(m,"labelMargin",c),new m(a,n,e)}var eo=(function(a){function n(){var e;J(this,n);for(var t=arguments.length,r=new Array(t),i=0;i<t;i++)r[i]=arguments[i];return e=ce(this,n,[].concat(r)),D(e,"totalCharacterCount",0),D(e,"bufferCapacity",0),e}return fe(n,a),ee(n,[{key:"processLabel",value:function(t,r,i){if(i.hidden||!i.text)return 0;for(var o=i.text,s=o.length,l=0;l<s;l++){var u=o[l];this.processCharacter(r+l,i,u,l)}return s}},{key:"hasNothingToRender",value:function(){return this.totalCharacterCount===0}},{key:"drawWebGL",value:function(t,r){var i=r.gl;this.totalCharacterCount!==0&&(this.isInstanced?i.drawArraysInstanced(t,0,this.VERTICES,this.totalCharacterCount):i.drawArrays(t,0,this.totalCharacterCount*this.VERTICES))}},{key:"reallocate",value:function(t){this.totalCharacterCount=t,t>this.bufferCapacity&&(this.bufferCapacity=Math.max(t,Math.ceil(this.bufferCapacity*1.5)||1e3),_e(n,"reallocate",this,3)([this.bufferCapacity]))}}])})(At);function ad(){var a=`#version 300 es

in float a_nodeIndex;
in vec4 a_id;
in vec4 a_color;
in float a_labelWidth;
in float a_labelHeight;
in float a_textHeight;
in float a_positionMode;
in float a_labelAngle;
in float a_padding;
in vec2 a_quadCorner;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_labelMargin;
uniform float u_zoomLabelSizeRatio;
uniform float u_labelPixelSnapping;
uniform float u_pickingPadding;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_nodeFrameTexture;
uniform int u_nodeFrameTextureWidth;

out vec4 v_id;
out vec4 v_color;

`.concat(at,`
`).concat(St,`
`).concat(Zt,`
`).concat(Ki,`

void main() {
  int nodeIdx = int(a_nodeIndex);

  // Node data: (x, y, size, shapeId).
  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 nodePosition = nodeData.xy;
  float nodeSize = nodeData.z;

  // Shape-aware edge distance, read once from the shared frame texture.
  float edgeDist = readFrameTexel(u_nodeFrameTexture, u_nodeFrameTextureWidth, nodeIdx).r;

  // Per-node label rotation alignment: 0 = viewport, 1 = label turns with camera.
  float labelRotation = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx).g;

  `).concat(Xi,`

  float zoomScale = u_zoomLabelSizeRatio;
  float labelW = a_labelWidth * zoomScale * u_pixelRatio;
  float labelH = a_labelHeight * zoomScale * u_pixelRatio;
  float labelMargin = u_labelMargin * zoomScale * u_pixelRatio;
#ifdef PICKING_MODE
  float padding = u_pickingPadding * u_pixelRatio;
#else
  float padding = a_padding * u_pixelRatio;
#endif

  if (labelW <= 0.0) {
    gl_Position = vec4(2.0, 0.0, 0.0, 1.0);
    v_id = vec4(0.0);
    v_color = vec4(0.0);
    return;
  }

  vec2 labelHalfSize = vec2(labelW * 0.5 + padding, labelH * 0.5 + padding);
  vec2 labelOffset = vec2(0.0);

  // Graph-aligned labels add the camera angle so the rect orbits with the text.
  float labelAngle = a_labelAngle - labelRotation * u_cameraAngle;
  float la_c = cos(labelAngle);
  float la_s = sin(labelAngle);
  mat2 labelRotMat = mat2(la_c, -la_s, la_s, la_c);

  vec3 nodeClip = u_matrix * vec3(nodePosition, 1.0);
  vec2 nodeScreen = vec2(
    (nodeClip.x + 1.0) * u_resolution.x,
    (1.0 - nodeClip.y) * u_resolution.y
  ) * 0.5;
  vec2 snapDelta = (round(nodeScreen) - nodeScreen) * u_labelPixelSnapping;

  if (a_positionMode < 4.0) {
    float labelStart = nodeRadiusPixels * edgeDist + labelMargin;
    float textHalf = a_textHeight * zoomScale * u_pixelRatio * 0.5;
    // Box center uses the text half-size; the padding expands the quad below.
    labelOffset = labelRotMat * labelBoxCenter(a_positionMode, labelStart, vec2(labelW * 0.5, labelH * 0.5), textHalf);
  }

  // Rotate the rect with the label so it stays aligned with the (rotated) text.
  vec2 localPos = labelOffset + labelRotMat * (a_quadCorner * labelHalfSize);
  vec2 ndcOffset = (localPos + snapDelta) * 2.0 / u_resolution;
  ndcOffset.y = -ndcOffset.y;

  gl_Position = vec4(nodeClip.xy + ndcOffset, 0.0, 1.0);
  v_id = a_id;
  v_color = a_color;
}
`);return a}var rd=`#version 300 es
precision highp float;

in vec4 v_id;
in vec4 v_color;

out vec4 fragColor;

void main() {
  #ifdef PICKING_MODE
    fragColor = v_id;
  #else
    if (v_color.a <= 0.0) discard;
    // v_color is non-premultiplied RGBA (0-1); convert to premultiplied for blending
    fragColor = vec4(v_color.rgb * v_color.a, v_color.a);
  #endif
}
`;function id(a,n,e,t){var r,i,o=t.label,s=o===void 0?{}:o,l=(r=s.margin)!==null&&r!==void 0?r:Kt,u=(i=s.zoomToLabelSizeRatioFunction)!==null&&i!==void 0?i:function(){return 1},d=ad(),h=(function(c){function f(){var g;J(this,f);for(var y=arguments.length,m=new Array(y),v=0;v<y;v++)m[v]=arguments[v];return g=ce(this,f,[].concat(m)),D(g,"totalCount",0),D(g,"bufferCapacity",0),g}return fe(f,c),ee(f,[{key:"getDefinition",value:function(){var y=WebGL2RenderingContext,m=y.FLOAT,v=y.UNSIGNED_BYTE,p=y.TRIANGLE_STRIP;return{VERTICES:4,VERTEX_SHADER_SOURCE:d,FRAGMENT_SHADER_SOURCE:rd,METHOD:p,UNIFORMS:["u_matrix","u_sizeRatio","u_correctionRatio","u_cameraAngle","u_resolution","u_pixelRatio","u_labelMargin","u_zoomLabelSizeRatio","u_labelPixelSnapping","u_pickingPadding","u_nodeDataTexture","u_nodeDataTextureWidth","u_nodeFrameTexture","u_nodeFrameTextureWidth"],ATTRIBUTES:[{name:"a_nodeIndex",size:1,type:m},{name:"a_id",size:4,type:v,normalized:!0},{name:"a_color",size:4,type:v,normalized:!0},{name:"a_labelWidth",size:1,type:m},{name:"a_labelHeight",size:1,type:m},{name:"a_textHeight",size:1,type:m},{name:"a_positionMode",size:1,type:m},{name:"a_labelAngle",size:1,type:m},{name:"a_padding",size:1,type:m}],CONSTANT_ATTRIBUTES:[{name:"a_quadCorner",size:2,type:m}],CONSTANT_DATA:[[-1,-1],[1,-1],[-1,1],[1,1]]}}},{key:"processLabelBackground",value:function(y,m){var v=this.floats,p=this.ints,b=y*this.STRIDE;v[b++]=m.nodeIndex,p[b++]=m.id,v[b++]=m.color,v[b++]=m.labelWidth,v[b++]=m.labelHeight,v[b++]=m.textHeight,v[b++]=m.positionMode,v[b++]=m.labelAngle,v[b++]=m.padding}},{key:"setUniforms",value:function(y,m){var v=m.gl,p=m.uniformLocations;v.uniformMatrix3fv(p.u_matrix,!1,y.matrix),v.uniform1f(p.u_sizeRatio,y.sizeRatio),v.uniform1f(p.u_correctionRatio,y.correctionRatio),v.uniform1f(p.u_cameraAngle,y.cameraAngle),v.uniform2f(p.u_resolution,y.width*y.pixelRatio,y.height*y.pixelRatio),v.uniform1f(p.u_pixelRatio,y.pixelRatio),v.uniform1f(p.u_labelMargin,f.labelMargin),v.uniform1f(p.u_zoomLabelSizeRatio,1/u(y.zoomRatio)),v.uniform1f(p.u_labelPixelSnapping,y.labelPixelSnapping),v.uniform1f(p.u_pickingPadding,y.labelPickingPadding),v.uniform1i(p.u_nodeDataTexture,y.nodeDataTextureUnit),v.uniform1i(p.u_nodeDataTextureWidth,y.nodeDataTextureWidth),v.uniform1i(p.u_nodeFrameTexture,y.nodeFrameTextureUnit),v.uniform1i(p.u_nodeFrameTextureWidth,y.nodeFrameTextureWidth)}},{key:"hasNothingToRender",value:function(){return this.totalCount===0}},{key:"drawWebGL",value:function(y,m){var v=m.gl;this.totalCount!==0&&v.drawArraysInstanced(v.TRIANGLE_STRIP,0,this.VERTICES,this.totalCount)}},{key:"reallocate",value:function(y){this.totalCount=y,y>this.bufferCapacity&&(this.bufferCapacity=Math.max(y,Math.ceil(this.bufferCapacity*1.5)||10),_e(f,"reallocate",this,3)([this.bufferCapacity]))}}])})(At);return D(h,"labelMargin",l),new h(a,n,e)}var qe={fontSize:64,buffer:8,radius:24,cutoff:.25,maxTextureSize:2048,debounceTimeout:100},vn=2,mn=1e20;function od(a,n,e,t,r){var i=a+r*4,o=document.createElement("canvas");o.width=i,o.height=i;var s=o.getContext("2d",{willReadFrequently:!0});return s.font="".concat(t," ").concat(e," ").concat(a,"px ").concat(n),s.textBaseline="alphabetic",s.textAlign="left",s.fillStyle="black",{ctx:s,canvasSize:i,gridOuter:new Float64Array(i*i),gridInner:new Float64Array(i*i),f:new Float64Array(i),z:new Float64Array(i+1),v:new Uint16Array(i)}}function sd(a,n,e,t,r){var i=a.ctx,o=a.canvasSize,s=i.measureText(n),l=s.width,u=s.actualBoundingBoxAscent,d=s.actualBoundingBoxDescent,h=s.actualBoundingBoxLeft,c=s.actualBoundingBoxRight,f=Math.ceil(u),g=Math.ceil(h),y=Math.max(0,Math.min(o-e,Math.ceil(h)+Math.ceil(c))),m=Math.min(o-e,f+Math.ceil(d)),v=y+2*e,p=m+2*e,b=Math.max(v*p,0),T=new Uint8ClampedArray(b),_={data:T,width:v,height:p,glyphWidth:y,glyphHeight:m,glyphTop:f,glyphLeft:g,glyphAdvance:l};if(y===0||m===0)return _;var E=a.gridInner,w=a.gridOuter;i.clearRect(e,e,y,m),i.fillText(n,e+g,e+f);var A=i.getImageData(e,e,y,m);w.fill(mn,0,b),E.fill(0,0,b);for(var S=0;S<m;S++)for(var k=0;k<y;k++){var z=A.data[4*(S*y+k)+3]/255;if(z!==0){var C=(S+e)*v+k+e;if(z===1)w[C]=0,E[C]=mn;else{var N=.5-z;w[C]=N>0?N*N:0,E[C]=N<0?N*N:0}}}Ni(w,0,0,v,p,v,a.f,a.v,a.z),Ni(E,e,e,y,m,v,a.f,a.v,a.z);for(var L=0;L<b;L++){var G=Math.sqrt(w[L])-Math.sqrt(E[L]);T[L]=Math.round(255-255*(G/t+r))}return _}function Ni(a,n,e,t,r,i,o,s,l){for(var u=n;u<n+t;u++)Wi(a,e*i+u,i,r,o,s,l);for(var d=e;d<e+r;d++)Wi(a,d*i+n,1,t,o,s,l)}function Wi(a,n,e,t,r,i,o){i[0]=0,o[0]=-mn,o[1]=mn,r[0]=a[n];for(var s=1,l=0,u=0;s<t;s++){r[s]=a[n+s*e];var d=s*s;do{var h=i[l];u=(r[s]-r[h]+d-h*h)/(s-h)/2}while(u<=o[l]&&--l>-1);l++,i[l]=s,o[l]=u,o[l+1]=mn}for(var c=0,f=0;c<t;c++){for(;o[f+1]<c;)f++;var g=i[f],y=c-g;a[n+c*e]=r[g]+y*y}}var Et=(function(a){function n(){var e,t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return J(this,n),e=ce(this,n),D(e,"fonts",new Map),D(e,"textures",[]),D(e,"cursor",{x:0,y:0,rowHeight:0,atlasIndex:0}),D(e,"pendingGlyphs",[]),D(e,"debounceTimer",null),e.options=O(O({},qe),t),e.canvas=document.createElement("canvas"),e.canvas.width=e.options.maxTextureSize,e.canvas.height=e.options.maxTextureSize,e.ctx=e.canvas.getContext("2d",{willReadFrequently:!0}),e.measureCanvas=document.createElement("canvas"),e.measureCtx=e.measureCanvas.getContext("2d"),e.textures.push(e.ctx.getImageData(0,0,1,1)),e}return fe(n,a),ee(n,[{key:"getFontKey",value:function(t){return"".concat(t.family,"-").concat(t.weight,"-").concat(t.style)}},{key:"registerFont",value:function(t){var r=this.getFontKey(t);if(this.fonts.has(r))return r;var i=od(this.options.fontSize,t.family,t.weight,t.style,this.options.buffer);return this.fonts.set(r,{descriptor:t,generator:i,glyphs:new Map}),r}},{key:"ensureGlyphs",value:function(t,r){var i=this.fonts.get(r);if(!i)throw new Error('Font "'.concat(r,'" is not registered. Call registerFont() first.'));var o=!1,s=U(t),l;try{for(s.s();!(l=s.n()).done;){var u=l.value,d=u.codePointAt(0);d!==void 0&&(i.glyphs.has(d)||(this.pendingGlyphs.push({fontKey:r,charCode:d}),o=!0))}}catch(h){s.e(h)}finally{s.f()}o&&this.scheduleTextureGeneration()}},{key:"measureText",value:function(t,r){var i=this.fonts.get(r);if(!i)throw new Error('Font "'.concat(r,'" is not registered.'));var o=i.descriptor,s=o.family,l=o.weight,u=o.style;return this.measureCtx.font="".concat(u," ").concat(l," ").concat(this.options.fontSize,"px ").concat(s),this.measureCtx.measureText(t).width}},{key:"getGlyph",value:function(t,r){var i=this.fonts.get(r);if(i)return i.glyphs.get(t)}},{key:"getTextures",value:function(){return this.textures}},{key:"getFontCount",value:function(){return this.fonts.size}},{key:"getGlyphCount",value:function(){var t=0,r=U(this.fonts.values()),i;try{for(r.s();!(i=r.n()).done;){var o=i.value;t+=o.glyphs.size}}catch(s){r.e(s)}finally{r.f()}return t}},{key:"hasPendingGlyphs",value:function(){return this.pendingGlyphs.length>0}},{key:"flush",value:function(){this.debounceTimer&&(clearTimeout(this.debounceTimer),this.debounceTimer=null),this.generateTextures()}},{key:"destroy",value:function(){this.debounceTimer&&clearTimeout(this.debounceTimer),this.fonts.clear(),this.textures=[],this.pendingGlyphs=[],this.removeAllListeners()}},{key:"scheduleTextureGeneration",value:function(){var t=this;this.debounceTimer===null&&(this.options.debounceTimeout===null?this.generateTextures():this.debounceTimer=setTimeout(function(){t.debounceTimer=null,t.generateTextures()},this.options.debounceTimeout))}},{key:"generateTextures",value:function(){if(this.pendingGlyphs.length!==0){var t=this.options,r=t.maxTextureSize,i=t.buffer,o=t.radius,s=t.cutoff,l=U(this.pendingGlyphs),u;try{for(l.s();!(u=l.n()).done;){var d=u.value,h=d.fontKey,c=d.charCode,f=this.fonts.get(h);if(!(!f||f.glyphs.has(c))){var g=String.fromCodePoint(c),y=sd(f.generator,g,i,o,s),m=y.width,v=y.height;this.cursor.x+m+vn>r&&(this.cursor.x=0,this.cursor.y+=this.cursor.rowHeight+vn,this.cursor.rowHeight=0),this.cursor.y+v+vn>r&&(this.finalizeCurrentTexture(),this.cursor={x:0,y:0,rowHeight:0,atlasIndex:this.cursor.atlasIndex+1},this.ctx.clearRect(0,0,r,r));for(var p=y.data,b=new Uint8ClampedArray(m*v*4),T=0;T<p.length;T++){var _=T*4;b[_]=255,b[_+1]=255,b[_+2]=255,b[_+3]=p[T]}var E=new ImageData(b,m,v);this.ctx.putImageData(E,this.cursor.x,this.cursor.y);var w={charCode:c,width:y.glyphWidth,height:y.glyphHeight,bearingX:-y.glyphLeft-i,bearingY:y.glyphTop+i,advance:y.glyphAdvance,atlasX:this.cursor.x,atlasY:this.cursor.y,atlasWidth:m,atlasHeight:v,atlasIndex:this.cursor.atlasIndex};f.glyphs.set(c,w),this.cursor.x+=m+vn,this.cursor.rowHeight=Math.max(this.cursor.rowHeight,v)}}}catch(A){l.e(A)}finally{l.f()}this.finalizeCurrentTexture(),this.pendingGlyphs=[],this.emit(n.ATLAS_UPDATED_EVENT,{textures:this.textures,glyphCount:this.getGlyphCount()})}}},{key:"finalizeCurrentTexture",value:function(){var t=this.options.maxTextureSize,r=this.cursor.y>0||this.cursor.rowHeight>0,i=Math.min(t,Math.max(this.cursor.x,r?t:1)),o=Math.min(t,this.cursor.y+this.cursor.rowHeight+vn),s=this.ctx.getImageData(0,0,i,o);this.cursor.atlasIndex>=this.textures.length?this.textures.push(s):this.textures[this.cursor.atlasIndex]=s}}])})(Hi.EventEmitter);D(Et,"ATLAS_UPDATED_EVENT","atlasUpdated");var ld=qe.fontSize;function ud(){var a=`  // -------------------------------------------------------------------------
  // Step 3: Calculate position offset from the shared edge distance
  // -------------------------------------------------------------------------
  vec2 positionOffset = vec2(0.0);

  if (a_positionMode < 4.0) {
    vec2 screenDir = getLabelDirection(a_positionMode);
    float boundaryDistPixels = nodeRadiusPixels * edgeDist;
    positionOffset = screenDir * (boundaryDistPixels + margin);
  }`,n=`#version 300 es

// ============================================================================
// Attributes
// ============================================================================

// Per-character (instanced)
in float a_nodeIndex;        // Index into node data texture
in vec2 a_charOffset;        // Character offset from label origin (pixels)
in vec2 a_charSize;          // Character dimensions (pixels)
in vec4 a_texCoords;         // Atlas coords: (x, y, width, height) in pixels
in vec4 a_color;             // Text color (RGBA)
in float a_margin;           // Gap between node edge and label (pixels)
in float a_positionMode;     // Position: 0=right, 1=left, 2=above, 3=below, 4=over
in float a_labelWidth;       // Total label width (pixels)
in float a_labelHeight;      // Label height (pixels)
in float a_verticalCenter;   // Vertical center offset from baseline (pixels)
in float a_textHeight;       // Actual text height: maxAscent + maxDescent (pixels)
in float a_labelAngle;       // Label rotation angle (radians)

// Per-vertex (constant quad corners)
in vec2 a_quadCorner;        // Quad corner: [-1,-1], [1,-1], [-1,1], [1,1]

// ============================================================================
// Uniforms
// ============================================================================

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform vec2 u_resolution;
uniform vec2 u_atlasSize;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_nodeFrameTexture;
uniform int u_nodeFrameTextureWidth;
uniform float u_zoomLabelSizeRatio;
uniform float u_labelPixelSnapping;
uniform float u_pixelRatio;

// ============================================================================
// Varyings
// ============================================================================

out vec2 v_texCoord;
out vec4 v_color;
out float v_fontScale;

// ============================================================================
// Constants
// ============================================================================

const float bias = 255.0 / 254.0;
const float ATLAS_FONT_SIZE = `.concat(me(ld),`;

// ============================================================================
// Helper Functions
// ============================================================================

`).concat(at,`
`).concat(St,`
`).concat(Zt,`
`).concat(Yi,`

// ============================================================================
// Main
// ============================================================================

void main() {
  // -------------------------------------------------------------------------
  // Step 0: Fetch node data + shared edge distance from textures
  // -------------------------------------------------------------------------
  // Node-data texture format: vec4(x, y, size, shapeId)
  // 2D texture layout: texCoord = (index % width, index / width)
  int nodeIdx = int(a_nodeIndex);
  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 a_anchorPosition = nodeData.xy;
  float a_nodeSize = nodeData.z;

  // Normalized edge distance from the shared frame texture (the frame-pass ran
  // the SDF search once; the label just reads the result).
  float edgeDist = readFrameTexel(u_nodeFrameTexture, u_nodeFrameTextureWidth, nodeIdx).r;

  // Per-node label rotation alignment: 0 = viewport, 1 = label turns with camera.
  float labelRotation = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx).g;

  // Apply zoom-dependent label size scaling
  // Positional values are in CSS pixels; multiply by u_pixelRatio to convert to
  // physical pixels, which is what the NDC conversion (/ u_resolution) expects.
  float zoomScale = u_zoomLabelSizeRatio;
  float margin = a_margin * zoomScale * u_pixelRatio;
  vec2 charOffset = a_charOffset * zoomScale * u_pixelRatio;
  vec2 charSize = a_charSize * zoomScale * u_pixelRatio;
  float labelWidth = a_labelWidth * zoomScale * u_pixelRatio;
  float labelHeight = a_labelHeight * zoomScale;

  // Font scale: ratio of CSS label size to the base atlas font size.
  // Divided by u_pixelRatio because the atlas is generated at ATLAS_FONT_SIZE * pixelRatio,
  // which cancels out the u_pixelRatio in the fragment shader's gamma formula and keeps
  // the anti-aliasing band width consistent across pixel densities.
  v_fontScale = a_labelHeight * zoomScale / (ATLAS_FONT_SIZE * u_pixelRatio);

  // -------------------------------------------------------------------------
  // Step 1: Transform node position to clip space
  // -------------------------------------------------------------------------
  vec3 anchorClip = u_matrix * vec3(a_anchorPosition, 1.0);

  // -------------------------------------------------------------------------
  // Step 2: Convert node size to screen pixels
  // -------------------------------------------------------------------------
  float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
  float nodeRadiusGraphSpace = a_nodeSize * u_correctionRatio / u_sizeRatio * 2.0;
  float nodeRadiusNDC = nodeRadiusGraphSpace * matrixScaleX;
  float nodeRadiusPixels = nodeRadiusNDC * u_resolution.x / 2.0;

`).concat(a,`

  // -------------------------------------------------------------------------
  // Step 4: Calculate final vertex position
  // -------------------------------------------------------------------------
  vec2 cornerOffset = (a_quadCorner + 1.0) * 0.5;
  vec2 charPixelPos = positionOffset + charOffset + cornerOffset * charSize;

  // Apply text alignment based on position mode
  float verticalCenter = a_verticalCenter * zoomScale * u_pixelRatio;
  float textHeight = a_textHeight * zoomScale * u_pixelRatio;
  float baselineToDescent = textHeight / 2.0 - verticalCenter;
  float baselineToAscent = textHeight / 2.0 + verticalCenter;

  if (a_positionMode < 0.5) {
    // Right: vertically center
    charPixelPos.y += verticalCenter;
  } else if (a_positionMode < 1.5) {
    // Left: right-align and vertically center
    charPixelPos.x -= labelWidth;
    charPixelPos.y += verticalCenter;
  } else if (a_positionMode < 2.5) {
    // Above: center horizontally, bottom of text at anchor
    charPixelPos.x -= labelWidth * 0.5;
    charPixelPos.y -= baselineToDescent;
  } else if (a_positionMode < 3.5) {
    // Below: center horizontally, top of text at anchor
    charPixelPos.x -= labelWidth * 0.5;
    charPixelPos.y += baselineToAscent;
  } else {
    // Over: center both
    charPixelPos.x -= labelWidth * 0.5;
    charPixelPos.y += verticalCenter;
  }

  // Apply label angle rotation. Graph-aligned labels add the camera angle so the
  // whole label orbits the node in lockstep with the frame-pass edge distance.
  float labelAngle = a_labelAngle - labelRotation * u_cameraAngle;
  float la_c = cos(labelAngle);
  float la_s = sin(labelAngle);
  mat2 labelRotMat = mat2(la_c, -la_s, la_s, la_c);
  charPixelPos = labelRotMat * charPixelPos;

  // Snap node center to pixel grid so label/backdrop/attachment move as a unit
  vec2 nodeScreen = vec2(
    (anchorClip.x + 1.0) * u_resolution.x,
    (1.0 - anchorClip.y) * u_resolution.y
  ) * 0.5;
  charPixelPos += (round(nodeScreen) - nodeScreen) * u_labelPixelSnapping;

  // Convert to NDC (flip Y: screen Y-down -> clip Y-up)
  vec2 ndcOffset = vec2(charPixelPos.x, -charPixelPos.y) * 2.0 / u_resolution;
  gl_Position = vec4(anchorClip.xy + ndcOffset, 0.0, 1.0);

  // -------------------------------------------------------------------------
  // Step 5: Texture coordinates
  // -------------------------------------------------------------------------
  v_texCoord = (a_texCoords.xy + cornerOffset * a_texCoords.zw) / u_atlasSize;

  // -------------------------------------------------------------------------
  // Step 6: Pass color
  // -------------------------------------------------------------------------
  v_color = a_color;
  v_color.a *= bias;
}
`);return n}function dd(){var a=`#version 300 es
precision highp float;

in vec2 v_texCoord;
in vec4 v_color;
in float v_fontScale;

uniform sampler2D u_atlas;
uniform float u_gamma;
uniform float u_sdfBuffer;
uniform float u_pixelRatio;

// Fragment output (single target - picking handled via separate pass)
out vec4 fragColor;

void main() {
  #ifdef PICKING_MODE
    // Labels are not pickable - discard all fragments in picking mode
    fragColor = vec4(0.0);
    discard;
  #else
    // Sample SDF value from atlas (high = inside glyph, low = outside)
    float sdfValue = texture(u_atlas, v_texCoord).a;

    // Edge threshold: 1.0 - cutoff = 0.75 for default cutoff=0.25
    // This is where the glyph edge is located in the SDF
    float edgeThreshold = 1.0 - u_sdfBuffer;

    // Gamma controls the anti-aliasing band width.
    // Scale inversely with font scale so small labels get a wider AA band
    // (smoother) and large labels get a tighter band (sharper).
    float gamma = u_gamma / (u_pixelRatio * v_fontScale);

    // Pure gamma-based anti-aliasing using smoothstep
    // The AA band extends from (threshold - gamma) to (threshold + gamma)
    float alpha = smoothstep(edgeThreshold - gamma, edgeThreshold + gamma, sdfValue);

    // Premultiplied alpha output for correct blending
    float finalAlpha = v_color.a * alpha;
    fragColor = vec4(v_color.rgb * finalAlpha, finalAlpha);
  #endif
}
`;return a}function hd(){return["u_matrix","u_sizeRatio","u_correctionRatio","u_cameraAngle","u_resolution","u_atlasSize","u_atlas","u_gamma","u_sdfBuffer","u_pixelRatio","u_nodeDataTexture","u_nodeDataTextureWidth","u_nodeFrameTexture","u_nodeFrameTextureWidth","u_zoomLabelSizeRatio","u_labelPixelSnapping"]}function cd(){return{vertexShader:ud(),fragmentShader:dd(),uniforms:hd()}}function fd(a,n,e,t){var r,i,o=t.label,s=o===void 0?{}:o,l=(r=s.margin)!==null&&r!==void 0?r:Kt,u=(i=s.zoomToLabelSizeRatioFunction)!==null&&i!==void 0?i:function(){return 1},d=cd(),h=(function(c){function f(g,y,m){var v,p,b,T;if(J(this,f),T=ce(this,f,[g,y,m]),D(T,"atlasTexture",null),D(T,"atlasNeedsUpdate",!1),D(T,"labelGlyphCache",new Map),T.atlasFontSize=qe.fontSize*gn(),T.atlasManager=new Et({fontSize:T.atlasFontSize}),T.gamma=.025,T.sdfBuffer=qe.cutoff,T.atlasTexture=g.createTexture(),!T.atlasTexture)throw new Error("NodeLabelProgram: failed to create atlas texture");g.bindTexture(g.TEXTURE_2D,T.atlasTexture),g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_S,g.CLAMP_TO_EDGE),g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_T,g.CLAMP_TO_EDGE),g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MIN_FILTER,g.LINEAR),g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MAG_FILTER,g.LINEAR),g.bindTexture(g.TEXTURE_2D,null),T.atlasManager.on(Et.ATLAS_UPDATED_EVENT,function(){T.atlasNeedsUpdate=!0});var _={family:((v=s.font)===null||v===void 0?void 0:v.family)||"sans-serif",weight:((p=s.font)===null||p===void 0?void 0:p.weight)||"normal",style:((b=s.font)===null||b===void 0?void 0:b.style)||"normal"};return T.defaultFontKey=T.atlasManager.registerFont(_),T}return fe(f,c),ee(f,[{key:"getDefinition",value:function(){var y=WebGL2RenderingContext,m=y.FLOAT,v=y.UNSIGNED_BYTE,p=y.TRIANGLE_STRIP;return{VERTICES:4,VERTEX_SHADER_SOURCE:d.vertexShader,FRAGMENT_SHADER_SOURCE:d.fragmentShader,METHOD:p,UNIFORMS:d.uniforms,ATTRIBUTES:[{name:"a_nodeIndex",size:1,type:m},{name:"a_charOffset",size:2,type:m},{name:"a_charSize",size:2,type:m},{name:"a_texCoords",size:4,type:m},{name:"a_color",size:4,type:v,normalized:!0},{name:"a_margin",size:1,type:m},{name:"a_positionMode",size:1,type:m},{name:"a_labelWidth",size:1,type:m},{name:"a_labelHeight",size:1,type:m},{name:"a_verticalCenter",size:1,type:m},{name:"a_textHeight",size:1,type:m},{name:"a_labelAngle",size:1,type:m}],CONSTANT_ATTRIBUTES:[{name:"a_quadCorner",size:2,type:m}],CONSTANT_DATA:[[-1,-1],[1,-1],[-1,1],[1,1]]}}},{key:"prepareLabelGlyphs",value:function(y,m){if(m.hidden||!m.text){this.labelGlyphCache.delete(y);return}var v=m.text,p=m.fontKey||this.defaultFontKey;this.atlasManager.ensureGlyphs(v,p);var b=[],T=[],_=0,E=0,w=0,A=U(v),S;try{for(A.s();!(S=A.n()).done;){var k=S.value,z=k.codePointAt(0);if(z===void 0){b.push(void 0),T.push(_);continue}var C=this.atlasManager.getGlyph(z,p);b.push(C),T.push(_),C&&(_+=C.advance,E=Math.max(E,C.bearingY),w=Math.max(w,C.atlasHeight-C.bearingY))}}catch(N){A.e(N)}finally{A.f()}this.labelGlyphCache.set(y,{glyphs:b,xOffsets:T,totalWidth:_,totalHeight:E+w,verticalCenterOffset:(E-w)/2})}},{key:"processCharacter",value:function(y,m,v,p){var b=this.floats,T=this.STRIDE,_=y*T,E=this.labelGlyphCache.get(m.parentKey);if(!E||!E.glyphs[p]){for(var w=0;w<T;w++)b[_+w]=0;return}var A=E.glyphs[p],S=E.xOffsets[p],k=m.size/this.atlasFontSize,z=Ne(m.color),C=_;b[C++]=m.nodeIndex,b[C++]=(S+A.bearingX)*k,b[C++]=-A.bearingY*k,b[C++]=A.atlasWidth*k,b[C++]=A.atlasHeight*k,b[C++]=A.atlasX,b[C++]=A.atlasY,b[C++]=A.atlasWidth,b[C++]=A.atlasHeight,b[C++]=z,b[C++]=m.margin,b[C++]=Yt[m.position],b[C++]=E.totalWidth*k,b[C++]=m.size,b[C++]=E.verticalCenterOffset*k,b[C++]=E.totalHeight*k,b[C++]=m.labelAngle}},{key:"processLabel",value:function(y,m,v){return this.prepareLabelGlyphs(y,v),_e(f,"processLabel",this,3)([y,m,v])}},{key:"updateAtlasTexture",value:function(){if(this.atlasNeedsUpdate){var y=this.normalProgram.gl,m=this.atlasManager.getTextures();if(m.length!==0){var v=m[0];y.bindTexture(y.TEXTURE_2D,this.atlasTexture),y.texImage2D(y.TEXTURE_2D,0,y.RGBA,v.width,v.height,0,y.RGBA,y.UNSIGNED_BYTE,v.data),y.bindTexture(y.TEXTURE_2D,null),this.atlasNeedsUpdate=!1}}}},{key:"setUniforms",value:function(y,m){var v=m.gl,p=m.uniformLocations;v.uniformMatrix3fv(p.u_matrix,!1,y.matrix),v.uniform1f(p.u_sizeRatio,y.sizeRatio),v.uniform1f(p.u_correctionRatio,y.correctionRatio),v.uniform1f(p.u_cameraAngle,y.cameraAngle),v.uniform2f(p.u_resolution,y.width*y.pixelRatio,y.height*y.pixelRatio);var b=this.atlasManager.getTextures();b.length>0?v.uniform2f(p.u_atlasSize,b[0].width,b[0].height):v.uniform2f(p.u_atlasSize,1,1),v.activeTexture(v.TEXTURE0),v.bindTexture(v.TEXTURE_2D,this.atlasTexture),v.uniform1i(p.u_atlas,0),p.u_nodeDataTexture!==void 0&&v.uniform1i(p.u_nodeDataTexture,y.nodeDataTextureUnit),p.u_nodeDataTextureWidth!==void 0&&v.uniform1i(p.u_nodeDataTextureWidth,y.nodeDataTextureWidth),v.uniform1i(p.u_nodeFrameTexture,y.nodeFrameTextureUnit),v.uniform1i(p.u_nodeFrameTextureWidth,y.nodeFrameTextureWidth),v.uniform1f(p.u_gamma,this.gamma),v.uniform1f(p.u_sdfBuffer,this.sdfBuffer),v.uniform1f(p.u_pixelRatio,y.pixelRatio),v.uniform1f(p.u_zoomLabelSizeRatio,1/f.zoomToLabelSizeRatioFunction(y.zoomRatio)),v.uniform1f(p.u_labelPixelSnapping,y.labelPixelSnapping)}},{key:"renderProgram",value:function(y,m){this.updateAtlasTexture(),this.atlasManager.hasPendingGlyphs()&&(this.atlasManager.flush(),this.updateAtlasTexture()),_e(f,"renderProgram",this,3)([y,m])}},{key:"registerFont",value:function(y){var m=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"normal",v=arguments.length>2&&arguments[2]!==void 0?arguments[2]:"normal";return this.atlasManager.registerFont({family:y,weight:m,style:v})}},{key:"getAtlasManager",value:function(){return this.atlasManager}},{key:"measureLabel",value:function(y,m,v){var p=v||this.defaultFontKey;this.atlasManager.ensureGlyphs(y,p),this.atlasManager.hasPendingGlyphs()&&this.atlasManager.flush();var b=0,T=0,_=0,E=U(y),w;try{for(E.s();!(w=E.n()).done;){var A=w.value,S=A.codePointAt(0);if(S!==void 0){var k=this.atlasManager.getGlyph(S,p);k&&(b+=k.advance,T=Math.max(T,k.bearingY),_=Math.max(_,k.atlasHeight-k.bearingY))}}}catch(C){E.e(C)}finally{E.f()}var z=m/this.atlasFontSize;return{width:b*z,height:m,textHeight:(T+_)*z}}},{key:"ensureGlyphsReady",value:function(y,m){var v=m||this.defaultFontKey,p=U(y),b;try{for(p.s();!(b=p.n()).done;){var T=b.value;this.atlasManager.ensureGlyphs(T,v)}}catch(_){p.e(_)}finally{p.f()}this.atlasManager.flush()}},{key:"kill",value:function(){var y=this.normalProgram.gl;this.atlasTexture&&(y.deleteTexture(this.atlasTexture),this.atlasTexture=null),this.atlasManager.destroy(),this.labelGlyphCache.clear(),_e(f,"kill",this,3)([])}}])})(eo);return D(h,"labelMargin",l),D(h,"zoomToLabelSizeRatioFunction",u),new h(a,n,e)}var gd=`#version 300 es
precision highp float;

in float v_edgeDist;

// R32F target: only the .r channel is stored.
out vec4 fragColor;

void main() {
  fragColor = vec4(v_edgeDist, 0.0, 0.0, 0.0);
}
`;function vd(a,n,e){var t=ir(a),r=_n(a).map(function(g){return"uniform ".concat(g.type," ").concat(g.name,";")}).join(`
`),i=Mu(a,e),o=i.code,s=i.multiShape,l=Qt(a,n),u=Object.keys(l.specs).map(function(g){return"float v_".concat(g,";")}).join(`
`),d=Xt(l,{varPrefix:"nodeAttr",baseTexelExpr:"nodeIdx * u_layerAttributeTexelsPerNode",textureWidthUniform:"u_layerAttributeTextureWidth",textureSamplerUniform:"u_layerAttributeTexture"}),h=d.fetchCode,c=d.varyingAssignments,f=`#version 300 es
precision highp float;

uniform float u_cameraAngle;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform float u_frameTextureWidth;
uniform float u_frameTextureHeight;
uniform sampler2D u_layerAttributeTexture;
uniform int u_layerAttributeTextureWidth;
uniform int u_layerAttributeTexelsPerNode;
`.concat(r,`

in float a_nodeIndex;     // node-data texture index (also the target frame texel)
in float a_positionMode;  // 0=right 1=left 2=above 3=below 4=over
in float a_labelAngle;    // intrinsic label angle (radians)

out float v_edgeDist;

// Shape attributes (plain globals: this pass is vertex-only)
`).concat(u,`

`).concat(at,`
`).concat(St,`
`).concat(t,`
`).concat(o,`
`).concat(Yi,`

void main() {
  int nodeIdx = int(a_nodeIndex);
`).concat(h,`
`).concat(c,`
  `).concat(s?`// Multi-shape: the shape id lives in the node-data texture's .w channel:
  g_shapeId = int(readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx).w);`:"// Single-shape mode, shape id not needed",`

  // Per-node rotation alignment (0 = viewport, 1 = graph).
  vec4 nodeFlags = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  float nodeRotation = nodeFlags.r;
  float labelRotation = nodeFlags.g;

  // Effective angle: intrinsic (style-given) plus the camera angle when the label
  // is graph-aligned. The companions place the box at this same angle.
  float effectiveAngle = a_labelAngle - labelRotation * u_cameraAngle;

  // The "over" mode (4) sits on the node center, so it has no edge distance.
  float edgeDist = 0.0;
  if (a_positionMode < 4.0) {
    vec2 screenDir = getLabelDirection(a_positionMode);
    // Rotate by the effective label angle. Inlined rather than via rotate2D()
    // because the shape SDFs (getShapeGLSLForShapes) already define that helper
    // for multi-shape programs, and redefining it would be a GLSL error.
    float ea_c = cos(effectiveAngle);
    float ea_s = sin(effectiveAngle);
    vec2 rotatedScreenDir = mat2(ea_c, -ea_s, ea_s, ea_c) * screenDir;
    // Screen (Y-down) -> SDF (Y-up).
    vec2 sdfDir = vec2(rotatedScreenDir.x, -rotatedScreenDir.y);
    // Counter-rotate into the shape's local frame for graph-aligned nodes, so the
    // boundary is queried against the shape's actual on-screen orientation.
    float nodeCa = -u_cameraAngle * nodeRotation;
    float nc = cos(nodeCa), ns = sin(nodeCa);
    sdfDir = mat2(nc, -ns, ns, nc) * sdfDir;
    edgeDist = findEdgeDistance(sdfDir, 1.0);
  }
  v_edgeDist = edgeDist;

  // Scatter to this node's texel center in the frame texture.
  float x = mod(a_nodeIndex, u_frameTextureWidth);
  float y = floor(a_nodeIndex / u_frameTextureWidth);
  vec2 ndc = (vec2(x, y) + 0.5) / vec2(u_frameTextureWidth, u_frameTextureHeight) * 2.0 - 1.0;
  gl_Position = vec4(ndc, 0.0, 1.0);
  gl_PointSize = 1.0;
}
`);return f}var to=(function(){function a(n,e){J(this,a),D(this,"uniformLocations",{});var t=e.shapes,r=e.layers,i=e.shapeGlobalIds;if(t.length===0)throw new Error("NodeLabelFramePass: at least one shape must be provided");this.gl=n,this.shapeUniforms=_n(t),this.hasAttributeData=Object.keys(Qt(t,r).offsets).length>0,this.vertexShader=nr(n,vd(t,r,i)),this.fragmentShader=ar(n,gd),this.program=rr(n,[this.vertexShader,this.fragmentShader]);var o=["u_cameraAngle","u_nodeDataTexture","u_nodeDataTextureWidth","u_frameTextureWidth","u_frameTextureHeight","u_layerAttributeTexture","u_layerAttributeTextureWidth","u_layerAttributeTexelsPerNode"].concat(K(this.shapeUniforms.map(function(v){return v.name}))),s=U(o),l;try{for(s.s();!(l=s.n()).done;){var u=l.value;this.uniformLocations[u]=n.getUniformLocation(this.program,u)}}catch(v){s.e(v)}finally{s.f()}var d=a.FLOATS_PER_POINT*4;this.vao=n.createVertexArray(),this.buffer=n.createBuffer(),n.bindVertexArray(this.vao),n.bindBuffer(n.ARRAY_BUFFER,this.buffer);var h=U([["a_nodeIndex",0],["a_positionMode",4],["a_labelAngle",8]]),c;try{for(h.s();!(c=h.n()).done;){var f=ne(c.value,2),g=f[0],y=f[1],m=n.getAttribLocation(this.program,g);m>=0&&(n.enableVertexAttribArray(m),n.vertexAttribPointer(m,1,n.FLOAT,!1,d,y))}}catch(v){h.e(v)}finally{h.f()}n.bindVertexArray(null)}return ee(a,[{key:"run",value:function(e,t,r,i,o){if(t!==0){var s=this.gl;s.useProgram(this.program),s.bindVertexArray(this.vao),s.bindBuffer(s.ARRAY_BUFFER,this.buffer),s.bufferData(s.ARRAY_BUFFER,e.subarray(0,t*a.FLOATS_PER_POINT),s.DYNAMIC_DRAW);var l=this.uniformLocations;s.uniform1f(l.u_cameraAngle,i.cameraAngle),s.uniform1i(l.u_nodeDataTexture,i.nodeDataTextureUnit),s.uniform1i(l.u_nodeDataTextureWidth,i.nodeDataTextureWidth),s.uniform1f(l.u_frameTextureWidth,r.getTextureWidth()),s.uniform1f(l.u_frameTextureHeight,r.getTextureHeight()),this.hasAttributeData&&o&&(o.bind(dt),l.u_layerAttributeTexture&&s.uniform1i(l.u_layerAttributeTexture,dt),l.u_layerAttributeTextureWidth&&s.uniform1i(l.u_layerAttributeTextureWidth,o.getTextureWidth()),l.u_layerAttributeTexelsPerNode&&s.uniform1i(l.u_layerAttributeTexelsPerNode,o.getTexelsPerItem()));var u=U(this.shapeUniforms),d;try{for(u.s();!(d=u.n()).done;){var h=d.value;lr(s,this.uniformLocations[h.name],h)}}catch(c){u.e(c)}finally{u.f()}r.bindAsRenderTarget(),s.disable(s.BLEND),s.disable(s.DEPTH_TEST),s.drawArrays(s.POINTS,0,t),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindVertexArray(null)}}},{key:"kill",value:function(){var e=this.gl;e.deleteProgram(this.program),e.deleteShader(this.vertexShader),e.deleteShader(this.fragmentShader),e.deleteBuffer(this.buffer),e.deleteVertexArray(this.vao)}}])})();D(to,"FLOATS_PER_POINT",3);function no(a,n,e,t,r){var i,o=t.label,s=o===void 0?{}:o,l=t.shapes;if(l.length===0)throw new Error("createNodeProgram: at least one shape must be provided in 'shapes'");var u={},d=[],h;l.forEach(function(w,A){var S=Cu(w);A===0&&(h=S),u[w.name]=A,d[A]=bn(S)});var c=K(t.layers),f=zi({shapes:l,layers:c,shapeGlobalIds:l.length>1?d:void 0,antialias:r}),g=fd(a,null,e,{label:s}),y=nd(a,null,e,{shapes:l,layers:c,getAttributeTexture:function(){return E.getAttributeTexture()},label:s,shapeGlobalIds:l.length>1?d:void 0}),m=id(a,n,e,{label:s}),v=t.labelAttachments&&Object.keys(t.labelAttachments).length>0?qu(a,null,e,{label:s}):null,p=new to(a,{shapes:l,layers:c,shapeGlobalIds:l.length>1?d:void 0}),b=_a(l,c),T=Be(b),_=(i=(function(w){function A(S,k,z){var C;J(this,A),C=ce(this,A,[S,k,z]),D(C,"layerLifecycles",new Map),D(C,"layersNeedingRegeneration",new Set),D(C,"attrDescriptors",[]),C._pickingBuffer=k;var N=_.layerTextures.get(S);N||(N=new ma(S,T),_.layerTextures.set(S,N)),C.layerAttributeTexture=N;var L=_.textureRefCounts.get(S)||0;_.textureRefCounts.set(S,L+1),C.packedAttributeData=new Float32Array(T.floatsPerItem),c.forEach(function(M,F){if(M.lifecycle){var x={gl:S,renderer:{refresh:function(){return z.refresh()}},getUniformLocation:function(I){return S.getUniformLocation(C.normalProgram.program,I)},requestShaderRegeneration:function(){C.layersNeedingRegeneration.add(F)},requestRefresh:function(){z.refresh()}},P=M.lifecycle(x);C.layerLifecycles.set(F,P)}}),C.layerLifecycles.forEach(function(M){var F;(F=M.init)===null||F===void 0||F.call(M)});var G=new Map;return C.layerLifecycles.forEach(function(M,F){M.getAttributeData&&G.set(F,M)}),C.attrDescriptors=ya(b,T,G),C}return fe(A,w),ee(A,[{key:"getDefinition",value:function(){var k=WebGL2RenderingContext,z=k.FLOAT,C=k.TRIANGLE_STRIP;return{VERTICES:4,VERTEX_SHADER_SOURCE:f.vertexShader,FRAGMENT_SHADER_SOURCE:f.fragmentShader,METHOD:C,UNIFORMS:f.uniforms,ATTRIBUTES:f.attributes,CONSTANT_ATTRIBUTES:[{name:"a_quadCorner",size:2,type:z}],CONSTANT_DATA:[[-1,-1],[1,-1],[-1,1],[1,1]]}}},{key:"maybeRegenerateShaders",value:function(){var k=this;if(this.layersNeedingRegeneration.size!==0){c=c.map(function(F,x){if(k.layersNeedingRegeneration.has(x)){var P=k.layerLifecycles.get(x);if(P!=null&&P.regenerate){var B=P.regenerate();return O(O({},B),{},{lifecycle:F.lifecycle})}}return F}),this.layersNeedingRegeneration.clear(),f=zi({shapes:l,layers:c,shapeGlobalIds:l.length>1?d:void 0,antialias:this.renderer.getSetting("antialiasNodes")});var z=this.normalProgram.gl,C=this.normalProgram,N=C.program,L=C.buffer,G=C.vertexShader,M=C.fragmentShader;z.deleteProgram(N),z.deleteBuffer(L),z.deleteShader(G),z.deleteShader(M),this.normalProgram=this.getProgramInfo("normal",z,f.vertexShader,f.fragmentShader,this._pickingBuffer)}}},{key:"getAttributeTexture",value:function(){return this.layerAttributeTexture}},{key:"uploadLayerTexture",value:function(){this.layerAttributeTexture.upload()}},{key:"process",value:function(k,z,C,N){var L=z*this.STRIDE;if(C.visibility==="hidden"){for(var G=L+this.STRIDE;L<G;L++)this.floats[L]=0;this.floats[z*this.STRIDE]=Zi;return}this.processVisibleItem(Ot(k),L,C,N)}},{key:"processVisibleItem",value:function(k,z,C,N){var L,G=this.floats,M=this.ints;if(G[z++]=N,M[z++]=k,G[z++]=(L=C.opacity)!==null&&L!==void 0?L:1,T.floatsPerItem!==0){var F=this.packedAttributeData;ba(this.attrDescriptors,C,F,C.color,this.layerLifecycles,0),this.layerAttributeTexture.updateAllAttributesAtRow(N,F)}}},{key:"setUniforms",value:function(k,z){var C=this,N=z.gl,L=z.uniformLocations;L.u_matrix&&N.uniformMatrix3fv(L.u_matrix,!1,k.matrix),L.u_sizeRatio&&N.uniform1f(L.u_sizeRatio,k.sizeRatio),L.u_correctionRatio&&N.uniform1f(L.u_correctionRatio,k.correctionRatio),L.u_pickingPadding&&N.uniform1f(L.u_pickingPadding,k.nodePickingPadding),L.u_cameraAngle&&N.uniform1f(L.u_cameraAngle,k.cameraAngle),L.u_nodeDataTexture&&N.uniform1i(L.u_nodeDataTexture,k.nodeDataTextureUnit),L.u_nodeDataTextureWidth&&N.uniform1i(L.u_nodeDataTextureWidth,k.nodeDataTextureWidth),L.u_layerAttributeTexture&&(this.layerAttributeTexture.bind(dt),N.uniform1i(L.u_layerAttributeTexture,dt)),L.u_layerAttributeTextureWidth&&N.uniform1i(L.u_layerAttributeTextureWidth,this.layerAttributeTexture.getTextureWidth()),L.u_layerAttributeTexelsPerNode&&N.uniform1i(L.u_layerAttributeTexelsPerNode,this.layerAttributeTexture.getTexelsPerItem()),l.forEach(function(G){G.uniforms.forEach(function(M){C.setTypedUniform(M,z)})}),c.forEach(function(G){G.uniforms.forEach(function(M){C.setTypedUniform(M,z)})})}},{key:"render",value:function(k,z,C){this.maybeRegenerateShaders(),_e(A,"render",this,3)([k,z,C])}},{key:"renderProgram",value:function(k,z){var C=z.gl,N=z.program;C.useProgram(N),z===this.normalProgram&&this.layerLifecycles.forEach(function(L){var G;(G=L.beforeRender)===null||G===void 0||G.call(L)}),_e(A,"renderProgram",this,3)([k,z])}},{key:"kill",value:function(){this.layerLifecycles.forEach(function(C){var N;(N=C.kill)===null||N===void 0||N.call(C)}),this.layerLifecycles.clear();var k=this.normalProgram.gl,z=(_.textureRefCounts.get(k)||1)-1;z<=0?(this.layerAttributeTexture.kill(),_.layerTextures.delete(k),_.textureRefCounts.delete(k)):_.textureRefCounts.set(k,z),_e(A,"kill",this,3)([])}}])})(At),D(i,"layerTextures",new WeakMap),D(i,"textureRefCounts",new WeakMap),i),E=new _(a,null,e);return{nodeProgram:E,labelProgram:g,backdropProgram:y,labelBackgroundProgram:m,attachmentProgram:v,framePass:p,shapeSlug:h,shapeNameToIndex:l.length>1?u:void 0,shapeGlobalIds:l.length>1?d:void 0}}var ht=6;function Tn(a){var n=a.offsets,e=a.specs,t=a.floatsPerItem,r=Object.keys(n);if(r.length===0||t===0)return{uniformDeclarations:"",uniformNames:[],vertexVaryingDeclarations:"",fragmentVaryingDeclarations:"",fetchCode:"",varyingAssignments:""};var i=`
uniform sampler2D u_edgeAttributeTexture;
uniform int u_edgeAttributeTextureWidth;
uniform int u_edgeAttributeTexelsPerEdge;`,o=["u_edgeAttributeTexture","u_edgeAttributeTextureWidth","u_edgeAttributeTexelsPerEdge"],s=r.map(function(f){var g=e[f].size===1?"float":"vec".concat(e[f].size);return"".concat(g," v_").concat(f,";")}),l=s.map(function(f){return"out ".concat(f)}).join(`
`),u=s.map(function(f){return"in ".concat(f)}).join(`
`),d=Xt(a,{varPrefix:"attr",baseTexelExpr:"edgeIdx * u_edgeAttributeTexelsPerEdge",textureWidthUniform:"u_edgeAttributeTextureWidth",textureSamplerUniform:"u_edgeAttributeTexture"}),h=d.fetchCode,c=d.varyingAssignments;return{uniformDeclarations:i,uniformNames:o,vertexVaryingDeclarations:l,fragmentVaryingDeclarations:u,fetchCode:h,varyingAssignments:c}}function pd(a){return`
float findSourceClampT_`.concat(a,`(vec2 source, float sourceSize, int sourceShapeId, float sourceRotateAlign, vec2 target, float margin) {
  float lo = 0.0, hi = 0.5;
  float nodeExtent = sourceSize * u_correctionRatio / u_sizeRatio * 2.0;
  float effectiveSize = 1.0 - u_correctionRatio / nodeExtent;

  // Counter-rotate the query point so viewport-aligned nodes (rotateAlign=0) are
  // clamped against their on-screen orientation; graph-aligned nodes skip it.
  float ca = u_cameraAngle * (1.0 - sourceRotateAlign);
  float rc = cos(ca), rs = sin(ca);
  mat2 rot = mat2(rc, -rs, rs, rc);

  for (int i = 0; i < 12; i++) {
    float mid = (lo + hi) * 0.5;
    vec2 pos = path_`).concat(a,`_position(mid, source, target);
    vec2 localPos = rot * ((pos - source) / nodeExtent);
    float sdf = querySDF(sourceShapeId, localPos, effectiveSize);
    if (sdf < 0.0) lo = mid;
    else hi = mid;
  }

  float pathLen = path_`).concat(a,`_length(source, target);
  float marginT = (margin * u_correctionRatio / u_sizeRatio) / pathLen;
  return (lo + hi) * 0.5 + marginT;
}
`)}function md(a){return`
float findTargetClampT_`.concat(a,`(vec2 source, vec2 target, float targetSize, int targetShapeId, float targetRotateAlign, float margin) {
  float lo = 0.5, hi = 1.0;
  float nodeExtent = targetSize * u_correctionRatio / u_sizeRatio * 2.0;
  float effectiveSize = 1.0 - u_correctionRatio / nodeExtent;

  // See findSourceClampT_ for the rotation rationale.
  float ca = u_cameraAngle * (1.0 - targetRotateAlign);
  float rc = cos(ca), rs = sin(ca);
  mat2 rot = mat2(rc, -rs, rs, rc);

  for (int i = 0; i < 12; i++) {
    float mid = (lo + hi) * 0.5;
    vec2 pos = path_`).concat(a,`_position(mid, source, target);
    vec2 localPos = rot * ((pos - target) / nodeExtent);
    float sdf = querySDF(targetShapeId, localPos, effectiveSize);
    if (sdf < 0.0) hi = mid;
    else lo = mid;
  }

  float pathLen = path_`).concat(a,`_length(source, target);
  float marginT = (margin * u_correctionRatio / u_sizeRatio) / pathLen;
  return (lo + hi) * 0.5 - marginT;
}
`)}function ao(a){return`
// Auto-generated numerical tangent (from position via finite differences)
vec2 path_`.concat(a,`_tangent(float t, vec2 source, vec2 target) {
  float epsilon = 0.001;
  float t1 = max(0.0, t - epsilon);
  float t2 = min(1.0, t + epsilon);
  vec2 p1 = path_`).concat(a,`_position(t1, source, target);
  vec2 p2 = path_`).concat(a,`_position(t2, source, target);
  return normalize(p2 - p1);
}

// Auto-generated normal (perpendicular to tangent)
vec2 path_`).concat(a,`_normal(float t, vec2 source, vec2 target) {
  vec2 tangent = path_`).concat(a,`_tangent(t, source, target);
  return vec2(-tangent.y, tangent.x);
}
`)}function yd(a){return`
// Auto-generated path length (samples position 16 times)
float path_`.concat(a,`_length(vec2 source, vec2 target) {
  float len = 0.0;
  vec2 prev = path_`).concat(a,`_position(0.0, source, target);
  for (int i = 1; i <= 16; i++) {
    float t = float(i) / 16.0;
    vec2 curr = path_`).concat(a,`_position(t, source, target);
    len += length(curr - prev);
    prev = curr;
  }
  return len;
}
`)}function bd(a){return`
// Auto-generated closest_t (coarse sample + ternary search)
float path_`.concat(a,`_closest_t(vec2 p, vec2 source, vec2 target) {
  // Coarse search: find best among 10 samples
  float bestT = 0.0;
  float bestDist = 1e10;
  for (int i = 0; i <= 10; i++) {
    float t = float(i) / 10.0;
    vec2 pos = path_`).concat(a,`_position(t, source, target);
    float d = length(p - pos);
    if (d < bestDist) {
      bestDist = d;
      bestT = t;
    }
  }

  // Refine with ternary search
  float lo = max(0.0, bestT - 0.1);
  float hi = min(1.0, bestT + 0.1);
  for (int i = 0; i < 10; i++) {
    float mid1 = lo + (hi - lo) / 3.0;
    float mid2 = hi - (hi - lo) / 3.0;
    float d1 = length(p - path_`).concat(a,`_position(mid1, source, target));
    float d2 = length(p - path_`).concat(a,`_position(mid2, source, target));
    if (d1 < d2) {
      hi = mid2;
    } else {
      lo = mid1;
    }
  }
  return (lo + hi) * 0.5;
}
`)}function _d(a){return`
// Auto-generated signed distance (via closest_t + normal)
float path_`.concat(a,`_distance(vec2 p, vec2 source, vec2 target) {
  float closestT = path_`).concat(a,`_closest_t(p, source, target);
  vec2 closest = path_`).concat(a,`_position(closestT, source, target);
  vec2 diff = p - closest;
  float dist = length(diff);
  if (dist < 0.0001) return 0.0;

  // Get normal at closest point
  vec2 normal = path_`).concat(a,`_normal(closestT, source, target);
  return dist * sign(dot(diff, normal));
}
`)}function xd(a){return`
// Auto-generated t_at_distance (binary search)
float path_`.concat(a,`_t_at_distance(float targetDist, vec2 source, vec2 target) {
  if (targetDist <= 0.0) return 0.0;

  float totalLen = path_`).concat(a,`_length(source, target);
  if (targetDist >= totalLen) return 1.0;

  // Binary search for t
  float lo = 0.0, hi = 1.0;
  for (int i = 0; i < 12; i++) {
    float mid = (lo + hi) * 0.5;

    // Compute arc length from 0 to mid
    float arcLen = 0.0;
    vec2 prev = path_`).concat(a,`_position(0.0, source, target);
    for (int j = 1; j <= 8; j++) {
      float t = mid * float(j) / 8.0;
      vec2 curr = path_`).concat(a,`_position(t, source, target);
      arcLen += length(curr - prev);
      prev = curr;
    }

    if (arcLen < targetDist) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return (lo + hi) * 0.5;
}
`)}function ha(a,n){var e=new RegExp("\\b(float|vec[234]|void|int|bool)\\s+".concat(n,"\\s*\\("));return e.test(a)}function ro(a,n){var e=[];return ha(n,"path_".concat(a,"_length"))||e.push(yd(a)),ha(n,"path_".concat(a,"_closest_t"))||e.push(bd(a)),ha(n,"path_".concat(a,"_distance"))||e.push(_d(a)),ha(n,"path_".concat(a,"_t_at_distance"))||e.push(xd(a)),e.length>0?`
// ============================================================================
// Auto-generated fallback functions (path only provided position)
// ============================================================================
`.concat(e.join(`
`)):""}function io(a){var n,e,t,r=a.paths,i=a.layers,o=(n=a.extremities)!==null&&n!==void 0?n:[];if(r.length===0)throw new Error("At least one path is required in 'paths'");if(i.length===0)throw new Error("At least one layer is required in 'layers'");var s=(e=a.defaultHead)!==null&&e!==void 0?e:"none",l=(t=a.defaultTail)!==null&&t!==void 0?t:"none";return{paths:r,extremities:o,layers:i,path:r[0],layer:i[0],defaultHead:s,defaultTail:l}}var oo=WebGL2RenderingContext,yn=oo.FLOAT,Bi=oo.UNSIGNED_BYTE;function Td(a,n,e){var t=new Set(["u_matrix","u_sizeRatio","u_correctionRatio","u_zoomRatio","u_pixelRatio","u_cameraAngle","u_minEdgeThickness","u_pickingPadding","u_nodeDataTexture","u_nodeDataTextureWidth","u_edgeDataTexture","u_edgeDataTextureWidth","u_edgeFrameTexture","u_edgeFrameTextureWidth","u_edgeAttributeTexture","u_edgeAttributeTextureWidth","u_edgeAttributeTexelsPerEdge"]),r=new Set(t);return a.forEach(function(i){return i.uniforms.forEach(function(o){return r.add(o.name)})}),n.forEach(function(i){return i.uniforms.forEach(function(o){return r.add(o.name)})}),e.forEach(function(i){return i.uniforms.forEach(function(o){return r.add(o.name)})}),Array.from(r)}function ur(a){var n=new Set,e=[],t=U(a),r;try{for(t.s();!(r=t.n()).done;){var i=r.value;n.has(i.name)||(n.add(i.name),e.push("// Path: ".concat(i.name)),e.push(i.glsl),e.push(ao(i.name)),e.push(ro(i.name,i.glsl)))}}catch(o){t.e(o)}finally{t.f()}return e.join(`

`)}function Ed(a){var n=[],e=U(a),t;try{for(e.s();!(t=e.n()).done;){var r=t.value;n.push("// Extremity: ".concat(r.name)),n.push(r.glsl)}}catch(i){e.e(i)}finally{e.f()}return n.join(`

`)}var Sd=[{queryName:"queryPathPosition",pathFunc:"position",returnType:"vec2",params:"float t, vec2 source, vec2 target",args:"t, source, target"},{queryName:"queryPathTangent",pathFunc:"tangent",returnType:"vec2",params:"float t, vec2 source, vec2 target",args:"t, source, target"},{queryName:"queryPathNormal",pathFunc:"normal",returnType:"vec2",params:"float t, vec2 source, vec2 target",args:"t, source, target"},{queryName:"queryPathLength",pathFunc:"length",returnType:"float",params:"vec2 source, vec2 target",args:"source, target"},{queryName:"queryPathClosestT",pathFunc:"closest_t",returnType:"float",params:"vec2 p, vec2 source, vec2 target",args:"p, source, target"}];function Ad(a,n){var e=n.queryName,t=n.pathFunc,r=n.returnType,i=n.params,o=n.args;if(a.length===1)return"".concat(r," ").concat(e,"(int pathId, ").concat(i,`) {
  return path_`).concat(a[0].name,"_").concat(t,"(").concat(o,`);
}`);var s=a.map(function(l,u){return"    case ".concat(u,": return path_").concat(l.name,"_").concat(t,"(").concat(o,");")}).join(`
`);return"".concat(r," ").concat(e,"(int pathId, ").concat(i,`) {
  switch (pathId) {
`).concat(s,`
    default: return path_`).concat(a[0].name,"_").concat(t,"(").concat(o,`);
  }
}`)}function dr(a){return Sd.map(function(n){return Ad(a,n)}).join(`

`)}function wd(a){if(a.length===1)return`float queryExtremitySDF(int extremityId, vec2 uv, float lengthRatio, float widthRatio) {
  return extremity_`.concat(a[0].name,`(uv, lengthRatio, widthRatio);
}`);var n=a.map(function(e,t){return"    case ".concat(t,": return extremity_").concat(e.name,"(uv, lengthRatio, widthRatio);")}).join(`
`);return`float queryExtremitySDF(int extremityId, vec2 uv, float lengthRatio, float widthRatio) {
  switch (extremityId) {
`.concat(n,`
    default: return extremity_`).concat(a[0].name,`(uv, lengthRatio, widthRatio);
  }
}`)}function Dd(a){var n=[],e=U(a),t;try{for(e.s();!(t=e.n()).done;){var r=t.value;n.push(pd(r.name)),n.push(md(r.name))}}catch(s){e.e(s)}finally{e.f()}if(a.length===1)n.push(`
float queryFindSourceClampT(int pathId, vec2 source, float sourceSize, int sourceShapeId, float sourceRotateAlign, vec2 target, float margin) {
  return findSourceClampT_`.concat(a[0].name,`(source, sourceSize, sourceShapeId, sourceRotateAlign, target, margin);
}

float queryFindTargetClampT(int pathId, vec2 source, vec2 target, float targetSize, int targetShapeId, float targetRotateAlign, float margin) {
  return findTargetClampT_`).concat(a[0].name,`(source, target, targetSize, targetShapeId, targetRotateAlign, margin);
}`));else{var i=a.map(function(s,l){return"    case ".concat(l,": return findSourceClampT_").concat(s.name,"(source, sourceSize, sourceShapeId, sourceRotateAlign, target, margin);")}).join(`
`),o=a.map(function(s,l){return"    case ".concat(l,": return findTargetClampT_").concat(s.name,"(source, target, targetSize, targetShapeId, targetRotateAlign, margin);")}).join(`
`);n.push(`
float queryFindSourceClampT(int pathId, vec2 source, float sourceSize, int sourceShapeId, float sourceRotateAlign, vec2 target, float margin) {
  switch (pathId) {
`.concat(i,`
    default: return findSourceClampT_`).concat(a[0].name,`(source, sourceSize, sourceShapeId, sourceRotateAlign, target, margin);
  }
}

float queryFindTargetClampT(int pathId, vec2 source, vec2 target, float targetSize, int targetShapeId, float targetRotateAlign, float margin) {
  switch (pathId) {
`).concat(o,`
    default: return findTargetClampT_`).concat(a[0].name,`(source, target, targetSize, targetShapeId, targetRotateAlign, margin);
  }
}`))}return n.join(`

`)}function Rd(a,n,e,t,r){var i=Be([].concat(K(a),K(e))),o=Tn(i),s=Qt(t,r),l=Object.keys(s.offsets),u=function(w){var A=s.specs[w].size;return A===1?"float":"vec".concat(A)},d=l.map(function(E){return"".concat(u(E)," v_source_").concat(E,`;
`).concat(u(E)," v_target_").concat(E,";")}).join(`
`),h=Xt(s,{varPrefix:"srcNodeAttr",baseTexelExpr:"srcIdx * u_layerAttributeTexelsPerNode",textureWidthUniform:"u_layerAttributeTextureWidth",textureSamplerUniform:"u_layerAttributeTexture",outputPrefix:"v_source_"}),c=Xt(s,{varPrefix:"tgtNodeAttr",baseTexelExpr:"tgtIdx * u_layerAttributeTexelsPerNode",textureWidthUniform:"u_layerAttributeTextureWidth",textureSamplerUniform:"u_layerAttributeTexture",outputPrefix:"v_target_"}),f=l.map(function(E){return"".concat(u(E)," g_").concat(E,";")}).join(`
`),g=l.map(function(E){return"  g_".concat(E," = v_source_").concat(E,";")}).join(`
`),y=l.map(function(E){return"  g_".concat(E," = v_target_").concat(E,";")}).join(`
`),m=new Set,v=[],p=function(w){m.has(w.name)||(m.add(w.name),v.push("uniform ".concat(w.type," ").concat(w.name,";")))};a.forEach(function(E){return E.uniforms.forEach(p)}),n.forEach(function(E){return E.uniforms.forEach(p)});var b=n.map(function(E){return me(E.widthFactor)}).join(", "),T=Math.max.apply(Math,K(a.map(function(E){return E.minBodyLengthRatio||0}))),_=`#version 300 es

// Node and edge data textures
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_edgeDataTexture;
uniform int u_edgeDataTextureWidth;

// Edge attribute texture (for path-specific attributes like curvature)
`.concat(o.uniformDeclarations,`

// Node attribute texture (for node shape attributes)
uniform sampler2D u_layerAttributeTexture;
uniform int u_layerAttributeTextureWidth;
uniform int u_layerAttributeTexelsPerNode;

// Render params needed for clamping
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
uniform float u_minEdgeThickness;

// Edge-frame texture dimensions, for scattering each point to its texel
uniform float u_frameTextureWidth;
uniform float u_frameTextureHeight;

// Custom path/extremity uniforms
`).concat(v.join(`
`),`

// Path attribute varyings \u2014 assigned so path functions can read them as globals
`).concat(o.vertexVaryingDeclarations,`

// Node size varyings \u2014 read by path functions like loop
out float v_sourceNodeSize;
out float v_targetNodeSize;

// Node shape attributes per endpoint, and the ones querySDF reads
`).concat(d,`
`).concat(f,`

// Scattered output written to the edge-frame texel: [tStart, tEnd, straightenFactor, pathLength]
out vec4 v_clamp;

// Extremity width factor array (needed for extremityScale computation)
const float EXTREMITY_WIDTH_FACTORS[`).concat(n.length,"] = float[](").concat(b,`);

// Node-data fetch helpers (geometry texel + rotation-flags texel)
`).concat(at,`
`).concat(St,`

// Shape SDFs for node boundary clamping
`).concat(ku(),`
`).concat(Pu(new Set(l)),`

// Path functions
`).concat(ur(a),`
`).concat(dr(a),`
`).concat(Dd(a),`

void main() {
  // One point per edge-data row; the row index is the edge-frame texel target.
  int edgeIdx = gl_VertexID;
  int texel0Idx = edgeIdx * 2;
  int texel1Idx = edgeIdx * 2 + 1;
  ivec2 edgeTexCoord0 = ivec2(texel0Idx % u_edgeDataTextureWidth, texel0Idx / u_edgeDataTextureWidth);
  ivec2 edgeTexCoord1 = ivec2(texel1Idx % u_edgeDataTextureWidth, texel1Idx / u_edgeDataTextureWidth);
  vec4 edgeData0 = texelFetch(u_edgeDataTexture, edgeTexCoord0, 0);
  vec4 edgeData1 = texelFetch(u_edgeDataTexture, edgeTexCoord1, 0);

  int srcIdx = int(edgeData0.x);
  int tgtIdx = int(edgeData0.y);
  float a_thickness = edgeData0.z;
  float a_headLengthRatio = edgeData1.x;
  float a_tailLengthRatio = edgeData1.y;
  int pathId = int(edgeData1.z);
  int extremityPacked = int(edgeData1.w);
  int headId = extremityPacked >> 4;
  int tailId = extremityPacked & 15;

  // Fetch path/layer attributes and assign to path-function globals
`).concat(o.fetchCode,`
`).concat(o.varyingAssignments,`

  // Fetch node shape attributes for both endpoints
`).concat(h.fetchCode,`
`).concat(h.varyingAssignments,`
`).concat(c.fetchCode,`
`).concat(c.varyingAssignments,`

  // Fetch node geometry (texel 0) and rotation flags (texel 1).
  vec4 srcNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx);
  vec4 tgtNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx);

  vec2 a_source = srcNodeData.xy;
  vec2 a_target = tgtNodeData.xy;
  float a_sourceSize = srcNodeData.z;
  float a_targetSize = tgtNodeData.z;
  float a_sourceShapeId = srcNodeData.w;
  float a_targetShapeId = tgtNodeData.w;
  // Per-node rotation alignment (0 = viewport, 1 = graph), for boundary clamping.
  float a_sourceRotateAlign = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx).r;
  float a_targetRotateAlign = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx).r;

  v_sourceNodeSize = a_sourceSize;
  v_targetNodeSize = a_targetSize;

  float headLengthRatio = a_headLengthRatio;
  float tailLengthRatio = a_tailLengthRatio;
  float headWidthFactor = EXTREMITY_WIDTH_FACTORS[headId];
  float tailWidthFactor = EXTREMITY_WIDTH_FACTORS[tailId];
  float minBodyLengthRatio = `).concat(me(T),`;

  // Thickness in WebGL units (needed to compute clamping margin and extremity lengths)
  float pixelsThickness = max(a_thickness, u_minEdgeThickness * u_sizeRatio);
  float webGLThickness = pixelsThickness * u_correctionRatio / u_sizeRatio;

  // SDF clamping: find where the edge body meets the node boundaries. Always
  // searched (ungated) so labels get a true boundary clamp; the body re-applies
  // its extremity gating in-shader.
`).concat(g,`
  float tStart = queryFindSourceClampT(pathId, a_source, a_sourceSize, int(a_sourceShapeId), a_sourceRotateAlign, a_target, 0.0);
`).concat(y,`
  float tEnd = queryFindTargetClampT(pathId, a_source, a_target, a_targetSize, int(a_targetShapeId), a_targetRotateAlign, 0.0);

  // straightenFactor (frame .z) is consumed only by the body, which runs to the
  // node center when an extremity is absent. Derive the straightening math from
  // these gated clamps \u2014 not the ungated boundary ones above \u2014 so it matches the
  // geometry it drives. The ungated tStart/tEnd remain what labels read.
  float bodyTStart = tailLengthRatio > 0.0 ? tStart : 0.0;
  float bodyTEnd = headLengthRatio > 0.0 ? tEnd : 1.0;

  // Path length and zone boundaries (needed for straightening check)
  float pathLength = queryPathLength(pathId, a_source, a_target);
  float visibleLength = pathLength * (bodyTEnd - bodyTStart);

  float headLength = headLengthRatio * webGLThickness;
  float tailLength = tailLengthRatio * webGLThickness;
  float minBodyLength = minBodyLengthRatio * webGLThickness;

  float totalNeededLength = headLength + tailLength + minBodyLength;
  float extremityScale = 1.0;
  if (totalNeededLength > visibleLength && totalNeededLength > 0.0001) {
    extremityScale = visibleLength / totalNeededLength;
    headLength *= extremityScale;
    tailLength *= extremityScale;
  }

  float headLengthT = pathLength > 0.0001 ? headLength / pathLength : 0.0;
  float tailLengthT = pathLength > 0.0001 ? tailLength / pathLength : 0.0;

  float tTailEnd = bodyTStart + tailLengthT;
  float tHeadStart = bodyTEnd - headLengthT;
  if (tTailEnd > tHeadStart) {
    float mid = (bodyTStart + bodyTEnd) * 0.5;
    tTailEnd = mid;
    tHeadStart = mid;
  }

  // Straighten factor: blend toward straight line when path twists in extremity zones
  float straightenFactor = 0.0;
  {
    float maxDeviation = 0.0;
    if (tailLengthT > 0.0001) {
      vec2 tailTang = queryPathTangent(pathId, tTailEnd, a_source, a_target);
      vec2 tailChord = queryPathPosition(pathId, bodyTStart, a_source, a_target)
                     - queryPathPosition(pathId, tTailEnd, a_source, a_target);
      float tailChordLen = length(tailChord);
      if (tailChordLen > 0.0001) {
        maxDeviation = max(maxDeviation, 1.0 - dot(-tailTang, tailChord / tailChordLen));
      }
    }
    if (headLengthT > 0.0001) {
      vec2 headTang = queryPathTangent(pathId, tHeadStart, a_source, a_target);
      vec2 headChord = queryPathPosition(pathId, bodyTEnd, a_source, a_target)
                     - queryPathPosition(pathId, tHeadStart, a_source, a_target);
      float headChordLen = length(headChord);
      if (headChordLen > 0.0001) {
        maxDeviation = max(maxDeviation, 1.0 - dot(headTang, headChord / headChordLen));
      }
    }
    straightenFactor = smoothstep(0.035, 0.5, maxDeviation);
  }

  // When straightening, blend the ungated tStart/tEnd (the label-facing clamps)
  // toward straight-line clamp positions.
  if (straightenFactor > 0.001) {
    if (tailLengthRatio > 0.0) {
`).concat(g,`
      float srcExtent = a_sourceSize * u_correctionRatio / u_sizeRatio * 2.0;
      float srcEffective = 1.0 - u_correctionRatio / srcExtent;
      float srcCa = u_cameraAngle * (1.0 - a_sourceRotateAlign);
      mat2 srcRot = mat2(cos(srcCa), -sin(srcCa), sin(srcCa), cos(srcCa));
      float lo = 0.0, hi = 0.5;
      for (int i = 0; i < 12; i++) {
        float mid = (lo + hi) * 0.5;
        vec2 pos = mix(a_source, a_target, mid);
        vec2 localPos = srcRot * ((pos - a_source) / srcExtent);
        float sdf = querySDF(int(a_sourceShapeId), localPos, srcEffective);
        if (sdf < 0.0) lo = mid; else hi = mid;
      }
      tStart = mix(tStart, (lo + hi) * 0.5, straightenFactor);
    }
    if (headLengthRatio > 0.0) {
`).concat(y,`
      float tgtExtent = a_targetSize * u_correctionRatio / u_sizeRatio * 2.0;
      float tgtEffective = 1.0 - u_correctionRatio / tgtExtent;
      float tgtCa = u_cameraAngle * (1.0 - a_targetRotateAlign);
      mat2 tgtRot = mat2(cos(tgtCa), -sin(tgtCa), sin(tgtCa), cos(tgtCa));
      float lo = 0.5, hi = 1.0;
      for (int i = 0; i < 12; i++) {
        float mid = (lo + hi) * 0.5;
        vec2 pos = mix(a_source, a_target, mid);
        vec2 localPos = tgtRot * ((pos - a_target) / tgtExtent);
        float sdf = querySDF(int(a_targetShapeId), localPos, tgtEffective);
        if (sdf < 0.0) hi = mid; else lo = mid;
      }
      tEnd = mix(tEnd, (lo + hi) * 0.5, straightenFactor);
    }
  }

  v_clamp = vec4(tStart, tEnd, straightenFactor, pathLength);

  // Scatter this point to its edge's texel center in the frame texture.
  float x = mod(float(edgeIdx), u_frameTextureWidth);
  float y = floor(float(edgeIdx) / u_frameTextureWidth);
  vec2 ndc = (vec2(x, y) + 0.5) / vec2(u_frameTextureWidth, u_frameTextureHeight) * 2.0 - 1.0;
  gl_Position = vec4(ndc, 0.0, 1.0);
  gl_PointSize = 1.0;
}
`);return _}var ca=0,Mi=1,fa=2;function Ld(a,n,e){var t=[];e&&(t.push([ca,0,-1],[ca,0,1]),t.push([ca,1,-1],[ca,1,1]));for(var r=0;r<=a;r++){var i=r/a;t.push([Mi,i,-1],[Mi,i,1])}return n&&(t.push([fa,0,-1],[fa,0,1]),t.push([fa,1,-1],[fa,1,1])),{data:t,attributes:[{name:"a_zone",size:1,type:yn},{name:"a_zoneT",size:1,type:yn},{name:"a_side",size:1,type:yn}],verticesPerEdge:t.length}}function Cd(a,n,e,t){var r=Be([].concat(K(a),K(e))),i=Tn(r),o=new Set(["u_matrix","u_sizeRatio","u_correctionRatio","u_zoomRatio","u_pixelRatio","u_cameraAngle","u_minEdgeThickness","u_pickingPadding","u_nodeDataTexture"]),s=new Set,l=[],u=function(v){!o.has(v.name)&&!s.has(v.name)&&(s.add(v.name),l.push("uniform ".concat(v.type," ").concat(v.name,";")))};a.forEach(function(m){return m.uniforms.forEach(u)}),n.forEach(function(m){return m.uniforms.forEach(u)}),e.forEach(function(m){return m.uniforms.forEach(u)});var d=t.map(function(m){var v=m.size===1?"float":"vec".concat(m.size);return"in ".concat(v," ").concat(m.name,";")}).join(`
`),h=n.map(function(m){return me(m.widthFactor)}).join(", "),c=Math.max.apply(Math,K(a.map(function(m){return m.minBodyLengthRatio||0}))),f=e.some(function(m){return m.needsNodeColors}),g=a.some(function(m){return m.needsNodeSize}),y=`#version 300 es

// Constant attributes (per vertex)
`.concat(d,`

// Per-edge attributes
// Edge data (source/target indices, thickness, extremity ratios, path/extremity IDs)
// is fetched from edge data texture via edge index
in float a_edgeIndex;   // Index into edge data texture
in vec4 a_color;        // Edge color
in vec4 a_id;           // Edge ID for picking
in float a_opacity;     // Edge opacity

// Standard uniforms
uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_zoomRatio;
uniform float u_pixelRatio;
uniform float u_cameraAngle;
uniform float u_minEdgeThickness;
#ifdef PICKING_MODE
uniform float u_pickingPadding;
#endif
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_edgeDataTexture;
uniform int u_edgeDataTextureWidth;
uniform sampler2D u_edgeFrameTexture;
uniform int u_edgeFrameTextureWidth;

// Edge path attribute texture uniforms
`).concat(i.uniformDeclarations,`

// Custom uniforms
`).concat(l.join(`
`),`

// Standard varyings
out vec4 v_color;
out float v_opacity;
out vec4 v_id;
out float v_thickness;       // Edge body thickness (in consistent units)
out float v_t;
out float v_tStart;
out float v_tEnd;
out float v_side;
out float v_antialiasingWidth;  // Anti-aliasing width (normalized: u_correctionRatio / thickness)
out vec2 v_source;
out vec2 v_target;
out float v_edgeLength;
`).concat(g?`
out float v_sourceNodeSize;  // Source node size (mirrored in labels/generator.ts as plain float)
out float v_targetNodeSize;  // Target node size (mirrored in labels/generator.ts as plain float)`:"",`
`).concat(f?`
out vec4 v_sourceColor;
out vec4 v_targetColor;`:"",`
// Zone varyings
out float v_zone;            // 0=tail, 1=body, 2=head
out float v_zoneT;           // Position within zone [0,1]
out float v_headLengthRatio; // Head length as ratio of thickness
out float v_tailLengthRatio; // Tail length as ratio of thickness
out float v_headWidthRatio;  // Head width factor
out float v_tailWidthRatio;  // Tail width factor

// Multi-path/extremity varyings
flat out int v_pathId;
flat out int v_headId;
flat out int v_tailId;

// Path/layer attribute varyings (fetched from edge attribute texture)
`).concat(i.vertexVaryingDeclarations,`

const float bias = 255.0 / 254.0;

// Width factor array for extremities (shared pool for head/tail)
const float EXTREMITY_WIDTH_FACTORS[`).concat(n.length,"] = float[](").concat(h,`);

// All path functions
`).concat(ur(a),`

// Path selector functions
`).concat(dr(a),`

// Node-data fetch helper (geometry texel of the two-texel node stride)
`).concat(at,`
`).concat(f?Bu:"",`
// Per-edge clamp from the frame-pass (tStart, tEnd, straightenFactor, pathLength)
`).concat(Zt,`

void main() {
  // Fetch edge data from edge texture (2 texels per edge)
  // Texel 0: sourceNodeIndex, targetNodeIndex, thickness, reserved
  // Texel 1: headLengthRatio, tailLengthRatio, pathId, (headId << 4) | tailId
  int edgeIdx = int(a_edgeIndex);

  // Hidden edges are flagged with a negative row by EdgeProgram.process(). Push
  // the whole primitive outside the clip volume: every vertex lands at the same
  // out-of-range position, so it is fully clipped and rasterizes nothing \u2014
  // neither to the frame buffer nor to the picking buffer.
  if (edgeIdx < 0) {
    gl_Position = vec4(2.0, 0.0, 0.0, 1.0);
    v_color = vec4(0.0);
    v_id = vec4(0.0);
    return;
  }

  int texel0Idx = edgeIdx * 2;
  int texel1Idx = edgeIdx * 2 + 1;
  ivec2 edgeTexCoord0 = ivec2(texel0Idx % u_edgeDataTextureWidth, texel0Idx / u_edgeDataTextureWidth);
  ivec2 edgeTexCoord1 = ivec2(texel1Idx % u_edgeDataTextureWidth, texel1Idx / u_edgeDataTextureWidth);
  vec4 edgeData0 = texelFetch(u_edgeDataTexture, edgeTexCoord0, 0);
  vec4 edgeData1 = texelFetch(u_edgeDataTexture, edgeTexCoord1, 0);

  // Unpack edge data
  int srcIdx = int(edgeData0.x);
  int tgtIdx = int(edgeData0.y);
  float a_thickness = edgeData0.z;
  // edgeData0.w is now reserved (curvature moved to path attribute texture)
  float a_headLengthRatio = edgeData1.x;
  float a_tailLengthRatio = edgeData1.y;
  int pathId = int(edgeData1.z);
  int extremityPacked = int(edgeData1.w);
  int headId = extremityPacked >> 4;
  int tailId = extremityPacked & 15;

  // Fetch path/layer attributes from edge attribute texture
`).concat(i.fetchCode,`

  // Assign path/layer attribute varyings
`).concat(i.varyingAssignments,`

  // Fetch source and target node geometry (texel 0 of the two-texel node stride)
  vec4 srcNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx);
  vec4 tgtNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx);

  vec2 a_source = srcNodeData.xy;
  vec2 a_target = tgtNodeData.xy;
`).concat(g?`
  // Assign node size varyings early (path functions like loops need them during clamping)
  v_sourceNodeSize = srcNodeData.z;
  v_targetNodeSize = tgtNodeData.z;`:"",`
`).concat(f?`
  v_sourceColor = readNodeColor(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx);
  v_targetColor = readNodeColor(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx);`:"",`

  // Convert thickness to WebGL units
  float minThickness = u_minEdgeThickness;
  float pixelsThickness = max(a_thickness, minThickness * u_sizeRatio);
  float webGLThickness = pixelsThickness * u_correctionRatio / u_sizeRatio;

  // Extremity parameters from ID lookups (shared pool)
  float headLengthRatio = a_headLengthRatio;
  float tailLengthRatio = a_tailLengthRatio;
  float headWidthFactor = EXTREMITY_WIDTH_FACTORS[headId];
  float tailWidthFactor = EXTREMITY_WIDTH_FACTORS[tailId];
  float minBodyLengthRatio = `).concat(me(c),`;

  // Per-edge values from the frame-pass texture (read by edge index).
  // tStart/tEnd are the ungated boundary clamps: re-apply the body's extremity
  // gating here (no extremity \u2192 body runs to the node center, 0/1).
  vec4 frameClamp = readFrameTexel(u_edgeFrameTexture, u_edgeFrameTextureWidth, edgeIdx);
  float tStart           = a_tailLengthRatio > 0.0 ? frameClamp.x : 0.0;
  float tEnd             = a_headLengthRatio > 0.0 ? frameClamp.y : 1.0;
  float straightenFactor = frameClamp.z;
  float pathLength       = frameClamp.w;

  // Anti-aliasing width (~1 pixel, normalized by thickness)
  float antialiasingWidth = u_correctionRatio / webGLThickness;

  float visibleLength = pathLength * (tEnd - tStart);

  // Compute extremity lengths in world units
  float headLength = headLengthRatio * webGLThickness;
  float tailLength = tailLengthRatio * webGLThickness;
  float minBodyLength = minBodyLengthRatio * webGLThickness;

  // Handle short edges: scale down extremities if needed
  float totalNeededLength = headLength + tailLength + minBodyLength;
  float extremityScale = 1.0;
  if (totalNeededLength > visibleLength && totalNeededLength > 0.0001) {
    extremityScale = visibleLength / totalNeededLength;
    headLength *= extremityScale;
    tailLength *= extremityScale;
  }

  // Convert lengths to t-values
  float headLengthT = pathLength > 0.0001 ? headLength / pathLength : 0.0;
  float tailLengthT = pathLength > 0.0001 ? tailLength / pathLength : 0.0;

  // Zone boundaries in t-space
  float tTailEnd = tStart + tailLengthT;
  float tHeadStart = tEnd - headLengthT;

  // Ensure body has non-negative length
  if (tTailEnd > tHeadStart) {
    float mid = (tStart + tEnd) * 0.5;
    tTailEnd = mid;
    tHeadStart = mid;
  }

  // Convert to webGL units for geometry expansion
  float aaWidthWebGL = antialiasingWidth * webGLThickness;

  // Extra geometry width for picking padding (0 in visual mode)
  #ifdef PICKING_MODE
    float pickingPaddingWebGL = u_pickingPadding * u_correctionRatio;
  #else
    float pickingPaddingWebGL = 0.0;
  #endif

  // Straight-line direction and normal (for blending when straightenFactor > 0)
  vec2 straightDir = length(a_target - a_source) > 0.0001
    ? normalize(a_target - a_source) : vec2(1.0, 0.0);
  vec2 straightNormal = vec2(-straightDir.y, straightDir.x);

  // Zone-based vertex processing using path selectors
  vec2 position;
  vec2 normal;
  float t;
  float zone = a_zone;
  float zoneT = a_zoneT;
  float side = a_side;

  // Scaled extremity width factors (geometry must be at least as wide as body)
  float scaledTailWidth = max(tailWidthFactor * extremityScale, 1.0);
  float scaledHeadWidth = max(headWidthFactor * extremityScale, 1.0);

  if (zone < 0.5) {
    // TAIL ZONE: rectangular quad with scaled width
    vec2 tang = queryPathTangent(pathId, tTailEnd, a_source, a_target);
    normal = vec2(-tang.y, tang.x);
    vec2 centerPos = mix(queryPathPosition(pathId, tStart, a_source, a_target),
                         queryPathPosition(pathId, tTailEnd, a_source, a_target), zoneT);
    float halfWidth = webGLThickness * scaledTailWidth * 0.5 + aaWidthWebGL + pickingPaddingWebGL;
    position = centerPos + normal * side * halfWidth;
    t = mix(tStart, tTailEnd, zoneT);

  } else if (zone < 1.5) {
    // BODY ZONE: follows path curvature with width = 1.0
    t = mix(tTailEnd, tHeadStart, zoneT);
    normal = queryPathNormal(pathId, t, a_source, a_target);
    float halfWidth = webGLThickness * 0.5 + aaWidthWebGL + pickingPaddingWebGL;
    position = queryPathPosition(pathId, t, a_source, a_target) + normal * side * halfWidth;

  } else {
    // HEAD ZONE: rectangular quad with scaled width
    vec2 tang = queryPathTangent(pathId, tHeadStart, a_source, a_target);
    normal = vec2(-tang.y, tang.x);
    vec2 centerPos = mix(queryPathPosition(pathId, tHeadStart, a_source, a_target),
                         queryPathPosition(pathId, tEnd, a_source, a_target), zoneT);
    float halfWidth = webGLThickness * scaledHeadWidth * 0.5 + aaWidthWebGL + pickingPaddingWebGL;
    position = centerPos + normal * side * halfWidth;
    t = mix(tHeadStart, tEnd, zoneT);
  }

  // Blend toward straight line based on path twist in extremity zones
  if (straightenFactor > 0.001) {
    float zoneWidth = zone < 0.5 ? webGLThickness * scaledTailWidth * 0.5 + aaWidthWebGL + pickingPaddingWebGL :
                      zone < 1.5 ? webGLThickness * 0.5 + aaWidthWebGL + pickingPaddingWebGL :
                      webGLThickness * scaledHeadWidth * 0.5 + aaWidthWebGL + pickingPaddingWebGL;
    vec2 straightPos = mix(a_source, a_target, t) + straightNormal * side * zoneWidth;
    position = mix(position, straightPos, straightenFactor);
  }

  gl_Position = vec4((u_matrix * vec3(position, 1.0)).xy, 0.0, 1.0);

  // Pass varyings to fragment shader
  v_color = a_color;
  v_color.a *= bias;
  v_opacity = a_opacity;
  v_id = a_id;
  v_thickness = webGLThickness;
  v_t = t;
  v_tStart = tStart;
  v_tEnd = tEnd;
  v_side = side;
  v_antialiasingWidth = antialiasingWidth;
  v_source = a_source;
  v_target = a_target;
  v_edgeLength = pathLength;

  // Zone varyings
  v_zone = zone;
  v_zoneT = zoneT;
  v_headLengthRatio = headLengthRatio * extremityScale;
  v_tailLengthRatio = tailLengthRatio * extremityScale;
  // Scale extremity width proportionally with length when crushed
  v_headWidthRatio = headWidthFactor * extremityScale;
  v_tailWidthRatio = tailWidthFactor * extremityScale;

  // Multi-path varyings
  v_pathId = pathId;
  v_headId = headId;
  v_tailId = tailId;
}
`);return y}function kd(a,n,e,t){var r=Be([].concat(K(a),K(e))),i=Tn(r),o=new Set(["u_matrix","u_sizeRatio","u_correctionRatio","u_zoomRatio","u_pixelRatio","u_cameraAngle","u_minEdgeThickness","u_pickingPadding"]),s=new Set,l=[],u=function(p){!o.has(p.name)&&!s.has(p.name)&&(s.add(p.name),l.push("uniform ".concat(p.type," ").concat(p.name,";")))};a.forEach(function(v){return v.uniforms.forEach(u)}),n.forEach(function(v){return v.uniforms.forEach(u)}),e.forEach(function(v){return v.uniforms.forEach(u)});var d=n.map(function(v){var p;return me((p=v.baseRatio)!==null&&p!==void 0?p:.5)}).join(", "),h=function(p){var b,T;return n.length>1?"EXTREMITY_BASE_RATIOS[".concat(p,"]"):me((b=(T=n[0])===null||T===void 0?void 0:T.baseRatio)!==null&&b!==void 0?b:.5)},c=n.some(function(v){return tt(v.length)?!0:v.length>0}),f=e.some(function(v){return v.needsNodeColors}),g=a.some(function(v){return v.needsNodeSize}),y=e.map(function(v,p){return"  // Layer ".concat(p+1,": ").concat(v.name,`
  color = blendOver(color, layer_`).concat(v.name,"(context));")}).join(`

`),m=`#version 300 es
precision highp float;

// Standard varyings
in vec4 v_color;
in float v_opacity;
in vec4 v_id;
in float v_thickness;       // Edge body thickness
in float v_t;
in float v_tStart;
in float v_tEnd;
in float v_side;
in float v_antialiasingWidth;  // Anti-aliasing width (normalized: u_correctionRatio / thickness)
in vec2 v_source;
in vec2 v_target;
in float v_edgeLength;
`.concat(g?`
in float v_sourceNodeSize;   // Source node size (mirrored in labels/generator.ts as plain float)
in float v_targetNodeSize;   // Target node size (mirrored in labels/generator.ts as plain float)`:"",`
`).concat(f?`
in vec4 v_sourceColor;
in vec4 v_targetColor;`:"",`
// Zone varyings
in float v_zone;            // 0=tail, 1=body, 2=head
in float v_zoneT;           // Position within zone [0,1]
in float v_headLengthRatio; // Head length as ratio of thickness (scaled for short edges)
in float v_tailLengthRatio; // Tail length as ratio of thickness (scaled for short edges)
in float v_headWidthRatio;  // Head width factor
in float v_tailWidthRatio;  // Tail width factor

// Multi-path/extremity varyings
flat in int v_pathId;
flat in int v_headId;
flat in int v_tailId;

// Path/layer attribute varyings (from vertex shader texture fetch)
`).concat(i.fragmentVaryingDeclarations,`

// Standard uniforms (needed by some path types)
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
#ifdef PICKING_MODE
uniform float u_pickingPadding;
#endif

// Custom uniforms
`).concat(l.join(`
`),`

// Fragment output (single target - picking handled via separate pass)
out vec4 fragColor;

`).concat(n.length>1?`// Base ratio array for extremities (shared pool for head/tail)
const float EXTREMITY_BASE_RATIOS[`.concat(n.length,"] = float[](").concat(d,");"):"",`

// EdgeContext struct
struct EdgeContext {
  float t;                   // Position along path [0, 1]
  float sdf;                 // Signed distance from centerline
  vec2 position;             // World position
  vec2 tangent;              // Path tangent
  vec2 normal;               // Path normal
  float thickness;           // Edge thickness
  float aaWidth;             // Anti-aliasing width
  float edgeLength;          // Total path length
  float tStart;              // Clamped start t
  float tEnd;                // Clamped end t
  float distanceFromSource;  // Arc distance from source
  float distanceToTarget;    // Arc distance to target
};

EdgeContext context;

// Alpha "over" compositing for layer blending
vec4 blendOver(vec4 bg, vec4 fg) {
  float a = fg.a;
  return vec4(mix(bg.rgb, fg.rgb, a), bg.a + a * (1.0 - bg.a));
}

// All path functions
`).concat(ur(a),`

// Path selector functions
`).concat(dr(a),`

// All extremity functions
`).concat(Ed(n),`

// Extremity SDF selector (shared pool for head/tail)
`).concat(wd(n),`

// Layer functions
`).concat(e.map(function(v){return v.glsl}).join(`

`),`

// Helper: Compute arc length using path selector
float computeArcLengthMulti(int pathId, float t0, float t1, vec2 source, vec2 target, int samples) {
  float arcLen = 0.0;
  vec2 prev = queryPathPosition(pathId, t0, source, target);
  for (int i = 1; i <= samples; i++) {
    float t = t0 + (t1 - t0) * float(i) / float(samples);
    vec2 curr = queryPathPosition(pathId, t, source, target);
    arcLen += length(curr - prev);
    prev = curr;
  }
  return arcLen;
}

void main() {
  // Compute normalized t within visible edge (0 = start, 1 = end)
  float tNorm = (v_t - v_tStart) / max(v_tEnd - v_tStart, 0.0001);

  // Edge body half-thickness
  float halfThickness = v_thickness * 0.5;

  // Convert normalized AA width to webGL units (~1 pixel)
  float aaWidthWebGL = v_antialiasingWidth * v_thickness;

  // Distance from centerline based on v_side interpolation
  float zoneWidthFactor = v_zone < 0.5 ? v_tailWidthRatio :
                          v_zone < 1.5 ? 1.0 :
                          v_headWidthRatio;
  // In PICKING_MODE, inflate halfGeometryWidth to match the inflated vertex geometry
  #ifdef PICKING_MODE
    float halfGeometryWidth = halfThickness * zoneWidthFactor + aaWidthWebGL + u_pickingPadding * aaWidthWebGL;
  #else
    float halfGeometryWidth = halfThickness * zoneWidthFactor + aaWidthWebGL;
  #endif
  float distFromCenter = abs(v_side) * halfGeometryWidth;

  // Populate EdgeContext (for layer functions)
  context.t = tNorm;
  context.sdf = distFromCenter - halfThickness;
  context.position = queryPathPosition(v_pathId, v_t, v_source, v_target);
  context.tangent = queryPathTangent(v_pathId, v_t, v_source, v_target);
  context.normal = vec2(-context.tangent.y, context.tangent.x);
  context.thickness = v_thickness;
  context.aaWidth = aaWidthWebGL;
  context.edgeLength = v_edgeLength;
  context.tStart = v_tStart;
  context.tEnd = v_tEnd;

  // Compute arc distances
  float visibleLength = v_edgeLength * (v_tEnd - v_tStart);
  float pathT = v_t;
  float pathTNorm = tNorm;
`).concat(a.every(function(v){return v.linearParameterization})?`  // All paths have linear parameterization: t maps directly to arc distance
  context.distanceFromSource = pathTNorm * visibleLength;
  context.distanceToTarget = (1.0 - pathTNorm) * visibleLength;`:a.every(function(v){return!v.linearParameterization})?`  // No paths have linear parameterization: use numerical integration
  context.distanceFromSource = computeArcLengthMulti(v_pathId, v_tStart, pathT, v_source, v_target, 16);
  context.distanceToTarget = computeArcLengthMulti(v_pathId, pathT, v_tEnd, v_source, v_target, 16);`:`  // Mixed parameterization: use analytical for linear paths, numerical for others
  if (`.concat(a.filter(function(v){return v.linearParameterization}).map(function(v){return"v_pathId == ".concat(a.indexOf(v))}).join(" || "),`) {
    context.distanceFromSource = pathTNorm * visibleLength;
    context.distanceToTarget = (1.0 - pathTNorm) * visibleLength;
  } else {
    context.distanceFromSource = computeArcLengthMulti(v_pathId, v_tStart, pathT, v_source, v_target, 16);
    context.distanceToTarget = computeArcLengthMulti(v_pathId, pathT, v_tEnd, v_source, v_target, 16);
  }`),`

  // Compute SDF based on zone using extremity selector (shared pool)
  float bodySDF = distFromCenter - halfThickness;
  float finalSDF;

`).concat(c?`  // Base ratios, from baseRatioLookup
  float headBaseRatio = `.concat(h("v_headId"),`;
  float tailBaseRatio = `).concat(h("v_tailId"),`;

  if (v_zone < 0.5) {
    // TAIL ZONE: v_zoneT goes 0 (tip) to 1 (base)
    vec2 uv = vec2((1.0 - v_zoneT) * v_tailLengthRatio, v_side * v_tailWidthRatio * 0.5);
    float tailSDF = queryExtremitySDF(v_tailId, uv, v_tailLengthRatio, v_tailWidthRatio) * v_thickness;

    // Apply union only near base (v_zoneT > 1 - baseRatio)
    if (v_zoneT > 1.0 - tailBaseRatio) {
      finalSDF = min(tailSDF, bodySDF);
    } else {
      finalSDF = tailSDF;
    }
  } else if (v_zone < 1.5) {
    // BODY ZONE: distance from centerline
    finalSDF = bodySDF;
  } else {
    // HEAD ZONE: v_zoneT goes 0 (base) to 1 (tip)
    vec2 uv = vec2(v_zoneT * v_headLengthRatio, v_side * v_headWidthRatio * 0.5);
    float headSDF = queryExtremitySDF(v_headId, uv, v_headLengthRatio, v_headWidthRatio) * v_thickness;

    // Apply union only near base (v_zoneT < baseRatio)
    if (v_zoneT < headBaseRatio) {
      finalSDF = min(headSDF, bodySDF);
    } else {
      finalSDF = headSDF;
    }
  }`):`  // No extremity draws tail/head geometry, so every vertex is body zone.
  finalSDF = bodySDF;`,`

  #ifdef PICKING_MODE
    // Picking pass: output edge ID for pixels within the picking area
    if (finalSDF > u_pickingPadding * aaWidthWebGL) discard;
    fragColor = v_id;
  #else
`).concat(t?`    // Visual pass: anti-aliased edge with layers, edge opacity applied once
    float alpha = smoothstep(aaWidthWebGL, -aaWidthWebGL, finalSDF) * v_opacity;`:`    // Visual pass: hard-edged (no anti-aliasing gradient) edge with layers, edge opacity applied once
    float alpha = (finalSDF < 0.0 ? 1.0 : 0.0) * v_opacity;`,`
    if (alpha < 0.01) discard;

    // Apply layers sequentially with "over" compositing
    vec4 color = vec4(0.0);

`).concat(y,`

    // Mix with transparent to fade both color AND alpha (pre-multiplied alpha for correct blending)
    fragColor = mix(vec4(0.0), color, alpha);
  #endif
}
`);return m}function Pd(a,n,e){var t=tt(n.length)?!0:n.length>0,r=tt(e.length)?!0:e.length>0;if(a.generateConstantData){var i=a.generateConstantData();return{data:i.data,attributes:i.attributes,verticesPerEdge:i.verticesPerEdge}}return Ld(a.segments,t,r)}function Ui(a){var n,e=io(a),t=e.paths,r=e.extremities,i=e.layers,o=(n=a.antialias)!==null&&n!==void 0?n:!0,s=new Map,l=new Map,u=new Map,d=U(t),h;try{for(d.s();!(h=d.n()).done;){var c=h.value,f=U(r),g;try{for(f.s();!(g=f.n()).done;){var y=g.value,m=U(r),v;try{for(m.s();!(v=m.n()).done;){var p=v.value,b="".concat(c.name,":").concat(y.name,":").concat(p.name),T=Pd(c,y,p);s.set(b,T.verticesPerEdge),l.set(b,T.data);var _=U(T.attributes),E;try{for(_.s();!(E=_.n()).done;){var w=E.value;u.has(w.name)||u.set(w.name,w)}}catch($){_.e($)}finally{_.f()}}}catch($){m.e($)}finally{m.f()}}}catch($){f.e($)}finally{f.f()}}}catch($){d.e($)}finally{d.f()}var A=Array.from(u.values()),S={};A.forEach(function($,Y){S[$.name]=Y});var k=0,z="",C=U(s),N;try{for(C.s();!(N=C.n()).done;){var L=ne(N.value,2),G=L[0],M=L[1];M>k&&(k=M,z=G)}}catch($){C.e($)}finally{C.f()}var F=l.get(z)||[],x=z.split(":"),P=ne(x,1),B=P[0],I=t.find(function($){return $.name===B}),R=[];I!=null&&I.generateConstantData?R=I.generateConstantData().attributes:R=[{name:"a_zone"},{name:"a_zoneT"},{name:"a_side"}];var V=F.map(function($){var Y=new Array(A.length).fill(0);return R.forEach(function(xe,se){var X=S[xe.name];X!==void 0&&se<$.length&&(Y[X]=$[se])}),Y});return{vertexShader:Cd(t,r,i,A),fragmentShader:kd(t,r,i,o),uniforms:Td(t,r,i),attributes:Fd(),verticesPerEdge:k,constantData:V,constantAttributes:A,vertexCountsPerCombination:s,constantDataPerCombination:l}}function Fd(a,n,e){return[{name:"a_edgeIndex",size:1,type:yn},{name:"a_color",size:4,type:Bi,normalized:!0},{name:"a_id",size:4,type:Bi,normalized:!0},{name:"a_opacity",size:1,type:yn}]}var Id=`#version 300 es
precision highp float;

in vec4 v_clamp;

// RGBA32F target: stores (tStart, tEnd, straightenFactor, pathLength).
out vec4 fragColor;

void main() {
  fragColor = v_clamp;
}
`,Gd=(function(){function a(n,e){J(this,a),D(this,"uniformLocations",{});var t=e.paths,r=e.extremities,i=e.layers,o=e.nodeShapes,s=e.nodeLayers;this.gl=n,this.hasAttributeData=Be([].concat(K(t),K(i))).floatsPerItem>0,this.hasNodeAttributeData=Object.keys(Qt(o,s).offsets).length>0,this.vertexShader=nr(n,Rd(t,r,i,o,s)),this.fragmentShader=ar(n,Id),this.program=rr(n,[this.vertexShader,this.fragmentShader]);var l=new Set;this.customUniforms=[];for(var u=0,d=[].concat(K(t),K(r));u<d.length;u++){var h=d[u],c=U(h.uniforms),f;try{for(c.s();!(f=c.n()).done;){var g=f.value;l.has(g.name)||(l.add(g.name),this.customUniforms.push(g))}}catch(b){c.e(b)}finally{c.f()}}var y=["u_sizeRatio","u_correctionRatio","u_cameraAngle","u_minEdgeThickness","u_nodeDataTexture","u_nodeDataTextureWidth","u_edgeDataTexture","u_edgeDataTextureWidth","u_edgeAttributeTexture","u_edgeAttributeTextureWidth","u_edgeAttributeTexelsPerEdge","u_layerAttributeTexture","u_layerAttributeTextureWidth","u_layerAttributeTexelsPerNode","u_frameTextureWidth","u_frameTextureHeight"].concat(K(this.customUniforms.map(function(b){return b.name}))),m=U(y),v;try{for(m.s();!(v=m.n()).done;){var p=v.value;this.uniformLocations[p]=n.getUniformLocation(this.program,p)}}catch(b){m.e(b)}finally{m.f()}this.vao=n.createVertexArray()}return ee(a,[{key:"run",value:function(e,t,r,i,o){if(r!==0){var s=this.gl,l=this.uniformLocations;s.useProgram(this.program),s.bindVertexArray(this.vao),l.u_sizeRatio&&s.uniform1f(l.u_sizeRatio,e.sizeRatio),l.u_correctionRatio&&s.uniform1f(l.u_correctionRatio,e.correctionRatio),l.u_cameraAngle&&s.uniform1f(l.u_cameraAngle,e.cameraAngle),l.u_minEdgeThickness&&s.uniform1f(l.u_minEdgeThickness,e.minEdgeThickness),l.u_nodeDataTexture&&s.uniform1i(l.u_nodeDataTexture,e.nodeDataTextureUnit),l.u_nodeDataTextureWidth&&s.uniform1i(l.u_nodeDataTextureWidth,e.nodeDataTextureWidth),l.u_edgeDataTexture&&s.uniform1i(l.u_edgeDataTexture,e.edgeDataTextureUnit),l.u_edgeDataTextureWidth&&s.uniform1i(l.u_edgeDataTextureWidth,e.edgeDataTextureWidth),l.u_frameTextureWidth&&s.uniform1f(l.u_frameTextureWidth,t.getTextureWidth()),l.u_frameTextureHeight&&s.uniform1f(l.u_frameTextureHeight,t.getTextureHeight()),this.hasAttributeData&&i&&(i.bind(ht),l.u_edgeAttributeTexture&&s.uniform1i(l.u_edgeAttributeTexture,ht),l.u_edgeAttributeTextureWidth&&s.uniform1i(l.u_edgeAttributeTextureWidth,i.getTextureWidth()),l.u_edgeAttributeTexelsPerEdge&&s.uniform1i(l.u_edgeAttributeTexelsPerEdge,i.getTexelsPerItem())),this.hasNodeAttributeData&&o&&(o.bind(dt),l.u_layerAttributeTexture&&s.uniform1i(l.u_layerAttributeTexture,dt),l.u_layerAttributeTextureWidth&&s.uniform1i(l.u_layerAttributeTextureWidth,o.getTextureWidth()),l.u_layerAttributeTexelsPerNode&&s.uniform1i(l.u_layerAttributeTexelsPerNode,o.getTexelsPerItem()));var u=U(this.customUniforms),d;try{for(u.s();!(d=u.n()).done;){var h=d.value;lr(s,this.uniformLocations[h.name],h)}}catch(c){u.e(c)}finally{u.f()}t.bindAsRenderTarget(),s.disable(s.BLEND),s.disable(s.DEPTH_TEST),s.drawArrays(s.POINTS,0,r),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindVertexArray(null)}}},{key:"kill",value:function(){var e=this.gl;e.deleteProgram(this.program),e.deleteShader(this.vertexShader),e.deleteShader(this.fragmentShader),e.deleteVertexArray(this.vao)}}])})();function pn(a,n,e,t,r,i){if(a.length===1)return"".concat(t," ").concat(n,"(int pathId, ").concat(r,`) {
  return path_`).concat(a[0].name,"_").concat(e,"(").concat(i,`);
}`);var o=a.map(function(s,l){return"    case ".concat(l,": return path_").concat(s.name,"_").concat(e,"(").concat(i,");")}).join(`
`);return"".concat(t," ").concat(n,"(int pathId, ").concat(r,`) {
  switch (pathId) {
`).concat(o,`
    default: return path_`).concat(a[0].name,"_").concat(e,"(").concat(i,`);
  }
}`)}var zd=`
vec3 computeEdgeLabelBodyBounds(
  float tStart, float tEnd, float pathLength,
  float webGLThickness, float headLengthRatio, float tailLengthRatio
) {
  float visibleLength = pathLength * (tEnd - tStart);

  float headLength = headLengthRatio * webGLThickness;
  float tailLength = tailLengthRatio * webGLThickness;
  float totalNeededLength = headLength + tailLength;
  if (totalNeededLength > visibleLength && totalNeededLength > 0.0001) {
    float extremityScale = visibleLength / totalNeededLength;
    headLength *= extremityScale;
    tailLength *= extremityScale;
  }

  float bodyStartDist = tStart * pathLength + tailLength;
  float bodyEndDist = tEnd * pathLength - headLength;
  return vec3(bodyStartDist, bodyEndDist, max(bodyEndDist - bodyStartDist, 0.0));
}
`;function Nd(a,n){var e=me(a),t=me(n);return`
float computeEdgeLabelAlpha(float bodyLength, float textWidthWebGL) {
  float ratio = textWidthWebGL > 0.0001 ? min(bodyLength / textWidthWebGL, 1.0) : 1.0;
  if (ratio < `.concat(e,`) return 0.0;
  if (ratio < `).concat(t,") return (ratio - ").concat(e,") / (").concat(t," - ").concat(e,`);
  return 1.0;
}
`)}var Wd=`
float computeEdgeLabelScreenDir(int pathId, float t, vec2 source, vec2 target, mat3 matrix) {
  vec2 tangent = queryPathTangent(pathId, t, source, target);
  return (matrix * vec3(tangent, 0.0)).x < 0.0 ? -1.0 : 1.0;
}
`,Bd=`
float computeEdgeLabelPerpOffset(
  float positionMode,
  float halfThickness, float marginWebGL, float halfTextHeight,
  float readingSign, float screenDir
) {
  float magnitude = halfThickness + marginWebGL + halfTextHeight;
  if (positionMode == 1.0) return magnitude * readingSign;
  if (positionMode == 2.0) return -magnitude * readingSign;
  if (positionMode == 3.0) return magnitude * screenDir;
  return 0.0;
}
`;function so(a){var n=a.paths,e=a.minVisibilityThreshold,t=a.fullVisibilityThreshold,r=n.some(function(s){return s.hasSharpCorners}),i=n.map(function(s){return"// --- Path: ".concat(s.name,` ---
`).concat(s.glsl,`

// Tangent/normal functions: analytical if provided, otherwise numerical
`).concat(s.analyticalTangentGlsl||ao(s.name),`

// Auto-generated fallbacks for any missing path functions
`).concat(ro(s.name,s.glsl),`

// Corner skip helpers (for paths with sharp corners like step/taxi)
`).concat(s.cornerSkipGlsl||"",`
`)}).join(`
`),o=r?`// Corner function selectors (only some paths have sharp corners)
vec2 queryGetCornerTs(int pathId, vec2 source, vec2 target) {
  switch (pathId) {
`.concat(n.map(function(s,l){return s.hasSharpCorners?"    case ".concat(l,": return path_").concat(s.name,"_getCornerTs(source, target);"):"    case ".concat(l,": return vec2(-1.0, -1.0); // No corners for ").concat(s.name)}).join(`
`),`
    default: return vec2(-1.0, -1.0);
  }
}

vec2 queryGetCornerConcavity(int pathId, vec2 source, vec2 target, float perpOffset) {
  switch (pathId) {
`).concat(n.map(function(s,l){return s.hasSharpCorners?"    case ".concat(l,": return path_").concat(s.name,"_getCornerConcavity(source, target, perpOffset);"):"    case ".concat(l,": return vec2(0.0, 0.0); // No corners for ").concat(s.name)}).join(`
`),`
    default: return vec2(0.0, 0.0);
  }
}`):"";return`
// ============================================================================
// Node data fetch (geometry texel) and per-edge clamp fetch (edge-frame texture)
// ============================================================================

`.concat(at,`
`).concat(Zt,`

// ============================================================================
// Path Functions (one block per path)
// ============================================================================

`).concat(i,`

// ============================================================================
// Path Query Selectors (dispatch by pathId)
// ============================================================================

`).concat(pn(n,"queryPathPosition","position","vec2","float t, vec2 source, vec2 target","t, source, target"),`

`).concat(pn(n,"queryPathTangent","tangent","vec2","float t, vec2 source, vec2 target","t, source, target"),`

`).concat(pn(n,"queryPathNormal","normal","vec2","float t, vec2 source, vec2 target","t, source, target"),`

`).concat(pn(n,"queryPathLength","length","float","vec2 source, vec2 target","source, target"),`

`).concat(pn(n,"queryPathTAtDistance","t_at_distance","float","float dist, vec2 source, vec2 target","dist, source, target"),`

`).concat(o,`

// ============================================================================
// Shared helpers (body bounds, alpha ramp, screen direction, perpendicular offset)
// ============================================================================

`).concat(zd,`
`).concat(Nd(e,t),`
`).concat(Wd,`
`).concat(Bd,`
`)}var Md=qe.fontSize,Ud=new Map,lo=24,Oi=(lo+1)*2;function Od(a){var n=a.paths,e=a.fontSizeMode,t=a.headLengthRatio,r=a.tailLengthRatio,i=a.minVisibilityThreshold,o=a.fullVisibilityThreshold,s=a.keepUpright,l=e==="scaled",u=xt(),d=Be([].concat(K(n),[u])),h=Tn(d),c=`#version 300 es

// Per-instance attributes
in float a_edgeIndex;
in float a_edgeAttrIndex;
in float a_baseFontSize;
in float a_totalTextWidth;
in float a_positionMode;
in float a_margin;
in float a_padding;
in vec4 a_color;
in vec4 a_id;

// Per-vertex (constant) attribute: strip vertex index
in float a_vertexIndex;

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_pixelRatio;
uniform float u_cameraAngle;
uniform vec2 u_resolution;
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;
uniform sampler2D u_edgeDataTexture;
uniform int u_edgeDataTextureWidth;
uniform sampler2D u_edgeFrameTexture; // Per-edge clamp (tStart, tEnd, straightenFactor, pathLength)
uniform int u_edgeFrameTextureWidth;
`.concat(l?"uniform float u_zoomSizeRatio;":"",`

`).concat(h.uniformDeclarations,`

out vec4 v_color;
out vec4 v_id;
out float v_alphaModifier;

const float ATLAS_FONT_SIZE = `).concat(me(Md),`;
const float HEAD_RATIO = `).concat(me(t),`;
const float TAIL_RATIO = `).concat(me(r),`;
const int RIBBON_SEGMENTS = `).concat(lo,`;

// Path attribute varyings (declared as plain locals since this shader has no FS inputs for them)
`).concat(h.vertexVaryingDeclarations.replace(/out /g,""),`

// Node size variables used by some path functions (self-loops, etc.)
float v_sourceNodeSize;
float v_targetNodeSize;

// Shared preamble: shape SDFs, path functions + selectors, clamp, helpers.
`).concat(so({paths:n,minVisibilityThreshold:i,fullVisibilityThreshold:o}),`

void main() {
  int vIdx = int(a_vertexIndex);
  int pairIdx = vIdx / 2;
  int side = vIdx - pairIdx * 2; // 0 = left/bottom, 1 = right/top

  // --- Fetch edge data (2 texels per edge) ---
  int edgeIdx = int(a_edgeIndex);
  int texel0Idx = edgeIdx * 2;
  int texel1Idx = edgeIdx * 2 + 1;
  ivec2 e0 = ivec2(texel0Idx % u_edgeDataTextureWidth, texel0Idx / u_edgeDataTextureWidth);
  ivec2 e1 = ivec2(texel1Idx % u_edgeDataTextureWidth, texel1Idx / u_edgeDataTextureWidth);
  vec4 edgeData0 = texelFetch(u_edgeDataTexture, e0, 0);
  vec4 edgeData1 = texelFetch(u_edgeDataTexture, e1, 0);

  int srcIdx = int(edgeData0.x);
  int tgtIdx = int(edgeData0.y);
  float thickness = edgeData0.z;
  int pathId = int(edgeData1.z);

  // --- Fetch path attributes (curvature, etc.) ---
  {
    int edgeIdx = int(a_edgeAttrIndex);
`).concat(h.fetchCode,`
`).concat(h.varyingAssignments,`
  }

  // --- Fetch node data: geometry (texel 0) + rotation flags (texel 1) ---
  vec4 srcN = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx);
  vec4 tgtN = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx);

  vec2 source = srcN.xy;
  vec2 target = tgtN.xy;
  float sourceSize = srcN.z;
  float targetSize = tgtN.z;
  v_sourceNodeSize = sourceSize;
  v_targetNodeSize = targetSize;

  // --- Pixel-to-graph conversion (fixed font mode) ---
  float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
  float pixelToGraph = 2.0 / (matrixScaleX * u_resolution.x);

  float webGLThickness = thickness * u_correctionRatio / u_sizeRatio;

  // --- Body bounds (shared with edge label shader) ---
  vec4 edgeClamp = readFrameTexel(u_edgeFrameTexture, u_edgeFrameTextureWidth, edgeIdx);
  vec3 bodyBounds = computeEdgeLabelBodyBounds(
    edgeClamp.x, edgeClamp.y, edgeClamp.w,
    webGLThickness, HEAD_RATIO, TAIL_RATIO
  );
  float bodyStartDist = bodyBounds.x;
  float bodyEndDist = bodyBounds.y;
  float bodyLength = bodyBounds.z;

  // --- Text dimensions ---
  float baseFontSize = a_baseFontSize;
  `).concat(l?`float fontScale = baseFontSize / ATLAS_FONT_SIZE * u_zoomSizeRatio;
  float textWidthWebGL = a_totalTextWidth * fontScale * u_correctionRatio / u_sizeRatio;
  float halfTextHeight = baseFontSize * 0.35 * u_zoomSizeRatio * u_correctionRatio / u_sizeRatio;
  float marginWebGL = a_margin * u_zoomSizeRatio * u_correctionRatio / u_sizeRatio;`:`float fontScale = baseFontSize / ATLAS_FONT_SIZE;
  float textWidthWebGL = a_totalTextWidth * fontScale * pixelToGraph;
  float halfTextHeight = baseFontSize * 0.35 * pixelToGraph;
  float marginWebGL = a_margin * pixelToGraph;`,`
  float paddingWebGL = a_padding * pixelToGraph;

  // --- Alpha modifier (shared with edge label shader) ---
  float alphaModifier = computeEdgeLabelAlpha(bodyLength, textWidthWebGL);
  if (alphaModifier <= 0.0 || textWidthWebGL <= 0.0) {
    gl_Position = vec4(2.0, 0.0, 0.0, 1.0);
    v_color = vec4(0.0);
    v_id = vec4(0.0);
    v_alphaModifier = 0.0;
    return;
  }

  // --- Perpendicular offset (shared with edge label shader) ---
  float bodyCenterDist = (bodyStartDist + bodyEndDist) * 0.5;
  float centerT = queryPathTAtDistance(pathId, bodyCenterDist, source, target);
  float screenDir = computeEdgeLabelScreenDir(pathId, centerT, source, target, u_matrix);
  float readingSign = `).concat(s?"screenDir":"1.0",`;
  float halfThickness = webGLThickness * 0.5;
  float perpOffset = computeEdgeLabelPerpOffset(
    a_positionMode, halfThickness, marginWebGL, halfTextHeight, readingSign, screenDir
  );

  // --- Ribbon span (clipped to body) ---
  float halfTextWebGL = textWidthWebGL * 0.5;
  float labelStartDist = max(bodyCenterDist - halfTextWebGL, bodyStartDist);
  float labelEndDist = min(bodyCenterDist + halfTextWebGL, bodyEndDist);

  // Sample centerline at this pair, then apply perpendicular offset.
  // The ribbon follows the centerline path (simple & robust); for curved edges
  // this closely matches the offset path the characters sit on.
  float u = float(pairIdx) / float(RIBBON_SEGMENTS);
  float arcDist = mix(labelStartDist, labelEndDist, u);
  float t = queryPathTAtDistance(pathId, arcDist, source, target);
  vec2 pos = queryPathPosition(pathId, t, source, target);
  vec2 tan = queryPathTangent(pathId, t, source, target);
  vec2 perp = vec2(-tan.y, tan.x);

  vec2 centerPos = pos + perp * perpOffset;

  float halfRibbon = halfTextHeight + paddingWebGL;
  float sideSign = side == 0 ? -1.0 : 1.0;
  vec2 ribbonPos = centerPos + perp * (sideSign * halfRibbon);

  vec3 clipPos = u_matrix * vec3(ribbonPos, 1.0);
  gl_Position = vec4(clipPos.xy, 0.0, 1.0);

  v_color = a_color;
  v_id = a_id;
  v_alphaModifier = alphaModifier;
}
`);return c}var Hd=`#version 300 es
precision highp float;

in vec4 v_color;
in vec4 v_id;
in float v_alphaModifier;

out vec4 fragColor;

void main() {
#ifdef PICKING_MODE
  if (v_alphaModifier <= 0.0) discard;
  fragColor = v_id;
#else
  float alpha = v_color.a * v_alphaModifier;
  if (alpha <= 0.0) discard;
  fragColor = vec4(v_color.rgb * alpha, alpha);
#endif
}
`;function $d(a,n,e,t){var r=t.shaderConfig,i=r.paths,o=r.fontSizeMode;if(i.length===0)throw new Error("createEdgeLabelBackgroundProgram: shaderConfig must declare at least one path");var s=xt(),l=Be([].concat(K(i),[s])),u=ya([].concat(K(i),[s]),l),d=Od(r),h=(function(c){function f(g,y,m){var v;return J(this,f),v=ce(this,f,[g,y,m]),D(v,"totalCount",0),D(v,"bufferCapacity",0),D(v,"edgeAttributeTexture",null),v.edgeAttributeTexture=new ma(g,l),v.packedAttributeData=new Float32Array(l.floatsPerItem),v}return fe(f,c),ee(f,[{key:"getDefinition",value:function(){for(var y=WebGL2RenderingContext,m=y.FLOAT,v=y.UNSIGNED_BYTE,p=y.TRIANGLE_STRIP,b=[],T=0;T<Oi;T++)b.push([T]);var _=["u_matrix","u_sizeRatio","u_correctionRatio","u_pixelRatio","u_cameraAngle","u_resolution","u_nodeDataTexture","u_nodeDataTextureWidth","u_edgeDataTexture","u_edgeDataTextureWidth","u_edgeFrameTexture","u_edgeFrameTextureWidth"];return o==="scaled"&&_.push("u_zoomSizeRatio"),l.floatsPerItem>0&&_.push("u_edgeAttributeTexture","u_edgeAttributeTextureWidth","u_edgeAttributeTexelsPerEdge"),{VERTICES:Oi,VERTEX_SHADER_SOURCE:d,FRAGMENT_SHADER_SOURCE:Hd,METHOD:p,UNIFORMS:_,ATTRIBUTES:[{name:"a_edgeIndex",size:1,type:m},{name:"a_edgeAttrIndex",size:1,type:m},{name:"a_baseFontSize",size:1,type:m},{name:"a_totalTextWidth",size:1,type:m},{name:"a_positionMode",size:1,type:m},{name:"a_margin",size:1,type:m},{name:"a_padding",size:1,type:m},{name:"a_color",size:4,type:v,normalized:!0},{name:"a_id",size:4,type:v,normalized:!0}],CONSTANT_ATTRIBUTES:[{name:"a_vertexIndex",size:1,type:m}],CONSTANT_DATA:b}}},{key:"processEdgeLabelBackground",value:function(y,m,v){var p=0;if(this.edgeAttributeTexture&&l.floatsPerItem>0){p=this.edgeAttributeTexture.allocate(m);var b=this.packedAttributeData;ba(u,v.edgeAttributes,b,"",Ud,0),this.edgeAttributeTexture.updateAllAttributes(m,b)}var T=this.floats,_=this.ints,E=y*this.STRIDE;T[E++]=v.edgeIndex,T[E++]=p,T[E++]=v.baseFontSize,T[E++]=v.totalTextWidth,T[E++]=v.positionMode,T[E++]=v.margin,T[E++]=v.padding,T[E++]=v.color,_[E++]=v.id}},{key:"setUniforms",value:function(y,m){var v=m.gl,p=m.uniformLocations;if(v.uniformMatrix3fv(p.u_matrix,!1,y.matrix),v.uniform1f(p.u_sizeRatio,y.sizeRatio),v.uniform1f(p.u_correctionRatio,y.correctionRatio),v.uniform1f(p.u_pixelRatio,y.pixelRatio),v.uniform1f(p.u_cameraAngle,y.cameraAngle),v.uniform2f(p.u_resolution,y.width,y.height),p.u_nodeDataTexture!==void 0&&v.uniform1i(p.u_nodeDataTexture,y.nodeDataTextureUnit),p.u_nodeDataTextureWidth!==void 0&&v.uniform1i(p.u_nodeDataTextureWidth,y.nodeDataTextureWidth),p.u_edgeDataTexture!==void 0&&v.uniform1i(p.u_edgeDataTexture,y.edgeDataTextureUnit),p.u_edgeDataTextureWidth!==void 0&&v.uniform1i(p.u_edgeDataTextureWidth,y.edgeDataTextureWidth),p.u_edgeFrameTexture!==void 0&&v.uniform1i(p.u_edgeFrameTexture,y.edgeFrameTextureUnit),p.u_edgeFrameTextureWidth!==void 0&&v.uniform1i(p.u_edgeFrameTextureWidth,y.edgeFrameTextureWidth),o==="scaled"&&p.u_zoomSizeRatio!==void 0){var b=this.renderer.getSetting("zoomToSizeRatioFunction");v.uniform1f(p.u_zoomSizeRatio,1/b(y.zoomRatio))}this.edgeAttributeTexture&&l.floatsPerItem>0&&p.u_edgeAttributeTexture!==void 0&&(this.edgeAttributeTexture.bind(ht),v.uniform1i(p.u_edgeAttributeTexture,ht),v.uniform1i(p.u_edgeAttributeTextureWidth,this.edgeAttributeTexture.getTextureWidth()),v.uniform1i(p.u_edgeAttributeTexelsPerEdge,this.edgeAttributeTexture.getTexelsPerItem()))}},{key:"renderProgram",value:function(y,m){this.edgeAttributeTexture&&l.floatsPerItem>0&&this.edgeAttributeTexture.upload(),_e(f,"renderProgram",this,3)([y,m])}},{key:"kill",value:function(){this.edgeAttributeTexture&&(this.edgeAttributeTexture.kill(),this.edgeAttributeTexture=null),_e(f,"kill",this,3)([])}},{key:"drawWebGL",value:function(y,m){var v=m.gl;this.totalCount!==0&&v.drawArraysInstanced(v.TRIANGLE_STRIP,0,this.VERTICES,this.totalCount)}},{key:"reallocate",value:function(y){this.totalCount=y,y>this.bufferCapacity&&(this.bufferCapacity=Math.max(y,Math.ceil(this.bufferCapacity*1.5)||10),_e(f,"reallocate",this,3)([this.bufferCapacity]))}}])})(At);return new h(a,n,e)}function uo(a){var n,e,t,r,i,o;return{paths:a.paths,headLengthRatio:(n=a.headLengthRatio)!==null&&n!==void 0?n:0,tailLengthRatio:(e=a.tailLengthRatio)!==null&&e!==void 0?e:0,fontSizeMode:(t=a.fontSizeMode)!==null&&t!==void 0?t:"fixed",minVisibilityThreshold:(r=a.minVisibilityThreshold)!==null&&r!==void 0?r:.7,fullVisibilityThreshold:(i=a.fullVisibilityThreshold)!==null&&i!==void 0?i:.8,keepUpright:(o=a.keepUpright)!==null&&o!==void 0?o:!0}}var Vd=qe.fontSize,jd=17/64;function qd(a){var n=a.paths,e=a.hasBorder,t=e===void 0?!1:e,r=a.fontSizeMode,i=r===void 0?"fixed":r,o=a.minVisibilityThreshold,s=o===void 0?.5:o,l=a.fullVisibilityThreshold,u=l===void 0?.6:l,d=a.keepUpright,h=d===void 0?!0:d,c=i==="scaled",f=n.some(function(p){return p.hasSharpCorners}),g=xt(),y=Be([].concat(K(n),[g])),m=Tn(y),v=`#version 300 es

// ============================================================================
// Attributes - Per Character (Instanced)
// ============================================================================

// Edge geometry: indices for texture lookup
// Edge data (source/target node indices, thickness, head/tail ratios) is fetched from edge data texture
// Edge path attributes (curvature, etc.) are fetched from edge attribute texture
in float a_edgeIndex;       // Index into edge data texture
in float a_edgeAttrIndex;   // Index into edge attribute texture (for curvature, etc.)
in float a_baseFontSize;    // Base font size in pixels (per-label)

// Character metrics (in glyph units = atlas font size pixels)
in vec4 a_charMetrics;      // (charTextOffset, charAdvance, totalTextWidth, positionMode)
in vec4 a_charDims;         // (charSize.x, charSize.y, charOffset.x, charOffset.y)

// Atlas texture coordinates
in vec4 a_texCoords;        // (x, y, width, height) in atlas pixels

// Label parameters
in vec2 a_labelParams;      // (margin, unused)

// Appearance
in vec4 a_color;            // Character color (RGBA, normalized)
`.concat(t?"in vec4 a_borderColor;      // Border color (RGBA, normalized)":"",`

// ============================================================================
// Attributes - Per Vertex (Constant)
// ============================================================================

in vec2 a_quadCorner;       // Quad corner: (0,0), (1,0), (0,1), (1,1)

// ============================================================================
// Uniforms
// ============================================================================

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_pixelRatio;
uniform float u_cameraAngle;    // Required by node shape SDFs
// u_sdfBufferPixels kept for ABI compatibility but unused in shader
uniform float u_sdfBufferPixels;
uniform vec2 u_resolution;
uniform vec2 u_atlasSize;
uniform sampler2D u_nodeDataTexture; // Shared texture with node position/size/shape data
uniform int u_nodeDataTextureWidth;  // Width of 2D node data texture for coordinate calculation
uniform sampler2D u_edgeDataTexture; // Shared texture with edge data
uniform int u_edgeDataTextureWidth;  // Width of 2D edge data texture for coordinate calculation
uniform sampler2D u_edgeFrameTexture; // Per-edge clamp (tStart, tEnd, straightenFactor, pathLength)
uniform int u_edgeFrameTextureWidth;
`).concat(c?"uniform float u_zoomSizeRatio;  // Zoom-based size ratio from zoomToSizeRatioFunction":"",`

// Edge path attribute texture uniforms (for curvature and other path attributes)
`).concat(m.uniformDeclarations,`

// ============================================================================
// Varyings
// ============================================================================

out vec2 v_texCoord;
out vec4 v_color;
`).concat(t?"out vec4 v_borderColor;":"",`
out float v_edgeFade;  // 0 = fully visible, 1 = fully faded (outside body)
out float v_alphaModifier;  // 0-1 based on label visibility ratio
out float v_fontScale;  // Ratio of rendered font size to atlas font size
`).concat(t?"out float v_positionMode;  // Position mode for conditional border (0=over needs border)":"",`

// ============================================================================
// Constants
// ============================================================================

const float bias = 255.0 / 254.0;
const float FADE_WIDTH_PIXELS = 15.0;  // Width of fade gradient in pixels
const float ATLAS_FONT_SIZE = `).concat(me(Vd),`;  // Base font size used in SDF atlas
const float VERTICAL_CENTER_RATIO = `).concat(me(jd),`;  // Baseline to visual center ratio

// ============================================================================
// Path Attribute Variables (set in main, used by path functions)
// ============================================================================
// Path attributes are fetched from the edge attribute texture and stored in
// variables with v_ prefix (e.g., v_curvature) for path functions to access.
`).concat(m.vertexVaryingDeclarations.replace(/out /g,""),`

// Node size variables (set in main, used by some path functions like loops).
// These mirror the v_sourceNodeSize / v_targetNodeSize varyings in generator.ts,
// but are plain floats here since the label shader is vertex-only.
float v_sourceNodeSize;
float v_targetNodeSize;

// Shared preamble: shape SDFs, path functions + selectors, clamp, helpers.
`).concat(so({paths:n,minVisibilityThreshold:s,fullVisibilityThreshold:u}),`

// ============================================================================
// Main
// ============================================================================

void main() {
  // -------------------------------------------------------------------------
  // Fetch edge data from edge texture (2 texels per edge)
  // -------------------------------------------------------------------------
  // Texel 0: sourceNodeIndex, targetNodeIndex, thickness, reserved
  // Texel 1: headLengthRatio, tailLengthRatio, pathId, extremityIds
  int edgeIdx = int(a_edgeIndex);
  int texel0Idx = edgeIdx * 2;
  int texel1Idx = edgeIdx * 2 + 1;
  ivec2 edgeTexCoord0 = ivec2(texel0Idx % u_edgeDataTextureWidth, texel0Idx / u_edgeDataTextureWidth);
  ivec2 edgeTexCoord1 = ivec2(texel1Idx % u_edgeDataTextureWidth, texel1Idx / u_edgeDataTextureWidth);
  vec4 edgeData0 = texelFetch(u_edgeDataTexture, edgeTexCoord0, 0);
  vec4 edgeData1 = texelFetch(u_edgeDataTexture, edgeTexCoord1, 0);

  // Unpack edge data
  int srcIdx = int(edgeData0.x);
  int tgtIdx = int(edgeData0.y);
  float thickness = edgeData0.z;
  // edgeData0.w is reserved
  float headLengthRatio = edgeData1.x;
  float tailLengthRatio = edgeData1.y;
  int pathId = int(edgeData1.z);  // Path type for multi-path support
  float baseFontSize = a_baseFontSize;

  // -------------------------------------------------------------------------
  // Fetch path attributes from edge attribute texture
  // -------------------------------------------------------------------------
  // Note: The fetch code uses 'edgeIdx' variable, so we set it to the attribute texture index
  {
    int edgeIdx = int(a_edgeAttrIndex);  // Use attribute texture index for path attributes
`).concat(m.fetchCode,`
`).concat(m.varyingAssignments,`
  }

  // -------------------------------------------------------------------------
  // Fetch node data from node texture (geometry texel + rotation-flags texel)
  // -------------------------------------------------------------------------
  vec4 srcNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, srcIdx);
  vec4 tgtNodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, tgtIdx);

  vec2 source = srcNodeData.xy;
  vec2 target = tgtNodeData.xy;
  float sourceSize = srcNodeData.z;
  float targetSize = tgtNodeData.z;
  v_sourceNodeSize = sourceSize;
  v_targetNodeSize = targetSize;
  float charTextOffset = a_charMetrics.x;
  float charAdvance = a_charMetrics.y;
  float totalTextWidth = a_charMetrics.z;
  float positionMode = a_charMetrics.w;
  vec2 charSize = a_charDims.xy;
  vec2 charOffset = a_charDims.zw;
  float margin = a_labelParams.x;

  // -------------------------------------------------------------------------
  // Compute pixel-to-graph conversion (for fixed font size mode)
  // -------------------------------------------------------------------------
  // This converts screen pixels to graph units such that N pixels on screen
  // becomes N pixels regardless of zoom level.
  // matrixScaleX is how much the matrix scales graph units to clip space
  float matrixScaleX = length(vec2(u_matrix[0][0], u_matrix[1][0]));
  float pixelToGraph = 2.0 / (matrixScaleX * u_resolution.x);

  // -------------------------------------------------------------------------
  // Step 1: Convert thickness to WebGL units
  // -------------------------------------------------------------------------
  float webGLThickness = thickness * u_correctionRatio / u_sizeRatio;

  // -------------------------------------------------------------------------
  // Step 2: Compute body bounds (truncated at node boundaries + extremities)
  // -------------------------------------------------------------------------
  vec4 edgeClamp = readFrameTexel(u_edgeFrameTexture, u_edgeFrameTextureWidth, edgeIdx);
  vec3 bodyBounds = computeEdgeLabelBodyBounds(
    edgeClamp.x, edgeClamp.y, edgeClamp.w,
    webGLThickness, headLengthRatio, tailLengthRatio
  );
  float bodyStartDist = bodyBounds.x;
  float bodyEndDist = bodyBounds.y;
  float bodyLength = bodyBounds.z;

  // -------------------------------------------------------------------------
  // Step 3: Compute font scale and text dimensions
  // -------------------------------------------------------------------------
  // Font size modes:
  // - "fixed": Constant pixel size regardless of zoom, using pixelToGraph conversion
  // - "scaled": Scales with zoom using zoomToSizeRatioFunction
  `).concat(c?`// Scaled mode: font scales with zoom
  float fontScale = baseFontSize / ATLAS_FONT_SIZE * u_zoomSizeRatio;
  // Convert glyph-unit metrics to WebGL units (scales with zoom)
  float textWidthWebGL = totalTextWidth * fontScale * u_correctionRatio / u_sizeRatio;
  float charOffsetWebGL = charTextOffset * fontScale * u_correctionRatio / u_sizeRatio;
  float charAdvanceWebGL = charAdvance * fontScale * u_correctionRatio / u_sizeRatio;`:`// Fixed mode: font stays constant in screen pixels
  float fontScale = baseFontSize / ATLAS_FONT_SIZE;
  // Convert glyph-unit metrics to graph units using pixelToGraph (zoom-independent)
  float textWidthWebGL = totalTextWidth * fontScale * pixelToGraph;
  float charOffsetWebGL = charTextOffset * fontScale * pixelToGraph;
  float charAdvanceWebGL = charAdvance * fontScale * pixelToGraph;`,`

  // Font scale varying for fragment shader gamma scaling.
  // Ratio of rendered font size to atlas font size \u2014 used to tighten the
  // anti-aliasing band for large labels so they stay sharp.
  v_fontScale = fontScale;

  // -------------------------------------------------------------------------
  // Step 4: Alpha modifier from how much of the label fits in the body
  // -------------------------------------------------------------------------
  float alphaModifier = computeEdgeLabelAlpha(bodyLength, textWidthWebGL);

  // -------------------------------------------------------------------------
  // Step 5: Compute character center offset (truncation check moved to after curvature adjustment)
  // -------------------------------------------------------------------------
  // Body center in arc distance
  float bodyCenterDist = (bodyStartDist + bodyEndDist) * 0.5;

  float centerT = queryPathTAtDistance(pathId, bodyCenterDist, source, target);
  float screenDir = computeEdgeLabelScreenDir(pathId, centerT, source, target, u_matrix);

  // Reversed labels lay their characters out from target to source
  float readingSign = `).concat(h?"screenDir":"1.0",`;

  // Character center position relative to label center (on centerline, before curvature adjustment)
  float charCenterOffset = readingSign * (charOffsetWebGL + charAdvanceWebGL * 0.5 - textWidthWebGL * 0.5);

  // -------------------------------------------------------------------------
  // Step 6: Compute perpendicular offset based on position mode
  // -------------------------------------------------------------------------
  // Position modes: 0=over, 1=above, 2=below, 3=auto
  // Needed early for curvature-adaptive character spacing in Step 7
  float halfThickness = webGLThickness * 0.5;
  `).concat(c?`// Scaled mode: margin and text height scale with zoom (same factor as font)
  float marginWebGL = margin * u_zoomSizeRatio * u_correctionRatio / u_sizeRatio;
  float halfTextHeight = baseFontSize * 0.35 * u_zoomSizeRatio * u_correctionRatio / u_sizeRatio;`:`// Fixed mode: margin and text height stay constant in screen pixels
  float marginWebGL = margin * pixelToGraph;
  float halfTextHeight = baseFontSize * 0.35 * pixelToGraph;`,`
  float perpOffset = computeEdgeLabelPerpOffset(
    positionMode, halfThickness, marginWebGL, halfTextHeight, readingSign, screenDir
  );

  // -------------------------------------------------------------------------
  // Step 7: Position character on path using offset path traversal
  // -------------------------------------------------------------------------
  // For "over" mode (perpOffset = 0), use simple centerline placement
  // For above/below modes, walk along the offset path to find correct position
  float charT;

  if (perpOffset == 0.0) {
    // Simple case: place on centerline
    float charArcDist = bodyCenterDist + charCenterOffset;
    charT = queryPathTAtDistance(pathId, charArcDist, source, target);
  } else {
    // Offset path traversal: walk along the offset curve to find character position
    // This ensures even character spacing regardless of curvature

    `).concat(f?`// -----------------------------------------------------------------------
    // Corner skip setup for step/taxi edges with above/below labels
    // -----------------------------------------------------------------------
    // At concave corners (inner side of the bend), characters would bunch up
    // because the offset path has near-zero arc length. We detect corner
    // crossings during the offset path traversal and add skip distance.

    // Get corner t values and concavity
    vec2 cornerTs = queryGetCornerTs(pathId, source, target);
    vec2 concavity = queryGetCornerConcavity(pathId, source, target, perpOffset);

    // Skip distance in graph units, proportional to on-screen font size
    // For fixed mode: use pixelToGraph so gap stays constant regardless of zoom
    // For scaled mode: use the same conversion as text width
    `.concat(c?"float skipDistGraph = STEP_INNER_CORNER_SKIP_FACTOR * baseFontSize * u_zoomSizeRatio * u_correctionRatio / u_sizeRatio;":"float skipDistGraph = STEP_INNER_CORNER_SKIP_FACTOR * baseFontSize * pixelToGraph;",`

    // Corner t values for detecting crossings during traversal
    float corner1T = cornerTs.x;
    float corner2T = cornerTs.y;
    bool corner1IsConcave = concavity.x > 0.5;
    bool corner2IsConcave = concavity.y > 0.5;`):"",`

    // Target distance along offset path from center
    float targetOffsetDist = abs(charCenterOffset);

    // Handle center character (charCenterOffset \u2248 0) - no search needed
    if (targetOffsetDist < 0.0001) {
      charT = centerT;
    } else {
      vec2 centerPos = queryPathPosition(pathId, centerT, source, target);
      vec2 centerNormal = queryPathNormal(pathId, centerT, source, target);
      vec2 offsetCenter = centerPos + centerNormal * perpOffset;

      float searchDir = charCenterOffset > 0.0 ? 1.0 : -1.0;

      // Search bounds (t values for body start and end)
      float tBodyStart = queryPathTAtDistance(pathId, bodyStartDist, source, target);
      float tBodyEnd = queryPathTAtDistance(pathId, bodyEndDist, source, target);

      // Walk along offset path to find character position
      float accumDist = 0.0;
      vec2 prevOffsetPos = offsetCenter;
      float prevT = centerT;
      float foundT = centerT;

      // Search range depends on direction
      float tSearchEnd = searchDir > 0.0 ? tBodyEnd : tBodyStart;

      `).concat(f?`// Track which concave corners we've crossed to add skip distance
      bool crossedCorner1 = false;
      bool crossedCorner2 = false;
      float effectiveTargetDist = targetOffsetDist;`:"",`

      const int STEPS = 32;
      for (int i = 1; i <= STEPS; i++) {
        // Step along centerline t, from center toward target
        float stepT = centerT + searchDir * float(i) * abs(tSearchEnd - centerT) / float(STEPS);

        `).concat(f?`// Check for concave corner crossings and add skip distance
        // Corner 1 crossing check
        if (corner1IsConcave && !crossedCorner1) {
          bool crossingCorner1 = (searchDir > 0.0)
            ? (prevT < corner1T && stepT >= corner1T)
            : (prevT > corner1T && stepT <= corner1T);
          if (crossingCorner1) {
            crossedCorner1 = true;
            effectiveTargetDist += skipDistGraph;
          }
        }

        // Corner 2 crossing check
        if (corner2IsConcave && !crossedCorner2) {
          bool crossingCorner2 = (searchDir > 0.0)
            ? (prevT < corner2T && stepT >= corner2T)
            : (prevT > corner2T && stepT <= corner2T);
          if (crossingCorner2) {
            crossedCorner2 = true;
            effectiveTargetDist += skipDistGraph;
          }
        }`:"",`

        // Compute offset position at this t
        vec2 stepPos = queryPathPosition(pathId, stepT, source, target);
        vec2 stepNormal = queryPathNormal(pathId, stepT, source, target);
        vec2 offsetPos = stepPos + stepNormal * perpOffset;

        // Distance along offset path
        float segDist = length(offsetPos - prevOffsetPos);

        `).concat(f?`if (accumDist + segDist >= effectiveTargetDist) {
          // Interpolate within segment to find exact t
          float remaining = effectiveTargetDist - accumDist;
          float segT = remaining / max(segDist, 0.0001);
          foundT = mix(prevT, stepT, segT);
          break;
        }`:`if (accumDist + segDist >= targetOffsetDist) {
          // Interpolate within segment to find exact t
          float remaining = targetOffsetDist - accumDist;
          float segT = remaining / max(segDist, 0.0001);
          foundT = mix(prevT, stepT, segT);
          break;
        }`,`

        accumDist += segDist;
        prevOffsetPos = offsetPos;
        prevT = stepT;
        // Update foundT to last valid position in case loop exhausts without finding target
        foundT = stepT;
      }

      charT = foundT;
    }
  }

  // Get position and tangent at final character position
  vec2 pathPos = queryPathPosition(pathId, charT, source, target);
  vec2 tangent = queryPathTangent(pathId, charT, source, target);

  // Compute perpendicular direction (90 degrees from tangent)
  vec2 perpDir = vec2(-tangent.y, tangent.x);

  // Apply perpendicular offset to path position
  vec2 offsetPathPos = pathPos + perpDir * perpOffset;

  // -------------------------------------------------------------------------
  // Step 8: Build character quad
  // -------------------------------------------------------------------------
  // Character size in screen pixels
  vec2 charSizePixels = charSize * fontScale;

  // Character offset from origin to the atlas region's top-left corner.
  // bearingX/bearingY already include the SDF buffer.
  vec2 charOffsetPixels = charOffset * fontScale;

  // The character's local X offset from pathPos (which is at character center)
  float charLocalX = -charAdvance * 0.5 * fontScale;

  // Build quad position:
  // - Start at character origin (charLocalX on X axis, 0 on Y axis = baseline)
  // - Add bearing offset to get to atlas region corner
  // - Add quad corner * size to get vertex position
  vec2 quadPos;
  quadPos.x = charLocalX + charOffsetPixels.x + a_quadCorner.x * charSizePixels.x;
  // charOffset.y = -bearingY (negated), so -charOffsetPixels.y = bearingY * fontScale
  // (distance from baseline to atlas region top, positive = upward)
  // Quad corner (0,0) = bottom-left, (1,1) = top-right
  quadPos.y = -charOffsetPixels.y - charSizePixels.y * (1.0 - a_quadCorner.y);

  // Center vertically on the path by offsetting by half the visual text height
  // VERTICAL_CENTER_RATIO is the distance from baseline to visual center as a ratio of atlas font size
  float verticalCenterOffset = VERTICAL_CENTER_RATIO * ATLAS_FONT_SIZE * fontScale;
  quadPos.y -= verticalCenterOffset;

  // -------------------------------------------------------------------------
  // Step 9: Rotate quad to align with tangent
  // -------------------------------------------------------------------------
  // Rotation matrix from the reading direction
  // readingDir = (cos(angle), sin(angle)), so we can build rotation directly
  vec2 readingDir = tangent * readingSign;
  mat2 rotation = mat2(readingDir.x, readingDir.y, -readingDir.y, readingDir.x);

  // Convert pixel offset to WebGL units for rotation
  `).concat(c?"vec2 quadPosWebGL = quadPos * u_correctionRatio / u_sizeRatio; // Scaled mode":"vec2 quadPosWebGL = quadPos * pixelToGraph; // Fixed mode: use pixelToGraph for zoom-independent size",`

  // Rotate around character center on path
  vec2 rotatedOffset = rotation * quadPosWebGL;

  // Final position in graph space (using offset path position for above/below modes)
  vec2 worldPos = offsetPathPos + rotatedOffset;

  // -------------------------------------------------------------------------
  // Step 10: Transform to clip space
  // -------------------------------------------------------------------------
  vec3 clipPos = u_matrix * vec3(worldPos, 1.0);
  gl_Position = vec4(clipPos.xy, 0.0, 1.0);

  // -------------------------------------------------------------------------
  // Step 11: Texture coordinates
  // -------------------------------------------------------------------------
  // Flip Y for texture coordinates (texture Y goes down, quad Y goes up)
  vec2 texCorner = vec2(a_quadCorner.x, 1.0 - a_quadCorner.y);
  v_texCoord = (a_texCoords.xy + texCorner * a_texCoords.zw) / u_atlasSize;

  // -------------------------------------------------------------------------
  // Step 12: Pass color, border color, and alpha modifier
  // -------------------------------------------------------------------------
  v_color = a_color;
  v_color.a *= bias;
`).concat(t?`  v_borderColor = a_borderColor;
  v_borderColor.a *= bias;
  v_positionMode = positionMode;`:"",`
  v_alphaModifier = alphaModifier;

  // -------------------------------------------------------------------------
  // Step 13: Compute edge fade for soft truncation
  // -------------------------------------------------------------------------
  // Convert fade width from pixels to WebGL units
  `).concat(c?"float fadeWidthWebGL = FADE_WIDTH_PIXELS * u_correctionRatio / u_sizeRatio;":"float fadeWidthWebGL = FADE_WIDTH_PIXELS * pixelToGraph;",`

  // Compute the arc position of THIS VERTEX (not just character center)
  // The quad extends from charCenter - advance/2 to charCenter + advance/2
  // a_quadCorner.x is 0 for left edge, 1 for right edge
  float vertexLocalOffset = readingSign * (a_quadCorner.x - 0.5) * charAdvanceWebGL;
  float vertexArcOffset = charCenterOffset + vertexLocalOffset;

  // Compute distance from body edges (positive = inside body, negative = outside)
  float halfBody = bodyLength * 0.5;
  float distFromStart = vertexArcOffset + halfBody;  // Distance from body start edge
  float distFromEnd = halfBody - vertexArcOffset;    // Distance from body end edge
  float distFromEdge = min(distFromStart, distFromEnd);

  // Compute fade: 0 = fully visible (deep inside body), 1 = fully faded (at body edge)
  // Fade goes from 0 (at 2*fadeWidth inside) to 1 (at body edge)
  // This ensures text is fully transparent before reaching extremities
  v_edgeFade = 1.0 - smoothstep(0.0, fadeWidthWebGL * 2.0, distFromEdge);
}
`);return v}function Xd(){var a=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},n=a.hasBorder,e=n===void 0?!1:n,t=`#version 300 es
precision highp float;

in vec2 v_texCoord;
in vec4 v_color;
`.concat(e?"in vec4 v_borderColor;":"",`
in float v_edgeFade;  // 0 = fully visible, 1 = fully faded
in float v_alphaModifier;  // 0-1 based on label visibility ratio
in float v_fontScale;  // Ratio of rendered font size to atlas font size
`).concat(e?"in float v_positionMode;  // Position mode (0=over, 1=above, 2=below, 3=auto)":"",`

uniform sampler2D u_atlas;
uniform float u_gamma;
uniform float u_sdfBuffer;
uniform float u_pixelRatio;
`).concat(e?"uniform float u_borderWidth;  // Border width in SDF units (normalized)":"",`

// Fragment output (single target - picking handled via separate pass)
out vec4 fragColor;

void main() {
  #ifdef PICKING_MODE
    // Edge labels are not pickable - discard all fragments in picking mode
    fragColor = vec4(0.0);
    discard;
  #else
  // SDF stores normalized distance: 0.5 = on edge, >0.5 = inside glyph
  float sdfValue = texture(u_atlas, v_texCoord).a;

  // Edge threshold accounting for SDF buffer padding
  float edge = 1.0 - u_sdfBuffer;

  // Scale gamma inversely with font scale so small labels get a wider AA band
  // (smoother) and large labels get a tighter band (sharper).
  float aaWidth = u_gamma / (u_pixelRatio * v_fontScale);

  // Apply edge fade for soft truncation at body boundaries
  // Also apply visibility-based alpha modifier for short edge labels
  float edgeAlpha = (1.0 - v_edgeFade) * v_alphaModifier;

`).concat(e?`  // Fill alpha: fully opaque inside the glyph
  float fillAlpha = smoothstep(edge - aaWidth, edge + aaWidth, sdfValue);

  // Only apply border for "over" position mode (v_positionMode == 0.0)
  // Labels positioned above/below/auto don't overlap the edge line and don't need borders
  if (v_positionMode < 0.5) {
    // Border rendering: compute alpha for both fill and border regions
    // Border extends from (edge - borderWidth) to edge
    float borderEdge = edge - u_borderWidth;

    // Border alpha: opaque in the border region (between borderEdge and edge)
    float borderAlpha = smoothstep(borderEdge - aaWidth, borderEdge + aaWidth, sdfValue);

    // Composite: fill on top of border
    // Border is visible where borderAlpha > 0 but fillAlpha < 1
    vec3 borderColorPremult = v_borderColor.rgb * v_borderColor.a * borderAlpha * edgeAlpha;
    vec3 fillColorPremult = v_color.rgb * v_color.a * fillAlpha * edgeAlpha;

    // Blend fill over border (fill replaces border where fill is opaque)
    float finalBorderAlpha = borderAlpha * (1.0 - fillAlpha);
    vec3 finalColor = fillColorPremult + v_borderColor.rgb * v_borderColor.a * finalBorderAlpha * edgeAlpha;
    float finalAlpha = (v_color.a * fillAlpha + v_borderColor.a * finalBorderAlpha) * edgeAlpha;

    fragColor = vec4(finalColor, finalAlpha);
  } else {
    // No border for above/below/auto positions - simple text rendering
    float finalAlpha = v_color.a * fillAlpha * edgeAlpha;
    fragColor = vec4(v_color.rgb * finalAlpha, finalAlpha);
  }`:`  // Smooth transition from transparent to opaque at glyph edge
  float alpha = smoothstep(edge - aaWidth, edge + aaWidth, sdfValue);

  // Premultiplied alpha output
  float finalAlpha = v_color.a * alpha * edgeAlpha;
  fragColor = vec4(v_color.rgb * finalAlpha, finalAlpha);`,`
  #endif
}
`);return t}function Yd(a){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,e=arguments.length>2&&arguments[2]!==void 0?arguments[2]:"fixed",t=["u_matrix","u_sizeRatio","u_correctionRatio","u_pixelRatio","u_cameraAngle","u_sdfBufferPixels","u_resolution","u_atlasSize","u_atlas","u_gamma","u_sdfBuffer","u_nodeDataTexture","u_nodeDataTextureWidth","u_edgeDataTexture","u_edgeDataTextureWidth","u_edgeFrameTexture","u_edgeFrameTextureWidth","u_edgeAttributeTexture","u_edgeAttributeTextureWidth","u_edgeAttributeTexelsPerEdge"];e==="scaled"&&t.push("u_zoomSizeRatio"),n&&t.push("u_borderWidth");var r=U(a),i;try{for(r.s();!(i=r.n()).done;){var o=i.value,s=U(o.uniforms),l;try{for(s.s();!(l=s.n()).done;){var u=l.value;t.includes(u.name)||t.push(u.name)}}catch(d){s.e(d)}finally{s.f()}}}catch(d){r.e(d)}finally{r.f()}return t}function Kd(a){var n=a.hasBorder,e=n===void 0?!1:n,t=a.fontSizeMode,r=t===void 0?"fixed":t;return{vertexShader:qd(a),fragmentShader:Xd({hasBorder:e}),uniforms:Yd(a.paths,e,r)}}var Zd=new Map;function Qd(a){switch(a){case"over":return 0;case"above":return 1;case"below":return 2;case"auto":return 3;default:return 0}}function Jd(a,n,e,t){var r=t.color,i=t.margin,o=t.textBorder,s=uo(t),l=s.paths,u=s.fontSizeMode,d=s.minVisibilityThreshold,h=s.fullVisibilityThreshold,c=s.keepUpright,f=!!o,g=Kd({paths:l,hasBorder:f,fontSizeMode:u,minVisibilityThreshold:d,fullVisibilityThreshold:h,keepUpright:c}),y=(function(m){function v(p,b,T){var _;J(this,v),_=ce(this,v,[p,b,T]),D(_,"atlasTexture",null),D(_,"atlasNeedsUpdate",!1),D(_,"refreshTimeout",null),D(_,"labelGlyphCache",new Map),D(_,"edgeAttributeTexture",null);var E=xt();if(_.attributeLayout=Be([].concat(K(l),[E])),_.attrDescriptors=ya([].concat(K(l),[E]),_.attributeLayout),_.edgeAttributeTexture=new ma(p,_.attributeLayout),_.packedAttributeData=new Float32Array(_.attributeLayout.floatsPerItem),_.atlasManager=new Et,_.gamma=.025,_.sdfBuffer=qe.cutoff,_.atlasTexture=p.createTexture(),!_.atlasTexture)throw new Error("EdgeLabelProgram: failed to create atlas texture");p.bindTexture(p.TEXTURE_2D,_.atlasTexture),p.texParameteri(p.TEXTURE_2D,p.TEXTURE_WRAP_S,p.CLAMP_TO_EDGE),p.texParameteri(p.TEXTURE_2D,p.TEXTURE_WRAP_T,p.CLAMP_TO_EDGE),p.texParameteri(p.TEXTURE_2D,p.TEXTURE_MIN_FILTER,p.LINEAR),p.texParameteri(p.TEXTURE_2D,p.TEXTURE_MAG_FILTER,p.LINEAR),p.bindTexture(p.TEXTURE_2D,null),_.atlasManager.on(Et.ATLAS_UPDATED_EVENT,function(){_.atlasNeedsUpdate=!0,_.refreshTimeout!==null&&clearTimeout(_.refreshTimeout),_.refreshTimeout=setTimeout(function(){_.refreshTimeout=null,_.renderer.refresh()},0)});var w={family:"sans-serif",weight:"normal",style:"normal"};return _.defaultFontKey=_.atlasManager.registerFont(w),_}return fe(v,m),ee(v,[{key:"getDefinition",value:function(){var b=WebGL2RenderingContext,T=b.FLOAT,_=b.UNSIGNED_BYTE,E=b.TRIANGLE_STRIP,w=new Set,A=[],S=U(l),k;try{for(S.s();!(k=S.n()).done;){var z=k.value,C=U(z.attributes),N;try{for(C.s();!(N=C.n()).done;){var L=N.value,G=L.name.startsWith("a_")?L.name:"a_".concat(L.name);w.has(G)||(w.add(G),A.push({name:G,size:L.size,type:L.type}))}}catch(M){C.e(M)}finally{C.f()}}}catch(M){S.e(M)}finally{S.f()}return{VERTICES:4,VERTEX_SHADER_SOURCE:g.vertexShader,FRAGMENT_SHADER_SOURCE:g.fragmentShader,METHOD:E,UNIFORMS:g.uniforms,ATTRIBUTES:[{name:"a_edgeIndex",size:1,type:T},{name:"a_edgeAttrIndex",size:1,type:T},{name:"a_baseFontSize",size:1,type:T},{name:"a_charMetrics",size:4,type:T},{name:"a_charDims",size:4,type:T},{name:"a_texCoords",size:4,type:T},{name:"a_labelParams",size:2,type:T},{name:"a_color",size:4,type:_,normalized:!0}].concat(K(f?[{name:"a_borderColor",size:4,type:_,normalized:!0}]:[]),K(A.filter(function(M){return!["a_curvature","curvature"].includes(M.name)}))),CONSTANT_ATTRIBUTES:[{name:"a_quadCorner",size:2,type:T}],CONSTANT_DATA:[[0,0],[1,0],[0,1],[1,1]]}}},{key:"prepareLabelGlyphs",value:function(b,T){if(T.hidden||!T.text){this.labelGlyphCache.delete(b);return}var _=T.text,E=T.fontKey||this.defaultFontKey;this.atlasManager.ensureGlyphs(_,E);var w=[],A=[],S=0,k=U(_),z;try{for(k.s();!(z=k.n()).done;){var C=z.value,N=C.codePointAt(0);if(N===void 0){w.push(void 0),A.push(S);continue}var L=this.atlasManager.getGlyph(N,E);w.push(L),A.push(S),L&&(S+=L.advance)}}catch(G){k.e(G)}finally{k.f()}this.labelGlyphCache.set(b,{glyphs:w,xOffsets:A,totalWidth:S})}},{key:"processCharacter",value:function(b,T,_,E){var w,A,S,k=this.floats,z=this.STRIDE,C=b*z,N=this.labelGlyphCache.get(T.parentKey);if(!N||!N.glyphs[E]){for(var L=0;L<z;L++)k[C+L]=0;return}var G=N.glyphs[E],M=N.xOffsets[E],F=v.labelColor,x=F&&te(F)==="object"&&"color"in F&&F.color?F.color:T.color,P=Ne(x),B=C;k[B++]=T.edgeIndex,k[B++]=(w=(A=this.edgeAttributeTexture)===null||A===void 0?void 0:A.getIndex(T.parentKey))!==null&&w!==void 0?w:0,k[B++]=T.size,k[B++]=M,k[B++]=G.advance,k[B++]=N.totalWidth,k[B++]=Qd(T.position),k[B++]=G.atlasWidth,k[B++]=G.atlasHeight,k[B++]=G.bearingX,k[B++]=-G.bearingY,k[B++]=G.atlasX,k[B++]=G.atlasY,k[B++]=G.atlasWidth,k[B++]=G.atlasHeight;var I=(S=v.labelMargin)!==null&&S!==void 0?S:T.margin;if(k[B++]=I,k[B++]=0,k[B++]=P,f&&o){var R;typeof o.color=="string"?R=o.color:R=o.color.color||"#ffffff",k[B++]=Ne(R)}var V=new Set,$=U(l),Y;try{for($.s();!(Y=$.n()).done;){var xe=Y.value,se=U(xe.attributes),X;try{for(se.s();!(X=se.n()).done;){var je=X.value,Se=je.name.startsWith("a_")?je.name.slice(2):je.name;if(Se!=="curvature"&&!V.has(Se)){V.add(Se);for(var pt=0;pt<je.size;pt++)k[B++]=0}}}catch(Ue){se.e(Ue)}finally{se.f()}}}catch(Ue){$.e(Ue)}finally{$.f()}}},{key:"processEdgeLabel",value:function(b,T,_){if(this.prepareLabelGlyphs(b,_),this.edgeAttributeTexture&&!_.hidden&&_.text){this.edgeAttributeTexture.allocate(b);var E=this.packedAttributeData;ba(this.attrDescriptors,_.edgeAttributes,E,"",Zd,0),this.edgeAttributeTexture.updateAllAttributes(b,E)}return _e(v,"processLabel",this,3)([b,T,_])}},{key:"updateAtlasTexture",value:function(){if(this.atlasNeedsUpdate){var b=this.normalProgram.gl,T=this.atlasManager.getTextures();if(T.length!==0){var _=T[0];b.bindTexture(b.TEXTURE_2D,this.atlasTexture),b.texImage2D(b.TEXTURE_2D,0,b.RGBA,_.width,_.height,0,b.RGBA,b.UNSIGNED_BYTE,_.data),b.bindTexture(b.TEXTURE_2D,null),this.atlasNeedsUpdate=!1}}}},{key:"setUniforms",value:function(b,T){var _=T.gl,E=T.uniformLocations,w=this.atlasManager.getTextures(),A=w.length>0?[w[0].width,w[0].height]:[1,1];if(_.uniformMatrix3fv(E.u_matrix,!1,b.matrix),_.uniform1f(E.u_sizeRatio,b.sizeRatio),_.uniform1f(E.u_correctionRatio,b.correctionRatio),_.uniform1f(E.u_pixelRatio,b.pixelRatio),_.uniform1f(E.u_cameraAngle,b.cameraAngle),_.uniform1f(E.u_sdfBufferPixels,qe.buffer),_.uniform2f(E.u_resolution,b.width,b.height),_.uniform2f(E.u_atlasSize,A[0],A[1]),_.uniform1f(E.u_gamma,this.gamma),_.uniform1f(E.u_sdfBuffer,this.sdfBuffer),_.activeTexture(_.TEXTURE0),_.bindTexture(_.TEXTURE_2D,this.atlasTexture),_.uniform1i(E.u_atlas,0),E.u_nodeDataTexture!==void 0&&_.uniform1i(E.u_nodeDataTexture,b.nodeDataTextureUnit),E.u_nodeDataTextureWidth!==void 0&&_.uniform1i(E.u_nodeDataTextureWidth,b.nodeDataTextureWidth),E.u_edgeDataTexture!==void 0&&_.uniform1i(E.u_edgeDataTexture,b.edgeDataTextureUnit),E.u_edgeDataTextureWidth!==void 0&&_.uniform1i(E.u_edgeDataTextureWidth,b.edgeDataTextureWidth),E.u_edgeFrameTexture!==void 0&&_.uniform1i(E.u_edgeFrameTexture,b.edgeFrameTextureUnit),E.u_edgeFrameTextureWidth!==void 0&&_.uniform1i(E.u_edgeFrameTextureWidth,b.edgeFrameTextureWidth),f&&o&&E.u_borderWidth!==void 0){var S=o.width/qe.buffer*this.sdfBuffer;_.uniform1f(E.u_borderWidth,S)}if(this.edgeAttributeTexture&&E.u_edgeAttributeTexture!==void 0&&(this.edgeAttributeTexture.bind(ht),_.uniform1i(E.u_edgeAttributeTexture,ht),_.uniform1i(E.u_edgeAttributeTextureWidth,this.edgeAttributeTexture.getTextureWidth()),_.uniform1i(E.u_edgeAttributeTexelsPerEdge,this.edgeAttributeTexture.getTexelsPerItem())),u==="scaled"&&E.u_zoomSizeRatio!==void 0){var k=this.renderer.getSetting("zoomToSizeRatioFunction"),z=1/k(b.zoomRatio);_.uniform1f(E.u_zoomSizeRatio,z)}}},{key:"renderProgram",value:function(b,T){this.updateAtlasTexture(),this.atlasManager.hasPendingGlyphs()&&(this.atlasManager.flush(),this.updateAtlasTexture()),this.edgeAttributeTexture&&this.edgeAttributeTexture.upload(),_e(v,"renderProgram",this,3)([b,T])}},{key:"registerFont",value:function(b){var T=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"normal",_=arguments.length>2&&arguments[2]!==void 0?arguments[2]:"normal";return this.atlasManager.registerFont({family:b,weight:T,style:_})}},{key:"getAtlasManager",value:function(){return this.atlasManager}},{key:"ensureGlyphsReady",value:function(b,T){var _=T||this.defaultFontKey,E=U(b),w;try{for(E.s();!(w=E.n()).done;){var A=w.value;this.atlasManager.ensureGlyphs(A,_)}}catch(S){E.e(S)}finally{E.f()}this.atlasManager.flush()}},{key:"measureLabelAtlasWidth",value:function(b,T){var _=T||this.defaultFontKey;this.atlasManager.ensureGlyphs(b,_),this.atlasManager.hasPendingGlyphs()&&this.atlasManager.flush();var E=0,w=U(b),A;try{for(w.s();!(A=w.n()).done;){var S=A.value,k=S.codePointAt(0);if(k!==void 0){var z=this.atlasManager.getGlyph(k,_);z&&(E+=z.advance)}}}catch(C){w.e(C)}finally{w.f()}return E}},{key:"measureLabel",value:function(b,T,_){var E=this.measureLabelAtlasWidth(b,_),w=T/qe.fontSize;return{width:E*w,height:T,textHeight:T}}},{key:"kill",value:function(){var b=this.normalProgram.gl;this.refreshTimeout!==null&&(clearTimeout(this.refreshTimeout),this.refreshTimeout=null),this.atlasTexture&&(b.deleteTexture(this.atlasTexture),this.atlasTexture=null),this.edgeAttributeTexture&&(this.edgeAttributeTexture.kill(),this.edgeAttributeTexture=null),this.atlasManager.destroy(),this.labelGlyphCache.clear(),_e(v,"kill",this,3)([])}}])})(eo);return D(y,"labelColor",r),D(y,"labelMargin",i),new y(a,n,e)}function eh(){var a=`
// No extremity - always returns positive (outside)
float extremity_none(vec2 uv, float lengthRatio, float widthRatio) {
  return 1.0;
}
`;return{name:"none",glsl:a,length:0,widthFactor:1,margin:0,uniforms:[],attributes:[]}}function ho(a,n,e,t,r,i,o){var s,l,u=io(t),d=u.paths,h=u.layers,c=u.defaultHead,f=u.defaultTail,g=[eh()].concat(K(u.extremities)),y={},m={};d.forEach(function(C,N){return y[C.name]=N}),g.forEach(function(C,N){return m[C.name]=N});var v=(s=m[c])!==null&&s!==void 0?s:0,p=(l=m[f])!==null&&l!==void 0?l:0,b=null,T=Be([].concat(K(d),K(h))),_=(function(C){function N(L,G,M){var F;J(this,N),b||(b=Ui({paths:d,extremities:g,layers:h,antialias:r})),F=ce(this,N,[L,G,M]),D(F,"layerLifecycles",new Map),D(F,"needsShaderRegeneration",!1),D(F,"edgeAttributeTexture",null),D(F,"layout",T),D(F,"attrDescriptors",[]),D(F,"lifecycleIndexOffset",d.length),F._pickingBuffer=G,F.edgeAttributeTexture=new ma(L,F.layout),F.packedAttributeData=new Float32Array(F.layout.floatsPerItem),h.forEach(function(P,B){if(P.lifecycle){var I={gl:L,renderer:{refresh:function(){return M.refresh()}},getUniformLocation:function(V){return L.getUniformLocation(F.normalProgram.program,V)},requestShaderRegeneration:function(){F.needsShaderRegeneration=!0},requestRefresh:function(){M.refresh()}};F.layerLifecycles.set(B,P.lifecycle(I))}}),F.layerLifecycles.forEach(function(P){var B;return(B=P.init)===null||B===void 0?void 0:B.call(P)});var x=new Map;return F.layerLifecycles.forEach(function(P,B){P.getAttributeData&&x.set(d.length+B,P)}),F.attrDescriptors=ya([].concat(K(d),K(h)),F.layout,x),F}return fe(N,C),ee(N,[{key:"getAttributeTexture",value:function(){return this.edgeAttributeTexture}},{key:"resolveEdgeIds",value:function(G,M,F){var x=G,P=0,B=v,I=p,R=M?x.selfLoopPath:F&&x.parallelPath?x.parallelPath:x.path;R&&y[R]!==void 0&&(P=y[R]),x.head&&x.head!=="none"&&m[x.head]!==void 0&&(B=m[x.head]),x.tail&&x.tail!=="none"&&m[x.tail]!==void 0&&(I=m[x.tail]);var V=g[B],$=g[I];return{pathId:P,headId:B,tailId:I,headLengthRatio:tt(V.length)?0:V.length,tailLengthRatio:tt($.length)?0:$.length}}},{key:"getDefinition",value:function(){var G=WebGL2RenderingContext,M=G.TRIANGLE_STRIP,F=M,x=b;return{VERTICES:x.verticesPerEdge,VERTEX_SHADER_SOURCE:x.vertexShader,FRAGMENT_SHADER_SOURCE:x.fragmentShader,METHOD:F,UNIFORMS:x.uniforms,ATTRIBUTES:x.attributes,CONSTANT_ATTRIBUTES:x.constantAttributes,CONSTANT_DATA:x.constantData}}},{key:"maybeRegenerateShaders",value:function(){var G=this;if(this.needsShaderRegeneration){this.needsShaderRegeneration=!1;var M=h.map(function(V,$){var Y=G.layerLifecycles.get($);return Y!=null&&Y.regenerate?Y.regenerate():V});b=Ui({paths:d,extremities:g,layers:M,antialias:this.renderer.getSetting("antialiasEdges")});var F=this.normalProgram.gl,x=this.normalProgram,P=x.program,B=x.buffer,I=x.vertexShader,R=x.fragmentShader;F.deleteProgram(P),F.deleteBuffer(B),F.deleteShader(I),F.deleteShader(R),this.normalProgram=this.getProgramInfo("normal",F,b.vertexShader,b.fragmentShader,this._pickingBuffer)}}},{key:"process",value:function(G,M,F,x,P,B){var I=M*this.STRIDE;if(P.visibility==="hidden"||F.visibility==="hidden"||x.visibility==="hidden"){for(var R=I+this.STRIDE;I<R;I++)this.floats[I]=0;this.floats[M*this.STRIDE]=Zi;return}this.processVisibleItem(Ot(G),I,F,x,P,B)}},{key:"processVisibleItem",value:function(G,M,F,x,P,B){var I,R=this.floats,V=this.ints;R[M++]=B,R[M++]=Ne(P.color),V[M++]=G,R[M++]=(I=P.opacity)!==null&&I!==void 0?I:1;var $=this.packedAttributeData;ba(this.attrDescriptors,P,$,P.color,this.layerLifecycles,this.lifecycleIndexOffset),this.edgeAttributeTexture.updateAllAttributesAtRow(B,$)}},{key:"setUniforms",value:function(G,M){var F=this,x=M.gl,P=M.uniformLocations;P.u_matrix&&x.uniformMatrix3fv(P.u_matrix,!1,G.matrix),P.u_sizeRatio&&x.uniform1f(P.u_sizeRatio,G.sizeRatio),P.u_correctionRatio&&x.uniform1f(P.u_correctionRatio,G.correctionRatio),P.u_zoomRatio&&x.uniform1f(P.u_zoomRatio,G.zoomRatio),P.u_pixelRatio&&x.uniform1f(P.u_pixelRatio,G.pixelRatio),P.u_cameraAngle&&x.uniform1f(P.u_cameraAngle,G.cameraAngle),P.u_feather&&x.uniform1f(P.u_feather,G.antiAliasingFeather),P.u_minEdgeThickness&&x.uniform1f(P.u_minEdgeThickness,G.minEdgeThickness),P.u_pickingPadding&&x.uniform1f(P.u_pickingPadding,G.edgePickingPadding),P.u_nodeDataTexture&&x.uniform1i(P.u_nodeDataTexture,G.nodeDataTextureUnit),P.u_nodeDataTextureWidth&&x.uniform1i(P.u_nodeDataTextureWidth,G.nodeDataTextureWidth),P.u_edgeDataTexture&&x.uniform1i(P.u_edgeDataTexture,G.edgeDataTextureUnit),P.u_edgeDataTextureWidth&&x.uniform1i(P.u_edgeDataTextureWidth,G.edgeDataTextureWidth),P.u_edgeFrameTexture&&x.uniform1i(P.u_edgeFrameTexture,G.edgeFrameTextureUnit),P.u_edgeFrameTextureWidth&&x.uniform1i(P.u_edgeFrameTextureWidth,G.edgeFrameTextureWidth),this.edgeAttributeTexture&&this.layout.floatsPerItem>0&&(this.edgeAttributeTexture.bind(ht),P.u_edgeAttributeTexture&&x.uniform1i(P.u_edgeAttributeTexture,ht),P.u_edgeAttributeTextureWidth&&x.uniform1i(P.u_edgeAttributeTextureWidth,this.edgeAttributeTexture.getTextureWidth()),P.u_edgeAttributeTexelsPerEdge&&x.uniform1i(P.u_edgeAttributeTexelsPerEdge,this.edgeAttributeTexture.getTexelsPerItem()));var B=new Set;d.forEach(function(I){I.uniforms.forEach(function(R){B.has(R.name)||(B.add(R.name),F.setTypedUniform(R,M))})}),g.forEach(function(I){I.uniforms.forEach(function(R){B.has(R.name)||(B.add(R.name),F.setTypedUniform(R,M))})}),h.forEach(function(I){I.uniforms.forEach(function(R){B.has(R.name)||(B.add(R.name),F.setTypedUniform(R,M))})})}},{key:"render",value:function(G,M,F){this.maybeRegenerateShaders(),_e(N,"render",this,3)([G,M,F])}},{key:"renderProgram",value:function(G,M){this.layerLifecycles.forEach(function(F){var x;return(x=F.beforeRender)===null||x===void 0?void 0:x.call(F)}),_e(N,"renderProgram",this,3)([G,M])}},{key:"uploadAttributeTexture",value:function(){this.edgeAttributeTexture&&this.layout.floatsPerItem>0&&this.edgeAttributeTexture.upload()}},{key:"kill",value:function(){this.layerLifecycles.forEach(function(G){var M;return(M=G.kill)===null||M===void 0?void 0:M.call(G)}),this.edgeAttributeTexture&&(this.edgeAttributeTexture.kill(),this.edgeAttributeTexture=null),_e(N,"kill",this,3)([])}}])})(At),E=g[v],w=g[p],A=O({paths:d,headLengthRatio:tt(E.length)?0:E.length,tailLengthRatio:tt(w.length)?0:w.length},t.label),S=uo(A),k=function(){return{labelProgram:Jd(a,null,e,A),labelBackgroundProgram:$d(a,n,e,{shaderConfig:S})}},z=new Gd(a,{paths:d,extremities:g,layers:h,nodeShapes:i,nodeLayers:o});return{edgeProgram:new _(a,null,e),createLabelPrograms:k,framePass:z}}function th(a){return te(a)==="object"&&"uniforms"in a&&Array.isArray(a.uniforms)}function nh(a){return te(a)==="object"&&"uniforms"in a&&"attributes"in a&&"glsl"in a}function ah(a){return te(a)==="object"&&"uniforms"in a&&"attributes"in a&&"segments"in a}function rh(a){return te(a)==="object"&&"uniforms"in a&&"attributes"in a&&"length"in a}function ih(a){return te(a)==="object"&&"uniforms"in a&&"attributes"in a&&"glsl"in a}function oh(a){return te(a)==="object"&&"glsl"in a&&"name"in a&&!("uniforms"in a)}function sh(a){return te(a)==="object"&&"glsl"in a&&"name"in a&&!("uniforms"in a)}function lh(a){return te(a)==="object"&&"glsl"in a&&"name"in a&&!("uniforms"in a)}function uh(a){if(th(a))return a;if(oh(a))return{name:a.name,glsl:a.glsl,inradiusFactor:a.inradiusFactor,uniforms:[]};throw new Error("Invalid node shape specification: ".concat(JSON.stringify(a)))}function dh(a){if(nh(a))return a;if(ci(a))return{name:a.name,glsl:a.glsl,uniforms:[],attributes:[]};throw new Error("Invalid node layer specification: ".concat(JSON.stringify(a)))}function hh(a){if(ah(a))return a;if(sh(a))return{name:a.name,glsl:a.glsl,segments:a.segments,uniforms:[],attributes:[]};throw new Error("Invalid edge path specification: ".concat(JSON.stringify(a)))}function ch(a){if(ih(a))return a;if(fi(a))return{name:a.name,glsl:a.glsl,uniforms:[],attributes:[]};throw new Error("Invalid edge layer specification: ".concat(JSON.stringify(a)))}function fh(a){if(rh(a))return a;if(lh(a))return{name:a.name,glsl:a.glsl,length:a.length,widthFactor:a.widthFactor,margin:0,uniforms:[],attributes:[]};throw new Error("Invalid edge extremity specification: ".concat(JSON.stringify(a)))}function co(a){var n,e,t=(n=a==null?void 0:a.shapes)!==null&&n!==void 0?n:fn.shapes,r=(e=a==null?void 0:a.layers)!==null&&e!==void 0?e:fn.layers,i=t.map(uh),o=r.map(dh);if(i.length===0)throw new Error("At least one node shape must be specified.");if(o.length===0)throw new Error("At least one node layer must be specified.");return{shapes:i,layers:o}}function gh(a){var n,e,t,r=(n=a==null?void 0:a.paths)!==null&&n!==void 0?n:Ht.paths,i=(e=a==null?void 0:a.extremities)!==null&&e!==void 0?e:Ht.extremities,o=(t=a==null?void 0:a.layers)!==null&&t!==void 0?t:Ht.layers,s=r.map(hh),l=i.map(fh).filter(function(d){return d!==null}),u=o.map(ch);if(s.length===0)throw new Error("At least one edge path must be specified.");if(u.length===0)throw new Error("At least one edge layer must be specified.");return{paths:s,extremities:l,layers:u}}function fo(a,n){var e={},t=U(a),r;try{for(t.s();!(r=t.n()).done;){var i=r.value;i.variables&&Object.assign(e,i.variables)}}catch(o){t.e(o)}finally{t.f()}return Object.assign(e,n||{}),e}function go(a,n,e,t,r){var i=co(t),o=i.shapes,s=i.layers,l=fo(o,t==null?void 0:t.variables),u=no(a,n,e,{shapes:o,layers:s,label:t==null?void 0:t.label,backdrop:t==null?void 0:t.backdrop,labelAttachments:t==null?void 0:t.labelAttachments},r);return O(O({},u),{},{variables:l})}function vo(a,n,e,t,r,i){var o=gh(t),s=o.paths,l=o.extremities,u=o.layers,d=co(i),h=d.shapes,c=d.layers,f=fo(s,t==null?void 0:t.variables),g=ho(a,n,e,{paths:s,extremities:l,layers:u,defaultHead:t==null?void 0:t.defaultHead,defaultTail:t==null?void 0:t.defaultTail,label:t==null?void 0:t.label},r,h,c);return O(O({},g),{},{variables:f,paths:s})}var vh=2;function po(a,n,e){var t=arguments.length>3&&arguments[3]!==void 0?arguments[3]:vh,r=n.canvas,i=r.width,o=r.height,s=e.x,l=e.y,u=e.rowHeight,d=e.maxRowWidth,h={},c=[],f=U(a),g;try{for(f.s();!(g=f.n()).done;){var y=g.value,m=y.width+t,v=y.height+t;if(m>i||v>o||s+m>i&&l+u+v>o){c.push(y);continue}s+m>i&&(d=Math.max(d,s),s=0,l+=u,u=v),y.draw(n,s,l),h[y.key]={x:s,y:l,width:y.width,height:y.height},s+=m,u=Math.max(u,v)}}catch(p){f.e(p)}finally{f.f()}return d=Math.max(d,s),{atlas:h,cursor:{x:s,y:l,rowHeight:u,maxRowWidth:d},remaining:c}}function Ce(a,n,e,t){var r=Object.defineProperty;try{r({},"",{})}catch{r=0}Ce=function(i,o,s,l){function u(d,h){Ce(i,d,function(c){return this._invoke(d,h,c)})}o?r?r(i,o,{value:s,enumerable:!l,configurable:!l,writable:!l}):i[o]=s:(u("next",0),u("throw",1),u("return",2))},Ce(a,n,e,t)}function ke(){var a,n,e=typeof Symbol=="function"?Symbol:{},t=e.iterator||"@@iterator",r=e.toStringTag||"@@toStringTag";function i(f,g,y,m){var v=g&&g.prototype instanceof s?g:s,p=Object.create(v.prototype);return Ce(p,"_invoke",(function(b,T,_){var E,w,A,S=0,k=_||[],z=!1,C={p:0,n:0,v:a,a:N,f:N.bind(a,4),d:function(L,G){return E=L,w=0,A=a,C.n=G,o}};function N(L,G){for(w=L,A=G,n=0;!z&&S&&!M&&n<k.length;n++){var M,F=k[n],x=C.p,P=F[2];L>3?(M=P===G)&&(A=F[(w=F[4])?5:(w=3,3)],F[4]=F[5]=a):F[0]<=x&&((M=L<2&&x<F[1])?(w=0,C.v=G,C.n=F[1]):x<P&&(M=L<3||F[0]>G||G>P)&&(F[4]=L,F[5]=G,C.n=P,w=0))}if(M||L>1)return o;throw z=!0,G}return function(L,G,M){if(S>1)throw TypeError("Generator is already running");for(z&&G===1&&N(G,M),w=G,A=M;(n=w<2?a:A)||!z;){E||(w?w<3?(w>1&&(C.n=-1),N(w,A)):C.n=A:C.v=A);try{if(S=2,E){if(w||(L="next"),n=E[L]){if(!(n=n.call(E,A)))throw TypeError("iterator result is not an object");if(!n.done)return n;A=n.value,w<2&&(w=0)}else w===1&&(n=E.return)&&n.call(E),w<2&&(A=TypeError("The iterator does not provide a '"+L+"' method"),w=1);E=a}else if((n=(z=C.n<0)?A:b.call(T,C))!==o)break}catch(F){E=a,w=1,A=F}finally{S=1}}return{value:n,done:z}}})(f,y,m),!0),p}var o={};function s(){}function l(){}function u(){}n=Object.getPrototypeOf;var d=[][t]?n(n([][t]())):(Ce(n={},t,function(){return this}),n),h=u.prototype=s.prototype=Object.create(d);function c(f){return Object.setPrototypeOf?Object.setPrototypeOf(f,u):(f.__proto__=u,Ce(f,r,"GeneratorFunction")),f.prototype=Object.create(h),f}return l.prototype=u,Ce(h,"constructor",u),Ce(u,"constructor",l),l.displayName="GeneratorFunction",Ce(u,r,"GeneratorFunction"),Ce(h),Ce(h,r,"Generator"),Ce(h,t,function(){return this}),Ce(h,"toString",function(){return"[object Generator]"}),(ke=function(){return{w:i,m:c}})()}function mo(a,n,e,t,r,i,o){try{var s=a[i](o),l=s.value}catch(u){return void e(u)}s.done?n(l):Promise.resolve(l).then(t,r)}function en(a){return function(){var n=this,e=arguments;return new Promise(function(t,r){var i=a.apply(n,e);function o(l){mo(i,t,r,o,s,"next",l)}function s(l){mo(i,t,r,o,s,"throw",l)}o(void 0)})}}var xa=new Map,yo=!1;function ph(a){return new Promise(function(n,e){var t=new FileReader;t.onload=function(){return n(t.result)},t.onerror=e,t.readAsDataURL(a)})}function mh(a){if(!xa.has(a)){var n=fetch(a).then(function(e){return e.blob()}).then(ph).catch(function(){return xa.delete(a),null});xa.set(a,n)}return xa.get(a)}function yh(a){return hr.apply(this,arguments)}function hr(){return hr=en(ke().m(function a(n){var e,t,r;return ke().w(function(i){for(;;)switch(i.n){case 0:return e=document.createElement("div"),e.innerHTML=n,t=Array.from(e.querySelectorAll("img[src]")),r=t.filter(function(o){return!o.getAttribute("src").startsWith("data:")}),i.n=1,Promise.all(r.map((function(){var o=en(ke().m(function s(l){var u;return ke().w(function(d){for(;;)switch(d.n){case 0:return d.n=1,mh(l.getAttribute("src"));case 1:u=d.v,u&&l.setAttribute("src",u);case 2:return d.a(2)}},s)}));return function(s){return o.apply(this,arguments)}})()));case 1:return i.a(2,e.innerHTML)}},a)})),hr.apply(this,arguments)}function bo(a){return cr.apply(this,arguments)}function cr(){return cr=en(ke().m(function a(n){var e,t,r,i,o,s,l,u,d,h,c,f,g,y=arguments;return ke().w(function(m){for(;;)switch(m.n){case 0:if(e=y.length>1&&y[1]!==void 0?y[1]:1,t=n instanceof SVGElement?new XMLSerializer().serializeToString(n):n,r=new DOMParser,i=r.parseFromString(t,"image/svg+xml"),o=i.querySelector("svg"),o){m.n=1;break}return m.a(2,null);case 1:if(s=parseFloat(o.getAttribute("width")||""),l=parseFloat(o.getAttribute("height")||""),(!(s>0)||!(l>0))&&(u=o.getAttribute("viewBox"),u&&(d=u.trim().split(/[\s,]+/),s=parseFloat(d[2]),l=parseFloat(d[3]))),!(!(s>0)||!(l>0))){m.n=2;break}return console.warn("Sigma: SVG label attachment has no parseable dimensions \u2014 skipped."),m.a(2,null);case 2:return h=Math.ceil(s*e),c=Math.ceil(l*e),f=new Blob([t],{type:"image/svg+xml"}),g=URL.createObjectURL(f),m.a(2,new Promise(function(v){var p=new Image;p.onload=function(){var b=document.createElement("canvas");b.width=h,b.height=c,b.getContext("2d").drawImage(p,0,0,h,c),URL.revokeObjectURL(g);try{b.getContext("2d").getImageData(0,0,1,1)}catch(T){if(T instanceof DOMException&&T.name==="SecurityError"){yo||(yo=!0,console.warn('Sigma: A label attachment was skipped because the rendered canvas is tainted. SVG with <foreignObject> (used by the "html" attachment type) is blocked in Chromium and Safari. Use type: "canvas" with Canvas 2D rendering instead.')),v(null);return}throw T}v(b)},p.onerror=function(){URL.revokeObjectURL(g),v(null)},p.src=g}))}},a)})),cr.apply(this,arguments)}function bh(a,n){var e=document.createElement("div");e.style.cssText="position:fixed;left:-99999px;top:0;visibility:hidden;width:max-content;height:max-content",e.innerHTML=(n?"<style>".concat(n,"</style>"):"")+a,document.body.appendChild(e);var t=e.getBoundingClientRect(),r=t.width,i=t.height;return document.body.removeChild(e),{width:Math.ceil(r),height:Math.ceil(i)}}function _h(a,n,e,t){return fr.apply(this,arguments)}function fr(){return fr=en(ke().m(function a(n,e,t,r){var i,o,s,l,u,d,h,c,f=arguments;return ke().w(function(g){for(;;)switch(g.n){case 0:return i=f.length>4&&f[4]!==void 0?f[4]:1,o=n instanceof HTMLElement?n.outerHTML:n,g.n=1,yh(o);case 1:return s=g.v,(t==null||r==null)&&(l=bh(s,e),t=t!=null?t:l.width,r=r!=null?r:l.height),u=Math.ceil(t*i),d=Math.ceil(r*i),h=e?"<style>".concat(e,"</style>"):"",c='<svg xmlns="http://www.w3.org/2000/svg" '+'width="'.concat(u,'" height="').concat(d,'" viewBox="0 0 ').concat(t," ").concat(r,'">')+'<foreignObject width="'.concat(t,'" height="').concat(r,'">')+'<body xmlns="http://www.w3.org/1999/xhtml" style="margin:0;padding:0">'.concat(h).concat(s,"</body>")+"</foreignObject></svg>",g.a(2,bo(c,1))}},a)})),fr.apply(this,arguments)}function xh(a){return gr.apply(this,arguments)}function gr(){return gr=en(ke().m(function a(n){var e,t=arguments,r;return ke().w(function(i){for(;;)switch(i.n){case 0:e=t.length>1&&t[1]!==void 0?t[1]:1,r=n.type,i.n=r==="canvas"?1:r==="svg"?2:r==="html"?3:4;break;case 1:return i.a(2,n.canvas);case 2:return i.a(2,bo(n.svg,e));case 3:return i.a(2,_h(n.html,n.css,n.width,n.height,e));case 4:return i.a(2)}},a)})),gr.apply(this,arguments)}var Jt=2048,_o=(function(){function a(n,e,t){J(this,a),D(this,"cache",new Map),D(this,"pending",new Set),D(this,"atlas",{}),D(this,"glTexture",null),D(this,"dirty",!0),this.gl=n,this.renderers=e,this.scheduleRender=t,this.packCanvas=document.createElement("canvas"),this.packCanvas.width=Jt,this.packCanvas.height=Jt,this.packCtx=this.packCanvas.getContext("2d")}return ee(a,[{key:"renderAttachment",value:function(e,t,r){var i=this,o="".concat(e,":").concat(t);if(!(this.cache.has(o)||this.pending.has(o))){var s=this.renderers[t];if(s){var l=s(r);if(l){this.pending.add(o);var u=r.pixelRatio;Promise.resolve(l).then((function(){var d=en(ke().m(function h(c){var f;return ke().w(function(g){for(;;)switch(g.n){case 0:if(i.pending.has(o)){g.n=1;break}return g.a(2);case 1:if(i.pending.delete(o),c){g.n=2;break}return g.a(2);case 2:return g.n=3,xh(c,u);case 3:if(f=g.v,!(!f||f.width===0||f.height===0)){g.n=4;break}return g.a(2);case 4:i.cache.set(o,{image:f,width:f.width,height:f.height}),i.dirty=!0,i.scheduleRender();case 5:return g.a(2)}},h)}));return function(h){return d.apply(this,arguments)}})())}}}}},{key:"regenerateAtlas",value:function(){if(this.dirty){this.dirty=!1;var e=[];if(this.cache.forEach(function(u,d){e.push({key:d,width:u.width,height:u.height,draw:function(c,f,g){c.drawImage(u.image,f,g)}})}),e.length===0){this.atlas={},this.deleteGLTexture();return}var t={x:0,y:0,rowHeight:0,maxRowWidth:0};this.packCtx.clearRect(0,0,Jt,Jt);var r=po(e,this.packCtx,t),i=r.atlas,o=r.remaining;this.atlas=i,o.length>0&&console.warn("Sigma: ".concat(o.length," label attachment(s) could not fit in the ").concat(Jt,"x").concat(Jt," atlas and will not be rendered.")),this.deleteGLTexture();var s=this.gl,l=s.createTexture();s.activeTexture(s.TEXTURE0+xn),s.bindTexture(s.TEXTURE_2D,l),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),s.texImage2D(s.TEXTURE_2D,0,s.RGBA,s.RGBA,s.UNSIGNED_BYTE,this.packCanvas),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MAG_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),this.glTexture=l}}},{key:"bindTexture",value:function(e){if(this.glTexture){var t=this.gl;t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D,this.glTexture)}}},{key:"getEntry",value:function(e,t){var r="".concat(e,":").concat(t);return this.atlas[r]||null}},{key:"invalidateNode",value:function(e){var t="".concat(e,":"),r=U(this.cache.keys()),i;try{for(r.s();!(i=r.n()).done;){var o=i.value;o.startsWith(t)&&(this.cache.delete(o),this.dirty=!0)}}catch(d){r.e(d)}finally{r.f()}var s=U(this.pending),l;try{for(s.s();!(l=s.n()).done;){var u=l.value;u.startsWith(t)&&this.pending.delete(u)}}catch(d){s.e(d)}finally{s.f()}}},{key:"restore",value:function(){this.glTexture=null,this.dirty=!0}},{key:"clear",value:function(){this.cache.clear(),this.pending.clear(),this.atlas={},this.dirty=!0,this.deleteGLTexture()}},{key:"kill",value:function(){this.clear(),this.packCanvas=null,this.packCtx=null,this.gl=null}},{key:"deleteGLTexture",value:function(){this.glTexture&&(this.gl.deleteTexture(this.glTexture),this.glTexture=null)}}])})(),vr=(function(){function a(n){J(this,a),D(this,"buckets",new Map),D(this,"keyDepth",new Map);var e=U(n),t;try{for(e.s();!(t=e.n()).done;){var r=t.value;this.buckets.set(r,new Set)}}catch(i){e.e(i)}finally{e.f()}}return ee(a,[{key:"has",value:function(e){return this.keyDepth.has(e)}},{key:"getBucket",value:function(e){return this.buckets.get(e)}},{key:"set",value:function(e,t){var r,i=this.keyDepth.get(e);if(i!==t){var o=this.buckets.get(t);if(!o)throw new Error('Sigma: "'.concat(t,'" is not a declared depth layer'));i!==void 0&&((r=this.buckets.get(i))===null||r===void 0||r.delete(e)),o.add(e),this.keyDepth.set(e,t)}}},{key:"remove",value:function(e){var t=this.keyDepth.get(e);t!==void 0&&(this.buckets.get(t).delete(e),this.keyDepth.delete(e))}},{key:"clearAll",value:function(){var e=U(this.buckets.values()),t;try{for(e.s();!(t=e.n()).done;){var r=t.value;r.clear()}}catch(i){e.e(i)}finally{e.f()}this.keyDepth.clear()}},{key:"getSorted",value:function(e,t){var r=this.buckets.get(e);return!r||r.size===0?[]:K(r).sort(function(i,o){return t(i)-t(o)})}}])})(),xo=(function(a){function n(e,t){return J(this,n),ce(this,n,[e,2,t])}return fe(n,a),ee(n,[{key:"updateNode",value:function(t,r,i,o,s,l,u,d){var h=this.indexMap.get(t);if(h===void 0)throw new Error('Node "'.concat(t,'" not allocated in NodeDataTexture'));var c=lt(d),f=ne(c,4),g=f[0],y=f[1],m=f[2],v=f[3],p=h*2*4;this.data[p]=r,this.data[p+1]=i,this.data[p+2]=o,this.data[p+3]=s,this.data[p+4]=l,this.data[p+5]=u,this.data[p+6]=g*65536+y*256+m,this.data[p+7]=v/255,this.markDirty(h)}}])})(pa),Th=1024,Eh=1.5,pr=(function(){function a(n,e){var t;if(J(this,a),D(this,"texture",null),D(this,"framebuffer",null),!n.getExtension("EXT_color_buffer_float"))throw new Error("sigma: EXT_color_buffer_float is required for label/edge placement but is unavailable in this WebGL2 context.");this.gl=n,this.maxTextureSize=n.getParameter(n.MAX_TEXTURE_SIZE),this.channels=e.channels,this.capacity=this.roundUpToPowerOfTwo((t=e.initialCapacity)!==null&&t!==void 0?t:Th);var r=this.computeDimensions(this.capacity);this.textureWidth=r.width,this.textureHeight=r.height,this.create()}return ee(a,[{key:"roundUpToPowerOfTwo",value:function(e){return Math.pow(2,Math.ceil(Math.log2(Math.max(1,e))))}},{key:"computeDimensions",value:function(e){var t=Math.min(e,this.maxTextureSize),r=Math.ceil(e/t);return{width:t,height:r}}},{key:"create",value:function(){var e=this.gl,t=this.channels===1?e.R32F:e.RGBA32F,r=this.channels===1?e.RED:e.RGBA;if(this.texture=e.createTexture(),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.texture),e.texImage2D(e.TEXTURE_2D,0,t,this.textureWidth,this.textureHeight,0,r,e.FLOAT,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this.framebuffer=e.createFramebuffer(),e.bindFramebuffer(e.FRAMEBUFFER,this.framebuffer),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,this.texture,0),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE)throw new Error("sigma: float framebuffer for frame-pass placement is incomplete.");e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindTexture(e.TEXTURE_2D,null)}},{key:"ensureCapacity",value:function(e){if(!(e<=this.capacity)){var t=this.gl;this.capacity=this.roundUpToPowerOfTwo(Math.ceil(e*Eh));var r=this.computeDimensions(this.capacity);this.textureWidth=r.width,this.textureHeight=r.height,this.texture&&t.deleteTexture(this.texture),this.framebuffer&&t.deleteFramebuffer(this.framebuffer),this.create()}}},{key:"bindAsRenderTarget",value:function(){var e=this.gl;e.bindFramebuffer(e.FRAMEBUFFER,this.framebuffer),e.viewport(0,0,this.textureWidth,this.textureHeight)}},{key:"bind",value:function(e){var t=this.gl;t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D,this.texture)}},{key:"getTexture",value:function(){return this.texture}},{key:"getTextureWidth",value:function(){return this.textureWidth}},{key:"getTextureHeight",value:function(){return this.textureHeight}},{key:"restore",value:function(){this.gl.getExtension("EXT_color_buffer_float"),this.create()}},{key:"kill",value:function(){var e=this.gl;this.texture&&(e.deleteTexture(this.texture),this.texture=null),this.framebuffer&&(e.deleteFramebuffer(this.framebuffer),this.framebuffer=null)}}])})(),To=(function(a){function n(e,t){return J(this,n),ce(this,n,[e,2,t])}return fe(n,a),ee(n,[{key:"updateEdge",value:function(t,r,i,o,s,l){var u=arguments.length>6&&arguments[6]!==void 0?arguments[6]:0,d=arguments.length>7&&arguments[7]!==void 0?arguments[7]:0,h=arguments.length>8&&arguments[8]!==void 0?arguments[8]:0,c=this.indexMap.get(t);if(c===void 0)throw new Error('Edge "'.concat(t,'" not allocated in EdgeDataTexture'));var f=c*this.TEXELS_PER_ITEM*4;this.data[f+0]=r,this.data[f+1]=i,this.data[f+2]=o,this.data[f+3]=0,this.data[f+4]=s,this.data[f+5]=l,this.data[f+6]=u,this.data[f+7]=(d&15)<<4|h&15,this.markDirty(c)}}])})(pa);var Pf=Qe(sn()),Ff=Qe(jt());function Sh(a,n){if(a==null)return{};var e={};for(var t in a)if({}.hasOwnProperty.call(a,t)){if(n.indexOf(t)!==-1)continue;e[t]=a[t]}return e}function Eo(a,n){if(a==null)return{};var e,t,r=Sh(a,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(a);for(t=0;t<i.length;t++)e=i[t],n.indexOf(e)===-1&&{}.propertyIsEnumerable.call(a,e)&&(r[e]=a[e])}return r}var Ah=["factor"],wh=["factor"],So=1.5,mr={x:.5,y:.5,angle:0,ratio:1},Ao=(function(a){function n(){var e;J(this,n);for(var t=arguments.length,r=new Array(t),i=0;i<t;i++)r[i]=arguments[i];return e=ce(this,n,[].concat(r)),D(e,"minRatio",null),D(e,"maxRatio",null),D(e,"enabled",!0),D(e,"enabledZooming",!0),D(e,"enabledPanning",!0),D(e,"enabledRotation",!0),D(e,"constrainState",null),D(e,"state",O({},mr)),D(e,"previousState",O({},mr)),D(e,"nextFrame",null),D(e,"currentAnimationFrom",null),D(e,"currentAnimationTo",null),D(e,"animationCallback",null),e}return fe(n,a),ee(n,[{key:"x",get:function(){return this.state.x}},{key:"y",get:function(){return this.state.y}},{key:"angle",get:function(){return this.state.angle}},{key:"ratio",get:function(){return this.state.ratio}},{key:"getState",value:function(){return O({},this.state)}},{key:"getPreviousState",value:function(){return O({},this.previousState)}},{key:"getBoundedRatio",value:function(t){var r=t;return typeof this.minRatio=="number"&&(r=Math.max(r,this.minRatio)),typeof this.maxRatio=="number"&&(r=Math.min(r,this.maxRatio)),r}},{key:"validateState",value:function(t){var r=this.getState();return this.enabledPanning&&typeof t.x=="number"&&(r.x=t.x),this.enabledPanning&&typeof t.y=="number"&&(r.y=t.y),this.enabledZooming&&typeof t.ratio=="number"&&(r.ratio=this.getBoundedRatio(t.ratio)),this.enabledRotation&&typeof t.angle=="number"&&(r.angle=t.angle),this.constrainState?this.constrainState(r):r}},{key:"isAnimating",value:function(){return this.nextFrame!==null}},{key:"setState",value:function(t){if(!this.enabled)return this;var r=this.validateState(t);return Ri(this.state,r)?this:(this.previousState=this.state,this.state=r,this.emit("updated",this.getState()),this)}},{key:"updateState",value:function(t){return this.setState(t(this.getState())),this}},{key:"animate",value:function(t,r){var i=this;return this.enabled?new Promise(function(o){return i.runAnimation(t,O(O({},ki),r),o)}):Promise.resolve()}},{key:"cancelAnimation",value:function(){return this.nextFrame!==null&&(cancelAnimationFrame(this.nextFrame),this.nextFrame=null),this.resolveAnimation(),this.emitAnimationEnd(!1),this}},{key:"zoomIn",value:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},r=t.factor,i=r===void 0?So:r,o=Eo(t,Ah);return this.animate({ratio:this.ratio/i},o)}},{key:"zoomOut",value:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},r=t.factor,i=r===void 0?So:r,o=Eo(t,wh);return this.animate({ratio:this.ratio*i},o)}},{key:"reset",value:function(t){return this.animate(mr,t)}},{key:"runAnimation",value:function(t,r,i){var o=this,s=Jn(r.easing),l=Date.now(),u=this.getState(),d=this.validateState(t),h=function(){if(!o.enabled){o.cancelAnimation();return}var f=r.duration>0?(Date.now()-l)/r.duration:1;if(f>=1){o.nextFrame=null,o.setState(d),o.resolveAnimation(),o.emitAnimationEnd(!0);return}var g=s(f);o.setState({x:u.x+(d.x-u.x)*g,y:u.y+(d.y-u.y)*g,angle:u.angle+(d.angle-u.angle)*g,ratio:u.ratio+(d.ratio-u.ratio)*g}),o.nextFrame=requestAnimationFrame(h)};this.cancelAnimation(),this.currentAnimationFrom=u,this.currentAnimationTo=d,this.animationCallback=i,this.emit("animationStart",{from:u,to:d}),h()}},{key:"resolveAnimation",value:function(){var t=this.animationCallback;this.animationCallback=null,t&&t()}},{key:"emitAnimationEnd",value:function(t){var r=this.currentAnimationFrom,i=this.currentAnimationTo;!r||!i||(this.currentAnimationFrom=null,this.currentAnimationTo=null,this.emit("animationEnd",{from:r,to:i,completed:t}))}}],[{key:"from",value:function(t){var r=new n;return r.setState(t)}}])})(aa);function Pe(a,n){var e=n.getBoundingClientRect();return{x:a.clientX-e.left,y:a.clientY-e.top}}function Xe(a,n){var e=O(O({},Pe(a,n)),{},{sigmaDefaultPrevented:!1,preventSigmaDefault:function(){e.sigmaDefaultPrevented=!0},original:a});return e}function wt(a){var n="x"in a?a:O(O({},a.touches[0]||a.previousTouches[0]),{},{original:a.original,sigmaDefaultPrevented:a.sigmaDefaultPrevented,preventSigmaDefault:function(){a.sigmaDefaultPrevented=!0,n.sigmaDefaultPrevented=!0}});return n}function Dh(a,n){var e=Xe(a,n);return e.delta=Uo(a),e}var Rh=2;function Sa(a){for(var n=[],e=0,t=Math.min(a.length,Rh);e<t;e++)n.push(a[e]);return n}function En(a,n,e){var t={touches:Sa(a.touches).map(function(r){return Pe(r,e)}),previousTouches:n.map(function(r){return Pe(r,e)}),sigmaDefaultPrevented:!1,preventSigmaDefault:function(){t.sigmaDefaultPrevented=!0},original:a};return t}function Uo(a){if(typeof a.deltaY!="undefined")return a.deltaY*-3/360;if(typeof a.detail!="undefined")return a.detail/-9;throw new Error("Captor: could not extract delta from event.")}var Oo=(function(a){function n(e,t){var r;return J(this,n),r=ce(this,n),r.container=e,r.renderer=t,r}return fe(n,a),ee(n)})(aa),Lh=["doubleClickTimeout","doubleClickZoomingDuration","doubleClickZoomingRatio","dragTimeout","draggedEventsTolerance","enableCameraMouseRotation","gestureTarget","inertiaDuration","inertiaRatio","zoomDuration","zoomingRatio"],Ch=Lh.reduce(function(a,n){return O(O({},a),{},D({},n,oa[n]))},{});function Sn(a){return a instanceof PointerEvent&&a.pointerType==="touch"}var kh=(function(a){function n(e,t){var r;return J(this,n),r=ce(this,n,[e,t]),D(r,"enabled",!0),D(r,"draggedEvents",0),D(r,"downStartTime",null),D(r,"lastMouseX",null),D(r,"lastMouseY",null),D(r,"isMouseDown",!1),D(r,"isMoving",!1),D(r,"isPanningStage",!1),D(r,"movingTimeout",null),D(r,"startCameraState",null),D(r,"clicks",0),D(r,"doubleClickTimeout",null),D(r,"isRightMouseDown",!1),D(r,"startRotationAngle",null),D(r,"startCameraAngle",null),D(r,"currentWheelDirection",0),D(r,"lastWheelAnimationId",0),D(r,"settings",Ch),r.handleRightClick=r.handleRightClick.bind(r),r.handleDown=r.handleDown.bind(r),r.handleUp=r.handleUp.bind(r),r.handleMove=r.handleMove.bind(r),r.handleWheel=r.handleWheel.bind(r),r.handleLeave=r.handleLeave.bind(r),r.handleEnter=r.handleEnter.bind(r),e.addEventListener("contextmenu",r.handleRightClick,{capture:!1}),e.addEventListener("pointerdown",r.handleDown,{capture:!1}),e.addEventListener("wheel",r.handleWheel,{capture:!1,passive:!1}),e.addEventListener("pointerleave",r.handleLeave,{capture:!1}),e.addEventListener("pointerenter",r.handleEnter,{capture:!1}),document.addEventListener("pointermove",r.handleMove,{capture:!1}),document.addEventListener("pointerup",r.handleUp,{capture:!1}),r}return fe(n,a),ee(n,[{key:"kill",value:function(){var t=this.container;t.removeEventListener("contextmenu",this.handleRightClick),t.removeEventListener("pointerdown",this.handleDown),t.removeEventListener("wheel",this.handleWheel),t.removeEventListener("pointerleave",this.handleLeave),t.removeEventListener("pointerenter",this.handleEnter),document.removeEventListener("pointermove",this.handleMove),document.removeEventListener("pointerup",this.handleUp)}},{key:"handleClick",value:function(t){var r=this;if(this.enabled){if(this.clicks++,this.clicks===2)return this.clicks=0,typeof this.doubleClickTimeout=="number"&&(clearTimeout(this.doubleClickTimeout),this.doubleClickTimeout=null),this.handleDoubleClick(t);setTimeout(function(){r.clicks=0,r.doubleClickTimeout=null},this.settings.doubleClickTimeout),this.draggedEvents<this.settings.draggedEventsTolerance&&this.emit("click",Xe(t,this.container))}}},{key:"handleRightClick",value:function(t){this.enabled&&(this.settings.enableCameraMouseRotation&&t.preventDefault(),this.emit("rightClick",Xe(t,this.container)))}},{key:"handleDoubleClick",value:function(t){if(this.enabled){t.preventDefault(),t.stopPropagation();var r=Xe(t,this.container);if(this.emit("doubleClick",r),!r.sigmaDefaultPrevented){var i=this.renderer.getCamera(),o=i.getBoundedRatio(i.getState().ratio/this.settings.doubleClickZoomingRatio);i.animate(this.renderer.getViewportZoomedState(Pe(t,this.container),o),{easing:"quadraticInOut",duration:this.settings.doubleClickZoomingDuration})}}}},{key:"handleDown",value:function(t){if(!(!this.enabled||Sn(t))){if(t.button===0){this.startCameraState=this.renderer.getCamera().getState();var r=Pe(t,this.container),i=r.x,o=r.y;this.lastMouseX=i,this.lastMouseY=o,this.draggedEvents=0,this.downStartTime=Date.now(),this.isMouseDown=!0}if(t.button===2&&this.settings.enableCameraMouseRotation){var s=Pe(t,this.container),l=s.x,u=s.y,d=this.container.offsetWidth/2,h=this.container.offsetHeight/2;this.startRotationAngle=Math.atan2(u-h,l-d),this.startCameraAngle=this.renderer.getCamera().getState().angle,this.isRightMouseDown=!0}this.emit("mousedown",Xe(t,this.container))}}},{key:"handleUp",value:function(t){var r=this;if(!(!this.enabled||Sn(t)||!this.isMouseDown&&!this.isRightMouseDown)){if(this.isRightMouseDown){this.isRightMouseDown=!1,this.startRotationAngle=null,this.startCameraAngle=null,this.emit("mouseup",Xe(t,this.container));return}var i=this.renderer.getCamera();this.isMouseDown=!1,this.isPanningStage&&(this.isPanningStage=!1,this.renderer._setPanning(!1)),typeof this.movingTimeout=="number"&&(clearTimeout(this.movingTimeout),this.movingTimeout=null);var o=Pe(t,this.container),s=o.x,l=o.y,u=i.getState(),d=i.getPreviousState();this.isMoving?i.animate({x:u.x+this.settings.inertiaRatio*(u.x-d.x),y:u.y+this.settings.inertiaRatio*(u.y-d.y)},{duration:this.settings.inertiaDuration,easing:"quadraticOut"}):(this.lastMouseX!==s||this.lastMouseY!==l)&&i.setState({x:u.x,y:u.y}),this.isMoving=!1,setTimeout(function(){var h=r.draggedEvents>0;r.draggedEvents=0;var c=r.renderer.getSetting("hideEdgesOnMove")||r.renderer.getSetting("hideLabelsOnMove");h&&c&&r.renderer.refresh()},0),this.emit("mouseup",Xe(t,this.container)),(t.target===this.container||t.composedPath()[0]===this.container)&&this.handleClick(t)}}},{key:"handleMove",value:function(t){var r=this;if(!(!this.enabled||Sn(t))){var i=Xe(t,this.container);if(this.emit("mousemovebody",i),(t.target===this.container||t.composedPath()[0]===this.container)&&this.emit("mousemove",i),this.isMouseDown&&this.draggedEvents++,!i.sigmaDefaultPrevented){if(this.isMouseDown){this.isMoving=!0,typeof this.movingTimeout=="number"&&clearTimeout(this.movingTimeout),this.movingTimeout=window.setTimeout(function(){r.movingTimeout=null,r.isMoving=!1},this.settings.dragTimeout);var o=this.renderer.getCamera(),s=Pe(t,this.container),l=s.x,u=s.y,d=this.renderer.viewportToFramedGraph({x:this.lastMouseX,y:this.lastMouseY}),h=this.renderer.viewportToFramedGraph({x:l,y:u}),c=d.x-h.x,f=d.y-h.y,g=o.getState(),y=g.x+c,m=g.y+f;this.isPanningStage||(this.isPanningStage=!0,this.renderer._setPanning(!0)),o.setState({x:y,y:m}),this.lastMouseX=l,this.lastMouseY=u,t.preventDefault(),t.stopPropagation()}if(this.isRightMouseDown){var v=Pe(t,this.container),p=v.x,b=v.y,T=this.container.offsetWidth/2,_=this.container.offsetHeight/2,E=Math.atan2(b-_,p-T),w=E-this.startRotationAngle,A=this.renderer.getCamera();A.setState({angle:this.startCameraAngle+w}),t.preventDefault(),t.stopPropagation()}}}}},{key:"handleLeave",value:function(t){Sn(t)||this.emit("mouseleave",Xe(t,this.container))}},{key:"handleEnter",value:function(t){Sn(t)||this.emit("mouseenter",Xe(t,this.container))}},{key:"handleWheel",value:function(t){var r=this,i=this.renderer.getCamera();if(!(!this.enabled||!i.enabledZooming)){var o=Dh(t,this.container);if(this.emit("wheel",o),!o.sigmaDefaultPrevented){var s=this.settings.gestureTarget;if(s!=="page"){if(s==="shared"&&!t.ctrlKey&&!t.metaKey){this.renderer._showGestureHint("wheel");return}var l=Uo(t);if(l){t.preventDefault(),t.stopPropagation();var u=i.getState().ratio,d=l>0?1/this.settings.zoomingRatio:this.settings.zoomingRatio,h=i.getBoundedRatio(u*d),c=l>0?1:-1,f=Date.now();if(u!==h&&!(this.currentWheelDirection===c&&this.lastWheelTriggerTime&&f-this.lastWheelTriggerTime<this.settings.zoomDuration/5)){var g=++this.lastWheelAnimationId;i.animate(this.renderer.getViewportZoomedState(Pe(t,this.container),h),{easing:"quadraticOut",duration:this.settings.zoomDuration}).then(function(){r.lastWheelAnimationId===g&&(r.currentWheelDirection=0)}),this.currentWheelDirection=c,this.lastWheelTriggerTime=f}}}}}}},{key:"setSettings",value:function(t){this.settings=t}}])})(Oo),Ph=["dragTimeout","gestureTarget","inertiaDuration","inertiaRatio","doubleClickTimeout","doubleClickZoomingRatio","doubleClickZoomingDuration","tapMoveTolerance"],Fh=Ph.reduce(function(a,n){return O(O({},a),{},D({},n,oa[n]))},{}),Ih=(function(a){function n(e,t){var r;return J(this,n),r=ce(this,n,[e,t]),D(r,"enabled",!0),D(r,"isMoving",!1),D(r,"hasMoved",!1),D(r,"isPanningStage",!1),D(r,"isZoomingStage",!1),D(r,"touchMode",0),D(r,"startTouchesPositions",[]),D(r,"lastTouches",[]),D(r,"lastTap",null),D(r,"settings",Fh),r.handleStart=r.handleStart.bind(r),r.handleLeave=r.handleLeave.bind(r),r.handleMove=r.handleMove.bind(r),e.addEventListener("touchstart",r.handleStart,{capture:!1}),e.addEventListener("touchcancel",r.handleLeave,{capture:!1}),document.addEventListener("touchend",r.handleLeave,{capture:!1,passive:!1}),document.addEventListener("touchmove",r.handleMove,{capture:!1,passive:!1}),r}return fe(n,a),ee(n,[{key:"kill",value:function(){var t=this.container;t.removeEventListener("touchstart",this.handleStart),t.removeEventListener("touchcancel",this.handleLeave),document.removeEventListener("touchend",this.handleLeave),document.removeEventListener("touchmove",this.handleMove)}},{key:"getDimensions",value:function(){return{width:this.container.offsetWidth,height:this.container.offsetHeight}}},{key:"doesCapture",value:function(t){var r=this.settings.gestureTarget;return r==="graph"?!0:r==="page"?!1:t>=2}},{key:"syncStageFlags",value:function(){var t=this.touchMode===1&&this.hasMoved,r=this.touchMode===2;t!==this.isPanningStage&&(this.isPanningStage=t,this.renderer._setPanning(t)),r!==this.isZoomingStage&&(this.isZoomingStage=r,this.renderer._setZooming(r))}},{key:"handleStart",value:function(t){var r=this;if(this.enabled){var i=Sa(t.touches);if(this.touchMode=i.length,this.startCameraState=this.renderer.getCamera().getState(),this.startTouchesPositions=i.map(function(f){return Pe(f,r.container)}),this.touchMode===2){var o=ne(this.startTouchesPositions,2),s=o[0],l=s.x,u=s.y,d=o[1],h=d.x,c=d.y;this.startTouchesAngle=Math.atan2(c-u,h-l),this.startTouchesDistance=Math.sqrt(Math.pow(h-l,2)+Math.pow(c-u,2))}this.syncStageFlags(),this.emit("touchdown",En(t,this.lastTouches,this.container)),this.lastTouches=i,this.lastTouchesPositions=this.startTouchesPositions,t.cancelable&&(this.doesCapture(t.touches.length)||this.renderer._hasNodeDrag())&&t.preventDefault()}}},{key:"handleLeave",value:function(t){if(!(!this.enabled||!this.startTouchesPositions.length)){switch(t.cancelable&&this.doesCapture(this.touchMode)&&t.preventDefault(),this.movingTimeout&&(this.isMoving=!1,clearTimeout(this.movingTimeout)),this.touchMode){case 2:if(t.touches.length===1){this.handleStart(t);break}case 1:if(this.isMoving){var r=this.renderer.getCamera(),i=r.getState(),o=r.getPreviousState();r.animate({x:i.x+this.settings.inertiaRatio*(i.x-o.x),y:i.y+this.settings.inertiaRatio*(i.y-o.y)},{duration:this.settings.inertiaDuration,easing:"quadraticOut"})}this.hasMoved=!1,this.isMoving=!1,this.touchMode=0;break}if(this.syncStageFlags(),this.emit("touchup",En(t,this.lastTouches,this.container)),!t.touches.length){var s=Pe(this.lastTouches[0],this.container),l=this.startTouchesPositions[0],u=Math.pow(s.x-l.x,2)+Math.pow(s.y-l.y,2);if(!t.touches.length&&u<Math.pow(this.settings.tapMoveTolerance,2))if(this.lastTap&&Date.now()-this.lastTap.time<this.settings.doubleClickTimeout){var d=En(t,this.lastTouches,this.container);if(this.emit("doubletap",d),this.lastTap=null,!d.sigmaDefaultPrevented&&this.settings.gestureTarget!=="page"){var h=this.renderer.getCamera(),c=h.getBoundedRatio(h.getState().ratio/this.settings.doubleClickZoomingRatio);h.animate(this.renderer.getViewportZoomedState(s,c),{easing:"quadraticInOut",duration:this.settings.doubleClickZoomingDuration})}}else{var f=En(t,this.lastTouches,this.container);this.emit("tap",f),this.lastTap={time:Date.now(),position:f.touches[0]||f.previousTouches[0]}}}this.lastTouches=Sa(t.touches),this.startTouchesPositions=[]}}},{key:"handleMove",value:function(t){var r=this;if(!(!this.enabled||!this.startTouchesPositions.length)){var i=this.doesCapture(t.touches.length);i&&t.preventDefault();var o=Sa(t.touches),s=o.map(function(R){return Pe(R,r.container)}),l=this.lastTouches;this.lastTouches=o,this.lastTouchesPositions=s;var u=En(t,l,this.container);if(this.emit("touchmove",u),!u.sigmaDefaultPrevented&&(this.hasMoved||(this.hasMoved=s.some(function(R,V){var $=r.startTouchesPositions[V];return $&&(R.x!==$.x||R.y!==$.y)})),!!this.hasMoved)){if(!i){this.settings.gestureTarget==="shared"&&this.renderer._showGestureHint("touch");return}this.isMoving=!0,this.syncStageFlags(),this.movingTimeout&&clearTimeout(this.movingTimeout),this.movingTimeout=window.setTimeout(function(){r.isMoving=!1},this.settings.dragTimeout);var d=this.renderer.getCamera(),h=this.startCameraState,c=this.renderer.getSetting("stagePadding");switch(this.touchMode){case 1:{var f=this.renderer.viewportToFramedGraph((this.startTouchesPositions||[])[0]),g=f.x,y=f.y,m=this.renderer.viewportToFramedGraph(s[0]),v=m.x,p=m.y;d.setState({x:h.x+g-v,y:h.y+y-p});break}case 2:{var b={x:.5,y:.5,angle:0,ratio:1},T=s[0],_=T.x,E=T.y,w=s[1],A=w.x,S=w.y,k=Math.atan2(S-E,A-_)-this.startTouchesAngle,z=Math.hypot(S-E,A-_)/this.startTouchesDistance,C=d.getBoundedRatio(h.ratio/z);b.ratio=C,b.angle=h.angle+k;var N=this.getDimensions(),L=this.renderer.viewportToFramedGraph((this.startTouchesPositions||[])[0],{cameraState:h}),G=Math.min(N.width,N.height)-2*c,M=G/N.width,F=G/N.height,x=C/G,P=_-G/2/M,B=E-G/2/F,I=za({x:P,y:B},b.angle);P=I.x,B=I.y,b.x=L.x-P*x,b.y=L.y+B*x,d.setState(b);break}}}}}},{key:"setSettings",value:function(t){this.settings=t}}])})(Oo),Gh=(function(){function a(n,e,t,r){J(this,a),D(this,"pendingNode",null),D(this,"session",null),this.graph=n,this.viewportToGraph=e,this.setNodesState=t,this.emit=r}return ee(a,[{key:"start",value:function(e,t,r,i,o){var s=r(e),l=!1;if(this.emit("nodeDragStart",{node:e,allDraggedNodes:s,event:t,preventSigmaDefault:function(){l=!0}}),l)return!1;var u=new Map,d=U(s),h;try{for(d.s();!(h=d.n()).done;){var c=h.value;u.set(c,{x:this.graph.getNodeAttribute(c,i),y:this.graph.getNodeAttribute(c,o)})}}catch(f){d.e(f)}finally{d.f()}return this.session={node:e,allNodes:s,startPosition:this.viewportToGraph(t),startNodePositions:u,xAttr:i,yAttr:o},this.setNodesState(s,{isDragged:!0}),!0}},{key:"applyMove",value:function(e,t){var r=this.session,i=r.allNodes,o=r.startNodePositions,s=r.startPosition,l=r.xAttr,u=r.yAttr,d=this.viewportToGraph(e),h={x:d.x-s.x,y:d.y-s.y},c=U(i),f;try{for(c.s();!(f=c.n()).done;){var g=f.value,y=o.get(g);if(!(!y||!this.graph.hasNode(g))){var m={x:y.x+h.x,y:y.y+h.y};t?this.graph.mergeNodeAttributes(g,t(m,g)):(this.graph.setNodeAttribute(g,l,m.x),this.graph.setNodeAttribute(g,u,m.y))}}}catch(v){c.e(v)}finally{c.f()}}},{key:"end",value:function(){if(this.pendingNode=null,!this.session)return null;var e=this.session,t=e.node,r=e.allNodes;return this.setNodesState(r,{isDragged:!1}),this.session=null,{node:t,allNodes:r}}},{key:"removeNode",value:function(e){e===this.pendingNode&&(this.pendingNode=null),this.session&&(this.session.node===e?(this.setNodesState(this.session.allNodes,{isDragged:!1}),this.session=null):this.session.allNodes.includes(e)&&(this.session.allNodes=this.session.allNodes.filter(function(t){return t!==e}),this.session.startNodePositions.delete(e)))}},{key:"clear",value:function(){this.pendingNode=null,this.session=null}}])})();function wo(a,n){return a<n?"".concat(a,"\0").concat(n):"".concat(n,"\0").concat(a)}var zh=(function(){function a(n,e){J(this,a),D(this,"groups",new Map),D(this,"edgeToGroupKey",new Map),this.graph=n,this.onGroupChanged=e}return ee(a,[{key:"getGroupKey",value:function(e){return wo(this.graph.source(e),this.graph.target(e))}},{key:"sortGroup",value:function(e,t){var r=this,i=t.split("\0")[0];e.sort(function(o,s){var l=r.graph.source(o)===i||!r.graph.isDirected(o)?0:1,u=r.graph.source(s)===i||!r.graph.isDirected(s)?0:1;return l-u})}},{key:"register",value:function(e){var t=this.getGroupKey(e),r=this.groups.get(t);r||(r=[],this.groups.set(t,r)),r.includes(e)||r.push(e),this.edgeToGroupKey.set(e,t),r.length>1&&this.sortGroup(r,t),this.onGroupChanged(r,r.length)}},{key:"unregister",value:function(e){var t=this.edgeToGroupKey.get(e);if(t){this.edgeToGroupKey.delete(e);var r=this.groups.get(t);if(r){var i=r.indexOf(e);i!==-1&&r.splice(i,1),r.length===0?this.groups.delete(t):this.onGroupChanged(r,r.length)}}}},{key:"getGroup",value:function(e){var t,r=this.edgeToGroupKey.get(e);return r?(t=this.groups.get(r))!==null&&t!==void 0?t:[]:[]}},{key:"getSiblings",value:function(e){return this.getGroup(e).filter(function(t){return t!==e})}},{key:"rebuild",value:function(){var e=this;this.groups.clear(),this.edgeToGroupKey.clear(),this.graph.forEachEdge(function(l,u,d,h){var c=wo(d,h),f=e.groups.get(c);f||(f=[],e.groups.set(c,f)),f.push(l),e.edgeToGroupKey.set(l,c)});var t=U(this.groups),r;try{for(t.s();!(r=t.n()).done;){var i=ne(r.value,2),o=i[0],s=i[1];s.length>1&&this.sortGroup(s,o),this.onGroupChanged(s,s.length)}}catch(l){t.e(l)}finally{t.f()}}},{key:"clear",value:function(){this.groups.clear(),this.edgeToGroupKey.clear()}}])})();function Do(a,n){var e;if(a===!1||a==="extend"||a==="separate")return a;var t=a[n];return t!==void 0?t:(e=a.default)!==null&&e!==void 0?e:!1}function Ro(a){return a===!1?!1:a==="extend"||a==="separate"?!0:Object.values(a).some(function(n){return n==="extend"||n==="separate"})}function Lo(a){return a==="separate"?!0:a===!1||a==="extend"?!1:a.default==="separate"?!0:Object.values(a).includes("separate")}var Ae={node:{parent:null,eventSuffix:"Node",payloadKey:"node",isEnabled:function(){return!0},writesPickingThisFrame:function(){return!0},setHover:function(n,e,t){return n.setNodeState(e,{isHovered:t})},getCursor:function(n,e){var t;return(t=n.nodeDataCache[e])===null||t===void 0?void 0:t.cursor},isHitValid:function(n,e){var t;return((t=n.nodeDataCache[e])===null||t===void 0?void 0:t.visibility)!=="hidden"}},edge:{parent:null,eventSuffix:"Edge",payloadKey:"edge",isEnabled:function(n){return!!n.settings.enableEdgeEvents},writesPickingThisFrame:function(n){return!!n.settings.enableEdgeEvents},setHover:function(n,e,t){return n.setEdgeState(e,{isHovered:t})},getCursor:function(n,e){var t;return(t=n.edgeDataCache[e])===null||t===void 0?void 0:t.cursor}},nodeLabel:{parent:"node",eventSuffix:"NodeLabel",payloadKey:"node",isEnabled:function(n){return Lo(n.settings.nodeLabelEvents)},writesPickingThisFrame:function(n){return Ro(n.settings.nodeLabelEvents)},setHover:function(n,e,t){return n.setNodeState(e,{isLabelHovered:t})},getCursor:function(n,e){var t;return(t=n.nodeDataCache[e])===null||t===void 0?void 0:t.labelCursor},resolveForVerb:function(n,e,t){var r=Do(t.settings.nodeLabelEvents,e);return r===!1?null:r==="extend"?{kind:"node",key:n.key}:n}},edgeLabel:{parent:"edge",eventSuffix:"EdgeLabel",payloadKey:"edge",isEnabled:function(n){return Lo(n.settings.edgeLabelEvents)},writesPickingThisFrame:function(n){return Ro(n.settings.edgeLabelEvents)},setHover:function(n,e,t){return n.setEdgeState(e,{isLabelHovered:t})},getCursor:function(n,e){var t;return(t=n.edgeDataCache[e])===null||t===void 0?void 0:t.labelCursor},resolveForVerb:function(n,e,t){var r=Do(t.settings.edgeLabelEvents,e);return r===!1?null:r==="extend"?{kind:"edge",key:n.key}:n}}},Lt=["node","edge","nodeLabel","edgeLabel"];function Nh(){return{lookup:[null],idsByKind:{node:new Map,edge:new Map,nodeLabel:new Map,edgeLabel:new Map},nextId:1}}function Rt(a,n,e){var t;return(t=a.idsByKind[n].get(e))!==null&&t!==void 0?t:0}function Ta(a,n){var e=U(Lt),t;try{for(e.s();!(t=e.n()).done;){var r=t.value;if(r===n||Ae[r].parent===n){var i=U(a.idsByKind[r].values()),o;try{for(i.s();!(o=i.n()).done;){var s=o.value;a.lookup[s]=null}}catch(c){i.e(c)}finally{i.f()}a.idsByKind[r]=new Map}}}catch(c){e.e(c)}finally{e.f()}var l=1,u=U(Lt),d;try{for(u.s();!(d=u.n()).done;){var h=d.value;if(h===n)break;l+=a.idsByKind[h].size}}catch(c){u.e(c)}finally{u.f()}a.nextId=l}function Co(a,n,e){var t=a.nextId++;return a.idsByKind[n].set(e,t),a.lookup[t]={kind:n,key:e},t}function ko(a,n,e){for(var t=0,r=Aa(n);t<r.length;t++){var i=r[t],o=a.idsByKind[i].get(e);o!==void 0&&(a.lookup[o]=null,a.idsByKind[i].delete(e))}}function Wh(a,n){var e=U(Lt),t;try{for(e.s();!(t=e.n()).done;){var r=t.value;if(Ae[r].parent!==null){var i=U(a.idsByKind[r].values()),o;try{for(i.s();!(o=i.n()).done;){var s=o.value;a.lookup[s]=null}}catch(_){i.e(_)}finally{i.f()}a.idsByKind[r]=new Map}}}catch(_){e.e(_)}finally{e.f()}a.nextId=1;var l=U(Lt),u;try{for(l.s();!(u=l.n()).done;){var d=u.value;if(Ae[d].parent===null){var h=U(a.idsByKind[d].values()),c;try{for(h.s();!(c=h.n()).done;){var f=c.value;f>=a.nextId&&(a.nextId=f+1)}}catch(_){h.e(_)}finally{h.f()}}}}catch(_){l.e(_)}finally{l.f()}var g=U(Lt),y;try{for(g.s();!(y=g.n()).done;){var m=y.value,v=Ae[m];if(!(v.parent===null||!v.isEnabled(n))){var p=U(a.idsByKind[v.parent].keys()),b;try{for(p.s();!(b=p.n()).done;){var T=b.value;a.idsByKind[m].set(T,a.nextId),a.lookup[a.nextId]={kind:m,key:T},a.nextId++}}catch(_){p.e(_)}finally{p.f()}}}}catch(_){g.e(_)}finally{g.f()}}function Bh(a,n){var e=U(Lt),t;try{for(e.s();!(t=e.n()).done;){var r=t.value,i=a[r],o=n[r];if(i!==o){if(i.size!==o.size)return!1;var s=U(i),l;try{for(s.s();!(l=s.n()).done;){var u=ne(l.value,2),d=u[0],h=u[1];if(o.get(d)!==h)return!1}}catch(c){s.e(c)}finally{s.f()}}}}catch(c){e.e(c)}finally{e.f()}return!0}function Po(a,n,e){Ae[n.kind].setHover(a,n.key,e)}function Mh(a,n){return Ae[n.kind].getCursor(a,n.key)}function An(a,n){return"".concat(n).concat(Ae[a].eventSuffix)}function wn(a,n){return O(O({},n),{},D({},Ae[a.kind].payloadKey,a.key))}function Uh(a,n,e){var t=Ae[n.kind].resolveForVerb;return t?t(n,e,a):n}function Oh(a,n){var e=Ae[n.kind].isHitValid;return e?e(a,n.key):!0}function Aa(a){return Lt.filter(function(n){return n===a||Ae[n].parent===a})}function Ho(a,n,e){return n&&(n=Uh(a,n,e)),n&&!Oh(a,n)&&(n=null),n}function yr(a,n,e){var t=e==="wheel"?a.stateManager.hovered:a.getHitAtPosition(n);return Ho(a,t,e)}function Hh(a,n){return!a||!n?a===n:a.kind===n.kind&&a.key===n.key}function $o(a,n,e){var t={event:e,preventSigmaDefault:function(){return e.preventSigmaDefault()}},r=a.dragManager.session,i=r?{kind:"node",key:r.node}:Ho(a,n,"enter"),o=a.stateManager,s=o.hovered;Hh(s,i)||(s&&(Po(a,s,!1),a.emit(An(s.kind,"leave"),wn(s,t))),o.setHovered(i),i&&(Po(a,i,!0),a.emit(An(i.kind,"enter"),wn(i,t))),a.updateContainerCursor())}function $h(a,n,e,t){t.handleResize=function(){return a.scheduleRefresh()},window.addEventListener("resize",t.handleResize),t.handleMove=function(i){a.hoverResolver.pointerMoved(wt(i))},t.handleMoveBody=function(i){var o=wt(i),s=a.dragManager;if(s.pendingNode&&!s.session){var l=a.nodeStyleAnalysis,u=l.xAttribute,d=l.yAttribute,h=a.settings;s.start(s.pendingNode,o,h.getDraggedNodes,u||"x",d||"y"),s.pendingNode=null}s.session&&(s.applyMove(o,a.settings.dragPositionToAttributes),a.emit("nodeDrag",{node:s.session.node,allDraggedNodes:s.session.allNodes,event:o}),o.preventSigmaDefault()),a.emit("moveBody",{event:o,preventSigmaDefault:function(){return o.preventSigmaDefault()}})},t.handleLeave=function(i){var o=wt(i),s={event:o,preventSigmaDefault:function(){return o.preventSigmaDefault()}};a.hoverResolver.pointerLeft(),$o(a,null,o),a.emit("leaveStage",s)},t.handleEnter=function(i){var o=wt(i);a.emit("enterStage",{event:o,preventSigmaDefault:function(){return o.preventSigmaDefault()}})};var r=function(o){return function(s){var l=wt(s),u={event:l,preventSigmaDefault:function(){return l.preventSigmaDefault()}},d=yr(a,l,o);if(d){a.emit(An(d.kind,o),wn(d,u));return}a.emit("".concat(o,"Stage"),u)}};t.handleClick=r("click"),t.handleRightClick=r("rightClick"),t.handleDoubleClick=r("doubleClick"),t.handleWheel=r("wheel"),t.handleDown=function(i){var o=wt(i),s={event:o,preventSigmaDefault:function(){return o.preventSigmaDefault()}},l=yr(a,o,"down");if(l){l.kind==="node"&&a.settings.enableNodeDrag&&(a.dragManager.pendingNode=l.key),a.emit(An(l.kind,"down"),wn(l,s));return}a.emit("downStage",s)},t.handleUp=function(i){var o=wt(i),s={event:o,preventSigmaDefault:function(){return o.preventSigmaDefault()}},l=a.dragManager.end();l&&a.emit("nodeDragEnd",O({node:l.node,allDraggedNodes:l.allNodes},s));var u=yr(a,o,"up");if(u){a.emit(An(u.kind,"up"),wn(u,s));return}a.emit("upStage",s)},n.on("mousemove",t.handleMove),n.on("mousemovebody",t.handleMoveBody),n.on("click",t.handleClick),n.on("rightClick",t.handleRightClick),n.on("doubleClick",t.handleDoubleClick),n.on("wheel",t.handleWheel),n.on("mousedown",t.handleDown),n.on("mouseup",t.handleUp),n.on("mouseleave",t.handleLeave),n.on("mouseenter",t.handleEnter),e.on("touchdown",t.handleDown),e.on("touchdown",t.handleMove),e.on("touchup",t.handleUp),e.on("touchmove",t.handleMove),e.on("tap",t.handleClick),e.on("doubletap",t.handleDoubleClick),e.on("touchmove",t.handleMoveBody)}function Vh(a,n){var e=a.graph,t=new Set(["x","y","zIndex","type"]);n.eachNodeAttributesUpdatedGraphUpdate=function(r){var i,o=(i=r.hints)===null||i===void 0?void 0:i.attributes,s=!o||o.some(function(l){return t.has(l)});a.refresh({partialGraph:{nodes:e.nodes()},skipIndexation:!s,schedule:!0})},n.eachEdgeAttributesUpdatedGraphUpdate=function(r){var i,o=(i=r.hints)===null||i===void 0?void 0:i.attributes,s=o&&["zIndex","type"].some(function(l){return o==null?void 0:o.includes(l)});a.refresh({partialGraph:{edges:e.edges()},skipIndexation:!s,schedule:!0})},n.addNodeGraphUpdate=function(r){a.refresh({partialGraph:{nodes:[r.key]},skipIndexation:!1,schedule:!0})},n.updateNodeGraphUpdate=function(r){a.refresh({partialGraph:{nodes:[r.key]},skipIndexation:!1,schedule:!0})},n.dropNodeGraphUpdate=function(r){a.removeNode(r.key),a.scheduleProcess()},n.addEdgeGraphUpdate=function(r){var i=r.key;a.markNodesDirty([r.source,r.target]),a.edgeGroups.register(i);var o=a.edgeGroups.getSiblings(i);a.refresh({partialGraph:{edges:[i].concat(K(o))},schedule:!0})},n.updateEdgeGraphUpdate=function(r){a.refresh({partialGraph:{edges:[r.key]},skipIndexation:!1,schedule:!0})},n.dropEdgeGraphUpdate=function(r){var i=r.key;a.markNodesDirty([r.source,r.target]);var o=a.edgeGroups.getSiblings(i);a.edgeGroups.unregister(i),a.removeEdge(i);var s=U(o),l;try{for(s.s();!(l=s.n()).done;){var u=l.value;a.addEdge(u)}}catch(d){s.e(d)}finally{s.f()}a.scheduleProcess()},n.clearEdgesGraphUpdate=function(){a.clearEdgeState(),a.clearEdgeIndices(),a.refresh({schedule:!0})},n.clearGraphUpdate=function(){a.clearEdgeState(),a.clearNodeState(),a.clearEdgeIndices(),a.clearNodeIndices(),a.refresh({schedule:!0})},e.on("nodeAdded",n.addNodeGraphUpdate),e.on("nodeDropped",n.dropNodeGraphUpdate),e.on("nodeAttributesUpdated",n.updateNodeGraphUpdate),e.on("eachNodeAttributesUpdated",n.eachNodeAttributesUpdatedGraphUpdate),e.on("edgeAdded",n.addEdgeGraphUpdate),e.on("edgeDropped",n.dropEdgeGraphUpdate),e.on("edgeAttributesUpdated",n.updateEdgeGraphUpdate),e.on("eachEdgeAttributesUpdated",n.eachEdgeAttributesUpdatedGraphUpdate),e.on("edgesCleared",n.clearEdgesGraphUpdate),e.on("cleared",n.clearGraphUpdate)}function jh(a,n){a.removeListener("nodeAdded",n.addNodeGraphUpdate),a.removeListener("nodeDropped",n.dropNodeGraphUpdate),a.removeListener("nodeAttributesUpdated",n.updateNodeGraphUpdate),a.removeListener("eachNodeAttributesUpdated",n.eachNodeAttributesUpdatedGraphUpdate),a.removeListener("edgeAdded",n.addEdgeGraphUpdate),a.removeListener("edgeDropped",n.dropEdgeGraphUpdate),a.removeListener("edgeAttributesUpdated",n.updateEdgeGraphUpdate),a.removeListener("eachEdgeAttributesUpdated",n.eachEdgeAttributesUpdatedGraphUpdate),a.removeListener("edgesCleared",n.clearEdgesGraphUpdate),a.removeListener("cleared",n.clearGraphUpdate)}var qh={x:.5,y:.5,angle:0,ratio:1},Xh=8,Yh=.001;function Kh(a){var n=a.coords,e=a.nodeData,t=a.dimensions,r=a.stagePadding,i=a.zoomToSizeRatioFunction,o=a.itemSizesReference,s=a.fitLabels,l=a.nodeLabelBox,u=Object.keys(n);if(!u.length)return a.extent;for(var d=i(1)||1,h=o==="positions",c=t.width,f=t.height,g=a.extent,y=0;y<Xh;y++){for(var m=ia(g),v={width:g.x[1]-g.x[0]||1,height:g.y[1]-g.y[0]||1},p=st(qh,t,v,r),b=Fo(p,m({x:0,y:0}),c,f),T=Fo(p,m({x:1,y:0}),c,f),_=Math.hypot(T.x-b.x,T.y-b.y)||1,E=1/0,w=-1/0,A=1/0,S=-1/0,k=0,z=u.length;k<z;k++){var C=u[k],N=e[C],L=N.size/d*(h?_:1),G=-L,M=L,F=-L,x=L;if(s){var P=l(N,L);P&&(P.minX<G&&(G=P.minX),P.maxX>M&&(M=P.maxX),P.minY<F&&(F=P.minY),P.maxY>x&&(x=P.maxY))}var B=n[C],I=B.x,R=B.y;E=Math.min(E,I+G/_),w=Math.max(w,I+M/_),A=Math.min(A,R-x/_),S=Math.max(S,R-F/_)}var V={x:[E,w],y:[A,S]},$=Math.max(V.x[1]-V.x[0],V.y[1]-V.y[0])||1,Y=Math.max(Math.abs(V.x[0]-g.x[0]),Math.abs(V.x[1]-g.x[1]),Math.abs(V.y[0]-g.y[0]),Math.abs(V.y[1]-g.y[1]));if(g=V,Y/$<Yh)break}return g}function Fo(a,n,e,t){var r=Ut(a,n);return{x:(1+r.x)*e/2,y:(1-r.y)*t/2}}var Zh=typeof navigator!="undefined"&&/Mac|iP(hone|ad|od)/.test(navigator.platform),Qh=1500,Jh=`.sigma-gesture-hint {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1em;
  background: #00000066;
  color: #ffffff;
  font-size: 1em;
  pointer-events: none;
  transition: opacity 0.1s;
}`;function Io(a){var n,e,t=qt("style");t.textContent=a,document.head.appendChild(t);var r=((n=(e=t.sheet)===null||e===void 0?void 0:e.cssRules.length)!==null&&n!==void 0?n:0)>0;return t.remove(),r}var Dt=null;function ec(){return Dt===null&&(Dt=Jh,Io("@scope {}")&&(Dt=`@scope {
`.concat(Dt,`
}`)),Io("@layer sigma-gesture-hint {}")&&(Dt=`@layer sigma-gesture-hint {
`.concat(Dt,`
}`))),Dt}var tc=(function(){function a(n){J(this,a),D(this,"hideTimeout",null),this.styleElement=qt("style"),this.styleElement.textContent=ec(),n.appendChild(this.styleElement),this.element=qt("div",{opacity:"0"},{class:"sigma-gesture-hint"}),n.appendChild(this.element)}return ee(a,[{key:"show",value:function(e,t){var r=this,i=e==="touch"?t.sharedGestureTouchMessage:Zh?t.sharedGestureAppleWheelMessage:t.sharedGestureWheelMessage;i&&(this.element.textContent=i,this.element.style.opacity="1",typeof this.hideTimeout=="number"&&clearTimeout(this.hideTimeout),this.hideTimeout=window.setTimeout(function(){r.hideTimeout=null,r.element.style.opacity="0"},Qh))}},{key:"kill",value:function(){typeof this.hideTimeout=="number"&&clearTimeout(this.hideTimeout),this.styleElement.remove(),this.element.remove()}}])})(),nc=(function(){function a(n){J(this,a),D(this,"readBuffer",null),D(this,"fence",null),D(this,"result",new Uint8Array(4)),D(this,"generation",0),D(this,"readGeneration",0),D(this,"lastEvent",null),D(this,"active",!1),D(this,"dirty",!1),D(this,"rafId",null),D(this,"killed",!1),this.options=n}return ee(a,[{key:"pointerMoved",value:function(e){this.lastEvent=e,this.active=!0,!this.options.isRenderPending()&&this.request()}},{key:"pointerLeft",value:function(){this.active=!1,this.dirty=!1}},{key:"frameRendered",value:function(){this.request()}},{key:"invalidate",value:function(){this.generation++}},{key:"request",value:function(){if(!(this.killed||!this.active||!this.lastEvent)){if(this.fence){this.dirty=!0;return}this.startRead()}}},{key:"startRead",value:function(){var e=this.options,t=e.gl,r=e.getFrameBuffer,i=e.getPixelRatio,o=e.getDownSizingRatio;this.readGeneration=this.generation;var s=this.lastEvent,l=Na(t,s.x,s.y,i(),o()),u=ne(l,2),d=u[0],h=u[1];this.readBuffer||(this.readBuffer=t.createBuffer()),t.bindFramebuffer(t.FRAMEBUFFER,r()),t.bindBuffer(t.PIXEL_PACK_BUFFER,this.readBuffer),t.bufferData(t.PIXEL_PACK_BUFFER,4,t.STREAM_READ),t.readPixels(d,h,1,1,t.RGBA,t.UNSIGNED_BYTE,0),t.bindBuffer(t.PIXEL_PACK_BUFFER,null),t.bindFramebuffer(t.FRAMEBUFFER,null),this.fence=t.fenceSync(t.SYNC_GPU_COMMANDS_COMPLETE,0),t.flush(),this.schedulePoll(s)}},{key:"schedulePoll",value:function(e){var t=this;this.rafId=requestAnimationFrame(function(){t.rafId=null,t.poll(e)})}},{key:"poll",value:function(e){var t=this.options,r=t.gl,i=t.onIndex;if(!(this.killed||!this.fence)){var o=r.clientWaitSync(this.fence,0,0);if(o===r.TIMEOUT_EXPIRED){this.schedulePoll(e);return}if(r.deleteSync(this.fence),this.fence=null,o!==r.WAIT_FAILED&&this.readGeneration===this.generation){r.bindBuffer(r.PIXEL_PACK_BUFFER,this.readBuffer),r.getBufferSubData(r.PIXEL_PACK_BUFFER,0,this.result),r.bindBuffer(r.PIXEL_PACK_BUFFER,null);var s=ne(this.result,4),l=s[0],u=s[1],d=s[2],h=s[3];this.active&&i(Wa(l,u,d,h),e)}this.dirty&&(this.dirty=!1,this.active&&this.lastEvent&&!this.options.isRenderPending()&&this.startRead())}}},{key:"reset",value:function(){this.rafId!==null&&cancelAnimationFrame(this.rafId),this.rafId=null,this.fence=null,this.readBuffer=null,this.dirty=!1}},{key:"kill",value:function(){this.killed=!0,this.rafId!==null&&cancelAnimationFrame(this.rafId),this.rafId=null;var e=this.options.gl;this.fence&&e.deleteSync(this.fence),this.fence=null,this.readBuffer&&e.deleteBuffer(this.readBuffer),this.readBuffer=null}}])})(),Go=(function(){function a(n,e){J(this,a),this.key=n,this.size=e}return ee(a,null,[{key:"compare",value:function(e,t){return e.size>t.size?-1:e.size<t.size||e.key>t.key?1:-1}}])})(),Ea=(function(){function a(){J(this,a),D(this,"width",0),D(this,"height",0),D(this,"cellSize",0),D(this,"columns",0),D(this,"rows",0),D(this,"cells",{})}return ee(a,[{key:"resizeAndClear",value:function(e,t){this.width=e.width,this.height=e.height,this.cellSize=t,this.columns=Math.ceil(e.width/t),this.rows=Math.ceil(e.height/t),this.cells={}}},{key:"getIndex",value:function(e){var t=Math.floor(e.x/this.cellSize),r=Math.floor(e.y/this.cellSize);return r*this.columns+t}},{key:"add",value:function(e,t,r){var i=new Go(e,t),o=this.getIndex(r),s=this.cells[o];s||(s=[],this.cells[o]=s),s.push(i)}},{key:"organize",value:function(){for(var e in this.cells){var t=this.cells[e];t.sort(Go.compare)}}},{key:"getLabelsToDisplay",value:function(e,t,r){var i=this.cellSize*this.cellSize,o=i/e/e,s=o*t/i,l=Math.ceil(s),u=[];if(r)for(var d=Math.max(0,Math.floor(r.x1/this.cellSize)),h=Math.min(this.columns-1,Math.floor(r.x2/this.cellSize)),c=Math.max(0,Math.floor(r.y1/this.cellSize)),f=Math.min(this.rows-1,Math.floor(r.y2/this.cellSize)),g=c;g<=f;g++)for(var y=d;y<=h;y++){var m=g*this.columns+y,v=this.cells[m];if(v)for(var p=0;p<Math.min(l,v.length);p++)u.push(v[p].key)}else for(var b in this.cells)for(var T=this.cells[b],_=0;_<Math.min(l,T.length);_++)u.push(T[_].key);return u}}])})();function ac(a){var n=a.graph,e=a.hoveredNode,t=a.highlightedNodes,r=a.displayedNodeLabels,i=new Set,o=new Set(t);e&&o.add(e);var s=U(o),l;try{for(s.s();!(l=s.n()).done;){var u=l.value;n.hasNode(u)&&n.forEachEdge(u,function(f){i.add(f)})}}catch(f){s.e(f)}finally{s.f()}var d=U(r),h;try{var c=function(){var g=h.value;if(o.has(g))return 1;n.forEachEdge(g,function(y,m,v,p){var b=v===g?p:v;r.has(b)&&i.add(y)})};for(d.s();!(h=d.n()).done;)c()}catch(f){d.e(f)}finally{d.f()}return Array.from(i)}var tn=150,nn=50,rc={both:0,node:1,label:2},ic={over:0,above:1,below:2,auto:3},zo=12,oc=3,sc=(function(){function a(n){J(this,a),D(this,"labelGrid",new Ea),D(this,"edgeAnchorGrid",new Ea),D(this,"displayedNodeLabels",new Set),D(this,"displayedEdgeLabels",new Set),D(this,"edgeLabelCandidates",[]),D(this,"renderedNodeLabels",new Set),D(this,"labelSizeCache",new Map),D(this,"framePassPoints",new Float32Array(0)),D(this,"labelsDirty",!0),this.internals=n}return ee(a,[{key:"resetFrame",value:function(){this.displayedNodeLabels=new Set,this.renderedNodeLabels=new Set,this.labelSizeCache.clear()}},{key:"clearEdgeLabels",value:function(){this.displayedEdgeLabels=new Set}},{key:"resetLabelGrid",value:function(){this.labelGrid=new Ea,this.edgeAnchorGrid=new Ea}},{key:"processWebGLLabels",value:function(e){for(var t,r=this.internals,i=r.labelProgram,o=r.primitives,s=r.nodeDataCache,l=(o==null||(t=o.nodes)===null||t===void 0||(t=t.label)===null||t===void 0||(t=t.font)===null||t===void 0?void 0:t.family)||"sans-serif",u=new Map,d=0,h=e.length;d<h;d++){var c=e[d],f=s[c];if(!(f.visibility==="hidden"||!f.label)){var g=f.labelFont||l,y=u.get(g);y?y.push(f.label):u.set(g,[f.label])}}var m=U(u),v;try{for(m.s();!(v=m.n()).done;){var p=ne(v.value,2),b=p[0],T=p[1],_=la(b),E=_.family,w=_.weight,A=_.style,S=i.registerFont(E,w,A);i.ensureGlyphsReady(T,S)}}catch(k){m.e(k)}finally{m.f()}}},{key:"measureNodeLabel",value:function(e){var t,r;if(!e.label)return{width:0,height:0,textHeight:0};var i=this.internals,o=i.labelProgram,s=i.primitives,l=(t=e.labelSize)!==null&&t!==void 0?t:14,u=e.labelFont||(s==null||(r=s.nodes)===null||r===void 0||(r=r.label)===null||r===void 0||(r=r.font)===null||r===void 0?void 0:r.family)||"sans-serif",d="".concat(e.label,"|").concat(l,"|").concat(u);if(this.labelSizeCache.has(d))return this.labelSizeCache.get(d);var h=la(u),c=h.family,f=h.weight,g=h.style,y=o.registerFont(c,f,g),m=o.measureLabel(e.label,l,y);return this.labelSizeCache.set(d,m),m}},{key:"nodeLabelBox",value:function(e,t){var r,i,o,s,l;if(e.visibility==="hidden"||e.labelVisibility==="hidden")return null;var u=this.measureNodeLabel(e),d=u.width,h=u.height,c=u.textHeight;if(!d)return null;var f=(r=(i=this.internals.primitives)===null||i===void 0||(i=i.nodes)===null||i===void 0||(i=i.label)===null||i===void 0?void 0:i.margin)!==null&&r!==void 0?r:Kt,g=t+f,y=e.labelBackgroundColor?(o=e.labelBackgroundPadding)!==null&&o!==void 0?o:or:0,m=d/2,v=h/2,p=m+y,b=v+y,T=c/2,_=0,E=0;switch((s=e.labelPosition)!==null&&s!==void 0?s:"right"){case"left":_=-(g+m);break;case"above":E=-(g+T);break;case"below":E=g+T;break;case"over":break;default:_=g+m}var w=(l=e.labelAngle)!==null&&l!==void 0?l:0,A=za({x:_,y:E},w),S=A.x,k=A.y,z=Math.abs(Math.cos(w)),C=Math.abs(Math.sin(w)),N=z*p+C*b,L=C*p+z*b;return{minX:S-N,maxX:S+N,minY:k-L,maxY:k+L}}},{key:"computeDisplayedNodeLabels",value:function(){var e=this.internals.getCameraState(),t=this.internals.getDimensions(),r=t.width,i=t.height,o=this.internals.viewportToFramedGraph({x:-tn,y:-nn}),s=this.internals.viewportToFramedGraph({x:r+tn,y:-nn}),l=this.internals.viewportToFramedGraph({x:-tn,y:i+nn}),u=this.internals.viewportToFramedGraph({x:r+tn,y:i+nn}),d=Math.min(o.x,s.x,l.x,u.x),h=Math.max(o.x,s.x,l.x,u.x),c=Math.min(o.y,s.y,l.y,u.y),f=Math.max(o.y,s.y,l.y,u.y),g=st({x:.5,y:.5,ratio:1,angle:0},{width:r,height:i},this.internals.getGraphDimensions(),this.internals.getStagePadding()),y=function(P){var B=Ut(g,P);return{x:(1+B.x)*r/2,y:(1-B.y)*i/2}},m=y({x:d,y:c}),v=y({x:h,y:c}),p=y({x:d,y:f}),b=y({x:h,y:f}),T={x1:Math.min(m.x,v.x,p.x,b.x),y1:Math.min(m.y,v.y,p.y,b.y),x2:Math.max(m.x,v.x,p.x,b.x),y2:Math.max(m.y,v.y,p.y,b.y)},_=this.internals,E=_.settings,w=_.nodeDataCache,A=_.nodesWithForcedLabels,S=this.labelGrid.getLabelsToDisplay(e.ratio,E.labelDensity,T);Ka(S,A);for(var k=0,z=S.length;k<z;k++){var C=S[k],N=w[C];if(!this.displayedNodeLabels.has(C)&&!(N.visibility==="hidden"||N.labelVisibility==="hidden")&&N.label&&!(N.x<d||N.x>h||N.y<c||N.y>f)){var L=this.internals.framedGraphToViewport(N),G=L.x,M=L.y,F=this.internals.scaleSize(N.size);!ut(N)&&F<E.labelRenderedSizeThreshold||G<-tn-F||G>r+tn+F||M<-nn-F||M>i+nn+F||this.displayedNodeLabels.add(C)}}}},{key:"buildFramePassPoints",value:function(){var e=this.internals,t=e.nodeDataCache,r=e.nodeDataTexture;if(!r)return{data:this.framePassPoints,count:0};var i=this.displayedNodeLabels.size*3;this.framePassPoints.length<i&&(this.framePassPoints=new Float32Array(i));var o=this.framePassPoints,s=0,l=U(this.displayedNodeLabels),u;try{for(l.s();!(u=l.n()).done;){var d,h,c=u.value,f=t[c];if(f){var g=r.getIndex(c);g<0||(o[s*3]=g,o[s*3+1]=(d=Yt[f.labelPosition||nt.labelPosition])!==null&&d!==void 0?d:0,o[s*3+2]=(h=f.labelAngle)!==null&&h!==void 0?h:0,s++)}}}catch(y){l.e(y)}finally{l.f()}return{data:o,count:s}}},{key:"renderWebGLLabels",value:function(e,t){var r=this.internals,i=r.nodeDataCache,o=r.labelProgram,s=r.primitives,l=r.nodeDataTexture,u=[],d=U(this.displayedNodeLabels),h;try{for(d.s();!(h=d.n()).done;){var c=h.value;if(!this.renderedNodeLabels.has(c)){var f=i[c];t&&f.labelDepth!==t||(this.renderedNodeLabels.add(c),u.push(c))}}}catch(se){d.e(se)}finally{d.f()}if(u.length!==0){if(this.labelsDirty){for(var g,y,m,v=0,p=0,b=u.length;p<b;p++){var T=i[u[p]];v+=T.label.length}o.reallocate(v);for(var _=14,E=(g=s==null||(y=s.nodes)===null||y===void 0||(y=y.label)===null||y===void 0?void 0:y.margin)!==null&&g!==void 0?g:Kt,w=nt.labelPosition,A=(s==null||(m=s.nodes)===null||m===void 0||(m=m.label)===null||m===void 0||(m=m.font)===null||m===void 0?void 0:m.family)||"sans-serif",S=new Map,k=0,z=0,C=u.length;z<C;z++){var N,L,G,M,F=u[z],x=i[F],P=x.labelFont||A,B=S.get(P);if(B===void 0){var I=la(P),R=I.family,V=I.weight,$=I.style;B=o.registerFont(R,V,$),S.set(P,B)}var Y={text:x.label,x:x.x,y:x.y,size:(N=x.labelSize)!==null&&N!==void 0?N:_,color:x.labelColor,nodeSize:x.size,margin:E,position:(L=x.labelPosition)!==null&&L!==void 0?L:w,hidden:!1,forceLabel:ut(x),type:"default",zIndex:(G=x.zIndex)!==null&&G!==void 0?G:0,parentType:"node",parentKey:F,fontKey:B,labelAngle:(M=x.labelAngle)!==null&&M!==void 0?M:0,nodeIndex:l.getIndex(F)},xe=o.processLabel(F,k,Y);k+=xe}o.invalidateBuffers()}o.render(e)}}},{key:"renderBackdrops",value:function(e,t){var r=this.internals,i=r.backdropProgram,o=r.nodeDataCache,s=r.nodesWithBackdrop,l=r.attachmentManager,u=r.pixelRatio,d=r.nodeDataTexture,h=[],c=U(s),f;try{for(c.s();!(f=c.n()).done;){var g,y=f.value,m=o[y];if(!(!m||m.visibility==="hidden")&&!(t&&m.depth!==t)){var v=(g=d==null?void 0:d.getIndex(y))!==null&&g!==void 0?g:-1;v<0||h.push({key:y,nodeIndex:v})}}}catch(q){c.e(q)}finally{c.f()}if(h.length!==0){i.reallocate(h.length);for(var p=0;p<h.length;p++){var b,T,_,E,w,A,S,k,z=h[p],C=z.key,N=z.nodeIndex,L=o[C],G=this.displayedNodeLabels.has(C),M=G?this.measureNodeLabel(L):{width:0,height:0,textHeight:0},F=M.textHeight,x=M.width,P=M.height,B=0,I=0;if(G&&L.labelAttachment&&l){var R=l.getEntry(C,L.labelAttachment);if(R){var V=L.labelAttachmentPlacement||"below";if(V==="below"||V==="above"){var $=R.height/u;P+=$+ct,x=Math.max(x,R.width/u),I=V==="below"?($+ct)/2:-($+ct)/2}else{var Y=R.width/u;x+=Y+ct,P=Math.max(P,R.height/u),B=V==="right"?(Y+ct)/2:-(Y+ct)/2}}}var xe=L.backdropColor?lt(L.backdropColor):[255,255,255,255],se=L.backdropShadowColor?lt(L.backdropShadowColor):[0,0,0,128],X=xe.map(function(q){return q/255}),je=se.map(function(q){return q/255}),Se=(b=L.backdropShadowBlur)!==null&&b!==void 0?b:12,pt=(T=L.backdropPadding)!==null&&T!==void 0?T:6,Ue=L.backdropBorderColor?lt(L.backdropBorderColor):[0,0,0,0],Ra=Ue.map(function(q){return q/255}),kt=(_=L.backdropBorderWidth)!==null&&_!==void 0?_:0,he=(E=L.backdropCornerRadius)!==null&&E!==void 0?E:0,ae=(w=L.backdropLabelPadding)!==null&&w!==void 0?w:-1,re=ae<0?pt:ae,Oe=(A=rc[(S=L.backdropArea)!==null&&S!==void 0?S:"both"])!==null&&A!==void 0?A:0,Q={key:C,nodeIndex:N,label:L.label,labelWidth:x,labelHeight:P,textHeight:F,type:"default",position:L.labelPosition||nt.labelPosition,labelAngle:(k=L.labelAngle)!==null&&k!==void 0?k:0,backdropColor:X,backdropShadowColor:je,backdropShadowBlur:Se,backdropPadding:pt,backdropBorderColor:Ra,backdropBorderWidth:kt,backdropCornerRadius:he,backdropLabelPadding:re,backdropArea:Oe,labelBoxOffset:[B,I]};i.processBackdrop(p,Q)}i.invalidateBuffers(),i.render(e)}}},{key:"renderLabelBackgrounds",value:function(e,t){var r=this.internals,i=r.labelBackgroundProgram,o=r.nodeDataCache,s=r.nodeDataTexture,l=Ae.nodeLabel.writesPickingThisFrame(this.internals),u=[],d=U(this.displayedNodeLabels),h;try{for(d.s();!(h=d.n()).done;){var c=h.value,f=o[c];!f||f.visibility==="hidden"||t&&f.labelDepth!==t||!l&&!f.labelBackgroundColor||u.push(c)}}catch(N){d.e(N)}finally{d.f()}if(u.length!==0){i.reallocate(u.length);for(var g=0;g<u.length;g++){var y,m,v,p,b=u[g],T=o[b],_=(y=s==null?void 0:s.getIndex(b))!==null&&y!==void 0?y:-1;if(!(_<0)){var E=this.measureNodeLabel(T),w=E.width,A=E.height,S=E.textHeight,k=Rt(this.internals.pickingState,"nodeLabel",b)||Rt(this.internals.pickingState,"node",b),z=T.labelBackgroundColor?Ne(T.labelBackgroundColor):Ne("transparent"),C={nodeIndex:_,id:Ot(k),color:z,labelWidth:w,labelHeight:A,textHeight:S,positionMode:(m=Yt[T.labelPosition||nt.labelPosition])!==null&&m!==void 0?m:0,labelAngle:(v=T.labelAngle)!==null&&v!==void 0?v:0,padding:(p=T.labelBackgroundPadding)!==null&&p!==void 0?p:or};i.processLabelBackground(g,C)}}i.invalidateBuffers(),i.render(e)}}},{key:"cacheAttachments",value:function(e){var t=this.internals,r=t.attachmentManager,i=t.pixelRatio,o=t.nodeDataCache,s=t.nodesWithBackdrop,l=t.graph;if(r){var u=U(s),d;try{for(u.s();!(d=u.n()).done;){var h=d.value;if(this.displayedNodeLabels.has(h)){var c=o[h];if(!(!c||c.visibility==="hidden")&&!(e&&c.depth!==e)&&c.labelAttachment){var f=l.getNodeAttributes(h),g=this.measureNodeLabel(c),y=g.width,m=g.height,v={node:h,attributes:f,pixelRatio:i,labelWidth:y,labelHeight:m};r.renderAttachment(h,c.labelAttachment,v)}}}}catch(p){u.e(p)}finally{u.f()}r.regenerateAtlas()}}},{key:"renderAttachments",value:function(e,t){var r=this.internals,i=r.attachmentManager,o=r.attachmentProgram,s=r.nodeDataCache,l=r.nodesWithBackdrop,u=r.pixelRatio,d=r.nodeDataTexture;if(!(!i||!o)){var h=0;o.reallocateAttachments(l.size);var c=U(l),f;try{for(c.s();!(f=c.n()).done;){var g,y,m,v,p=f.value;if(this.displayedNodeLabels.has(p)){var b=s[p];if(!(!b||b.visibility==="hidden")&&!(t&&b.labelDepth!==t)&&b.labelAttachment){var T=i.getEntry(p,b.labelAttachment);if(T){var _=(g=d==null?void 0:d.getIndex(p))!==null&&g!==void 0?g:-1;if(!(_<0)){var E=this.measureNodeLabel(b),w=E.width,A=E.height,S=E.textHeight,k=(y=Qi[b.labelAttachmentPlacement||"below"])!==null&&y!==void 0?y:0;o.processAttachment(h,{nodeIndex:_,atlasX:T.x,atlasY:T.y,atlasW:T.width,atlasH:T.height,attachWidth:T.width/u,attachHeight:T.height/u,positionMode:(m=Yt[b.labelPosition||nt.labelPosition])!==null&&m!==void 0?m:0,attachmentPlacement:k,labelWidth:w,labelHeight:A,textHeight:S,labelAngle:(v=b.labelAngle)!==null&&v!==void 0?v:0}),h++}}}}}}catch(z){c.e(z)}finally{c.f()}h!==0&&(o.reallocateAttachments(h),i.bindTexture(xn),o.invalidateBuffers(),o.render(e))}}},{key:"computeDisplayedEdgeLabels",value:function(){var e=this.internals,t=e.graph,r=e.stateManager,i=e.settings,o=e.edgesWithForcedLabels,s=r.getHighlightedNodes(),l=i.edgeLabelAnchors==="allNodes"?new Set(this.edgeAnchorGrid.getLabelsToDisplay(this.internals.getCameraState().ratio,i.labelDensity)):this.displayedNodeLabels,u=r.hovered,d=ac({graph:t,hoveredNode:(u==null?void 0:u.kind)==="node"?u.key:null,displayedNodeLabels:l,highlightedNodes:s});Ka(d,o),this.edgeLabelCandidates=d,this.displayedEdgeLabels=new Set}},{key:"filterEdgeLabelsForDepth",value:function(e){for(var t=this.internals,r=t.graph,i=t.nodeDataCache,o=t.edgeDataCache,s=[],l=new Set,u=0,d=this.edgeLabelCandidates.length;u<d;u++){var h=this.edgeLabelCandidates[u];if(!l.has(h)){l.add(h);var c=r.extremities(h),f=i[c[0]],g=i[c[1]],y=o[h];!y||!f||!g||y.visibility==="hidden"||y.labelVisibility==="hidden"||f.visibility==="hidden"||g.visibility==="hidden"||e&&y.labelDepth!==e||y.label&&s.push(h)}}return s}},{key:"renderEdgeLabels",value:function(e,t){var r=this.internals,i=r.graph,o=r.nodeDataCache,s=r.edgeDataCache,l=r.primitives,u=r.edgeLabelProgram,d=r.nodeDataTexture,h=r.edgeDataTexture;if(u){var c=this.filterEdgeLabelsForDepth(t),f=U(c),g;try{for(f.s();!(g=f.n()).done;){var y=g.value;this.displayedEdgeLabels.add(y)}}catch(Y){f.e(Y)}finally{f.f()}if(c.length!==0){if(this.labelsDirty){var m,v,p=0,b=U(c),T;try{for(b.s();!(T=b.n()).done;){var _=T.value;p+=s[_].label.length}}catch(Y){b.e(Y)}finally{b.f()}u.reallocate(p);var E=(m=l==null||(v=l.edges)===null||v===void 0||(v=v.label)===null||v===void 0?void 0:v.margin)!==null&&m!==void 0?m:5,w="over",A=0,S=U(c),k;try{for(S.s();!(k=S.n()).done;){var z,C,N=k.value,L=i.extremities(N),G=L[0],M=L[1],F=o[G],x=o[M],P=s[N],B=d.getIndex(G),I=d.getIndex(M),R=h.getIndex(N),V={text:P.label,x:(F.x+x.x)/2,y:(F.y+x.y)/2,size:zo,color:P.labelColor,nodeSize:0,nodeIndex:-1,margin:E,position:(z=P.labelPosition)!==null&&z!==void 0?z:w,hidden:!1,forceLabel:ut(P),type:"default",zIndex:(C=P.zIndex)!==null&&C!==void 0?C:0,parentType:"edge",parentKey:N,fontKey:"",labelAngle:0,sourceX:F.x,sourceY:F.y,targetX:x.x,targetY:x.y,sourceSize:F.size,targetSize:x.size,sourceShape:F.shape||"circle",targetShape:x.shape||"circle",edgeSize:P.size,offset:0,edgeAttributes:P,sourceNodeIndex:B,targetNodeIndex:I,edgeIndex:R},$=u.processEdgeLabel(N,A,V);A+=$}}catch(Y){S.e(Y)}finally{S.f()}u.invalidateBuffers()}u.render(e)}}}},{key:"renderEdgeLabelBackgrounds",value:function(e,t){var r,i,o=this.internals,s=o.edgeLabelBackgroundProgram,l=o.edgeLabelProgram,u=o.edgeDataCache,d=o.primitives,h=o.edgeDataTexture;if(!(!h||!l||!s)){var c=Ae.edgeLabel.writesPickingThisFrame(this.internals),f=(r=d==null||(i=d.edges)===null||i===void 0||(i=i.label)===null||i===void 0?void 0:i.margin)!==null&&r!==void 0?r:5,g="over",y=this.filterEdgeLabelsForDepth(t),m=[],v=U(y),p;try{for(v.s();!(p=v.n()).done;){var b=p.value;!c&&!u[b].labelBackgroundColor||m.push(b)}}catch(F){v.e(F)}finally{v.f()}if(m.length!==0){s.reallocate(m.length);for(var T=0;T<m.length;T++){var _,E,w,A=m[T],S=u[A],k=S.label,z=l.measureLabelAtlasWidth(k),C=(_=S.labelPosition)!==null&&_!==void 0?_:g,N=typeof C=="string"&&(E=ic[C])!==null&&E!==void 0?E:0,L=Rt(this.internals.pickingState,"edgeLabel",A)||Rt(this.internals.pickingState,"edge",A),G=S.labelBackgroundColor?Ne(S.labelBackgroundColor):Ne("transparent"),M={edgeIndex:h.getIndex(A),baseFontSize:zo,totalTextWidth:z,positionMode:N,margin:f,padding:(w=S.labelBackgroundPadding)!==null&&w!==void 0?w:oc,color:G,id:Ot(L),edgeAttributes:S};s.processEdgeLabelBackground(T,A,M)}s.invalidateBuffers(),s.render(e)}}}}])})(),lc=(function(){function a(n,e,t,r){J(this,a),D(this,"nodeStates",new Map),D(this,"edgeStates",new Map),D(this,"hovered",null),D(this,"dirtyNodes",new Set),D(this,"dirtyEdges",new Set),D(this,"graphStateChanged",!1),D(this,"graphStateFlagsDirty",!1),this.scheduleRefresh=n,this.customNodeStateDefaults=e,this.customEdgeStateDefaults=t,this.customGraphStateDefaults=r,this.graphState=Ha(r)}return ee(a,[{key:"getNodeState",value:function(e){e=""+e;var t=this.nodeStates.get(e);return t||(t=Ti(this.customNodeStateDefaults),this.nodeStates.set(e,t)),t}},{key:"getEdgeState",value:function(e){e=""+e;var t=this.edgeStates.get(e);return t||(t=Ei(this.customEdgeStateDefaults),this.edgeStates.set(e,t)),t}},{key:"getGraphState",value:function(){return this.flushGraphStateFlags(),this.graphState}},{key:"getHighlightedNodes",value:function(){var e=new Set,t=U(this.nodeStates),r;try{for(t.s();!(r=t.n()).done;){var i=ne(r.value,2),o=i[0],s=i[1];s.isHighlighted&&e.add(o)}}catch(l){t.e(l)}finally{t.f()}return e}},{key:"setNodeState",value:function(e,t){e=""+e;var r=this.getNodeState(e);if(Vt(r,t)){var i=O(O({},r),t);this.nodeStates.set(e,i),this.dirtyNodes.add(e),this.updateHoveredNodeTracking(e,r,i),this.graphStateFlagsDirty=!0,this.scheduleRefresh()}}},{key:"setEdgeState",value:function(e,t){e=""+e;var r=this.getEdgeState(e);if(Vt(r,t)){var i=O(O({},r),t);this.edgeStates.set(e,i),this.dirtyEdges.add(e),this.updateHoveredEdgeTracking(e,r,i),this.graphStateFlagsDirty=!0,this.scheduleRefresh()}}},{key:"setGraphState",value:function(e){if(Vt(this.graphState,e)){var t=O(O({},this.graphState),e);t.isIdle=!t.isPanning&&!t.isZooming&&!t.isDragging,this.graphState=t,this.graphStateChanged=!0,this.scheduleRefresh()}}},{key:"setNodesState",value:function(e,t){var r=!1,i=U(e),o;try{for(i.s();!(o=i.n()).done;){var s=o.value;s=""+s;var l=this.getNodeState(s);if(Vt(l,t)){var u=O(O({},l),t);this.nodeStates.set(s,u),this.dirtyNodes.add(s),this.updateHoveredNodeTracking(s,l,u),r=!0}}}catch(d){i.e(d)}finally{i.f()}r&&(this.graphStateFlagsDirty=!0,this.scheduleRefresh())}},{key:"setEdgesState",value:function(e,t){var r=!1,i=U(e),o;try{for(i.s();!(o=i.n()).done;){var s=o.value;s=""+s;var l=this.getEdgeState(s);if(Vt(l,t)){var u=O(O({},l),t);this.edgeStates.set(s,u),this.dirtyEdges.add(s),this.updateHoveredEdgeTracking(s,l,u),r=!0}}}catch(d){i.e(d)}finally{i.f()}r&&(this.graphStateFlagsDirty=!0,this.scheduleRefresh())}},{key:"markNodesDirty",value:function(e){var t=U(e),r;try{for(t.s();!(r=t.n()).done;){var i=r.value;this.dirtyNodes.add(i)}}catch(o){t.e(o)}finally{t.f()}this.scheduleRefresh()}},{key:"removeNode",value:function(e){this.nodeStates.delete(e),this.dirtyNodes.delete(e),this.clearHoveredFor("node",e),this.graphStateFlagsDirty=!0,this.scheduleRefresh()}},{key:"removeEdge",value:function(e){this.edgeStates.delete(e),this.dirtyEdges.delete(e),this.clearHoveredFor("edge",e),this.graphStateFlagsDirty=!0,this.scheduleRefresh()}},{key:"pruneNodes",value:function(e){var t=U(this.nodeStates.keys()),r;try{for(t.s();!(r=t.n()).done;){var i=r.value;e(i)||this.removeNode(i)}}catch(o){t.e(o)}finally{t.f()}}},{key:"pruneEdges",value:function(e){var t=U(this.edgeStates.keys()),r;try{for(t.s();!(r=t.n()).done;){var i=r.value;e(i)||this.removeEdge(i)}}catch(o){t.e(o)}finally{t.f()}}},{key:"clearNodes",value:function(){this.nodeStates.clear(),this.dirtyNodes.clear(),this.clearHoveredForKinds(Aa("node")),this.graphStateFlagsDirty=!0,this.scheduleRefresh()}},{key:"clearEdges",value:function(){this.edgeStates.clear(),this.dirtyEdges.clear(),this.clearHoveredForKinds(Aa("edge")),this.graphStateFlagsDirty=!0,this.scheduleRefresh()}},{key:"resetGraphState",value:function(){this.graphState=Ha(this.customGraphStateDefaults),this.graphStateChanged=!1,this.graphStateFlagsDirty=!1}},{key:"clearDirtyTracking",value:function(){this.dirtyNodes.clear(),this.dirtyEdges.clear(),this.graphStateChanged=!1}},{key:"setHovered",value:function(e){this.hovered=e}},{key:"clearHoveredFor",value:function(e,t){this.hovered&&this.hovered.key===t&&Aa(e).includes(this.hovered.kind)&&(this.hovered=null)}},{key:"clearHoveredForKinds",value:function(e){this.hovered&&e.includes(this.hovered.kind)&&(this.hovered=null)}},{key:"updateGraphStateFromNodes",value:function(){var e,t=!1,r=!1,i=!1,o=U(this.nodeStates),s;try{for(o.s();!(s=o.n()).done;){var l=ne(s.value,2),u=l[1];if(u.isHovered&&(t=!0),u.isHighlighted&&(r=!0),u.isDragged&&(i=!0),t&&r&&i)break}}catch(h){o.e(h)}finally{o.f()}!t&&((e=this.hovered)===null||e===void 0?void 0:e.kind)==="edge"&&(t=!0);var d=!this.graphState.isPanning&&!this.graphState.isZooming&&!i;(this.graphState.hasHovered!==t||this.graphState.hasHighlighted!==r||this.graphState.isDragging!==i||this.graphState.isIdle!==d)&&(this.graphStateChanged=!0),this.graphState=O(O({},this.graphState),{},{hasHovered:t,hasHighlighted:r,isDragging:i,isIdle:d})}},{key:"updateGraphStateFromEdges",value:function(){var e,t=((e=this.hovered)===null||e===void 0?void 0:e.kind)==="node";if(!t){var r=U(this.edgeStates),i;try{for(r.s();!(i=r.n()).done;){var o=ne(i.value,2),s=o[1];if(s.isHovered){t=!0;break}}}catch(l){r.e(l)}finally{r.f()}}this.graphState.hasHovered!==t&&(this.graphStateChanged=!0),this.graphState=O(O({},this.graphState),{},{hasHovered:t})}},{key:"flushGraphStateFlags",value:function(){this.graphStateFlagsDirty&&(this.updateGraphStateFromNodes(),this.updateGraphStateFromEdges(),this.graphStateFlagsDirty=!1)}},{key:"updateHoveredNodeTracking",value:function(e,t,r){var i;if(t.isHovered!==r.isHovered)if(r.isHovered){var o;if(((o=this.hovered)===null||o===void 0?void 0:o.kind)==="node"&&this.hovered.key!==e){var s=this.hovered.key,l=this.getNodeState(s);this.nodeStates.set(s,O(O({},l),{},{isHovered:!1})),this.dirtyNodes.add(s)}this.hovered={kind:"node",key:e}}else((i=this.hovered)===null||i===void 0?void 0:i.kind)==="node"&&this.hovered.key===e&&(this.hovered=null)}},{key:"updateHoveredEdgeTracking",value:function(e,t,r){var i;if(t.isHovered!==r.isHovered)if(r.isHovered){var o;if(((o=this.hovered)===null||o===void 0?void 0:o.kind)==="edge"&&this.hovered.key!==e){var s=this.hovered.key,l=this.getEdgeState(s);this.edgeStates.set(s,O(O({},l),{},{isHovered:!1})),this.dirtyEdges.add(s)}this.hovered={kind:"edge",key:e}}else((i=this.hovered)===null||i===void 0?void 0:i.kind)==="edge"&&this.hovered.key===e&&(this.hovered=null)}}])})(),No=1,Wo=2,Bo=3,Mo=4,uc=(function(a){function n(e,t){var r,i,o,s,l,u=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};J(this,n),l=ce(this,n),D(l,"nodeReducer",null),D(l,"edgeReducer",null),D(l,"stageCanvas",null),D(l,"mouseLayer",null),D(l,"gestureHint",null),D(l,"extraElements",{}),D(l,"webGLContext",null),D(l,"pickingFrameBuffer",null),D(l,"pickingTexture",null),D(l,"pickingDepthBuffer",null),D(l,"activeListeners",{}),D(l,"nodeVariableEntries",[]),D(l,"edgeVariableEntries",[]),D(l,"edgePathsByName",new Map),D(l,"nodeProgramIndex",{}),D(l,"edgeProgramIndex",{}),D(l,"edgeTextureIndexCache",{}),D(l,"nodeGraphCoords",{}),D(l,"nodeExtent",{x:[0,1],y:[0,1]}),D(l,"matrix",ze()),D(l,"invMatrix",ze()),D(l,"correctionRatio",1),D(l,"frameId",0),D(l,"customBBox",null),D(l,"gpuTimerExt",void 0),D(l,"activeGpuTimerQuery",null),D(l,"pendingGpuTimerQueries",[]),D(l,"normalizationFunction",ia({x:[0,1],y:[0,1]})),D(l,"graphToViewportRatio",1),D(l,"pickingState",Nh()),D(l,"prevNodeVisibilities",{}),D(l,"width",0),D(l,"height",0),D(l,"autoRescaleFrozen",!1),D(l,"stylesDeclaration",null),D(l,"resolvedStageStyle",{}),D(l,"renderFrame",null),D(l,"contextLost",!1),D(l,"pendingProcess","full"),D(l,"needToRefreshState",!1),D(l,"checkEdgesEventsFrame",null),D(l,"edgeStyleAnalysis",{dependency:"static",xAttribute:null,yAttribute:null}),D(l,"depthLayers",K(Qn)),D(l,"customLayerPrograms",new Map),D(l,"nodeShapeSlug",null),D(l,"sdfAtlas",null),D(l,"depthRanges",{nodes:{},edges:{}}),D(l,"nodeBaseDepth",{}),D(l,"edgeBaseDepth",{});var d=u.primitives,h=u.styles,c=u.settings,f=c===void 0?{}:c,g=u.nodeReducer,y=u.edgeReducer,m=u.customNodeState,v=u.customEdgeState,p=u.customGraphState;l.stateManager=new lc(function(){return l.scheduleStateRefresh()},m,v,p);var b=d!=null?d:wi;l.stylesDeclaration=h?{nodes:(r=h.nodes)!==null&&r!==void 0?r:ta.nodes,edges:(i=h.edges)!==null&&i!==void 0?i:ta.edges,stage:h.stage}:ta,l.nodeReducer=g!=null?g:null,l.edgeReducer=y!=null?y:null;var T=$a(l.stylesDeclaration.nodes);l.nodeReducer&&(T.dependency="graph-state"),l.edgeStyleAnalysis=$a(l.stylesDeclaration.edges),l.edgeReducer&&(l.edgeStyleAnalysis.dependency="graph-state"),l.stylesDeclaration.stage&&(l.resolvedStageStyle=Ya(l.stylesDeclaration.stage,l.stateManager.graphState));var _=Fi(f);if(sa(_),_.enableNodeDrag){var E=T.xAttribute,w=T.yAttribute;if((!E||!w)&&!_.dragPositionToAttributes)throw new Error('Sigma: `enableNodeDrag` is true but position attribute names could not be inferred from styles. Either use attribute bindings for x/y in your node styles (e.g. `x: { attribute: "x" }`), or provide a `dragPositionToAttributes` setting.')}if(Pi(e),!(t instanceof HTMLElement))throw new Error("Sigma: container should be an html element.");l.container=t,l.edgeGroups=new zh(e,function(x,P){for(var B=0;B<x.length;B++){var I=l.stateManager.getEdgeState(x[B]);I.parallelIndex=B,I.parallelCount=P}});var A=new Gh(e,l.viewportToGraph.bind(l),l.setNodesState.bind(l),function(x,P){return l.emit(x,P)});if(l.depthLayers=(o=b.depthLayers)!==null&&o!==void 0?o:K(Qn),!(h!=null&&h.nodes)&&!Kn.every(function(x){return l.depthLayers.includes(x)}))throw new Error("Sigma: depthLayers must include ".concat(Kn.join(", ")," for the built-in node styles."));if(!(h!=null&&h.edges)&&!Zn.every(function(x){return l.depthLayers.includes(x)}))throw new Error("Sigma: depthLayers must include ".concat(Zn.join(", ")," for the built-in edge styles."));l.itemBuckets={nodes:new vr(l.depthLayers),edges:new vr(l.depthLayers)},l.initWebGLContext(),l.mouseLayer=qt("div",{position:"absolute",touchAction:"none",userSelect:"none"},{class:"sigma-mouse"}),l.container.appendChild(l.mouseLayer),l.resolvedStageStyle.background&&(l.container.style.backgroundColor=l.resolvedStageStyle.background),l.resolvedStageStyle.cursor&&(l.container.style.cursor=l.resolvedStageStyle.cursor);var S=new xo(l.webGLContext),k=new pr(l.webGLContext,{channels:1}),z=new To(l.webGLContext),C=new pr(l.webGLContext,{channels:4}),N=l.webGLContext,L=new nc({gl:N,getFrameBuffer:function(){return l.pickingFrameBuffer},getPixelRatio:function(){return l.internals.pixelRatio},getDownSizingRatio:function(){return l.internals.settings.pickingDownSizingRatio},isRenderPending:function(){return l.renderFrame!==null},onIndex:function(P,B){var I;return $o(l.internals,(I=l.pickingState.lookup[P])!==null&&I!==void 0?I:null,B)}}),G=l.initPrograms(b,_),M=b==null||(s=b.nodes)===null||s===void 0?void 0:s.labelAttachments,F=null;return M&&Object.keys(M).length>0&&(F=new _o(N,M,function(){return l.scheduleRender()})),l.internals=O(O({nodeDataCache:{},edgeDataCache:{},nodesWithForcedLabels:new Set,nodesWithBackdrop:new Set,edgesWithForcedLabels:new Set,settings:_,primitives:b,pixelRatio:gn(),graph:e,stateManager:l.stateManager,dragManager:A,hoverResolver:L,nodeStyleAnalysis:T,pickingState:l.pickingState},G),{},{attachmentManager:F,nodeDataTexture:S,nodeFrameTexture:k,edgeDataTexture:z,edgeFrameTexture:C,getDimensions:function(){return l.getDimensions()},getGraphDimensions:function(){return l.getGraphDimensions()},getStagePadding:function(){return l.getStagePadding()},getCameraState:function(){return l.camera.getState()},getHitAtPosition:function(P){return l.getHitAtPosition(P)},setNodeState:function(P,B){return l.setNodeState(P,B)},setEdgeState:function(P,B){return l.setEdgeState(P,B)},updateContainerCursor:function(){return l.updateContainerCursor()},scheduleRefresh:function(){return l.scheduleRefresh()},viewportToFramedGraph:function(P){return l.viewportToFramedGraph(P)},viewportToGraph:function(P){return l.viewportToGraph(P)},framedGraphToViewport:function(P){return l.framedGraphToViewport(P)},scaleSize:function(P){return l.scaleSize(P)},emit:function(P,B){return l.emit(P,B)}}),l.labelRenderer=new sc(l.internals),l.resize(),l.initializeWebGLLabels(),l.camera=new Ao,l.bindCameraHandlers(),l.mouseCaptor=new kh(l.mouseLayer,l),l.mouseCaptor.setSettings(l.internals.settings),l.touchCaptor=new Ih(l.mouseLayer,l),l.touchCaptor.setSettings(l.internals.settings),l.bindEventHandlers(),l.bindGraphHandlers(),l.handleSettingsUpdate(),l.refresh(),l}return fe(n,a),ee(n,[{key:"initializeWebGLLabels",value:function(){this.sdfAtlas=new Et,this.sdfAtlas.registerFont({family:"sans-serif",weight:"normal",style:"normal"})}},{key:"resetWebGLTexture",value:function(){var t=this.webGLContext;if(!this.pickingFrameBuffer)return this;var r=Math.ceil(this.width*this.internals.pixelRatio/this.internals.settings.pickingDownSizingRatio),i=Math.ceil(this.height*this.internals.pixelRatio/this.internals.settings.pickingDownSizingRatio);t.bindFramebuffer(t.FRAMEBUFFER,this.pickingFrameBuffer),this.pickingTexture&&t.deleteTexture(this.pickingTexture);var o=t.createTexture();o&&(t.bindTexture(t.TEXTURE_2D,o),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,r,i,0,t.RGBA,t.UNSIGNED_BYTE,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,o,0),this.pickingTexture=o),this.pickingDepthBuffer&&t.deleteRenderbuffer(this.pickingDepthBuffer);var s=t.createRenderbuffer();return s&&(t.bindRenderbuffer(t.RENDERBUFFER,s),t.renderbufferStorage(t.RENDERBUFFER,t.DEPTH_COMPONENT16,r,i),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.RENDERBUFFER,s),this.pickingDepthBuffer=s),t.bindFramebuffer(t.FRAMEBUFFER,null),this}},{key:"bindCameraHandlers",value:function(){var t=this;return this.activeListeners.camera=function(){t.refreshMatrices(),t.labelRenderer.labelsDirty=!0,t.scheduleRender()},this.activeListeners.cameraAnimationStart=function(r){var i=r.from,o=r.to;i.ratio!==o.ratio&&t.stateManager.setGraphState({isZooming:!0})},this.activeListeners.cameraAnimationEnd=function(){t.stateManager.setGraphState({isZooming:!1})},this.camera.on("updated",this.activeListeners.camera),this.camera.on("animationStart",this.activeListeners.cameraAnimationStart),this.camera.on("animationEnd",this.activeListeners.cameraAnimationEnd),this}},{key:"unbindCameraHandlers",value:function(){return this.camera.removeListener("updated",this.activeListeners.camera),this.camera.removeListener("animationStart",this.activeListeners.cameraAnimationStart),this.camera.removeListener("animationEnd",this.activeListeners.cameraAnimationEnd),this}},{key:"getHitAtPosition",value:function(t){var r;if(this.contextLost)return null;var i=this.webGLContext;i.bindFramebuffer(i.FRAMEBUFFER,this.pickingFrameBuffer);var o=ni(i,this.pickingFrameBuffer,t.x,t.y,this.internals.pixelRatio,this.internals.settings.pickingDownSizingRatio),s=Wa.apply(void 0,K(o));return(r=this.pickingState.lookup[s])!==null&&r!==void 0?r:null}},{key:"bindEventHandlers",value:function(){return $h(this.internals,this.mouseCaptor,this.touchCaptor,this.activeListeners),this}},{key:"bindGraphHandlers",value:function(){var t=this;return Vh({graph:this.internals.graph,edgeGroups:this.edgeGroups,updateNode:this.updateNode.bind(this),removeNode:this.removeNode.bind(this),addEdge:this.addEdge.bind(this),updateEdge:this.updateEdge.bind(this),removeEdge:this.removeEdge.bind(this),clearEdgeState:this.clearEdgeState.bind(this),clearNodeState:this.clearNodeState.bind(this),clearEdgeIndices:this.clearEdgeIndices.bind(this),clearNodeIndices:this.clearNodeIndices.bind(this),refresh:this.refresh.bind(this),scheduleProcess:function(){t.pendingProcess="full",t.scheduleRender()},markNodesDirty:function(i){t.internals.nodeStyleAnalysis.dependency==="graph-state"&&t.stateManager.markNodesDirty(i)}},this.activeListeners),this}},{key:"unbindGraphHandlers",value:function(){jh(this.internals.graph,this.activeListeners)}},{key:"getNodeShapeId",value:function(t){return this.internals.nodeShapeMap&&this.internals.nodeGlobalShapeIds&&t.shape&&t.shape in this.internals.nodeShapeMap?this.internals.nodeGlobalShapeIds[this.internals.nodeShapeMap[t.shape]]:bn(t.shape||"circle")}},{key:"processNodes",value:function(){var t=this,r=this.internals.graph,i=this.internals.settings,o=this.getDimensions(),s=i.autoRescale,l=i.autoRescaleContent,u=this.nodeExtent;if(s===!1){var d=o.width,h=o.height;u={x:[-d/2,d/2],y:[-h/2,h/2]}}else(s!=="once"||!this.autoRescaleFrozen)&&(u=this.computeNodeExtent(),l!=="positions"&&!this.customBBox&&(u=Kh({extent:u,coords:this.nodeGraphCoords,nodeData:this.internals.nodeDataCache,dimensions:o,stagePadding:this.getStagePadding(),zoomToSizeRatioFunction:i.zoomToSizeRatioFunction,itemSizesReference:i.itemSizesReference,fitLabels:l==="labels",nodeLabelBox:function(I,R){return t.labelRenderer.nodeLabelBox(I,R)}})),s==="once"&&(this.autoRescaleFrozen=!0));this.nodeExtent=u,this.normalizationFunction=ia(this.customBBox||this.nodeExtent);var c=new Ao,f=st(c.getState(),o,this.getGraphDimensions(),this.getStagePadding());this.labelRenderer.labelGrid.resizeAndClear(o,i.labelGridCellSize),this.labelRenderer.edgeAnchorGrid.resizeAndClear(o,i.labelGridCellSize);var g=i.renderEdgeLabels&&i.edgeLabelAnchors==="allNodes",y=!1;Ta(this.pickingState,"node");for(var m=r.nodes(),v=0,p=m.length;v<p;v++){var b=m[v],T=this.internals.nodeDataCache[b],_=this.nodeGraphCoords[b];T.x=_.x,T.y=_.y,this.normalizationFunction.applyTo(T),T.visibility!==this.prevNodeVisibilities[b]&&(y=!0),typeof T.label=="string"&&T.visibility!=="hidden"&&T.labelVisibility!=="hidden"&&this.labelRenderer.labelGrid.add(b,T.size,this.framedGraphToViewport(T,{matrix:f})),g&&T.visibility!=="hidden"&&this.labelRenderer.edgeAnchorGrid.add(b,T.size,this.framedGraphToViewport(T,{matrix:f}))}this.labelRenderer.labelGrid.organize(),this.labelRenderer.edgeAnchorGrid.organize(),this.nodeProgram.reallocate(m.length);var E=0;this.depthRanges.nodes={},this.nodeBaseDepth={};var w=this.internals.nodeDataCache,A=U(this.depthLayers),S;try{for(A.s();!(S=A.n()).done;){var k=S.value,z=this.itemBuckets.nodes.getSorted(k,function(B){return w[B].zIndex});if(z.length!==0){this.depthRanges.nodes[k]=[{offset:E,count:z.length}];var C=U(z),N;try{for(C.s();!(N=C.n()).done;){var L=N.value;this.nodeBaseDepth[L]=k,Co(this.pickingState,"node",L),this.addNodeToProgram(L,E++)}}catch(B){C.e(B)}finally{C.f()}}}}catch(B){A.e(B)}finally{A.f()}this.nodeProgram.invalidateBuffers();for(var G=0,M=m.length;G<M;G++)this.prevNodeVisibilities[m[G]]=this.internals.nodeDataCache[m[G]].visibility;this.labelRenderer.processWebGLLabels(m);var F=U(this.customLayerPrograms.values()),x;try{for(F.s();!(x=F.n()).done;){var P=x.value.program;P.cacheData&&P.cacheData()}}catch(B){F.e(B)}finally{F.f()}return y}},{key:"processEdges",value:function(){var t=this.internals.graph,r=t.edges();this.edgeProgram.reallocate(r.length);var i=0;Ta(this.pickingState,"edge"),this.depthRanges.edges={},this.edgeBaseDepth={};var o=this.internals.edgeDataCache,s=U(this.depthLayers),l;try{for(s.s();!(l=s.n()).done;){var u=l.value,d=this.itemBuckets.edges.getSorted(u,function(g){return o[g].zIndex});if(d.length!==0){this.depthRanges.edges[u]=[{offset:i,count:d.length}];var h=U(d),c;try{for(h.s();!(c=h.n()).done;){var f=c.value;this.edgeBaseDepth[f]=u,Co(this.pickingState,"edge",f),this.addEdgeToProgram(f,i++)}}catch(g){h.e(g)}finally{h.f()}}}}catch(g){s.e(g)}finally{s.f()}this.edgeProgram.invalidateBuffers()}},{key:"updateNodeDepthRanges",value:function(t,r,i){var o=this.nodeProgramIndex[t];o!==void 0&&(Qa(this.depthRanges.nodes,r,o),Ja(this.depthRanges.nodes,i,o))}},{key:"updateEdgeDepthRanges",value:function(t,r,i){var o=this.edgeProgramIndex[t];o!==void 0&&(Qa(this.depthRanges.edges,r,o),Ja(this.depthRanges.edges,i,o))}},{key:"handleSettingsUpdate",value:function(){var t=this,r=this.internals.settings;return this.camera.minRatio=r.minCameraRatio,this.camera.maxRatio=r.maxCameraRatio,this.camera.enabledZooming=r.enableCameraZooming,this.camera.enabledPanning=r.enableCameraPanning,this.camera.enabledRotation=r.enableCameraRotation,r.cameraPanBoundaries?this.camera.constrainState=function(i){return t.cleanCameraState(i,r.cameraPanBoundaries&&te(r.cameraPanBoundaries)==="object"?r.cameraPanBoundaries:{})}:this.camera.constrainState=null,this.camera.setState(this.camera.getState()),this.mouseLayer.style.touchAction=r.gestureTarget==="graph"?"none":r.gestureTarget==="shared"?"pan-x pan-y":"auto",r.gestureTarget!=="shared"&&this.gestureHint&&(this.gestureHint.kill(),this.gestureHint=null),this.mouseCaptor.setSettings(this.internals.settings),this.touchCaptor.setSettings(this.internals.settings),this}},{key:"cleanCameraState",value:function(t){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=r.tolerance,o=i===void 0?0:i,s=r.boundaries,l=O({},t),u=s||this.nodeExtent,d=ne(u.x,2),h=d[0],c=d[1],f=ne(u.y,2),g=f[0],y=f[1],m=[this.graphToViewport({x:h,y:g},{cameraState:t}),this.graphToViewport({x:c,y:g},{cameraState:t}),this.graphToViewport({x:h,y},{cameraState:t}),this.graphToViewport({x:c,y},{cameraState:t})],v=1/0,p=-1/0,b=1/0,T=-1/0;m.forEach(function(L){var G=L.x,M=L.y;v=Math.min(v,G),p=Math.max(p,G),b=Math.min(b,M),T=Math.max(T,M)});var _=p-v,E=T-b,w=this.getDimensions(),A=w.width,S=w.height,k=0,z=0;if(_>=A?p<A-o?k=p-(A-o):v>o&&(k=v-o):p>A+o?k=p-(A+o):v<-o&&(k=v+o),E>=S?T<S-o?z=T-(S-o):b>o&&(z=b-o):T>S+o?z=T-(S+o):b<-o&&(z=b+o),k||z){var C=this.viewportToFramedGraph({x:0,y:0},{cameraState:t}),N=this.viewportToFramedGraph({x:k,y:z},{cameraState:t});k=N.x-C.x,z=N.y-C.y,l.x+=k,l.y+=z}return l}},{key:"refreshMatrices",value:function(){var t=this.camera.getState(),r=this.getDimensions(),i=this.getGraphDimensions(),o=this.getStagePadding();this.matrix=st(t,r,i,o),this.invMatrix=st(t,r,i,o,!0),this.correctionRatio=Qr(this.matrix,t,r),this.graphToViewportRatio=this.getGraphToViewportRatio()}},{key:"processData",value:function(){var t;this.emit("beforeProcess"),(t=this.internals.attachmentManager)===null||t===void 0||t.clear();var r=O({},this.pickingState.idsByKind),i=this.processNodes();(this.pendingProcess==="full"||i)&&this.processEdges(),Wh(this.pickingState,this.internals),Bh(r,this.pickingState.idsByKind)||this.internals.hoverResolver.invalidate(),this.pendingProcess="none",this.emit("afterProcess")}},{key:"render",value:function(){var t=this;if(this.contextLost)return this;this.emit("beforeRender");var r=function(){return t.internals.hoverResolver.frameRendered(),t.emit("afterRender"),t};if(this.renderFrame&&(cancelAnimationFrame(this.renderFrame),this.renderFrame=null),this.resize(),(this.pendingProcess!=="none"||this.needToRefreshState)&&(this.labelRenderer.labelsDirty=!0),this.pendingProcess!=="none"&&this.processData(),this.needToRefreshState&&this.refreshState(),this.needToRefreshState=!1,this.stateManager.clearDirtyTracking(),this.pendingProcess!=="none"&&this.processData(),this.clear(),this.resetWebGLTexture(),!this.internals.graph.order)return r();var i=this.mouseCaptor,o=this.camera.isAnimating()||i.isMoving||i.draggedEvents||i.currentWheelDirection;if(this.refreshMatrices(),this.frameId++,this.internals.settings.renderEdgeLabels&&!this.internals.edgeLabelProgram){var s=this.createEdgeLabelPrograms(),l=s.labelProgram,u=s.labelBackgroundProgram;this.internals.edgeLabelProgram=l,this.internals.edgeLabelBackgroundProgram=u}var d=this.internals.settings.DEBUG_logRenderStats?this.getDebugPrograms():null;d&&d.forEach(function(Y){return Y.resetDebugStats()}),this.internals.settings.DEBUG_gpuTimerQueries&&this.beginGpuTimerQuery(),this.internals.nodeFrameTexture.ensureCapacity(this.internals.nodeDataTexture.getCapacity()),this.internals.edgeFrameTexture.ensureCapacity(this.internals.edgeDataTexture.getCapacity());var h=this.getRenderParams(),c=Ae.edge.writesPickingThisFrame(this.internals)?h:O(O({},h),{},{pickingFrameBuffer:null});this.labelRenderer.resetFrame();var f=this.webGLContext,g=Math.ceil(this.width*this.internals.pixelRatio/this.internals.settings.pickingDownSizingRatio),y=Math.ceil(this.height*this.internals.pixelRatio/this.internals.settings.pickingDownSizingRatio);if(f.bindFramebuffer(f.FRAMEBUFFER,this.pickingFrameBuffer),f.viewport(0,0,g,y),f.clear(f.COLOR_BUFFER_BIT|f.DEPTH_BUFFER_BIT),f.bindFramebuffer(f.FRAMEBUFFER,null),f.viewport(0,0,this.width*this.internals.pixelRatio,this.height*this.internals.pixelRatio),f.clear(f.COLOR_BUFFER_BIT|f.DEPTH_BUFFER_BIT),this.internals.nodeDataTexture.upload(),this.internals.edgeDataTexture.upload(),this.nodeProgram.uploadLayerTexture(),this.edgeProgram.uploadAttributeTexture(),this.emit("afterTexturesUpload"),this.internals.nodeDataTexture.bind(Bo),this.internals.edgeDataTexture.bind(Mo),this.edgeFramePass.run(h,this.internals.edgeFrameTexture,this.internals.edgeDataTexture.getHighWaterMark(),this.edgeProgram.getAttributeTexture(),this.nodeProgram.getAttributeTexture()),this.internals.edgeFrameTexture.bind(No),this.internals.settings.renderLabels){this.labelRenderer.computeDisplayedNodeLabels();var m=this.labelRenderer.buildFramePassPoints(),v=m.data,p=m.count;this.nodeFramePass.run(v,p,this.internals.nodeFrameTexture,h,this.nodeProgram.getAttributeTexture()),this.internals.nodeFrameTexture.bind(Wo)}this.internals.settings.renderEdgeLabels&&this.labelRenderer.computeDisplayedEdgeLabels();var b=U(this.customLayerPrograms.values()),T;try{for(b.s();!(T=b.n()).done;){var _=T.value.program;_.preRender&&_.preRender(h)}}catch(Y){b.e(Y)}finally{b.f()}f.bindFramebuffer(f.FRAMEBUFFER,null),f.viewport(0,0,this.width*this.internals.pixelRatio,this.height*this.internals.pixelRatio),f.blendFunc(f.ONE,f.ONE_MINUS_SRC_ALPHA);var E=!this.internals.settings.hideLabelsOnMove||!o,w=U(this.depthLayers),A;try{for(w.s();!(A=w.n()).done;){var S=A.value,k=U(this.customLayerPrograms.values()),z;try{for(k.s();!(z=k.n()).done;){var C=z.value;C.depth===S&&C.program.render(h)}}catch(Y){k.e(Y)}finally{k.f()}var N=this.depthRanges.edges[S];if(N&&(!this.internals.settings.hideEdgesOnMove||!o)){var L=U(N),G;try{for(L.s();!(G=L.n()).done;){var M=G.value,F=M.offset,x=M.count;x>0&&this.edgeProgram.render(c,F,x)}}catch(Y){L.e(Y)}finally{L.f()}}this.internals.settings.renderEdgeLabels&&E&&(this.labelRenderer.renderEdgeLabelBackgrounds(Ae.edgeLabel.writesPickingThisFrame(this.internals)?h:O(O({},h),{},{pickingFrameBuffer:null}),S),this.labelRenderer.renderEdgeLabels(h,S)),this.labelRenderer.cacheAttachments(S),this.labelRenderer.renderBackdrops(O(O({},h),{},{pickingFrameBuffer:null}),S);var P=this.depthRanges.nodes[S];if(P){var B=U(P),I;try{for(B.s();!(I=B.n()).done;){var R=I.value,V=R.offset,$=R.count;$>0&&this.nodeProgram.render(h,V,$)}}catch(Y){B.e(Y)}finally{B.f()}}E&&(this.labelRenderer.renderAttachments(O(O({},h),{},{pickingFrameBuffer:null}),S),this.labelRenderer.renderLabelBackgrounds(Ae.nodeLabel.writesPickingThisFrame(this.internals)?h:O(O({},h),{},{pickingFrameBuffer:null}),S),this.internals.settings.renderLabels&&this.labelRenderer.renderWebGLLabels(h,S))}}catch(Y){w.e(Y)}finally{w.f()}return this.labelRenderer.labelsDirty=!1,this.internals.settings.DEBUG_displayPickingLayer&&(f.bindFramebuffer(f.READ_FRAMEBUFFER,this.pickingFrameBuffer),f.bindFramebuffer(f.DRAW_FRAMEBUFFER,null),f.blitFramebuffer(0,0,g,y,0,0,this.width*this.internals.pixelRatio,this.height*this.internals.pixelRatio,f.COLOR_BUFFER_BIT,f.NEAREST)),this.internals.settings.DEBUG_gpuTimerQueries&&this.endGpuTimerQuery(),this.pollGpuTimerQueries(),d&&this.logRenderStats(d),r()}},{key:"getDebugPrograms",value:function(){return[this.nodeProgram,this.edgeProgram,this.internals.labelProgram,this.internals.edgeLabelProgram,this.internals.edgeLabelBackgroundProgram,this.internals.backdropProgram,this.internals.labelBackgroundProgram,this.internals.attachmentProgram].filter(function(t){return t!==null})}},{key:"logRenderStats",value:function(t){var r={},i=U(t),o;try{for(i.s();!(o=i.n()).done;){var s=o.value;r[s.constructor.name]=O({},s.debugStats)}}catch(l){i.e(l)}finally{i.f()}console.log("[sigma] DEBUG_logRenderStats: frame #".concat(this.frameId)),console.table(r)}},{key:"getGpuTimerExtension",value:function(){return this.gpuTimerExt===void 0&&(this.gpuTimerExt=this.webGLContext.getExtension("EXT_disjoint_timer_query_webgl2"),this.gpuTimerExt||console.warn("Sigma: DEBUG_gpuTimerQueries is enabled, but this browser/driver doesn't support EXT_disjoint_timer_query_webgl2.")),this.gpuTimerExt}},{key:"beginGpuTimerQuery",value:function(){var t=this.getGpuTimerExtension();if(t){var r=this.webGLContext,i=r.createQuery();i&&(r.beginQuery(t.TIME_ELAPSED_EXT,i),this.activeGpuTimerQuery=i)}}},{key:"endGpuTimerQuery",value:function(){!this.gpuTimerExt||!this.activeGpuTimerQuery||(this.webGLContext.endQuery(this.gpuTimerExt.TIME_ELAPSED_EXT),this.pendingGpuTimerQueries.push({query:this.activeGpuTimerQuery,frameId:this.frameId}),this.activeGpuTimerQuery=null)}},{key:"pollGpuTimerQueries",value:function(){if(this.pendingGpuTimerQueries.length!==0){var t=this.webGLContext,r=this.gpuTimerExt;if(!r){this.pendingGpuTimerQueries.forEach(function(h){var c=h.query;return t.deleteQuery(c)}),this.pendingGpuTimerQueries=[];return}var i=t.getParameter(r.GPU_DISJOINT_EXT),o=[],s=U(this.pendingGpuTimerQueries),l;try{for(s.s();!(l=s.n()).done;){var u=l.value;if(!t.getQueryParameter(u.query,t.QUERY_RESULT_AVAILABLE)){o.push(u);continue}if(!i){var d=t.getQueryParameter(u.query,t.QUERY_RESULT);console.log("[sigma] DEBUG_gpuTimerQueries: frame #".concat(u.frameId," GPU time = ").concat((d/1e6).toFixed(2),"ms"))}t.deleteQuery(u.query)}}catch(h){s.e(h)}finally{s.f()}this.pendingGpuTimerQueries=o}}},{key:"postEvaluateNode",value:function(t,r,i){var o=t;o.x===void 0&&(o.x=r.x),o.y===void 0&&(o.y=r.y),t.highlighted=i.isHighlighted;for(var s=0,l=this.nodeVariableEntries.length;s<l;s++){var u,d,h=ne(this.nodeVariableEntries[s],2),c=h[0],f=h[1];o[c]=(u=(d=o[c])!==null&&d!==void 0?d:r[c])!==null&&u!==void 0?u:f.default}}},{key:"addNode",value:function(t){var r=this.internals.graph.getNodeAttributes(t),i=this.stateManager.getNodeState(t),o=this.internals.nodeDataCache[t]||{};if(qa(this.stylesDeclaration.nodes,r,i,this.stateManager.graphState,this.internals.graph,o),this.postEvaluateNode(o,r,i),this.nodeReducer){var s=this.nodeReducer(t,o,r,i,this.stateManager.graphState,this.internals.graph);o=O(O({},o),s)}if(typeof o.x!="number"||typeof o.y!="number")throw new Error('Sigma: could not find a valid position (x, y) for node "'.concat(t,'". ')+"Provide coordinates via node attributes, styles, or a nodeReducer.");this.internals.nodeShapeMap?(!o.shape||!(o.shape in this.internals.nodeShapeMap))&&(o.shape=Object.keys(this.internals.nodeShapeMap)[0]):this.nodeShapeSlug&&(o.shape=this.nodeShapeSlug),this.internals.nodeDataCache[t]=o,this.nodeGraphCoords[t]={x:o.x,y:o.y},Tt(this.internals.nodesWithForcedLabels,t,ut(o)),Tt(this.internals.nodesWithBackdrop,t,Za(o)),this.itemBuckets.nodes.set(t,o.depth)}},{key:"updateNode",value:function(t){this.addNode(t);var r=this.internals.nodeDataCache[t];this.normalizationFunction.applyTo(r)}},{key:"removeNode",value:function(t){ko(this.pickingState,"node",t),this.itemBuckets.nodes.remove(t),delete this.internals.nodeDataCache[t],delete this.nodeGraphCoords[t],delete this.nodeProgramIndex[t],this.internals.nodeDataTexture.free(t),this.internals.dragManager.removeNode(t),this.stateManager.removeNode(t),this.internals.nodesWithForcedLabels.delete(t),this.internals.nodesWithBackdrop.delete(t)}},{key:"postEvaluateEdge",value:function(t,r){for(var i=t,o=0,s=this.edgeVariableEntries.length;o<s;o++){var l,u,d=ne(this.edgeVariableEntries[o],2),h=d[0],c=d[1];i[h]=(l=(u=i[h])!==null&&u!==void 0?u:r[h])!==null&&l!==void 0?l:c.default}}},{key:"applyEdgeSpread",value:function(t,r,i){var o;if(!(i.parallelCount<=1)){var s=this.internals.graph.source(t),l=this.internals.graph.target(t),u=s===l,d=u?r.selfLoopPath||r.path:r.parallelPath||r.path,h=d?this.edgePathsByName.get(d):void 0;if(h!=null&&h.spread){var c=(o=r.parallelSpread)!==null&&o!==void 0?o:.25,f=h.spread.compute(i.parallelIndex,i.parallelCount,c);!u&&this.internals.graph.isDirected(t)&&s>l&&(f=-f),r[h.spread.variable]=f}}}},{key:"addEdge",value:function(t){var r=this.internals.graph.getEdgeAttributes(t),i=this.stateManager.getEdgeState(t),o={};if(Xa(this.stylesDeclaration.edges,r,i,this.stateManager.graphState,this.internals.graph,o),this.postEvaluateEdge(o,r),this.edgeReducer){var s=this.edgeReducer(t,o,r,i,this.stateManager.graphState,this.internals.graph);o=O(O({},o),s)}this.applyEdgeSpread(t,o,i),this.internals.edgeDataCache[t]=o,Tt(this.internals.edgesWithForcedLabels,t,ut(o)),this.itemBuckets.edges.set(t,o.depth)}},{key:"updateEdge",value:function(t){this.addEdge(t)}},{key:"removeEdge",value:function(t){this.itemBuckets.edges.remove(t),delete this.internals.edgeDataCache[t],delete this.edgeProgramIndex[t],delete this.edgeTextureIndexCache[t],this.internals.edgeDataTexture.free(t),ko(this.pickingState,"edge",t),this.stateManager.removeEdge(t),this.internals.edgesWithForcedLabels.delete(t)}},{key:"clearNodeIndices",value:function(){var t;this.labelRenderer.resetLabelGrid(),this.autoRescaleFrozen||(this.nodeExtent={x:[0,1],y:[0,1]}),this.internals.nodeDataCache={},this.nodeGraphCoords={},this.nodeProgramIndex={},(t=this.internals.nodeDataTexture)===null||t===void 0||t.clear(),this.internals.nodesWithForcedLabels.clear(),this.internals.nodesWithBackdrop.clear(),this.prevNodeVisibilities={},this.itemBuckets.nodes.clearAll(),this.depthRanges.nodes={},this.nodeBaseDepth={}}},{key:"clearEdgeIndices",value:function(){var t;this.internals.edgeDataCache={},this.edgeProgramIndex={},this.edgeTextureIndexCache={},(t=this.internals.edgeDataTexture)===null||t===void 0||t.clear(),this.internals.edgesWithForcedLabels.clear(),this.itemBuckets.edges.clearAll(),this.depthRanges.edges={},this.edgeBaseDepth={},this.edgeGroups.clear()}},{key:"clearIndices",value:function(){this.clearEdgeIndices(),this.clearNodeIndices()}},{key:"clearNodeState",value:function(){this.labelRenderer.resetFrame(),this.internals.nodesWithBackdrop.clear(),this.internals.dragManager.clear(),this.autoRescaleFrozen=!1,this.stateManager.clearNodes(),Ta(this.pickingState,"node")}},{key:"clearEdgeState",value:function(){this.labelRenderer.clearEdgeLabels(),this.stateManager.clearEdges(),Ta(this.pickingState,"edge")}},{key:"clearState",value:function(){this.clearEdgeState(),this.clearNodeState(),this.stateManager.resetGraphState()}},{key:"addNodeToProgram",value:function(t,r){var i,o=this.internals.nodeDataCache[t];this.internals.nodeDataTexture.allocate(t),(i=this.internals.nodeDataTexture).updateNode.apply(i,[t,o.x,o.y,o.size,this.getNodeShapeId(o)].concat(K(ra(o)),[o.color]));var s=this.internals.nodeDataTexture.getIndex(t);this.nodeProgram.process(Rt(this.pickingState,"node",t),r,o,s),this.nodeProgramIndex[t]=r}},{key:"addEdgeToProgram",value:function(t,r){var i,o,s=this.internals.edgeDataCache[t],l=this.internals.graph.source(t),u=this.internals.graph.target(t),d=this.internals.edgeDataTexture.allocate(t);this.edgeTextureIndexCache[t]=d;var h=l===u,c=!h&&((i=(o=this.stateManager.getEdgeState(t))===null||o===void 0?void 0:o.parallelCount)!==null&&i!==void 0?i:1)>1,f=this.edgeProgram.resolveEdgeIds(s,h,c),g=f.pathId,y=f.headId,m=f.tailId,v=f.headLengthRatio,p=f.tailLengthRatio;this.internals.edgeDataTexture.updateEdge(t,this.internals.nodeDataTexture.getIndex(l),this.internals.nodeDataTexture.getIndex(u),s.size,v,p,g,y,m),this.edgeProgram.process(Rt(this.pickingState,"edge",t),r,this.internals.nodeDataCache[l],this.internals.nodeDataCache[u],s,d),this.edgeProgramIndex[t]=r}},{key:"getRenderParams",value:function(){return{frameId:this.frameId,matrix:this.matrix,invMatrix:this.invMatrix,width:this.width,height:this.height,pixelRatio:this.internals.pixelRatio,zoomRatio:this.camera.ratio,cameraAngle:this.camera.angle,sizeRatio:1/this.scaleSize(),correctionRatio:this.correctionRatio,downSizingRatio:this.internals.settings.pickingDownSizingRatio,minEdgeThickness:this.internals.settings.minEdgeThickness,antiAliasingFeather:this.internals.settings.antiAliasingFeather,nodePickingPadding:this.internals.settings.nodePickingPadding,edgePickingPadding:this.internals.settings.edgePickingPadding,labelPickingPadding:this.internals.settings.labelPickingPadding,nodeDataTextureUnit:Bo,nodeDataTextureWidth:this.internals.nodeDataTexture.getTextureWidth(),nodeFrameTextureUnit:Wo,nodeFrameTextureWidth:this.internals.nodeFrameTexture.getTextureWidth(),edgeDataTextureUnit:Mo,edgeDataTextureWidth:this.internals.edgeDataTexture.getTextureWidth(),edgeFrameTextureUnit:No,edgeFrameTextureWidth:this.internals.edgeFrameTexture.getTextureWidth(),pickingFrameBuffer:this.pickingFrameBuffer,labelPixelSnapping:this.internals.settings.labelPixelSnapping?1:0}}},{key:"getStagePadding",value:function(){var t=this.internals.settings,r=t.stagePadding,i=t.autoRescale;return i&&r||0}},{key:"getLayerElement",value:function(t){if(t==="mouse")return this.mouseLayer;var r=this.extraElements[t];if(!r)throw new Error('Sigma: layer "'.concat(t,'" does not exist'));return r}},{key:"initWebGLContext",value:function(){var t=this,r=this.createWebGLContext("stage");this.stageCanvas=this.extraElements.stage,this.webGLContext=r,this.stageCanvas.addEventListener("webglcontextlost",function(i){t.webGLContext&&(i.preventDefault(),t.contextLost=!0,t.renderFrame&&(cancelAnimationFrame(t.renderFrame),t.renderFrame=null),t.gpuTimerExt=void 0,t.activeGpuTimerQuery=null,t.pendingGpuTimerQueries=[],t.emit("webglContextLost"))}),this.stageCanvas.addEventListener("webglcontextrestored",function(){requestAnimationFrame(function(){t.webGLContext&&!t.webGLContext.isContextLost()&&t.restoreWebGLContext()})}),this.initPickingFramebuffer()}},{key:"initPickingFramebuffer",value:function(){var t=this.webGLContext,r=t.createFramebuffer();if(!r)throw new Error("Sigma: cannot create picking frame buffer");t.bindFramebuffer(t.FRAMEBUFFER,r);var i=t.createTexture();if(!i)throw new Error("Sigma: cannot create picking texture");t.bindTexture(t.TEXTURE_2D,i),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,i,0);var o=t.createRenderbuffer();if(!o)throw new Error("Sigma: cannot create picking depth buffer");if(t.bindRenderbuffer(t.RENDERBUFFER,o),t.renderbufferStorage(t.RENDERBUFFER,t.DEPTH_COMPONENT16,1,1),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.RENDERBUFFER,o),t.checkFramebufferStatus(t.FRAMEBUFFER)!==t.FRAMEBUFFER_COMPLETE)throw new Error("Sigma: picking framebuffer is not complete");t.bindFramebuffer(t.FRAMEBUFFER,null),this.pickingFrameBuffer=r,this.pickingTexture=i,this.pickingDepthBuffer=o}},{key:"initPrograms",value:function(t,r){var i=this,o=this.webGLContext,s=go(o,this.pickingFrameBuffer,i,t==null?void 0:t.nodes,r.antialiasNodes),l=s.nodeProgram,u=s.labelProgram,d=s.backdropProgram,h=s.labelBackgroundProgram,c=s.attachmentProgram,f=s.framePass,g=s.shapeSlug,y=s.shapeNameToIndex,m=s.shapeGlobalIds,v=s.variables;this.nodeProgram=l,this.nodeFramePass=f,this.nodeVariableEntries=Object.entries(v),g&&(this.nodeShapeSlug=g);var p=vo(o,this.pickingFrameBuffer,i,t==null?void 0:t.edges,r.antialiasEdges,t==null?void 0:t.nodes),b=p.edgeProgram,T=p.createLabelPrograms,_=p.framePass,E=p.variables,w=p.paths;return this.createEdgeLabelPrograms=T,this.edgeProgram=b,this.edgeFramePass=_,this.edgeVariableEntries=Object.entries(E),this.edgePathsByName=new Map(w.map(function(A){return[A.name,A]})),{labelProgram:u,edgeLabelProgram:null,edgeLabelBackgroundProgram:null,backdropProgram:d,labelBackgroundProgram:h,attachmentProgram:c,nodeShapeMap:y!=null?y:null,nodeGlobalShapeIds:m!=null?m:null}}},{key:"restoreWebGLContext",value:function(){var t,r,i,o,s,l=this.internals;this.initPickingFramebuffer(),(t=l.nodeDataTexture)===null||t===void 0||t.restore(),(r=l.nodeFrameTexture)===null||r===void 0||r.restore(),(i=l.edgeDataTexture)===null||i===void 0||i.restore(),(o=l.edgeFrameTexture)===null||o===void 0||o.restore(),(s=l.attachmentManager)===null||s===void 0||s.restore(),l.hoverResolver.reset(),Object.assign(l,this.initPrograms(l.primitives,l.settings));var u=U(this.customLayerPrograms.values()),d;try{for(u.s();!(d=u.n()).done;){var h=d.value;h.program.kill(),h.program=h.factory(this.webGLContext)}}catch(c){u.e(c)}finally{u.f()}this.contextLost=!1,this.emit("webglContextRestored"),this.refresh()}},{key:"createLayer",value:function(t,r){var i=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};if(this.extraElements[t])throw new Error('Sigma: a layer named "'.concat(t,'" already exists'));var o=qt(r,{position:"absolute"},{class:"sigma-".concat(t)});return i.style&&Object.assign(o.style,i.style),this.extraElements[t]=o,"beforeLayer"in i&&i.beforeLayer?this.getLayerElement(i.beforeLayer).before(o):"afterLayer"in i&&i.afterLayer?this.getLayerElement(i.afterLayer).after(o):this.container.appendChild(o),o}},{key:"createCanvas",value:function(t){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};return this.createLayer(t,"canvas",r)}},{key:"createWebGLContext",value:function(t){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=this.createCanvas(t,r);r.hidden&&i.remove();var o=i.getContext("webgl2",O({preserveDrawingBuffer:!1,antialias:!1,depth:!0},r));if(!o)throw new Error("Sigma: WebGL 2 is not supported by your browser. Please use a modern browser (Chrome 56+, Firefox 51+, Safari 15+, Edge 79+).");return o.blendFunc(o.ONE,o.ONE_MINUS_SRC_ALPHA),o}},{key:"killLayer",value:function(t){if(t==="stage"||t==="mouse")throw new Error('Sigma: cannot kill built-in layer "'.concat(t,'"'));var r=this.extraElements[t];if(!r)throw new Error("Sigma: cannot kill layer ".concat(t,", which does not exist"));return r.remove(),delete this.extraElements[t],this}},{key:"getWebGLContext",value:function(){if(!this.webGLContext)throw new Error("Sigma: WebGL context is not available");return this.webGLContext}},{key:"getNodeDataTexture",value:function(){if(!this.internals.nodeDataTexture)throw new Error("Sigma: node data texture is not available");return this.internals.nodeDataTexture}},{key:"getNormalizationFunction",value:function(){return this.normalizationFunction}},{key:"addCustomLayerProgram",value:function(t,r,i){var o;if(!this.depthLayers.includes(r))throw new Error('Sigma: cannot add custom layer program at depth "'.concat(r,'", ')+"it must be declared in primitives.depthLayers. Current layers: ".concat(this.depthLayers.join(", ")));(o=this.customLayerPrograms.get(t))===null||o===void 0||o.program.kill();var s=i(this.webGLContext);return this.customLayerPrograms.set(t,{depth:r,factory:i,program:s}),s.cacheData&&s.cacheData(),this.scheduleRender(),this}},{key:"removeCustomLayerProgram",value:function(t){var r=this.customLayerPrograms.get(t);return r&&(r.program.kill(),this.customLayerPrograms.delete(t),this.scheduleRender()),this}},{key:"getCamera",value:function(){return this.camera}},{key:"setCamera",value:function(t){return this.camera.cancelAnimation(),this.unbindCameraHandlers(),this.camera=t,this.bindCameraHandlers(),this.scheduleRender(),this}},{key:"getContainer",value:function(){return this.container}},{key:"getGraph",value:function(){return this.internals.graph}},{key:"setGraph",value:function(t){return t===this.internals.graph?this:(this.stateManager.pruneNodes(function(r){return t.hasNode(r)}),this.stateManager.pruneEdges(function(r){return t.hasEdge(r)}),this.unbindGraphHandlers(),this.checkEdgesEventsFrame!==null&&(cancelAnimationFrame(this.checkEdgesEventsFrame),this.checkEdgesEventsFrame=null),this.internals.graph=t,this.autoRescaleFrozen=!1,this.bindGraphHandlers(),this.refresh(),this)}},{key:"getMouseCaptor",value:function(){return this.mouseCaptor}},{key:"getTouchCaptor",value:function(){return this.touchCaptor}},{key:"getDimensions",value:function(){return{width:this.width,height:this.height}}},{key:"getGraphDimensions",value:function(){var t=this.customBBox||this.nodeExtent;return{width:t.x[1]-t.x[0]||1,height:t.y[1]-t.y[0]||1}}},{key:"getNodeDisplayData",value:function(t){var r=this.internals.nodeDataCache[t];return r?Object.assign({},r):void 0}},{key:"getEdgeDisplayData",value:function(t){var r=this.internals.edgeDataCache[t];return r?Object.assign({},r):void 0}},{key:"getNodeState",value:function(t){return this.stateManager.getNodeState(t)}},{key:"getEdgeState",value:function(t){return this.stateManager.getEdgeState(t)}},{key:"getGraphState",value:function(){return this.stateManager.getGraphState()}},{key:"setNodeState",value:function(t,r){return this.stateManager.setNodeState(t,r),this}},{key:"setEdgeState",value:function(t,r){return this.stateManager.setEdgeState(t,r),this}},{key:"setGraphState",value:function(t){return this.stateManager.setGraphState(t),this}},{key:"_setPanning",value:function(t){this.stateManager.setGraphState({isPanning:t})}},{key:"_setZooming",value:function(t){this.stateManager.setGraphState({isZooming:t})}},{key:"_hasNodeDrag",value:function(){var t=this.internals.dragManager;return!!(t.pendingNode||t.session)}},{key:"_showGestureHint",value:function(t){var r=this.internals.settings;r.gestureTarget==="shared"&&(this.gestureHint=this.gestureHint||new tc(this.container),this.gestureHint.show(t,r))}},{key:"setNodesState",value:function(t,r){return this.stateManager.setNodesState(t,r),this}},{key:"setEdgesState",value:function(t,r){return this.stateManager.setEdgesState(t,r),this}},{key:"updateContainerCursor",value:function(){var t=this.stateManager.hovered,r=this.resolvedStageStyle.cursor||"";this.container.style.cursor=t&&Mh(this.internals,t)||r}},{key:"refreshStageStyle",value:function(){this.resolvedStageStyle=Ya(this.stylesDeclaration.stage,this.stateManager.graphState),this.resolvedStageStyle.background!==void 0&&(this.container.style.backgroundColor=this.resolvedStageStyle.background),this.updateContainerCursor()}},{key:"getNodeDisplayedLabels",value:function(){return new Set(this.labelRenderer.displayedNodeLabels)}},{key:"getEdgeDisplayedLabels",value:function(){return new Set(this.labelRenderer.displayedEdgeLabels)}},{key:"getSettings",value:function(){return O({},this.internals.settings)}},{key:"getSetting",value:function(t){return this.internals.settings[t]}},{key:"getStyles",value:function(){return O({},this.stylesDeclaration)}},{key:"getPrimitives",value:function(){return O({},this.internals.primitives)}},{key:"setSetting",value:function(t,r){return this.internals.settings[t]=r,sa(this.internals.settings),this.handleSettingsUpdate(),this.scheduleRefresh(),this}},{key:"updateSetting",value:function(t,r){return this.setSetting(t,r(this.internals.settings[t])),this}},{key:"setSettings",value:function(t){return this.internals.settings=O(O({},this.internals.settings),t),sa(this.internals.settings),this.handleSettingsUpdate(),this.scheduleRefresh(),this}},{key:"resize",value:function(t){var r=this.width,i=this.height;if(this.width=this.container.offsetWidth,this.height=this.container.offsetHeight,this.internals.pixelRatio=gn(),this.width===0)if(this.internals.settings.allowInvalidContainer)this.width=1;else throw new Error("Sigma: Container has no width. You can set the allowInvalidContainer setting to true to stop seeing this error.");if(this.height===0)if(this.internals.settings.allowInvalidContainer)this.height=1;else throw new Error("Sigma: Container has no height. You can set the allowInvalidContainer setting to true to stop seeing this error.");if(!t&&r===this.width&&i===this.height)return this;this.labelRenderer.labelsDirty=!0;for(var o=0,s=[this.mouseLayer].concat(K(Object.values(this.extraElements)));o<s.length;o++){var l=s[o];l.style.width=this.width+"px",l.style.height=this.height+"px"}return this.webGLContext&&(this.stageCanvas.setAttribute("width",this.width*this.internals.pixelRatio+"px"),this.stageCanvas.setAttribute("height",this.height*this.internals.pixelRatio+"px"),this.webGLContext.viewport(0,0,this.width*this.internals.pixelRatio,this.height*this.internals.pixelRatio)),this.emit("resize"),this}},{key:"clear",value:function(){return this.emit("beforeClear"),this.webGLContext.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER,null),this.webGLContext.clear(WebGLRenderingContext.COLOR_BUFFER_BIT),this.emit("afterClear"),this}},{key:"scheduleStateRefresh",value:function(){this.needToRefreshState=!0,this.scheduleRender()}},{key:"refreshState",value:function(){var t=this,r;this.stateManager.flushGraphStateFlags();var i=this.stateManager.graphStateChanged&&this.internals.nodeStyleAnalysis.dependency==="graph-state",o=this.stateManager.graphStateChanged&&this.edgeStyleAnalysis.dependency==="graph-state",s=!1;if(i)this.internals.graph.forEachNode(function(g){t.refreshNodeState(g)&&(s=!0)});else if(this.internals.nodeStyleAnalysis.dependency!=="static"){var l=U(this.stateManager.dirtyNodes),u;try{for(l.s();!(u=l.n()).done;){var d=u.value;this.refreshNodeState(d)&&(s=!0)}}catch(g){l.e(g)}finally{l.f()}}if(o)this.internals.graph.forEachEdge(function(g){t.refreshEdgeState(g)&&(s=!0)});else if(this.edgeStyleAnalysis.dependency!=="static"){var h=U(this.stateManager.dirtyEdges),c;try{for(h.s();!(c=h.n()).done;){var f=c.value;this.refreshEdgeState(f)&&(s=!0)}}catch(g){h.e(g)}finally{h.f()}}this.stateManager.graphStateChanged&&(r=this.stylesDeclaration)!==null&&r!==void 0&&r.stage&&this.refreshStageStyle(),this.stateManager.clearDirtyTracking(),s&&(this.pendingProcess="full")}},{key:"refreshNodeState",value:function(t){var r=this.internals.nodeDataCache[t];if(!r||this.nodeReducer){var i,o,s,l,u=(i=this.internals.nodeDataCache[t])===null||i===void 0?void 0:i.depth,d=(o=this.internals.nodeDataCache[t])===null||o===void 0?void 0:o.zIndex,h=(s=this.internals.nodeDataCache[t])===null||s===void 0?void 0:s.labelAttachment;this.updateNode(t);var c=this.internals.nodeDataCache[t];this.internals.attachmentManager&&c.labelAttachment!==h&&this.internals.attachmentManager.invalidateNode(t);var f;this.internals.nodeShapeMap&&this.internals.nodeGlobalShapeIds&&c.shape&&c.shape in this.internals.nodeShapeMap?f=this.internals.nodeGlobalShapeIds[this.internals.nodeShapeMap[c.shape]]:f=bn(c.shape||"circle"),(l=this.internals.nodeDataTexture).updateNode.apply(l,[t,c.x,c.y,c.size,f].concat(K(ra(c)),[c.color])),u&&c.depth!==u&&this.updateNodeDepthRanges(t,u,c.depth);var g=this.nodeProgramIndex[t];return g!==void 0&&(this.addNodeToProgram(t,g),this.nodeProgram.invalidateBuffers()),d!==void 0&&c.zIndex!==d}var y=this.internals.graph.getNodeAttributes(t),m=this.stateManager.getNodeState(t),v=r.size,p=r.shape,b=r.depth,T=r.zIndex,_=r.labelAttachment,E=r.rotationAlignment,w=r.labelRotationAlignment,A=r.color;qa(this.stylesDeclaration.nodes,y,m,this.stateManager.graphState,this.internals.graph,r),this.postEvaluateNode(r,y,m);var S=this.nodeGraphCoords[t],k=r.x!==S.x||r.y!==S.y;if(k&&(S.x=r.x,S.y=r.y),this.normalizationFunction.applyTo(r),this.internals.nodeShapeMap?(!r.shape||!(r.shape in this.internals.nodeShapeMap))&&(r.shape=Object.keys(this.internals.nodeShapeMap)[0]):this.nodeShapeSlug&&(r.shape=this.nodeShapeSlug),this.internals.attachmentManager&&r.labelAttachment!==_&&this.internals.attachmentManager.invalidateNode(t),Tt(this.internals.nodesWithForcedLabels,t,ut(r)),Tt(this.internals.nodesWithBackdrop,t,Za(r)),k||r.size!==v||r.shape!==p||r.rotationAlignment!==E||r.labelRotationAlignment!==w||r.color!==A){var z,C;this.internals.nodeShapeMap&&this.internals.nodeGlobalShapeIds&&r.shape&&r.shape in this.internals.nodeShapeMap?C=this.internals.nodeGlobalShapeIds[this.internals.nodeShapeMap[r.shape]]:C=bn(r.shape||"circle"),(z=this.internals.nodeDataTexture).updateNode.apply(z,[t,r.x,r.y,r.size,C].concat(K(ra(r)),[r.color]))}this.itemBuckets.nodes.set(t,r.depth),r.depth!==b&&this.updateNodeDepthRanges(t,b,r.depth);var N=this.nodeProgramIndex[t];return N!==void 0&&(this.addNodeToProgram(t,N),this.nodeProgram.invalidateBuffers()),r.zIndex!==T}},{key:"refreshEdgeState",value:function(t){var r=this.internals.edgeDataCache[t];if(!r||this.edgeReducer){var i=r==null?void 0:r.depth,o=r==null?void 0:r.zIndex;this.updateEdge(t);var s=this.internals.edgeDataCache[t];i&&s.depth!==i&&this.updateEdgeDepthRanges(t,i,s.depth);var l=this.edgeProgramIndex[t];return l!==void 0&&(this.addEdgeToProgram(t,l),this.edgeProgram.invalidateBuffers()),o!==void 0&&s.zIndex!==o}var u=this.internals.graph.getEdgeAttributes(t),d=this.stateManager.getEdgeState(t),h=r.depth,c=r.zIndex,f=r.size,g=r.path,y=r.selfLoopPath,m=r.parallelPath,v=r.head,p=r.tail;Xa(this.stylesDeclaration.edges,u,d,this.stateManager.graphState,this.internals.graph,r),this.postEvaluateEdge(r,u),this.applyEdgeSpread(t,r,d),Tt(this.internals.edgesWithForcedLabels,t,ut(r)),this.itemBuckets.edges.set(t,r.depth),r.depth!==h&&this.updateEdgeDepthRanges(t,h,r.depth);var b=this.edgeProgramIndex[t];if(b!==void 0){var T=r.size!==f||r.path!==g||r.selfLoopPath!==y||r.parallelPath!==m||r.head!==v||r.tail!==p;if(T)this.addEdgeToProgram(t,b),this.edgeProgram.invalidateBuffers();else{var _=this.internals.graph.source(t),E=this.internals.graph.target(t),w=this.internals.nodeDataCache[_],A=this.internals.nodeDataCache[E],S=this.edgeTextureIndexCache[t];this.edgeProgram.process(Rt(this.pickingState,"edge",t),b,w,A,r,S),this.edgeProgram.invalidateBuffers()}}return r.zIndex!==c}},{key:"refresh",value:function(t){var r=this,i=(t==null?void 0:t.skipIndexation)!==void 0?t==null?void 0:t.skipIndexation:!1,o=(t==null?void 0:t.schedule)!==void 0?t.schedule:!1,s=!t||!t.partialGraph;if(s)this.clearEdgeIndices(),this.clearNodeIndices(),this.internals.graph.forEachNode(function(w){return r.addNode(w)}),this.edgeGroups.rebuild(),this.internals.graph.forEachEdge(function(w){return r.addEdge(w)}),this.pendingProcess="full";else{for(var l,u,d=((l=t.partialGraph)===null||l===void 0?void 0:l.nodes)||[],h=0,c=(d==null?void 0:d.length)||0;h<c;h++){var f,g,y=""+d[h],m=(f=this.internals.nodeDataCache[y])===null||f===void 0?void 0:f.labelAttachment;if(this.updateNode(y),this.internals.attachmentManager&&((g=this.internals.nodeDataCache[y])!==null&&g!==void 0&&g.labelAttachment||m)&&this.internals.attachmentManager.invalidateNode(y),i){var v=this.nodeProgramIndex[y];if(v===void 0)throw new Error('Sigma: node "'.concat(y,`" can't be repaint`));this.addNodeToProgram(y,v)}}i&&d.length>0&&(this.nodeProgram.invalidateBuffers(),this.labelRenderer.labelsDirty=!0);for(var p=(t==null||(u=t.partialGraph)===null||u===void 0?void 0:u.edges)||[],b=0,T=p.length;b<T;b++){var _=""+p[b];if(this.updateEdge(_),i){var E=this.edgeProgramIndex[_];if(E===void 0)throw new Error('Sigma: edge "'.concat(_,`" can't be repaint`));this.addEdgeToProgram(_,E)}}i&&p.length>0&&(this.edgeProgram.invalidateBuffers(),this.labelRenderer.labelsDirty=!0),!i&&this.pendingProcess!=="full"&&(this.pendingProcess=p.length>0?"full":"nodes")}return o?this.scheduleRender():this.render(),this}},{key:"scheduleRender",value:function(){var t=this;return this.renderFrame||(this.renderFrame=requestAnimationFrame(function(){t.render()})),this}},{key:"scheduleRefresh",value:function(t){return this.refresh(O(O({},t),{},{schedule:!0}))}},{key:"getViewportZoomedState",value:function(t,r){var i=this.camera.getState(),o=i.ratio,s=i.angle,l=i.x,u=i.y,d=this.internals.settings,h=d.minCameraRatio,c=d.maxCameraRatio;typeof c=="number"&&(r=Math.min(r,c)),typeof h=="number"&&(r=Math.max(r,h));var f=r/o,g={x:this.width/2,y:this.height/2},y=this.viewportToFramedGraph(t),m=this.viewportToFramedGraph(g);return{angle:s,x:(y.x-m.x)*(1-f)+l,y:(y.y-m.y)*(1-f)+u,ratio:r}}},{key:"viewRectangle",value:function(){var t=this.viewportToFramedGraph({x:0,y:0}),r=this.viewportToFramedGraph({x:this.width,y:0}),i=this.viewportToFramedGraph({x:0,y:this.height});return{x1:t.x,y1:t.y,x2:r.x,y2:r.y,height:r.y-i.y}}},{key:"framedGraphToViewport",value:function(t){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=!!r.cameraState||!!r.viewportDimensions||!!r.graphDimensions||!!r.padding,o=r.matrix||(i?st(r.cameraState||this.camera.getState(),r.viewportDimensions||this.getDimensions(),r.graphDimensions||this.getGraphDimensions(),r.padding||this.getStagePadding()):this.matrix),s=Ut(o,t);return{x:(1+s.x)*this.width/2,y:(1-s.y)*this.height/2}}},{key:"viewportToFramedGraph",value:function(t){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=!!r.cameraState||!!r.viewportDimensions||!!r.graphDimensions||!!r.padding,o=r.matrix||(i?st(r.cameraState||this.camera.getState(),r.viewportDimensions||this.getDimensions(),r.graphDimensions||this.getGraphDimensions(),r.padding||this.getStagePadding(),!0):this.invMatrix),s=Ut(o,{x:t.x/this.width*2-1,y:1-t.y/this.height*2});return isNaN(s.x)&&(s.x=0),isNaN(s.y)&&(s.y=0),s}},{key:"viewportToGraph",value:function(t){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};return this.normalizationFunction.inverse(this.viewportToFramedGraph(t,r))}},{key:"graphToViewport",value:function(t){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};return this.framedGraphToViewport(this.normalizationFunction(t),r)}},{key:"graphToFramedGraph",value:function(t){return this.normalizationFunction(t)}},{key:"framedGraphToGraph",value:function(t){return this.normalizationFunction.inverse(t)}},{key:"getGraphToViewportRatio",value:function(){var t={x:0,y:0},r={x:1,y:1},i=Math.sqrt(Math.pow(t.x-r.x,2)+Math.pow(t.y-r.y,2)),o=this.graphToViewport(t),s=this.graphToViewport(r),l=Math.sqrt(Math.pow(o.x-s.x,2)+Math.pow(o.y-s.y,2));return l/i}},{key:"computeNodeExtent",value:function(){var t=this.nodeGraphCoords,r=Object.keys(t);if(!r.length)return{x:[0,1],y:[0,1]};for(var i=1/0,o=-1/0,s=1/0,l=-1/0,u=0,d=r.length;u<d;u++){var h=t[r[u]],c=h.x,f=h.y;c<i&&(i=c),c>o&&(o=c),f<s&&(s=f),f>l&&(l=f)}return{x:[i,o],y:[s,l]}}},{key:"getBBox",value:function(){return this.nodeExtent}},{key:"getCustomBBox",value:function(){return this.customBBox}},{key:"setCustomBBox",value:function(t){return this.customBBox=t,this.scheduleRender(),this}},{key:"kill",value:function(){var t,r,i,o,s;this.emit("kill"),this.removeAllListeners(),this.camera.cancelAnimation(),this.unbindCameraHandlers(),window.removeEventListener("resize",this.activeListeners.handleResize),this.mouseCaptor.kill(),this.touchCaptor.kill(),this.internals.hoverResolver.kill(),this.unbindGraphHandlers(),this.clearIndices(),this.clearState(),this.internals.nodeDataCache={},this.internals.edgeDataCache={},this.renderFrame&&(cancelAnimationFrame(this.renderFrame),this.renderFrame=null);for(var l=this.container;l.firstChild;)l.removeChild(l.firstChild);this.nodeProgram.kill(),this.nodeFramePass.kill(),this.edgeProgram.kill(),this.edgeFramePass.kill(),this.internals.labelProgram.kill(),(t=this.internals.edgeLabelProgram)===null||t===void 0||t.kill(),(r=this.internals.edgeLabelBackgroundProgram)===null||r===void 0||r.kill(),this.internals.backdropProgram.kill(),this.internals.labelBackgroundProgram.kill(),(i=this.internals.attachmentProgram)===null||i===void 0||i.kill(),(o=this.internals.attachmentManager)===null||o===void 0||o.kill(),this.internals.attachmentProgram=null,this.internals.attachmentManager=null;var u=U(this.customLayerPrograms.values()),d;try{for(u.s();!(d=u.n()).done;){var h=d.value.program;h.kill()}}catch(g){u.e(g)}finally{u.f()}if(this.customLayerPrograms.clear(),this.sdfAtlas&&(this.sdfAtlas=null),this.internals.nodeDataTexture&&(this.internals.nodeDataTexture.kill(),this.internals.nodeDataTexture=null),this.internals.nodeFrameTexture&&(this.internals.nodeFrameTexture.kill(),this.internals.nodeFrameTexture=null),this.internals.edgeDataTexture&&(this.internals.edgeDataTexture.kill(),this.internals.edgeDataTexture=null),this.internals.edgeFrameTexture&&(this.internals.edgeFrameTexture.kill(),this.internals.edgeFrameTexture=null),this.webGLContext){var c;(c=this.webGLContext.getExtension("WEBGL_lose_context"))===null||c===void 0||c.loseContext(),this.webGLContext=null}(s=this.gestureHint)===null||s===void 0||s.kill(),this.gestureHint=null,this.mouseLayer.remove();for(var f in this.extraElements)this.extraElements[f].remove();this.extraElements={}}},{key:"scaleSize",value:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:1,r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:this.camera.ratio;return t/this.internals.settings.zoomToSizeRatioFunction(r)*(this.getSetting("itemSizesReference")==="positions"?r*this.graphToViewportRatio:1)}},{key:"getStageCanvas",value:function(){return this.stageCanvas}},{key:"getMouseLayer",value:function(){return this.mouseLayer}}])})(aa),Vo=uc;var _s=Qe(ns()),xs=Qe(os()),Ts=Qe(bs());return Ls(Gc);})();
