import http from 'node:http';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {Store,Problem,bad,DEMO_USERS} from './db.js';
import {ScheduleError} from './schedule.js';
const dir=path.dirname(fileURLToPath(import.meta.url));
const PUBLIC=path.join(dir,'public');
const STATIC=new Map([['/app','index.html'],['/app/','index.html'],['/app/app.js','app.js'],['/app/app.css','app.css']]);
const MIME={'index.html':'text/html; charset=utf-8','app.js':'text/javascript; charset=utf-8','app.css':'text/css; charset=utf-8'};
const json=(res,status,value)=>{const body=JSON.stringify(value);res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'none'; frame-ancestors 'none'"});res.end(body)};
const text=(res,status,body,type)=>{res.writeHead(status,{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'self'; connect-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; base-uri 'none'; object-src 'none'; frame-ancestors 'none'"});res.end(body)};
async function bodyOf(req){let bytes=0,chunks=[];for await(const x of req){bytes+=x.length;if(bytes>300000)bad(413,'BODY_TOO_LARGE','Request exceeds local preview limit');chunks.push(x)}if(!bytes)return{};try{const o=JSON.parse(Buffer.concat(chunks).toString('utf8'));if(!o||Array.isArray(o)||typeof o!=='object')bad(422,'VALIDATION','Body must be an object');return o}catch(e){if(e instanceof Problem)throw e;bad(400,'INVALID_JSON','Malformed request JSON')}}
function projectFromContract(store,actor,id){const c=store.get('SELECT * FROM contracts WHERE id=?',id);if(!c)bad(404,'NOT_FOUND','Contract not found');store.requireProject(actor,c.project_id);return c;}
function projectFromSow(store,actor,id){const s=store.get('SELECT * FROM sows WHERE id=?',id);if(!s)bad(404,'NOT_FOUND','SOW not found');store.requireProject(actor,s.project_id);return s;}
function projectFromIms(store,actor,id){const i=store.get('SELECT * FROM ims_schedules WHERE id=?',id);if(!i)bad(404,'NOT_FOUND','IMS not found');store.requireProject(actor,i.project_id);return i;}
async function route(store,req,res){const url=new URL(req.url,'http://127.0.0.1');const p=url.pathname,m=req.method;
  if(p==='/'){res.writeHead(302,{Location:'/app'});res.end();return;}
  if(STATIC.has(p)&&m==='GET'){const name=STATIC.get(p);return text(res,200,readFileSync(path.join(PUBLIC,name),'utf8'),MIME[name])}
  if(p==='/api/health'&&m==='GET')return json(res,200,{status:'ok',mode:'LOCAL_DEMO',database:'SQLite dev adapter',liveIntegrations:false});
  if(p==='/api/demo/users'&&m==='GET')return json(res,200,DEMO_USERS.map(x=>({id:x.id,name:x.display_name,role:x.demo_role})));
  if(!p.startsWith('/api/'))bad(404,'NOT_FOUND','No such page');
  if(req.headers.origin&&req.headers.origin!==`http://127.0.0.1:${req.socket.localPort}`&&req.headers.origin!==`http://localhost:${req.socket.localPort}`)bad(403,'ORIGIN','Cross-origin writes are disabled');
  const actor=req.headers['x-demo-user'];if(typeof actor!=='string')bad(401,'DEMO_IDENTITY','X-Demo-User required in local preview');store.account(actor);
  const b=['POST','PUT'].includes(m)?await bodyOf(req):{};
  let a;
  if(p==='/api/homes'&&m==='GET')return json(res,200,store.listHomes(actor));
  if(p==='/api/homes'&&m==='POST')return json(res,201,store.createHome(actor,b,req.headers['idempotency-key']));
  if((a=p.match(/^\/api\/homes\/([^/]+)$/))&&m==='GET')return json(res,200,store.requireHome(actor,a[1]));
  if((a=p.match(/^\/api\/homes\/([^/]+)\/projects$/))){if(m==='GET')return json(res,200,store.projects(actor,a[1]));if(m==='POST')return json(res,201,store.createProject(actor,a[1],b))}
  if((a=p.match(/^\/api\/homes\/([^/]+)\/audit$/))&&m==='GET')return json(res,200,store.auditLog(actor,a[1]));
  if(p==='/api/projects/mine'&&m==='GET')return json(res,200,store.listMyProjects(actor));
  if((a=p.match(/^\/api\/projects\/([^/]+)\/overview$/))&&m==='GET')return json(res,200,store.overview(actor,a[1]));
  if((a=p.match(/^\/api\/projects\/([^/]+)\/parties$/))&&m==='POST')return json(res,201,store.addParty(actor,a[1],b));
  if((a=p.match(/^\/api\/projects\/([^/]+)\/contracts$/))&&m==='POST')return json(res,201,store.createContract(actor,a[1],b));
  if((a=p.match(/^\/api\/contracts\/([^/]+)\/revisions$/))&&m==='POST'){projectFromContract(store,actor,a[1]);return json(res,201,store.createContractRevision(actor,a[1],b));}
  if((a=p.match(/^\/api\/contracts\/([^/]+)\/revisions\/([^/]+)\/approve$/))&&m==='POST'){projectFromContract(store,actor,a[1]);return json(res,200,store.approveContract(actor,a[1],a[2]));}
  if((a=p.match(/^\/api\/projects\/([^/]+)\/sows$/))&&m==='POST')return json(res,201,store.createSow(actor,a[1],b));
  if((a=p.match(/^\/api\/sows\/([^/]+)\/revisions$/))&&m==='POST'){projectFromSow(store,actor,a[1]);return json(res,201,store.createSowRevision(actor,a[1],b));}
  if((a=p.match(/^\/api\/sows\/([^/]+)\/revisions\/([^/]+)\/approve$/))&&m==='POST'){projectFromSow(store,actor,a[1]);return json(res,200,store.approveSow(actor,a[1],a[2]));}
  if((a=p.match(/^\/api\/projects\/([^/]+)\/wbs$/))&&m==='POST')return json(res,201,store.createWbs(actor,a[1],b));
  if((a=p.match(/^\/api\/projects\/([^/]+)\/boq$/))&&m==='POST')return json(res,201,store.createBoq(actor,a[1],b));
  if((a=p.match(/^\/api\/projects\/([^/]+)\/ims$/))&&m==='PUT')return json(res,200,store.ensureIms(actor,a[1],b));
  if((a=p.match(/^\/api\/ims\/([^/]+)\/revisions$/))&&m==='POST'){projectFromIms(store,actor,a[1]);return json(res,201,store.ensureScheduleRevision(actor,a[1],b));}
  if((a=p.match(/^\/api\/ims-revisions\/([^/]+)\/activities$/))&&m==='POST')return json(res,201,store.addActivity(actor,a[1],b));
  if((a=p.match(/^\/api\/ims-revisions\/([^/]+)\/dependencies$/))&&m==='POST')return json(res,201,store.addDependency(actor,a[1],b));
  if((a=p.match(/^\/api\/ims-revisions\/([^/]+)\/analysis$/))&&m==='GET')return json(res,200,store.analyze(actor,a[1]));
  if((a=p.match(/^\/api\/ims\/([^/]+)\/baseline-approvals$/))&&m==='POST'){projectFromIms(store,actor,a[1]);return json(res,200,store.approveBaseline(actor,a[1],b.revisionId));}
  bad(404,'NOT_FOUND','No such API operation');
}
export function createLocalServer({dbPath=':memory:',seedExample=true}={}){
  const store=new Store(dbPath,{seedExample});
  const server=http.createServer((req,res)=>{route(store,req,res).catch(e=>{
    if(e instanceof ScheduleError)return json(res,422,{code:'SCHEDULE',message:e.message});
    if(e instanceof Problem)return json(res,e.status,{code:e.code,message:e.message});
    if(/constraint failed|UNIQUE|CHECK constraint|FOREIGN KEY|immutable|append-only/i.test(String(e.message)))return json(res,409,{code:'CONSTRAINT',message:'Record conflicts with lifecycle or uniqueness rule'});
    console.error('Local MVP error:',e);json(res,500,{code:'SERVER_ERROR',message:'An internal local-preview error occurred'});
  })});return{server,store};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  if(process.env.NODE_ENV==='production')throw Error('BAITNA preview must not run in production mode');
  const hostname='127.0.0.1',port=Number(process.env.PORT||4100);
  if(!Number.isSafeInteger(port)||port<1||port>65535)throw Error('Invalid PORT');
  const dbPath=process.env.BAITNA_DB_PATH||path.join(dir,'data','baitna-dev.sqlite');
  const {server}=createLocalServer({dbPath,seedExample:true});
  server.listen(port,hostname,()=>console.log(`BAITNA LOCAL DEMO ONLY: http://${hostname}:${port}/app | sqlite: ${dbPath}`));
}