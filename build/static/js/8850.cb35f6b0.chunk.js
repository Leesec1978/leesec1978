"use strict";(self.webpackChunk_stlite_desktop=self.webpackChunk_stlite_desktop||[]).push([[8850],{98850:(e,t,s)=>{s.r(t),s.d(t,{FileHandle:()=>d});var r=s(52753),a=s(51059);const{WritableStream:o,TransformStream:n,DOMException:i,Blob:c}=a.Z,{GONE:l}=r.errors,h=/constructor/i.test(window.HTMLElement);class d{constructor(e="unkown"){this.name=e,this.kind="file"}async getFile(){throw new i(...l)}async isSameEntry(e){return this===e}async createWritable(e={}){const t=await(navigator.serviceWorker?.getRegistration()),s=document.createElement("a"),r=new n,a=r.writable;if(s.download=this.name,h||!t){let e=[];r.readable.pipeTo(new o({write(t){e.push(new c([t]))},close(){const t=new c(e,{type:"application/octet-stream; charset=utf-8"});e=[],s.href=URL.createObjectURL(t),s.click(),setTimeout((()=>URL.revokeObjectURL(s.href)),1e4)}}))}else{const{writable:s,readablePort:a}=new _(o),i=encodeURIComponent(this.name).replace(/['()]/g,escape).replace(/\*/g,"%2A"),c={"content-disposition":"attachment; filename*=UTF-8''"+i,"content-type":"application/octet-stream; charset=utf-8",...e.size?{"content-length":e.size}:{}},l=setTimeout((()=>t.active.postMessage(0)),1e4);r.readable.pipeThrough(new n({transform(e,t){if(e instanceof Uint8Array)return t.enqueue(e);const s=new Response(e).body.getReader(),r=e=>s.read().then((e=>e.done?0:r(t.enqueue(e.value))));return r()}})).pipeTo(s).finally((()=>{clearInterval(l)})),t.active.postMessage({url:t.scope+i,headers:c,readablePort:a},[a]);const h=document.createElement("iframe");h.hidden=!0,h.src=t.scope+i,document.body.appendChild(h)}return a.getWriter()}}class p{constructor(e){e.onmessage=e=>this._onMessage(e.data),this._port=e,this._resetReady()}start(e){return this._controller=e,this._readyPromise}write(e){const t={type:0,chunk:e};return this._port.postMessage(t,[e.buffer]),this._resetReady(),this._readyPromise}close(){this._port.postMessage({type:2}),this._port.close()}abort(e){this._port.postMessage({type:1,reason:e}),this._port.close()}_onMessage(e){0===e.type&&this._resolveReady(),1===e.type&&this._onError(e.reason)}_onError(e){this._controller.error(e),this._rejectReady(e),this._port.close()}_resetReady(){this._readyPromise=new Promise(((e,t)=>{this._readyResolve=e,this._readyReject=t})),this._readyPending=!0}_resolveReady(){this._readyResolve(),this._readyPending=!1}_rejectReady(e){this._readyPending||this._resetReady(),this._readyPromise.catch((()=>{})),this._readyReject(e),this._readyPending=!1}}class _{constructor(e){const t=new MessageChannel;this.readablePort=t.port1,this.writable=new e(new p(t.port2))}}}}]);