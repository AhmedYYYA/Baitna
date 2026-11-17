// Day-calendar CPM prototype. Does not yet model weekends, holidays or resources.
export class ScheduleError extends Error { constructor(message) { super(message); this.name = 'ScheduleError'; } }
const DAY = 86400000;
function ordinal(iso) {
  if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) throw new ScheduleError('Invalid ISO date');
  const n = Date.parse(iso + 'T00:00:00Z');
  if (!Number.isFinite(n) || new Date(n).toISOString().slice(0,10) !== iso) throw new ScheduleError('Invalid calendar date');
  return n / DAY;
}
export function analyzeSchedule({baseDate,activities,dependencies}) {
  const startDay=ordinal(baseDate), map=new Map(), incoming=new Map(), outgoing=new Map();
  for(const a of activities){
    if(map.has(a.id)) throw new ScheduleError('Duplicate activity');
    if(!Number.isSafeInteger(a.duration_days) || a.duration_days<0) throw new ScheduleError('Invalid duration');
    map.set(a.id,{...a,minStart:Math.max(0,ordinal(a.planned_start)-startDay)});
    incoming.set(a.id,[]); outgoing.set(a.id,[]);
  }
  for(const d of dependencies){
    const p=map.get(d.predecessor_id),s=map.get(d.successor_id);
    if(!p||!s||p.id===s.id||!['FS','SS','FF','SF'].includes(d.link_type) || !Number.isSafeInteger(d.lag_days)) throw new ScheduleError('Invalid dependency');
    // Start(successor) >= Start(predecessor) + weight.
    const weight=({FS:p.duration_days,SS:0,FF:p.duration_days-s.duration_days,SF:-s.duration_days})[d.link_type]+d.lag_days;
    outgoing.get(p.id).push({to:s.id,weight}); incoming.get(s.id).push({from:p.id,weight});
  }
  const degree=new Map([...map.keys()].map(id=>[id,incoming.get(id).length]));
  const queue=[...map.keys()].filter(id=>degree.get(id)===0),order=[];
  for(let pos=0;pos<queue.length;pos++){
    const id=queue[pos];order.push(id);
    for(const link of outgoing.get(id)) {degree.set(link.to,degree.get(link.to)-1);if(degree.get(link.to)===0)queue.push(link.to)}
  }
  if(order.length!==map.size)throw new ScheduleError('Schedule dependency cycle detected');
  const es=new Map();
  for(const id of order){const a=map.get(id);let early=a.minStart;
    for(const d of incoming.get(id))early=Math.max(early,es.get(d.from)+d.weight);
    es.set(id,early);
  }
  const finish=order.length?Math.max(...order.map(id=>es.get(id)+map.get(id).duration_days)):0;
  const ls=new Map();
  for(const id of order.slice().reverse()){
    const a=map.get(id);let late=finish-a.duration_days;
    for(const d of outgoing.get(id))late=Math.min(late,ls.get(d.to)-d.weight);
    ls.set(id,late);
  }
  const date=n=>new Date((startDay+n)*DAY).toISOString().slice(0,10);
  return {calendar:'calendar_days_v1',completionDate:date(finish),totalDurationDays:finish,
    activities:order.map(id=>{const a=map.get(id);const totalFloatDays=ls.get(id)-es.get(id);return {
      id,code:a.code,title:a.title,wbsId:a.wbs_id,durationDays:a.duration_days,
      earliestStart:date(es.get(id)),earliestFinish:date(es.get(id)+a.duration_days),
      totalFloatDays,critical:totalFloatDays===0
    }}),criticalPathCodes:order.filter(id=>ls.get(id)===es.get(id)).map(id=>map.get(id).code)};
}