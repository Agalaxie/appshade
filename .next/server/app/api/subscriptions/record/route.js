"use strict";(()=>{var e={};e.id=2634,e.ids=[2634],e.modules={53524:e=>{e.exports=require("@prisma/client")},72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},35816:e=>{e.exports=require("process")},6162:e=>{e.exports=require("worker_threads")},72254:e=>{e.exports=require("node:buffer")},6005:e=>{e.exports=require("node:crypto")},87561:e=>{e.exports=require("node:fs")},88849:e=>{e.exports=require("node:http")},22286:e=>{e.exports=require("node:https")},87503:e=>{e.exports=require("node:net")},49411:e=>{e.exports=require("node:path")},97742:e=>{e.exports=require("node:process")},84492:e=>{e.exports=require("node:stream")},72477:e=>{e.exports=require("node:stream/web")},41041:e=>{e.exports=require("node:url")},47261:e=>{e.exports=require("node:util")},65628:e=>{e.exports=require("node:zlib")},61025:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>q,patchFetch:()=>w,requestAsyncStorage:()=>x,routeModule:()=>l,serverHooks:()=>m,staticGenerationAsyncStorage:()=>f});var n={};r.r(n),r.d(n,{POST:()=>d});var s=r(49303),o=r(88716),a=r(60670),i=r(87070),u=r(12497),p=r(13538),c=r(43895);async function d(e){try{let{userId:t}=(0,u.I)();if(!t)return c.ZP.error("Abonnement: Utilisateur non authentifi\xe9"),i.NextResponse.json({error:"Non autoris\xe9"},{status:401});let{subscriptionId:r,planId:n}=await e.json();if(!r||!n)return i.NextResponse.json({error:"Donn\xe9es d'abonnement manquantes"},{status:400});return await p.Z.user.update({where:{id:t},data:{role:"client",updatedAt:new Date}}),await p.Z.$executeRaw`
      INSERT INTO "Subscription" (
        "userId", 
        "planId", 
        "externalId", 
        "status", 
        "startDate", 
        "endDate", 
        "provider", 
        "createdAt", 
        "updatedAt"
      ) 
      VALUES (
        ${t}, 
        ${n}, 
        ${r}, 
        'active', 
        ${new Date}, 
        ${new Date(Date.now()+2592e6)}, 
        'paypal', 
        ${new Date}, 
        ${new Date}
      )
      ON CONFLICT ("userId") 
      DO UPDATE SET 
        "planId" = ${n},
        "externalId" = ${r},
        "status" = 'active',
        "startDate" = ${new Date},
        "endDate" = ${new Date(Date.now()+2592e6)},
        "updatedAt" = ${new Date}
    `,c.ZP.info(`Abonnement enregistr\xe9 avec succ\xe8s pour l'utilisateur: ${t}`),i.NextResponse.json({success:!0,message:"Abonnement enregistr\xe9 avec succ\xe8s",data:{subscriptionId:r,planId:n,userId:t,createdAt:new Date}},{status:200})}catch(e){return c.ZP.error("Erreur lors de l'enregistrement de l'abonnement:",e),i.NextResponse.json({error:"Erreur lors de l'enregistrement de l'abonnement"},{status:500})}}let l=new s.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/subscriptions/record/route",pathname:"/api/subscriptions/record",filename:"route",bundlePath:"app/api/subscriptions/record/route"},resolvedPagePath:"C:\\Users\\audif\\Desktop\\appshade\\src\\app\\api\\subscriptions\\record\\route.ts",nextConfigOutput:"",userland:n}),{requestAsyncStorage:x,staticGenerationAsyncStorage:f,serverHooks:m}=l,q="/api/subscriptions/record/route";function w(){return(0,a.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:f})}},49303:(e,t,r)=>{e.exports=r(30517)},43895:(e,t,r)=>{var n;r.d(t,{ZP:()=>p}),function(e){e[e.DEBUG=0]="DEBUG",e[e.INFO=1]="INFO",e[e.WARN=2]="WARN",e[e.ERROR=3]="ERROR",e[e.NONE=4]="NONE"}(n||(n={}));let s=3,o={},a=(e,t)=>`[${e}] ${t}`,i=e=>{let t=Date.now();if(!o[e])return o[e]={count:1,lastTime:t},!1;let r=o[e];return t-r.lastTime>1e4?(o[e]={count:1,lastTime:t},!1):(r.count++,10===r.count)?(r.lastTime=t,!1):1!==r.count},u={setLogLevel:e=>{s=e},getLogLevel:()=>s,debug:(e,...t)=>{if(s<=0){let r=`DEBUG:${e}`;if(!i(r)){let n=o[r];console.debug(a("DEBUG",e+(n&&n.count>1?` (r\xe9p\xe9t\xe9 ${n.count} fois)`:"")),...t)}}},info:(e,...t)=>{if(s<=1){let r=`INFO:${e}`;if(!i(r)){let n=o[r];console.info(a("INFO",e+(n&&n.count>1?` (r\xe9p\xe9t\xe9 ${n.count} fois)`:"")),...t)}}},warn:(e,...t)=>{if(s<=2){let r=`WARN:${e}`;if(!i(r)){let n=o[r];console.warn(a("WARN",e+(n&&n.count>1?` (r\xe9p\xe9t\xe9 ${n.count} fois)`:"")),...t)}}},error:(e,...t)=>{if(s<=3){let r=`ERROR:${e}`;if(!i(r)){let n=o[r];console.error(a("ERROR",e+(n&&n.count>1?` (r\xe9p\xe9t\xe9 ${n.count} fois)`:"")),...t)}}},once:(e,t,...r)=>{let n=`ONCE:${t}`;if(!o[n])switch(o[n]={count:1,lastTime:Date.now()},e){case 0:u.debug(t,...r);break;case 1:u.info(t,...r);break;case 2:u.warn(t,...r);break;case 3:u.error(t,...r)}}},p=u},13538:(e,t,r)=>{r.d(t,{Z:()=>o,_:()=>s});var n=r(53524);let s=global.prisma||new n.PrismaClient,o=s}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[2510,4140,2497],()=>r(61025));module.exports=n})();