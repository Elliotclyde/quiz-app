var e=Object.defineProperty,n=Object.defineProperties,t=Object.getOwnPropertyDescriptors,o=Object.getOwnPropertySymbols,l=Object.prototype.hasOwnProperty,i=Object.prototype.propertyIsEnumerable,s=(n,t,o)=>t in n?e(n,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):n[t]=o,r=(e,n)=>{for(var t in n||(n={}))l.call(n,t)&&s(e,t,n[t]);if(o)for(var t of o(n))i.call(n,t)&&s(e,t,n[t]);return e},u=(e,o)=>n(e,t(o));import{l as a,F as c,v as d,d as h,L as p,r as m,s as f,y as q,D as g,a as b,R as y,S as v}from"./vendor.eab9787a.js";function w({onAuthCallback:e}){const[n,t]=a(""),{user:o,setUser:l}=c(U);return console.log(o),d("div",{className:"modal-background"},d("div",{className:"modal"},d("h2",null,"Welcome!"),d("form",{onSubmit:function(t){t.preventDefault(),fetch("http://localhost:4000/create-user/",{headers:{"Content-Type":"application/json"},method:"POST",mode:"cors",body:JSON.stringify({name:n})}).then(((e,n)=>{if(e.ok)return e.json()})).then(((n,t)=>{document.getElementById("id").value&&(n.userId=parseInt(document.getElementById("id").value)),l(n),console.log(n),e&&e(n)}))}},d("label",{htmlFor:"new-name"},"Enter name:"),d("input",{type:"text",onChange:function(e){t(e.target.value)},value:n,name:"name",id:"new-name"})),d(h,null,d("label",{htmlFor:"id"},"User ID"),d("input",{id:"id",type:"number"}))))}!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver((e=>{for(const t of e)if("childList"===t.type)for(const e of t.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&n(e)})).observe(document,{childList:!0,subtree:!0})}function n(e){if(e.ep)return;e.ep=!0;const n=function(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerpolicy&&(n.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?n.credentials="include":"anonymous"===e.crossorigin?n.credentials="omit":n.credentials="same-origin",n}(e);fetch(e.href,n)}}();const z={title:"My quiz",user:null,questions:[{body:"What is the population of France?",answers:[{body:"65,453,399",isCorrect:!0},{body:"32,392,213",isCorrect:!1}]}]};function I(){const[e,n]=a(!1),{user:t}=c(U);function o(e){z.user=e,fetch("http://localhost:4000/create-quiz/",{headers:{"Content-Type":"application/json"},method:"POST",mode:"cors",body:JSON.stringify(z)}).then(((e,n)=>{if(e.ok)return e.json()})).then(((e,t)=>{console.log(e),n(!1),m("/editor/"+e.quizId)}))}return d("nav",null,d(p,{href:"/"},"Home"),d("button",{onClick:function(){t?o(t):n(!0)}},"Create"),d(p,{href:"/editor"},"Edit"),d(p,{href:"/host"},"Host"),e&&!t?d(w,{onAuthCallback:o}):null)}function C({data:e}){return d(h,null,d("h2",null,"Results"),d("div",null,e.quizers.map((n=>d(h,null,d("h3",null,n.name),d("table",null,d("tr",null,d("th",null,"Question"),d("th",null,"Answer"),d("th",null,"Result")),e.quiz.questions.map(((e,t)=>d("tr",null,d("td",null,e.body),d("td",null,n.answers[t].body),d("td",null,n.answers[t].isCorrect?"✔":"❌"))))),d("p",null,"Score: ",n.score))))))}function k({children:e}){return d("button",{onClick:function(e){console.log(e.target.innerText),navigator.clipboard.writeText(e.target.innerText)}},e)}function O({data:e}){return console.log(e.quizers[0]),d(h,null,d("h2",null,"Players"),d("div",null,d("table",null,d("tr",null,d("th",null,"Player"),d("th",null,"Result"),d("th",null,"Connected")),e.quizers.map((e=>d("tr",null,d("td",null,e.name),d("td",null,e.hasAnswered?e.answers[e.answers.length-1].isCorrect?"✔":"❌":"..."),d("td",null,e.connected?"connected":"disconnected")))))))}const N=(e,n)=>e.score>n.score?-1:e.score<n.score?1:0;let S;function T({roomId:e}){var n;const{user:t}=c(U),[o,l]=a(null),[i,s]=a("loading");f("loading");const r=(null==o?void 0:o.quizers)||[],u=(null==o?void 0:o.host)===(null==t?void 0:t.userId),p=o?o.quiz.questions[o.currentQuestionIndex]:null,m=o?null==(n=o.quizers.filter((e=>e.userId==(null==t?void 0:t.userId)))[0])?void 0:n.hasAnswered:null,g=!!o&&(o.hostConnected&&0===o.quizers.filter((e=>!e.connected)).length);function b(e){const n=JSON.parse(e.data);switch(n.type){case"host":n.hasStarted?s("quizzing"):s("waiting"),l(n);break;case"start":s("quizzing"),l(n);break;case"join":n.hasStarted?s("quizzing"):s("waiting"),l(n);break;case"disconnect":case"nextQuestion":l(n);break;case"failure":break;case"answer":l(n),n.currentQuestionIndex>=n.quiz.questions.length&&(s("end"),S.removeEventListener("message",b),S.close())}}function y(){fetch("http://localhost:4000/start-quiz",{headers:{"Content-Type":"application/json"},method:"POST",mode:"cors",body:JSON.stringify({roomId:e})}).then(((e,n)=>e.json())).then(((e,n)=>{console.log(e)}))}return q((()=>{if(t)return S=new EventSource("http://localhost:4000/join-quiz/"+e+"/"+t.userId),S.addEventListener("message",b),()=>{S.removeEventListener("message",b),S.close()}}),[t,e]),d("div",null,null==t?d(w,null):"",(()=>{switch(i){case"loading":return" . . . ";case"waiting":return d(h,null,u?d(h,null,d("h2",null,"Waiting for quizers..."),d("p",null,"You're hosting"),d("p",null,"Send your friends this link to join:"),d(k,null,{}.VITE_FRONTEND_URL+"/quiz/"+e)):o.hostConnected?d("h2",null,"Waiting for host to start the quiz"):d("h2",null,"Host disconnected. Waiting for them to reconnect."),d("div",null,d("h3",null,"Current quizers:"),0==r.length?"Noone's joined the quiz yet!":r.map((e=>e.userId==t.userId?d("p",null,"You are ready to quiz"):e.connected?d("p",null,e.name.charAt(0).toUpperCase()+e.name.slice(1)," ","is ready to quiz"):d("p",null,e.name.charAt(0).toUpperCase()+e.name.slice(1)," ","has disconnected")))),u?d("button",{disabled:0==(null==o?void 0:o.quizers.length)||!g,onClick:y},"Start quiz"):null);case"quizzing":return u?d(h,null,d("h2",null,"Quizers are on question ",o.currentQuestionIndex+1),d(O,{data:o})):d(h,null,d("h2",null,"Question ",o.currentQuestionIndex+1),d("h3",null,p.body),p.answers.map(((n,o)=>d("button",{disabled:m||!g,onClick:()=>{var n;n=o,fetch("http://localhost:4000/answer/",{headers:{"Content-Type":"application/json"},method:"POST",mode:"cors",body:JSON.stringify({roomId:e,user:t,answerIndex:n})})}},n.body))),d(O,{data:o}));case"end":return r.sort(N)[0],d(h,null,d("h2",null,function(e,n){const t=e.sort(N),o=t.filter((e=>e.score===t[0].score));return 1==o.length?t[0].userId==n.userId?"You win!":"The winner is: "+t[0].name:"It was a draw between: "+o.map((e=>e.name)).join(", ")}(r,t)),d(C,{data:o}))}})())}function j({roomId:e}){return d(h,null,d(I,null),d("div",null,d(T,{roomId:e})))}function x(){return d(h,null,d(I,null),d("div",null,d("h1",null,"Open-quiz"),d("ul",null,d("li",null,"Make a quiz"),d("li",null,"Invite your friends"),d("li",null,"Test their knowledge"))))}const D=(e,n,t=[])=>{const[o,l]=a(null);return q((()=>{n&&fetch(e).then((function(e){if(!e.ok)throw Error(e.statusText);return e.json()})).then((function(e){console.log(e),l(e)})).catch((function(e){console.log(e),console.log("Looks like there was a problem: \n",e)}))}),[e,...t]),o};function E({listData:e}){return d("div",null,e.map((e=>d(h,null,d("h2",null,e.title),d("p",null,d("a",{href:"./editor/"+e.quizId}," Edit this quiz"))))))}function P({onDeleteCallback:e}){return d("div",{className:"modal-background"},d("div",{className:"modal"},d("h2",null,"Delete this quiz?"),d("button",{onClick:()=>e(!0)},"Yes"),d("button",{onClick:()=>e(!1)},"No")))}function L({quizId:e}){const{user:n}=c(U);console.log(e);const t=D("http://localhost:4000/get-quiz/"+e,""!==e),o=D("http://localhost:4000/get-user-quizes/"+(null==n?void 0:n.userId),""===e&&n,[e]);return d(h,null,d(I,null),d("div",{className:"quiz-edit-wrapper"},d("h1",null,"Quiz editor"),""!=e?null!=t?d(Q,{initialData:t,quizId:e}):d("p",null,"Loading . . ."):d(h,null,null==n?d(w,null):"",d("h1",null,"Select quiz to edit"),null!=o?d(E,{listData:o}):d("p",null,"Loading . . ."))))}function Q({initialData:e,quizId:n}){const[t,o]=a(e),[l,i]=a(!1);return q((()=>{console.log(t)})),d(h,null,l?d(P,{onDeleteCallback:function(e){e?fetch("http://localhost:4000/delete-quiz/"+n,{headers:{"Content-Type":"application/json"},method:"POST",mode:"cors",body:JSON.stringify(t)}).then(((e,n)=>e.json())).then(((e,n)=>{console.log("here"),"deleted"===e.result&&(window.location.href={}.VITE_FRONTEND_URL+"/editor")})):i(!1)}}):"",d("form",{onSubmit:function(e){e.preventDefault(),console.log(JSON.stringify(t)),fetch("http://localhost:4000/edit-quiz/"+n,{headers:{"Content-Type":"application/json"},method:"POST",mode:"cors",body:JSON.stringify(t)})},action:"",method:"post"},d("div",{className:"title-input-wrapper"},d("label",{className:"title-input-label",htmlFor:"title-input"},"Title:"),d("input",{id:"title-input",type:"text",value:t.title,name:"title",onInput:function(e){o((n=>u(r({},n),{title:e.target.value})))}})),t.questions.map(((e,n)=>d("div",{key:n},d("div",{className:"question-input-wrapper"},d("label",{htmlFor:"question-input-text-"+n},"Question ",n+1,":"),d("input",{className:"question-input",id:"question-input-text-"+n,type:"text",name:"questionInputText"+n,onInput:e=>{!function(e,n){o((t=>u(r({},t),{questions:t.questions.map(((t,o)=>o==n?u(r({},t),{body:e.target.value}):t))})))}(e,n)},value:e.body})),e.answers.map(((t,l)=>d("div",{key:l},d("label",{htmlFor:"answer-input-text-"+l},"Answer ",l+1,":"),d("input",{id:"answer-input-text-"+l,type:"text",name:"answerInputText"+l,onInput:e=>{!function(e,n,t){o((o=>u(r({},o),{questions:o.questions.map(((l,i)=>i==n?u(r({},l),{answers:o.questions[n].answers.map(((n,o)=>o==t?u(r({},n),{body:e.target.value}):n))}):l))})))}(e,n,l)},value:t.body}),d("label",{htmlFor:"answer-input-is-correct-"+l},"Correct?"),d("input",{id:"answer-input-is-correct-"+l,type:"checkbox",name:"answerInputIsCorrect"+l,checked:t.isCorrect,onChange:e=>{!function(e,n,t){o((o=>u(r({},o),{questions:o.questions.map(((o,l)=>l==e?u(r({},o),{answers:o.answers.map(((e,o)=>u(r({},e),o===n?{isCorrect:"on"==t}:{isCorrect:!1})))}):o))})))}(n,l,e.target.value)}}),d("button",{disabled:e.answers.length<=2,onClick:e=>{!function(e,n,t){e.preventDefault(),o((e=>u(r({},e),{questions:[...e.questions.map(((e,o)=>o!=n?e:u(r({},e),{answers:e.answers.filter(((e,n)=>n!=t))})))]})))}(e,n,l)}},"Remove Answer")))),d("button",{disabled:e.answers.length>=4,onClick:e=>{!function(e,n){e.preventDefault(),o((e=>u(r({},e),{questions:e.questions.map(((e,t)=>t==n?u(r({},e),{answers:[...e.answers,{body:"",isCorrect:!1}]}):e))})))}(e,n)}},"Add answer"),d("button",{disabled:t.questions.length<=1,onClick:e=>{!function(e,n){o((e=>u(r({},e),{questions:[...e.questions.filter(((e,t)=>t!=n))]})))}(0,n)}},"Remove Question")))),d("button",{onClick:function(e){e.preventDefault(),o((e=>u(r({},e),{questions:[...e.questions,{body:"",answers:[{body:"",isCorrect:!0},{body:"",isCorrect:!1}]}]})))}},"Add Question"),d("div",{className:"save-wrapper"},d("input",{type:"submit",value:"Save"}),d("button",{onClick:function(e){e.preventDefault(),console.log(JSON.stringify(t)),fetch("http://localhost:4000/edit-quiz/"+n,{headers:{"Content-Type":"application/json"},method:"POST",mode:"cors",body:JSON.stringify(t)}).then(((e,n)=>e.json())).then(((e,t)=>(window.location.href={}.VITE_FRONTEND_URL+"/quiz/"+n,e.json())))}},"Save and host"))),d("button",{onClick:()=>{i(!0)}},"Delete quiz"))}function A({listData:e}){const{user:n}=c(U),t=e.filter((e=>e.quizUser===(null==n?void 0:n.userId)));function o(e){e.preventDefault(),fetch("http://localhost:4000/host-quiz",{body:JSON.stringify({userId:n.userId,quizId:parseInt(e.target.dataset.quizid)}),headers:{"Content-Type":"application/json"},method:"POST"}).then((function(e){if(!e.ok)throw Error(e.statusText);return e.json()})).then((function(e){console.log(e),m("/quiz/"+e.roomId)})).catch((function(e){console.log(e),console.log("Looks like there was a problem: \n",e)}))}return d("div",null,t.map((e=>d(h,null,d("h2",null,e.title),d("p",null,d("a",{onClick:o,"data-quizid":e.quizId,href:"./quiz/"+e.quizId}," ","Host this quiz"))))))}function R(){const{user:e}=c(U),n=D("http://localhost:4000/get-quiz/",!0);return d(h,null,d(I,null),null==e?d(w,null):"",n?d("div",null,d("h1",null,"Quizes"),d(A,{listData:n})):d("div",null,"Loading quizes . . ."))}const U=g({user:null,setUser:()=>{}});function J(e){const[n,t]=a(window.inMemoryUser),o=b((()=>({user:n,setUser:e=>{t(e)}})),[n]);return d(U.Provider,{value:o},d(y,null,d(x,{path:"/"}),d(L,{path:"/editor/:quizId?"}),d(R,{path:"/host/:quizId?"}),d(j,{path:"/quiz/:roomId?"})))}window.inMemoryUser=null;v(d(J,null),document.getElementById("app")),document.title="Quiz app";
