var pe=Object.create;var X=Object.defineProperty;var _e=Object.getOwnPropertyDescriptor;var ye=Object.getOwnPropertyNames;var he=Object.getPrototypeOf,ve=Object.prototype.hasOwnProperty;var M=(r,e)=>()=>(e||r((e={exports:{}}).exports,e),e.exports);var Pe=(r,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of ye(e))!ve.call(r,o)&&o!==t&&X(r,o,{get:()=>e[o],enumerable:!(s=_e(e,o))||s.enumerable});return r};var I=(r,e,t)=>(t=r!=null?pe(he(r)):{},Pe(e||!r||!r.__esModule?X(t,"default",{value:r,enumerable:!0}):t,r));var G=M(C=>{"use strict";Object.defineProperty(C,"__esModule",{value:!0});C.validateRequirements=void 0;var be="[",we="(<=>!~",Se=";",ke="@",Ae=new RegExp(`[${be+we+Se+ke}]`);function Re(r){return r.split(Ae)[0].trim()}function Fe(r){return r.forEach(t=>{let s;try{s=new URL(t)}catch{return}if(s.protocol==="emfs:"||s.protocol==="file:")throw new Error(`"emfs:" and "file:" protocols are not allowed for the requirement (${t})`)}),r.filter(t=>Re(t)==="streamlit"?(console.warn(`Streamlit is specified in the requirements ("${t}"), but it will be ignored. A built-in version of Streamlit will be used.`),!1):!0)}C.validateRequirements=Fe});var Q=M(T=>{"use strict";Object.defineProperty(T,"__esModule",{value:!0});T.parseRequirementsTxt=void 0;var Me=/\s#.*$/;function Ie(r){return r.split(`
`).filter(e=>!e.startsWith("#")).map(e=>e.replace(Me,"")).map(e=>e.trim()).filter(e=>e!=="")}T.parseRequirementsTxt=Ie});var Y=M(N=>{"use strict";Object.defineProperty(N,"__esModule",{value:!0});N.PromiseDelegate=void 0;var U=class{constructor(){this.promise=new Promise((e,t)=>{this.resolveInternal=e,this.rejectInternal=t})}resolve(e){this.resolveInternal(e)}reject(e){this.rejectInternal(e)}};N.PromiseDelegate=U});var Z=M(w=>{"use strict";var Oe=w&&w.__createBinding||(Object.create?function(r,e,t,s){s===void 0&&(s=t);var o=Object.getOwnPropertyDescriptor(e,t);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[t]}}),Object.defineProperty(r,s,o)}:function(r,e,t,s){s===void 0&&(s=t),r[s]=e[t]}),x=w&&w.__exportStar||function(r,e){for(var t in r)t!=="default"&&!Object.prototype.hasOwnProperty.call(e,t)&&Oe(e,r,t)};Object.defineProperty(w,"__esModule",{value:!0});x(G(),w);x(Q(),w);x(Y(),w)});var re=M((Xe,te)=>{"use strict";function P(r){if(typeof r!="string")throw new TypeError("Path must be a string. Received "+JSON.stringify(r))}function ee(r,e){for(var t="",s=0,o=-1,i=0,n,a=0;a<=r.length;++a){if(a<r.length)n=r.charCodeAt(a);else{if(n===47)break;n=47}if(n===47){if(!(o===a-1||i===1))if(o!==a-1&&i===2){if(t.length<2||s!==2||t.charCodeAt(t.length-1)!==46||t.charCodeAt(t.length-2)!==46){if(t.length>2){var c=t.lastIndexOf("/");if(c!==t.length-1){c===-1?(t="",s=0):(t=t.slice(0,c),s=t.length-1-t.lastIndexOf("/")),o=a,i=0;continue}}else if(t.length===2||t.length===1){t="",s=0,o=a,i=0;continue}}e&&(t.length>0?t+="/..":t="..",s=2)}else t.length>0?t+="/"+r.slice(o+1,a):t=r.slice(o+1,a),s=a-o-1;o=a,i=0}else n===46&&i!==-1?++i:i=-1}return t}function Ee(r,e){var t=e.dir||e.root,s=e.base||(e.name||"")+(e.ext||"");return t?t===e.root?t+s:t+r+s:s}var R={resolve:function(){for(var e="",t=!1,s,o=arguments.length-1;o>=-1&&!t;o--){var i;o>=0?i=arguments[o]:(s===void 0&&(s=process.cwd()),i=s),P(i),i.length!==0&&(e=i+"/"+e,t=i.charCodeAt(0)===47)}return e=ee(e,!t),t?e.length>0?"/"+e:"/":e.length>0?e:"."},normalize:function(e){if(P(e),e.length===0)return".";var t=e.charCodeAt(0)===47,s=e.charCodeAt(e.length-1)===47;return e=ee(e,!t),e.length===0&&!t&&(e="."),e.length>0&&s&&(e+="/"),t?"/"+e:e},isAbsolute:function(e){return P(e),e.length>0&&e.charCodeAt(0)===47},join:function(){if(arguments.length===0)return".";for(var e,t=0;t<arguments.length;++t){var s=arguments[t];P(s),s.length>0&&(e===void 0?e=s:e+="/"+s)}return e===void 0?".":R.normalize(e)},relative:function(e,t){if(P(e),P(t),e===t||(e=R.resolve(e),t=R.resolve(t),e===t))return"";for(var s=1;s<e.length&&e.charCodeAt(s)===47;++s);for(var o=e.length,i=o-s,n=1;n<t.length&&t.charCodeAt(n)===47;++n);for(var a=t.length,c=a-n,g=i<c?i:c,f=-1,l=0;l<=g;++l){if(l===g){if(c>g){if(t.charCodeAt(n+l)===47)return t.slice(n+l+1);if(l===0)return t.slice(n+l)}else i>g&&(e.charCodeAt(s+l)===47?f=l:l===0&&(f=0));break}var S=e.charCodeAt(s+l),_=t.charCodeAt(n+l);if(S!==_)break;S===47&&(f=l)}var d="";for(l=s+f+1;l<=o;++l)(l===o||e.charCodeAt(l)===47)&&(d.length===0?d+="..":d+="/..");return d.length>0?d+t.slice(n+f):(n+=f,t.charCodeAt(n)===47&&++n,t.slice(n))},_makeLong:function(e){return e},dirname:function(e){if(P(e),e.length===0)return".";for(var t=e.charCodeAt(0),s=t===47,o=-1,i=!0,n=e.length-1;n>=1;--n)if(t=e.charCodeAt(n),t===47){if(!i){o=n;break}}else i=!1;return o===-1?s?"/":".":s&&o===1?"//":e.slice(0,o)},basename:function(e,t){if(t!==void 0&&typeof t!="string")throw new TypeError('"ext" argument must be a string');P(e);var s=0,o=-1,i=!0,n;if(t!==void 0&&t.length>0&&t.length<=e.length){if(t.length===e.length&&t===e)return"";var a=t.length-1,c=-1;for(n=e.length-1;n>=0;--n){var g=e.charCodeAt(n);if(g===47){if(!i){s=n+1;break}}else c===-1&&(i=!1,c=n+1),a>=0&&(g===t.charCodeAt(a)?--a===-1&&(o=n):(a=-1,o=c))}return s===o?o=c:o===-1&&(o=e.length),e.slice(s,o)}else{for(n=e.length-1;n>=0;--n)if(e.charCodeAt(n)===47){if(!i){s=n+1;break}}else o===-1&&(i=!1,o=n+1);return o===-1?"":e.slice(s,o)}},extname:function(e){P(e);for(var t=-1,s=0,o=-1,i=!0,n=0,a=e.length-1;a>=0;--a){var c=e.charCodeAt(a);if(c===47){if(!i){s=a+1;break}continue}o===-1&&(i=!1,o=a+1),c===46?t===-1?t=a:n!==1&&(n=1):t!==-1&&(n=-1)}return t===-1||o===-1||n===0||n===1&&t===o-1&&t===s+1?"":e.slice(t,o)},format:function(e){if(e===null||typeof e!="object")throw new TypeError('The "pathObject" argument must be of type Object. Received type '+typeof e);return Ee("/",e)},parse:function(e){P(e);var t={root:"",dir:"",base:"",ext:"",name:""};if(e.length===0)return t;var s=e.charCodeAt(0),o=s===47,i;o?(t.root="/",i=1):i=0;for(var n=-1,a=0,c=-1,g=!0,f=e.length-1,l=0;f>=i;--f){if(s=e.charCodeAt(f),s===47){if(!g){a=f+1;break}continue}c===-1&&(g=!1,c=f+1),s===46?n===-1?n=f:l!==1&&(l=1):n!==-1&&(l=-1)}return n===-1||c===-1||l===0||l===1&&n===c-1&&n===a+1?c!==-1&&(a===0&&o?t.base=t.name=e.slice(1,c):t.base=t.name=e.slice(a,c)):(a===0&&o?(t.name=e.slice(1,n),t.base=e.slice(1,c)):(t.name=e.slice(a,n),t.base=e.slice(a,c)),t.ext=e.slice(n,c)),a>0?t.dir=e.slice(0,a-1):o&&(t.dir="/"),t},sep:"/",delimiter:":",win32:null,posix:null};R.posix=R;te.exports=R});var B=require("node:worker_threads");var le=I(Z());var q=I(re());function oe(r,e){let t=q.default.normalize(e),o=q.default.dirname(t).split("/"),i=[];for(let n of o){i.push(n);let a=i.join("/");if(r.FS.analyzePath(a).exists){if(r.FS.isDir(a))throw new Error(`"${a}" already exists and is not a directory.`);continue}try{r.FS.mkdir(a)}catch(c){throw console.error(`Failed to create a directory "${a}"`),c}}}function $(r,e,t,s){oe(r,e),r.FS.writeFile(e,t,s)}function se(r,e,t){oe(r,t),r.FS.rename(e,t)}var Le="[",Ce="(<=>!~",Te=";",Ne="@",De=new RegExp(`[${Le+Ce+Te+Ne}]`);function Ue(r){return r.split(De)[0].trim()}function H(r){return r.forEach(t=>{let s;try{s=new URL(t)}catch{return}if(s.protocol==="emfs:"||s.protocol==="file:")throw new Error(`"emfs:" and "file:" protocols are not allowed for the requirement (${t})`)}),r.filter(t=>Ue(t)==="streamlit"?(console.warn(`Streamlit is specified in the requirements ("${t}"), but it will be ignored. A built-in version of Streamlit will be used.`),!1):!0)}async function xe(r){let e=typeof process<"u"&&process.versions?.node,t;e?t=(await import("node:path")).sep:t="/";let s=r.slice(0,r.lastIndexOf(t)+1);if(r.endsWith(".mjs")){if(e){let o=await import("node:path"),i=await import("node:url");!r.includes("://")&&o.isAbsolute(r)&&(r=i.pathToFileURL(r).href)}return{scriptURL:r,pyodideIndexURL:s,isESModule:!0}}else return{scriptURL:r,pyodideIndexURL:s,isESModule:!1}}async function ne(r,e){let{scriptURL:t,pyodideIndexURL:s,isESModule:o}=await xe(r),i;return o?i=(await import(t)).loadPyodide:(importScripts(t),i=self.loadPyodide),i({...e,indexURL:s})}function j(r){r.runPython(`
import micropip
micropip.add_mock_package(
    "pyarrow", "0.0.1",
    modules={
        "pyarrow": """
__version__ = '0.0.1'  # TODO: Update when releasing


class Table:
    @classmethod
    def from_pandas(*args, **kwargs):
        raise NotImplementedError("stlite is not supporting this method.")


class Array:
    def __init__(self, *args, **kwargs):
        raise NotImplementedError("stlite is not supporting PyArrow.Array")


class ChunkedArray:
    def __init__(self, *args, **kwargs):
        raise NotImplementedError("stlite is not supporting PyArrow.ChunkedArray")
"""
    }
)
`)}var W;function qe(r,e){return W||(r.runPython(`
import ast
from textwrap import dedent

def find_imports(source: str) -> list[str]:
    source = dedent(source)

    try:
        mod = ast.parse(source)
    except SyntaxError:
        return []
    imports = set()
    for node in mod.body:
        if isinstance(node, ast.Import):
            for name in node.names:
                node_name = name.name
                imports.add(node_name.split(".")[0])
        elif isinstance(node, ast.ImportFrom):
            module_name = node.module
            if module_name is None:
                continue
            imports.add(module_name.split(".")[0])
    return imports
`),W=r.globals.get("find_imports")),W(e).toJs()}function $e(r){let e=new Set;for(let t of r)for(let s of t)e.add(s);return e}async function ie(r,e,t){let s=t.map(g=>qe(r,g)),o=$e(s),a=Array.from(o).filter(g=>!r.runPython(`__import__('importlib').util.find_spec('${g}')`)).map(g=>r._api._import_name_to_package_name.get(g)).filter(g=>g);if(a.length===0)return;let c=new MessageChannel;e({type:"event:moduleAutoLoad",data:{packagesToLoad:a}},c.port2);try{let g=await r.loadPackage(a);c.port1.postMessage({type:"moduleAutoLoad:success",data:{loadedPackages:g}}),c.port1.close();return}catch(g){throw c.port1.postMessage({type:"moduleAutoLoad:error",error:g}),c.port1.close(),g}}var D=global;function ae(r,e,t){let s=ie(r,e,t);D.__moduleAutoLoadPromise__=s,r.runPythonAsync(`
from streamlit.runtime.scriptrunner import script_runner
from js import __moduleAutoLoadPromise__

script_runner.moduleAutoLoadPromise = __moduleAutoLoadPromise__
`)}function ce(r,e,t){function s(f){e({type:"event:progress",data:{message:f}})}let o,i,n=new le.PromiseDelegate;async function a(){let f=await n.promise,l={...t,...f};console.debug("Initial data",l);let{entrypoint:S,files:_,archives:d,requirements:p,prebuiltPackageNames:y,wheels:h,mountedSitePackagesSnapshotFilePath:v,pyodideUrl:k=r,streamlitConfig:A,idbfsMountpoints:O,nodefsMountpoints:z,moduleAutoLoad:ue}=l,E=H(p);s("Loading Pyodide."),console.debug("Loading Pyodide"),o=await ne(k,{stdout:console.log,stderr:console.error}),console.debug("Loaded Pyodide");let J=!1;O&&(J=!0,O.forEach(u=>{o.FS.mkdir(u),o.FS.mount(o.FS.filesystems.IDBFS,{},u)}),await new Promise((u,m)=>{o.FS.syncfs(!0,b=>{b?m(b):u()})})),z&&Object.entries(z).forEach(([u,m])=>{o.FS.mkdir(u),o.FS.mount(o.FS.filesystems.NODEFS,{root:m},u)}),s("Mounting files.");let K=[];if(await Promise.all(Object.keys(_).map(async u=>{let m=_[u],b;"url"in m?(console.debug(`Fetch a file from ${m.url}`),b=await fetch(m.url).then(F=>F.arrayBuffer()).then(F=>new Uint8Array(F))):b=m.data;let{opts:L}=_[u];console.debug(`Write a file "${u}"`),$(o,u,b,L),u.endsWith(".py")&&K.push(u)})),s("Unpacking archives."),await Promise.all(d.map(async u=>{let m;"url"in u?(console.debug(`Fetch an archive from ${u.url}`),m=await fetch(u.url).then(F=>F.arrayBuffer())):m=u.buffer;let{format:b,options:L}=u;console.debug("Unpack an archive",{format:b,options:L}),o.unpackArchive(m,b,L)})),!v&&!h)throw new Error("Neither snapshot nor wheel files are provided.");v&&(s("Restoring the snapshot."),await o.runPythonAsync("import tarfile, shutil, site"),await o.runPythonAsync(`
site_packages_dirs = site.getsitepackages()
for site_packages in site_packages_dirs:
    shutil.rmtree(site_packages)
`),console.debug(`Unarchive ${v}`),await o.runPythonAsync(`
with tarfile.open("${v}", "r") as tar_gz_file:
    tar_gz_file.extractall("/")
`),console.debug("Restored the snapshot"),s("Mocking some packages."),console.debug("Mock pyarrow"),j(o),console.debug("Mocked pyarrow")),s("Installing packages."),console.debug("Installing the prebuilt packages:",y),await o.loadPackage(y),console.debug("Installed the prebuilt packages"),await o.loadPackage("micropip");let V=o.pyimport("micropip");if(h?(console.debug("Installing the wheels:",h,"and the requirements:",E),await V.install.callKwargs([h.stliteServer,h.streamlit,...E],{keep_going:!0}),console.debug("Installed the wheels and the requirements"),s("Mocking some packages."),console.debug("Mock pyarrow"),j(o),console.debug("Mocked pyarrow")):(console.debug("Installing the requirements:",E),await V.install.callKwargs(E,{keep_going:!0}),console.debug("Installed the requirements")),ue){let u=K.map(m=>o.FS.readFile(m,{encoding:"utf8"}));ae(o,e,u)}await o.runPythonAsync(`
import importlib
importlib.invalidate_caches()
`),s("Loading streamlit package."),console.debug("Loading the Streamlit package"),await o.runPythonAsync(`
import streamlit.runtime
    `),console.debug("Loaded the Streamlit package"),s("Setting up the loggers."),console.debug("Setting the loggers"),await o.runPythonAsync(`
import logging
import streamlit.logger

streamlit.logger.get_logger = logging.getLogger
streamlit.logger.setup_formatter = None
streamlit.logger.update_formatter = lambda *a, **k: None
streamlit.logger.set_log_level = lambda *a, **k: None

for name in streamlit.logger._loggers.keys():
    if name == "root":
        name = "streamlit"
    logger = logging.getLogger(name)
    logger.propagate = True
    logger.handlers.clear()
    logger.setLevel(logging.NOTSET)

streamlit.logger._loggers = {}
`);let ge=(u,m)=>{u>=40?console.error(m):u>=30?console.warn(m):u>=20?console.info(m):console.debug(m)};D.__logCallback__=ge,await o.runPythonAsync(`
def setup_loggers(streamlit_level, streamlit_message_format):
    from js import __logCallback__


    class JsHandler(logging.Handler):
        def emit(self, record):
            msg = self.format(record)
            __logCallback__(record.levelno, msg)


    root_message_format = "%(levelname)s:%(name)s:%(message)s"

    root_logger = logging.getLogger()
    root_logger.handlers.clear()
    root_formatter = logging.Formatter(root_message_format)
    root_handler = JsHandler()
    root_handler.setFormatter(root_formatter)
    root_logger.addHandler(root_handler)
    root_logger.setLevel(logging.DEBUG)

    streamlit_logger = logging.getLogger("streamlit")
    streamlit_logger.propagate = False
    streamlit_logger.handlers.clear()
    streamlit_formatter = logging.Formatter(streamlit_message_format)
    streamlit_handler = JsHandler()
    streamlit_handler.setFormatter(streamlit_formatter)
    streamlit_logger.addHandler(streamlit_handler)
    streamlit_logger.setLevel(streamlit_level.upper())
`);let fe=(A?.["logger.level"]??"INFO").toString(),me=A?.["logger.messageFormat"]??"%(asctime)s %(message)s";if(o.globals.get("setup_loggers")(fe,me),console.debug("Set the loggers"),s("Mocking some Streamlit functions for the browser environment."),console.debug("Mocking some Streamlit functions"),await o.runPythonAsync(`
import streamlit

def is_cacheable_msg(msg):
    return False

streamlit.runtime.runtime.is_cacheable_msg = is_cacheable_msg
`),console.debug("Mocked some Streamlit functions"),J){s("Setting up the IndexedDB filesystem synchronizer."),console.debug("Setting up the IndexedDB filesystem synchronizer");let u=!1;D.__scriptFinishedCallback__=()=>{console.debug("The script has finished. Syncing the filesystem."),u||(u=!0,o.FS.syncfs(!1,m=>{u=!1,m&&console.error(m)}))},await o.runPythonAsync(`
from streamlit.runtime.app_session import AppSession
from streamlit.runtime.scriptrunner import ScriptRunnerEvent
from js import __scriptFinishedCallback__

def wrap_app_session_on_scriptrunner_event(original_method):
    def wrapped(self, *args, **kwargs):
        if "event" in kwargs:
            event = kwargs["event"]
            if event == ScriptRunnerEvent.SCRIPT_STOPPED_WITH_SUCCESS or event == ScriptRunnerEvent.SCRIPT_STOPPED_FOR_RERUN or event == ScriptRunnerEvent.SHUTDOWN:
                __scriptFinishedCallback__()
        return original_method(self, *args, **kwargs)
    return wrapped

AppSession._on_scriptrunner_event = wrap_app_session_on_scriptrunner_event(AppSession._on_scriptrunner_event)
`),console.debug("Set up the IndexedDB filesystem synchronizer")}return s("Booting up the Streamlit server."),console.debug("Booting up the Streamlit server"),D.__streamlitFlagOptions__={"browser.gatherUsageStats":!1,...A,"runner.fastReruns":!1},await o.runPythonAsync(`
from stlite_server.bootstrap import load_config_options, prepare
from stlite_server.server import Server
from js import __streamlitFlagOptions__

flag_options = __streamlitFlagOptions__.to_py()
load_config_options(flag_options)

main_script_path = "${S}"
args = []

prepare(main_script_path, args)

server = Server(main_script_path)
server.start()
`),console.debug("Booted up the Streamlit server"),console.debug("Setting up the HTTP server"),i=o.globals.get("server").copy(),console.debug("Set up the HTTP server"),e({type:"event:loaded"}),l}let c=a().catch(f=>{throw e({type:"event:error",data:{error:f}}),f}),g=async f=>{let l=f.data;if(l.type==="initData"){n.resolve(l.data);return}let{moduleAutoLoad:S}=await c,_=f.ports[0];try{switch(l.type){case"websocket:connect":{console.debug("websocket:connect",l.data);let{path:d}=l.data;i.start_websocket(d,(p,y)=>{if(y){let h=p,v=h.getBuffer("u8");h.destroy();let k=new Uint8ClampedArray(v.data.buffer,v.data.byteOffset,v.data.byteLength);e({type:"websocket:message",data:{payload:new Uint8Array(k)}})}else e({type:"websocket:message",data:{payload:p}})}),_.postMessage({type:"reply"});break}case"websocket:send":{console.debug("websocket:send",l.data);let{payload:d}=l.data;i.receive_websocket_from_js(d);break}case"http:request":{console.debug("http:request",l.data);let{request:d}=l.data,p=(y,h,v)=>{let k=new Map(h.toJs()),A=v.toJs();console.debug({statusCode:y,headers:k,body:A});let O={type:"http:response",data:{response:{statusCode:y,headers:k,body:A}}};_.postMessage(O)};i.receive_http_from_js(d.method,decodeURIComponent(d.path),d.headers,d.body,p);break}case"file:write":{let{path:d,data:p,opts:y}=l.data;S&&typeof p=="string"&&d.endsWith(".py")&&(console.debug(`Auto install the requirements in ${d}`),ae(o,e,[p])),console.debug(`Write a file "${d}"`),$(o,d,p,y),_.postMessage({type:"reply"});break}case"file:rename":{let{oldPath:d,newPath:p}=l.data;console.debug(`Rename "${d}" to ${p}`),se(o,d,p),_.postMessage({type:"reply"});break}case"file:unlink":{let{path:d}=l.data;console.debug(`Remove "${d}`),o.FS.unlink(d),_.postMessage({type:"reply"});break}case"install":{let{requirements:d}=l.data,p=o.pyimport("micropip"),y=H(d);console.debug("Install the requirements:",y),await p.install.callKwargs(y,{keep_going:!0}).then(()=>{console.debug("Successfully installed"),_.postMessage({type:"reply"})})}}}catch(d){if(console.error(d),!(d instanceof Error))throw d;let p=new Error(d.message);p.name=d.name,p.stack=d.stack,_.postMessage({type:"reply",error:p})}};return e({type:"event:start"}),g}function de(){let r=process.env.NODEFS_MOUNTPOINTS;if(!r)return;let e;try{e=JSON.parse(r)}catch{console.error(`Failed to parse NODEFS_MOUNTPOINTS as JSON: ${r}`);return}if(typeof e!="object"){console.error(`NODEFS_MOUNTPOINTS is not an object: ${r}`);return}if(Array.isArray(e)){console.error(`NODEFS_MOUNTPOINTS is an array: ${r}`);return}if(Object.keys(e).some(t=>typeof t!="string")){console.error(`NODEFS_MOUNTPOINTS has non-string keys: ${r}`);return}if(Object.values(e).some(t=>typeof t!="string")){console.error(`NODEFS_MOUNTPOINTS has non-string values: ${r}`);return}return e}var He=r=>{console.debug("[worker thread] postMessage from worker",r),B.parentPort?.postMessage(r)},je=ce(process.env.PYODIDE_URL,He,{nodefsMountpoints:de()});B.parentPort?.on("message",({data:r,port:e})=>{console.debug("[worker thread] parentPort.onMessage",{data:r,port:e}),je({data:r,ports:[e]})});
