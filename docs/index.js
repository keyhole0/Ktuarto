!function(t){var e={};function i(n){if(e[n])return e[n].exports;var s=e[n]={i:n,l:!1,exports:{}};return t[n].call(s.exports,s,s.exports,i),s.l=!0,s.exports}i.m=t,i.c=e,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)i.d(n,s,function(e){return t[e]}.bind(null,s));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=23)}([function(t,e,i){"use strict";function n(t,e){for(let i of t.line_info)for(let t=0;t<4;++t){let n=i[t]+e.param[t];if(4==n||-4==n)return!0}return!1}function s(t,e){let i,n;for(let s=0;s<4;++s)for(let r=0;r<4;++r){if(null!=t.onboard[s][r])continue;let o=t.clone();if(o.setBoard(s,r,e),o.isQuarto())return[s,r];i=s,n=r}return[i,n]}function r(t,e){let i=[];for(let s of e)n(t,s)||i.push(s);return i}function o(t,e,i){let s=t.getIsBlankList();if(0==e.piecelist.length)return s;for(let r=0;r<4;++r)for(let o=0;o<4;++o){if(!s[r][o])continue;let a=t.clone();if(a.setBoard(r,o,i),a.isRiichi()){let t=!1;for(f of e.piecelist)if(!n(a,f)){t=!0;break}s[r][o]=t}}return s}function a(t){return t=Math.floor(t),Math.floor(Math.random()*t)}function l(t){let e=[];for(let i=0;i<4;++i)for(let n=0;n<4;++n)t[i][n]&&e.push([i,n]);return e}function c(t){for(let e=0;e<t.length;++e)for(let i=0;i<t[e].length;++i)if(t[e][i])return!0;return!1}function u(t){let e=t[0],i=0;for(let n=1;n<t.length;++n)e<t[n]&&(i=n,e=t[n]);return i}function h(t){let e=0;for(let i=0;i<t.length;++i)e+=t[i];return e}function p(t){let e=new Array(t);for(let t=0;t<e.length;++t)e[t]=0;return e}i.d(e,"c",function(){return n}),i.d(e,"d",function(){return s}),i.d(e,"g",function(){return r}),i.d(e,"f",function(){return o}),i.d(e,"h",function(){return a}),i.d(e,"e",function(){return l}),i.d(e,"a",function(){return c}),i.d(e,"b",function(){return u}),i.d(e,"i",function(){return h}),i.d(e,"j",function(){return p});class f{static open(t){}static close(){}static print(t){}}},function(t,e,i){"use strict";i.d(e,"a",function(){return n});class n{constructor(t,e,i,n){this.param=[t,e,i,n];let s=1==t?1:0,r=1==e?1:0,o=1==i?1:0,a=1==n?1:0;this.index=(s<<0)+(r<<1)+(o<<2)+(a<<3)}toDict(){return{color:1==this.param[0]?"light":"dark",shape:1==this.param[1]?"circular":"square",top:1==this.param[2]?"hollow":"solid",height:1==this.param[3]?"tall":"short"}}toNumList(){let t=new Array(4);for(let e=0;e<4;++e)t[e]=1==this.param[e]?1:2;return t}static getInstance(t){let e="light"==t.color?1:0,i="circular"==t.shape?1:0,n="hollow"==t.top?1:0,r="tall"==t.height?1:0;return s[(e<<0)+(i<<1)+(n<<2)+(r<<3)]}static getAllPiece(){return s.slice()}}const s=[new n(-1,-1,-1,-1),new n(1,-1,-1,-1),new n(-1,1,-1,-1),new n(1,1,-1,-1),new n(-1,-1,1,-1),new n(1,-1,1,-1),new n(-1,1,1,-1),new n(1,1,1,-1),new n(-1,-1,-1,1),new n(1,-1,-1,1),new n(-1,1,-1,1),new n(1,1,-1,1),new n(-1,-1,1,1),new n(1,-1,1,1),new n(-1,1,1,1),new n(1,1,1,1)]},function(t,e,i){"use strict";i.d(e,"a",function(){return s});var n=i(1);class s{constructor(t=null,e=null){if(this.piecelist=null,t){let e=[];for(let i of t){let t=n.a.getInstance(i);e.push(t)}this.piecelist=e}if(e){this.piecelist=n.a.getAllPiece();for(let t=0;t<4;++t)for(let i=0;i<4;++i){let n=e.onboard[t][i];n&&this.remove(n)}}}clone(){let t=new s;return t.piecelist=this.piecelist.slice(),t}remove(t){for(let e=0;e<this.piecelist.length;++e)this.piecelist[e]==t&&this.piecelist.splice(e,1)}toDict(){let t=[];for(let e of this.piecelist)t.push(e.toDict());return t}isEmpty(){return 0==this.piecelist.length}}},function(t,e,i){"use strict";i.d(e,"a",function(){return r});var n=i(1);class s{constructor(t=null){this.init(t)}init(t){if(this.onboard=null,t){this.onboard=[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]];for(let e=0;e<t.length;++e){let i=t[e];i.piece&&this.setBoard(i.left,i.top,n.a.getInstance(i.piece))}}}setBoard(t,e,i){this.onboard[t][e]=i}getBoard(t,e){return this.onboard[t][e]}toList(){return this.onboard}toDict(){let t=[];for(let e=0;e<4;++e)for(let i=0;i<4;++i){let n=this.onboard[e][i];n&&(n=n.toDict());let s={left:e,top:i,piece:n};t.push(s)}return t}}class r extends s{constructor(t=null){super(t)}init(t){if(this.countPiecesNum=0,this.line_info=null,t){this.line_info=new Array(10);for(let t=0;t<10;++t)this.line_info[t]=[0,0,0,0]}super.init(t)}setBoard(t,e,i){if(super.setBoard(t,e,i),i){let n=e,s=t+4;o(this.line_info[n],i.param),o(this.line_info[s],i.param),t==e&&o(this.line_info[8],i.param),t+e==3&&o(this.line_info[9],i.param)}++this.countPiecesNum}isQuarto(){for(let t=0;t<10;++t)for(let e=0;e<4;++e){let i=this.line_info[t][e];if(4==Math.abs(i))return!0}return!1}isRiichi(){for(let t=0;t<10;++t)for(let e=0;e<4;++e){let i=this.line_info[t][e];if(3==Math.abs(i))return!0}return!1}getIsBlankList(){let t=[new Array(4),new Array(4),new Array(4),new Array(4)];for(let e=0;e<4;++e)for(let i=0;i<4;++i)t[e][i]=null==this.onboard[e][i];return t}getPiecesNum(){return this.countPiecesNum}clone(){let t=new r;t.onboard=new Array(4);for(let e=0;e<4;++e){t.onboard[e]=new Array(4);for(let i=0;i<4;++i)t.onboard[e][i]=this.onboard[e][i]}t.line_info=new Array(10);for(let e=0;e<10;++e){t.line_info[e]=new Array(4);for(let i=0;i<4;++i)t.line_info[e][i]=this.line_info[e][i]}return t.countPiecesNum=this.countPiecesNum,t}}function o(t,e){for(let i=0;i<t.length;++i)t[i]+=e[i]}},,function(t,e,i){t.exports=i.p+"img/00.png"},function(t,e,i){t.exports=i.p+"img/01.png"},function(t,e,i){t.exports=i.p+"img/02.png"},function(t,e,i){t.exports=i.p+"img/03.png"},function(t,e,i){t.exports=i.p+"img/04.png"},function(t,e,i){t.exports=i.p+"img/05.png"},function(t,e,i){t.exports=i.p+"img/06.png"},function(t,e,i){t.exports=i.p+"img/07.png"},function(t,e,i){t.exports=i.p+"img/08.png"},function(t,e,i){t.exports=i.p+"img/09.png"},function(t,e,i){t.exports=i.p+"img/10.png"},function(t,e,i){t.exports=i.p+"img/11.png"},function(t,e,i){t.exports=i.p+"img/12.png"},function(t,e,i){t.exports=i.p+"img/13.png"},function(t,e,i){t.exports=i.p+"img/14.png"},function(t,e,i){t.exports=i.p+"img/15.png"},,,function(t,e,i){"use strict";i.r(e);var n=i(3),s=i(2),r=i(1);class o{constructor(t){this.name=t}setGamesys(t){this.gamesys=t}setPlayerNo(t){this.playerno=t}actionChoice(t,e){let i=this.gamesys.nowPhase();i instanceof c&&i.playerno==this.playerno&&(i.setParam(t,e),i.action())}actionPut(t,e,i){let n=this.gamesys.nowPhase();n instanceof u&&n.playerno==this.playerno&&(n.setParam(t,e,i),n.action())}}class a extends o{constructor(t,e){super(t),this.aiName=e,this.choiceWorker=new Worker("./worker/choice.js"),this.putWorker=new Worker("./worker/put.js"),this.choiceWorker.onmessage=(t=>{let e=r.a.getInstance(t.data.piece),i=t.data.call;this.actionChoice(e,i)}),this.putWorker.onmessage=(t=>{let e=t.data.left,i=t.data.top,n=t.data.call;this.actionPut(e,i,n)})}runAiChoice(){this.choiceWorker.postMessage({aiName:this.aiName,in_board:this.gamesys.board.toDict(),in_box:this.gamesys.box.toDict()})}runAiPut(){this.putWorker.postMessage({aiName:this.aiName,in_board:this.gamesys.board.toDict(),in_piece:this.gamesys.choicePiece.toDict()})}}class l{constructor(t,e){this.gamesys=t,this.playerno=e}}class c extends l{runAi(){let t=this.gamesys.players[this.playerno];t instanceof a&&t.runAiChoice()}setParam(t,e){this.piece=t,this.call=e}action(){this.gamesys.choice(this.piece,this.call),this.gamesys.disp(),this.gamesys.nextPhase()}}class u extends l{runAi(){let t=this.gamesys.players[this.playerno];t instanceof a&&t.runAiPut()}setParam(t,e,i){this.left=t,this.top=e,this.call=i}action(){this.gamesys.put(this.left,this.top,this.call),this.gamesys.disp(),this.gamesys.nextPhase()}}var h=i(5),p=i.n(h),f=i(6),d=i.n(f),m=i(7),g=i.n(m),y=i(8),b=i.n(y),w=i(9),P=i.n(w),x=i(10),_=i.n(x),v=i(11),B=i.n(v),E=i(12),N=i.n(E),k=i(13),A=i.n(k),M=i(14),I=i.n(M),G=i(15),L=i.n(G),D=i(16),j=i.n(D),Q=i(17),C=i.n(Q),O=i(18),T=i.n(O),W=i(19),S=i.n(W),H=i(20),R=i.n(H);let q=[p.a,d.a,g.a,b.a,P.a,_.a,B.a,N.a,A.a,I.a,L.a,j.a,C.a,T.a,S.a,R.a];function z(t){let e=document.createElement("img");return e.width=50,e.height=80,e.src=q[t],e}var F=i(0);const J=new o("あなた"),K=new a("モンテ","AiMontecarlo"),U=new class{constructor(){this.phases=[new c(this,0),new u(this,1),new c(this,1),new u(this,0)]}start(){this.board=new n.a([]),this.box=new s.a(null,this.board),this.choicePiece=null,this.isGameEnd=!1,this.winner=null,this.phasecount=0,this.dispInit(),this.nowPhase().runAi()}nowPhase(){return this.phases[this.phasecount]}nowPlayerNo(){return this.phases[this.phasecount].playerno}setPlayer(t,e){this.releasePlayer(),this.players=[t,e],t.setGamesys(this),t.setPlayerNo(0),e.setGamesys(this),e.setPlayerNo(1)}releasePlayer(){if(null!=this.players){for(let t of this.players)t.setGamesys(null),t.setPlayerNo(null);this.players=null}}setDisplay(t){this.display=t}choice(t,e){this.isGameEnd||this.checkQuarto(e)||(this.choicePiece=t,this.box.remove(this.choicePiece))}put(t,e,i){this.isGameEnd||(this.board.setBoard(t,e,this.choicePiece),this.choicePiece=null,this.checkQuarto(i)||this.checkBox())}checkQuarto(t){if("Quarto"==t){let t=this.nowPhase().playerno;this.board.isQuarto()?this.winner=t:this.winner=1-t,this.isGameEnd=!0}return this.isGameEnd}checkBox(){return this.box.isEmpty()&&(this.isGameEnd=!0),this.isGameEnd}dispInit(){this.display.dispInit(),this.display.dispMain(this.board,this.box,this.choicePiece)}disp(){this.display.dispMain(this.board,this.box,this.choicePiece)}gameover(){let t=null;null!=this.winner&&(t=this.players[this.winner].name),this.display.dispGameOver(t)}nextPhase(){this.isGameEnd?this.gameover():(this.phasecount=(this.phasecount+1)%this.phases.length,this.nowPhase().runAi())}},V=new class{setBoard(t){this.canvas_board=t}setBox(t){this.canvas_box=t}setPiece(t){this.canvas_piece=t}setResult(t){this.canvas_result=t}dispInit(){this.canvas_result.innerHTML=""}dispGameOver(t){this.canvas_result.innerHTML=t?"winner:"+t:"引き分け"}dispMain(t,e,i){this.dispBoard(t),this.dispBox(e),this.dispPiece(i)}dispBoard(t){for(let e=0;e<4;++e)for(let i=0;i<4;++i){let n=t.onboard[e][i],s=this.canvas_board.querySelector("#c"+e+i);if(null!=s&&(s.innerHTML="",n)){let t=z(n.index);s.appendChild(t)}}}dispBox(t){let e=document.createElement("p");if(t.piecelist){let i=0;for(let n of t.piecelist){let t=z(n.index);t.dataset.ind=i,e.appendChild(t),++i}}this.canvas_box.innerHTML="ボックス",this.canvas_box.appendChild(e)}dispPiece(t){if(this.canvas_piece.innerHTML="選択されたコマ：",t){let e=z(t.index);this.canvas_piece.appendChild(e)}}};U.setDisplay(V);const X=document.getElementById("gamestart_ai_first"),Y=document.getElementById("gamestart_you_first"),Z=document.getElementById("board"),$=document.getElementById("box"),tt=document.getElementById("piece"),et=document.getElementById("result");V.setBoard(Z),V.setBox($),V.setPiece(tt),V.setResult(et),X.addEventListener("click",t=>{U.setPlayer(K,J),U.start()}),Y.addEventListener("click",t=>{U.setPlayer(J,K),U.start()}),Z.addEventListener("click",t=>{let e=t.srcElement;if("TD"!=e.tagName)return;if(null==U.choicePiece)return;let i=Number(e.dataset.left),n=Number(e.dataset.top),s="Non";null==U.board.getBoard(i,n)&&(F.c(U.board,U.choicePiece)&&(s="Quarto"),J.actionPut(i,n,s))}),$.addEventListener("click",t=>{let e=t.srcElement;if("IMG"!=e.tagName)return;if(null!=U.choicePiece)return;let i=Number(e.dataset.ind),n=U.box.piecelist[i],s="Non";U.board.isQuarto()&&(s="Quarto"),J.actionChoice(n,s)})}]);