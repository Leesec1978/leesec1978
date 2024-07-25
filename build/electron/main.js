var Ce=Object.create;var Y=Object.defineProperty;var Le=Object.getOwnPropertyDescriptor;var ve=Object.getOwnPropertyNames;var Be=Object.getPrototypeOf,He=Object.prototype.hasOwnProperty;var qe=(i,a)=>()=>(a||i((a={exports:{}}).exports,a),a.exports);var Ve=(i,a,f,c)=>{if(a&&typeof a=="object"||typeof a=="function")for(let w of ve(a))!He.call(i,w)&&w!==f&&Y(i,w,{get:()=>a[w],enumerable:!(c=Le(a,w))||c.enumerable});return i};var _=(i,a,f)=>(f=i!=null?Ce(Be(i)):{},Ve(a||!i||!i.__esModule?Y(f,"default",{value:i,enumerable:!0}):f,i));var K=qe((T,Z)=>{(function(i,a){typeof T=="object"&&typeof Z<"u"?a(T):typeof define=="function"&&define.amd?define(["exports"],a):(i=typeof globalThis<"u"?globalThis:i||self,a(i.Superstruct={}))})(T,function(i){"use strict";class a extends TypeError{constructor(n,t){let r,{message:o,explanation:s,...d}=n,{path:b}=n,g=b.length===0?o:`At path: ${b.join(".")} -- ${o}`;super(s??g),s!=null&&(this.cause=g),Object.assign(this,d),this.name=this.constructor.name,this.failures=()=>r??(r=[n,...t()])}}function f(e){return c(e)&&typeof e[Symbol.iterator]=="function"}function c(e){return typeof e=="object"&&e!=null}function w(e){if(Object.prototype.toString.call(e)!=="[object Object]")return!1;let n=Object.getPrototypeOf(e);return n===null||n===Object.prototype}function p(e){return typeof e=="symbol"?e.toString():typeof e=="string"?JSON.stringify(e):`${e}`}function j(e){let{done:n,value:t}=e.next();return n?void 0:t}function N(e,n,t,r){if(e===!0)return;e===!1?e={}:typeof e=="string"&&(e={message:e});let{path:o,branch:s}=n,{type:d}=t,{refinement:b,message:g=`Expected a value of type \`${d}\`${b?` with refinement \`${b}\``:""}, but received: \`${p(r)}\``}=e;return{value:r,type:d,refinement:b,key:o[o.length-1],path:o,branch:s,...e,message:g}}function*m(e,n,t,r){f(e)||(e=[e]);for(let o of e){let s=N(o,n,t,r);s&&(yield s)}}function*k(e,n,t={}){let{path:r=[],branch:o=[e],coerce:s=!1,mask:d=!1}=t,b={path:r,branch:o};if(s&&(e=n.coercer(e,b),d&&n.type!=="type"&&c(n.schema)&&c(e)&&!Array.isArray(e)))for(let y in e)n.schema[y]===void 0&&delete e[y];let g="valid";for(let y of n.validator(e,b))y.explanation=t.message,g="not_valid",yield[y,void 0];for(let[y,E,Je]of n.entries(e,b)){let Ue=k(E,Je,{path:y===void 0?r:[...r,y],branch:y===void 0?o:[...o,E],coerce:s,mask:d,message:t.message});for(let W of Ue)W[0]?(g=W[0].refinement!=null?"not_refined":"not_valid",yield[W[0],void 0]):s&&(E=W[1],y===void 0?e=E:e instanceof Map?e.set(y,E):e instanceof Set?e.add(E):c(e)&&(E!==void 0||y in e)&&(e[y]=E))}if(g!=="not_valid")for(let y of n.refiner(e,b))y.explanation=t.message,g="not_refined",yield[y,void 0];g==="valid"&&(yield[void 0,e])}class u{constructor(n){let{type:t,schema:r,validator:o,refiner:s,coercer:d=g=>g,entries:b=function*(){}}=n;this.type=t,this.schema=r,this.entries=b,this.coercer=d,o?this.validator=(g,y)=>{let E=o(g,y);return m(E,y,this,g)}:this.validator=()=>[],s?this.refiner=(g,y)=>{let E=s(g,y);return m(E,y,this,g)}:this.refiner=()=>[]}assert(n,t){return $(n,this,t)}create(n,t){return I(n,this,t)}is(n){return J(n,this)}mask(n,t){return R(n,this,t)}validate(n,t={}){return F(n,this,t)}}function $(e,n,t){let r=F(e,n,{message:t});if(r[0])throw r[0]}function I(e,n,t){let r=F(e,n,{coerce:!0,message:t});if(r[0])throw r[0];return r[1]}function R(e,n,t){let r=F(e,n,{coerce:!0,mask:!0,message:t});if(r[0])throw r[0];return r[1]}function J(e,n){return!F(e,n)[0]}function F(e,n,t={}){let r=k(e,n,t),o=j(r);return o[0]?[new a(o[0],function*(){for(let d of r)d[0]&&(yield d[0])}),void 0]:[void 0,o[1]]}function re(...e){let n=e[0].type==="type",t=e.map(o=>o.schema),r=Object.assign({},...t);return n?z(r):A(r)}function P(e,n){return new u({type:e,schema:null,validator:n})}function ie(e,n){return new u({...e,refiner:(t,r)=>t===void 0||e.refiner(t,r),validator(t,r){return t===void 0?!0:(n(t,r),e.validator(t,r))}})}function oe(e){return new u({type:"dynamic",schema:null,*entries(n,t){yield*e(n,t).entries(n,t)},validator(n,t){return e(n,t).validator(n,t)},coercer(n,t){return e(n,t).coercer(n,t)},refiner(n,t){return e(n,t).refiner(n,t)}})}function se(e){let n;return new u({type:"lazy",schema:null,*entries(t,r){n??(n=e()),yield*n.entries(t,r)},validator(t,r){return n??(n=e()),n.validator(t,r)},coercer(t,r){return n??(n=e()),n.coercer(t,r)},refiner(t,r){return n??(n=e()),n.refiner(t,r)}})}function ae(e,n){let{schema:t}=e,r={...t};for(let o of n)delete r[o];switch(e.type){case"type":return z(r);default:return A(r)}}function ce(e){let n=e instanceof u,t=n?{...e.schema}:{...e};for(let r in t)t[r]=B(t[r]);return n&&e.type==="type"?z(t):A(t)}function fe(e,n){let{schema:t}=e,r={};for(let o of n)r[o]=t[o];switch(e.type){case"type":return z(r);default:return A(r)}}function de(e,n){return console.warn("superstruct@0.11 - The `struct` helper has been renamed to `define`."),P(e,n)}function ue(){return P("any",()=>!0)}function le(e){return new u({type:"array",schema:e,*entries(n){if(e&&Array.isArray(n))for(let[t,r]of n.entries())yield[t,r,e]},coercer(n){return Array.isArray(n)?n.slice():n},validator(n){return Array.isArray(n)||`Expected an array value, but received: ${p(n)}`}})}function pe(){return P("bigint",e=>typeof e=="bigint")}function me(){return P("boolean",e=>typeof e=="boolean")}function ye(){return P("date",e=>e instanceof Date&&!isNaN(e.getTime())||`Expected a valid \`Date\` object, but received: ${p(e)}`)}function he(e){let n={},t=e.map(r=>p(r)).join();for(let r of e)n[r]=r;return new u({type:"enums",schema:n,validator(r){return e.includes(r)||`Expected one of \`${t}\`, but received: ${p(r)}`}})}function be(){return P("func",e=>typeof e=="function"||`Expected a function, but received: ${p(e)}`)}function ge(e){return P("instance",n=>n instanceof e||`Expected a \`${e.name}\` instance, but received: ${p(n)}`)}function we(){return P("integer",e=>typeof e=="number"&&!isNaN(e)&&Number.isInteger(e)||`Expected an integer, but received: ${p(e)}`)}function ke(e){return new u({type:"intersection",schema:null,*entries(n,t){for(let r of e)yield*r.entries(n,t)},*validator(n,t){for(let r of e)yield*r.validator(n,t)},*refiner(n,t){for(let r of e)yield*r.refiner(n,t)}})}function $e(e){let n=p(e),t=typeof e;return new u({type:"literal",schema:t==="string"||t==="number"||t==="boolean"?e:null,validator(r){return r===e||`Expected the literal \`${n}\`, but received: ${p(r)}`}})}function Pe(e,n){return new u({type:"map",schema:null,*entries(t){if(e&&n&&t instanceof Map)for(let[r,o]of t.entries())yield[r,r,e],yield[r,o,n]},coercer(t){return t instanceof Map?new Map(t):t},validator(t){return t instanceof Map||`Expected a \`Map\` object, but received: ${p(t)}`}})}function U(){return P("never",()=>!1)}function Se(e){return new u({...e,validator:(n,t)=>n===null||e.validator(n,t),refiner:(n,t)=>n===null||e.refiner(n,t)})}function je(){return P("number",e=>typeof e=="number"&&!isNaN(e)||`Expected a number, but received: ${p(e)}`)}function A(e){let n=e?Object.keys(e):[],t=U();return new u({type:"object",schema:e||null,*entries(r){if(e&&c(r)){let o=new Set(Object.keys(r));for(let s of n)o.delete(s),yield[s,r[s],e[s]];for(let s of o)yield[s,r[s],t]}},validator(r){return c(r)||`Expected an object, but received: ${p(r)}`},coercer(r){return c(r)?{...r}:r}})}function B(e){return new u({...e,validator:(n,t)=>n===void 0||e.validator(n,t),refiner:(n,t)=>n===void 0||e.refiner(n,t)})}function Ee(e,n){return new u({type:"record",schema:null,*entries(t){if(c(t))for(let r in t){let o=t[r];yield[r,r,e],yield[r,o,n]}},validator(t){return c(t)||`Expected an object, but received: ${p(t)}`}})}function Ne(){return P("regexp",e=>e instanceof RegExp)}function _e(e){return new u({type:"set",schema:null,*entries(n){if(e&&n instanceof Set)for(let t of n)yield[t,t,e]},coercer(n){return n instanceof Set?new Set(n):n},validator(n){return n instanceof Set||`Expected a \`Set\` object, but received: ${p(n)}`}})}function H(){return P("string",e=>typeof e=="string"||`Expected a string, but received: ${p(e)}`)}function Me(e){let n=U();return new u({type:"tuple",schema:null,*entries(t){if(Array.isArray(t)){let r=Math.max(e.length,t.length);for(let o=0;o<r;o++)yield[o,t[o],e[o]||n]}},validator(t){return Array.isArray(t)||`Expected an array, but received: ${p(t)}`}})}function z(e){let n=Object.keys(e);return new u({type:"type",schema:e,*entries(t){if(c(t))for(let r of n)yield[r,t[r],e[r]]},validator(t){return c(t)||`Expected an object, but received: ${p(t)}`},coercer(t){return c(t)?{...t}:t}})}function Oe(e){let n=e.map(t=>t.type).join(" | ");return new u({type:"union",schema:null,coercer(t){for(let r of e){let[o,s]=r.validate(t,{coerce:!0});if(!o)return s}return t},validator(t,r){let o=[];for(let s of e){let[...d]=k(t,s,r),[b]=d;if(b[0])for(let[g]of d)g&&o.push(g);else return[]}return[`Expected the value to satisfy a union of \`${n}\`, but received: ${p(t)}`,...o]}})}function q(){return P("unknown",()=>!0)}function C(e,n,t){return new u({...e,coercer:(r,o)=>J(r,n)?e.coercer(t(r,o),o):e.coercer(r,o)})}function Fe(e,n,t={}){return C(e,q(),r=>{let o=typeof n=="function"?n():n;if(r===void 0)return o;if(!t.strict&&w(r)&&w(o)){let s={...r},d=!1;for(let b in o)s[b]===void 0&&(s[b]=o[b],d=!0);if(d)return s}return r})}function De(e){return C(e,H(),n=>n.trim())}function Ae(e){return O(e,"empty",n=>{let t=V(n);return t===0||`Expected an empty ${e.type} but received one with a size of \`${t}\``})}function V(e){return e instanceof Map||e instanceof Set?e.size:e.length}function ze(e,n,t={}){let{exclusive:r}=t;return O(e,"max",o=>r?o<n:o<=n||`Expected a ${e.type} less than ${r?"":"or equal to "}${n} but received \`${o}\``)}function Ie(e,n,t={}){let{exclusive:r}=t;return O(e,"min",o=>r?o>n:o>=n||`Expected a ${e.type} greater than ${r?"":"or equal to "}${n} but received \`${o}\``)}function Re(e){return O(e,"nonempty",n=>V(n)>0||`Expected a nonempty ${e.type} but received an empty one`)}function We(e,n){return O(e,"pattern",t=>n.test(t)||`Expected a ${e.type} matching \`/${n.source}/\` but received "${t}"`)}function Te(e,n,t=n){let r=`Expected a ${e.type}`,o=n===t?`of \`${n}\``:`between \`${n}\` and \`${t}\``;return O(e,"size",s=>{if(typeof s=="number"||s instanceof Date)return n<=s&&s<=t||`${r} ${o} but received \`${s}\``;if(s instanceof Map||s instanceof Set){let{size:d}=s;return n<=d&&d<=t||`${r} with a size ${o} but received one with a size of \`${d}\``}else{let{length:d}=s;return n<=d&&d<=t||`${r} with a length ${o} but received one with a length of \`${d}\``}})}function O(e,n,t){return new u({...e,*refiner(r,o){yield*e.refiner(r,o);let s=t(r,o),d=m(s,o,e,r);for(let b of d)yield{...b,refinement:n}}})}i.Struct=u,i.StructError=a,i.any=ue,i.array=le,i.assert=$,i.assign=re,i.bigint=pe,i.boolean=me,i.coerce=C,i.create=I,i.date=ye,i.defaulted=Fe,i.define=P,i.deprecated=ie,i.dynamic=oe,i.empty=Ae,i.enums=he,i.func=be,i.instance=ge,i.integer=we,i.intersection=ke,i.is=J,i.lazy=se,i.literal=$e,i.map=Pe,i.mask=R,i.max=ze,i.min=Ie,i.never=U,i.nonempty=Re,i.nullable=Se,i.number=je,i.object=A,i.omit=ae,i.optional=B,i.partial=ce,i.pattern=We,i.pick=fe,i.record=Ee,i.refine=O,i.regexp=Ne,i.set=_e,i.size=Te,i.string=H,i.struct=de,i.trimmed=De,i.tuple=Me,i.type=z,i.union=Oe,i.unknown=q,i.validate=F})});var l=require("electron"),S=_(require("node:path")),L=_(require("node:fs/promises")),v=_(require("node:worker_threads"));function G(i,a){let f=new URL(i),c=new URL(a);return f.search="",f.hash="",c.search="",c.hash="",c.toString().startsWith(f.toString())}var D=_(require("fs/promises")),M=_(require("path"));async function Q(i){let a={},f=await D.readdir(i);return await Promise.all(f.map(async c=>{let w=M.join(i,c);if((await D.stat(w)).isDirectory()){let j=await Q(w);Object.assign(a,j)}else{let j=await D.readFile(w);a[w]=j}})),a}async function X(i){let a=await Q(i),f={};return Object.keys(a).forEach(c=>{let p=M.relative(i,c).split(M.sep).join(M.posix.sep);f[p]=a[c]}),f}var x=_(require("path")),ee=_(require("fs/promises")),h=_(K()),Ye=h.object({entrypoint:h.string(),embed:h.defaulted(h.boolean(),!1),idbfsMountpoints:h.optional(h.array(h.string())),nodeJsWorker:h.defaulted(h.boolean(),!1),nodefsMountpoints:h.optional(h.record(h.string(),h.string()))});async function ne(){let i=x.resolve(__dirname,"../stlite-manifest.json"),a=await ee.readFile(i,{encoding:"utf-8"}),f=JSON.parse(a);return h.assert(f,Ye),f}var te=async()=>{let i=await ne(),a=[];a.push(`--entrypoint=${JSON.stringify(i.entrypoint)}`),i.idbfsMountpoints&&a.push(`--idbfs-mountpoints=${JSON.stringify(i.idbfsMountpoints)}`),i.nodeJsWorker&&a.push("--nodejs-worker");let f=new l.BrowserWindow({width:1280,height:720,webPreferences:{preload:S.join(__dirname,"preload.js"),sandbox:!0,additionalArguments:a}}),c=new URL((l.app.isPackaged,"file:///index.html")),w=new URLSearchParams;i.embed&&w.set("embed","true"),c.search=w.toString();let p=c.toString(),j=m=>G(p,m.url);l.ipcMain.handle("readSitePackagesSnapshot",m=>{if(!j(m.senderFrame))throw new Error(`Invalid IPC sender (readSitePackagesSnapshot) ${m.senderFrame.url}`);let k=S.resolve(__dirname,"../site-packages-snapshot.tar.gz");return L.readFile(k)}),l.ipcMain.handle("readPrebuiltPackageNames",async m=>{if(!j(m.senderFrame))throw new Error(`Invalid IPC sender (readPrebuiltPackageNames) ${m.senderFrame.url}`);let k=S.resolve(__dirname,"../prebuilt-packages.txt");return(await L.readFile(k,{encoding:"utf-8"})).split(`
`).map($=>$.trim()).filter($=>$.length>0)}),l.ipcMain.handle("readStreamlitAppDirectory",async m=>{if(!j(m.senderFrame))throw new Error(`Invalid IPC sender (readStreamlitAppDirectory) ${m.senderFrame.url}`);let k=S.resolve(__dirname,"../app_files");return X(k)}),f.on("closed",()=>{l.ipcMain.removeHandler("readSitePackagesSnapshot"),l.ipcMain.removeHandler("readPrebuiltPackageNames"),l.ipcMain.removeHandler("readStreamlitAppDirectory")});let N=null;l.ipcMain.handle("initializeNodeJsWorker",m=>{if(!j(m.senderFrame))throw new Error(`Invalid IPC sender (initializeNodeJsWorker) ${m.senderFrame.url}`);let k=S.resolve(__dirname,"..","pyodide","pyodide.mjs");function u($){f.webContents.send("messageFromNodeJsWorker",$)}N=new v.default.Worker(S.resolve(__dirname,"worker.js"),{env:{PYODIDE_URL:k,...i.nodefsMountpoints&&{NODEFS_MOUNTPOINTS:JSON.stringify(i.nodefsMountpoints)}}}),N.on("message",$=>{u($)})}),l.ipcMain.on("messageToNodeJsWorker",(m,{data:k,portId:u})=>{if(!j(m.senderFrame))throw new Error(`Invalid IPC sender (messageToNodeJsWorker) ${m.senderFrame.url}`);if(N==null)return;let $=new v.default.MessageChannel;$.port1.on("message",R=>{m.reply(`nodeJsWorker-portMessage-${u}`,R)});let I={data:k,port:$.port2};N.postMessage(I,[$.port2])}),l.ipcMain.handle("terminate",(m,{data:k,portId:u})=>{if(!j(m.senderFrame))throw new Error(`Invalid IPC sender (terminate) ${m.senderFrame.url}`);N?.terminate(),N=null}),f.on("closed",()=>{l.ipcMain.removeHandler("initializeNodeJsWorker"),l.ipcMain.removeHandler("messageToNodeJsWorker"),l.ipcMain.removeHandler("terminate")}),f.loadURL(p),l.app.isPackaged||f.webContents.openDevTools()};l.app.enableSandbox();l.app.whenReady().then(()=>{let i=S.resolve(__dirname,"..");l.protocol.interceptFileProtocol("file",function(a,f){let c=new URL(a.url).pathname;if(S.isAbsolute(c)){let w=S.join(i,c);f(S.normalize(w))}else f(c)}),te(),l.app.on("activate",()=>{l.BrowserWindow.getAllWindows().length===0&&te()})});l.app.on("window-all-closed",()=>{process.platform!=="darwin"&&l.app.quit()});l.app.on("web-contents-created",(i,a)=>{a.on("will-attach-webview",(f,c,w)=>{f.preventDefault()}),a.on("will-navigate",(f,c)=>{console.debug("will-navigate",c),f.preventDefault()}),a.setWindowOpenHandler(({url:f})=>(console.error("Opening a new window is not allowed."),{action:"deny"}))});