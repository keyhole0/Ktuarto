!function(e){var t={};function n(i){if(t[i])return t[i].exports;var s=t[i]={i:i,l:!1,exports:{}};return e[i].call(s.exports,s,s.exports,n),s.l=!0,s.exports}n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)n.d(i,s,function(t){return e[t]}.bind(null,s));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=23)}([function(e,t,n){"use strict";function i(e,t){for(let n of e.line_info)for(let e=0;e<4;++e){let i=n[e]+t.param[e];if(4==i||-4==i)return!0}return!1}function s(e,t){let n,i;for(let s=0;s<4;++s)for(let r=0;r<4;++r){if(null!=e.onboard[s][r])continue;let o=e.clone();if(o.setBoard(s,r,t),o.isQuarto())return[s,r];n=s,i=r}return[n,i]}function r(e,t){let n=[];for(let s of t)i(e,s)||n.push(s);return n}function o(e,t,n){let s=e.getIsBlankList();if(0==t.piecelist.length)return s;for(let r=0;r<4;++r)for(let o=0;o<4;++o){if(!s[r][o])continue;let a=e.clone();if(a.setBoard(r,o,n),a.isRiichi()){let e=!1;for(f of t.piecelist)if(!i(a,f)){e=!0;break}s[r][o]=e}}return s}function a(e){return e=Math.floor(e),Math.floor(Math.random()*e)}function l(e){let t=[];for(let n=0;n<4;++n)for(let i=0;i<4;++i)e[n][i]&&t.push([n,i]);return t}function c(e){for(let t=0;t<e.length;++t)for(let n=0;n<e[t].length;++n)if(e[t][n])return!0;return!1}function u(e){let t=e[0],n=0;for(let i=1;i<e.length;++i)t<e[i]&&(n=i,t=e[i]);return n}function h(e){let t=0;for(let n=0;n<e.length;++n)t+=e[n];return t}function p(e){let t=new Array(e);for(let e=0;e<t.length;++e)t[e]=0;return t}n.d(t,"c",function(){return i}),n.d(t,"d",function(){return s}),n.d(t,"g",function(){return r}),n.d(t,"f",function(){return o}),n.d(t,"h",function(){return a}),n.d(t,"e",function(){return l}),n.d(t,"a",function(){return c}),n.d(t,"b",function(){return u}),n.d(t,"i",function(){return h}),n.d(t,"j",function(){return p});class f{static open(e){}static close(){}static print(e){}}},function(e,t,n){"use strict";n.d(t,"a",function(){return i});class i{constructor(e,t,n,i){this.param=[e,t,n,i];let s=1==e?1:0,r=1==t?1:0,o=1==n?1:0,a=1==i?1:0;this.index=(s<<0)+(r<<1)+(o<<2)+(a<<3)}toDict(){return{color:1==this.param[0]?"light":"dark",shape:1==this.param[1]?"circular":"square",top:1==this.param[2]?"hollow":"solid",height:1==this.param[3]?"tall":"short"}}toNumList(){let e=new Array(4);for(let t=0;t<4;++t)e[t]=1==this.param[t]?1:2;return e}static getInstance(e){let t="light"==e.color?1:0,n="circular"==e.shape?1:0,i="hollow"==e.top?1:0,r="tall"==e.height?1:0;return s[(t<<0)+(n<<1)+(i<<2)+(r<<3)]}static getAllPiece(){return s.slice()}}const s=[new i(-1,-1,-1,-1),new i(1,-1,-1,-1),new i(-1,1,-1,-1),new i(1,1,-1,-1),new i(-1,-1,1,-1),new i(1,-1,1,-1),new i(-1,1,1,-1),new i(1,1,1,-1),new i(-1,-1,-1,1),new i(1,-1,-1,1),new i(-1,1,-1,1),new i(1,1,-1,1),new i(-1,-1,1,1),new i(1,-1,1,1),new i(-1,1,1,1),new i(1,1,1,1)]},function(e,t,n){"use strict";n.d(t,"a",function(){return s});var i=n(1);class s{constructor(e=null,t=null){if(this.piecelist=null,e){let t=[];for(let n of e){let e=i.a.getInstance(n);t.push(e)}this.piecelist=t}if(t){this.piecelist=i.a.getAllPiece();for(let e=0;e<4;++e)for(let n=0;n<4;++n){let i=t.onboard[e][n];i&&this.remove(i)}}}clone(){let e=new s;return e.piecelist=this.piecelist.slice(),e}remove(e){for(let t=0;t<this.piecelist.length;++t)this.piecelist[t]==e&&this.piecelist.splice(t,1)}toDict(){let e=[];for(let t of this.piecelist)e.push(t.toDict());return e}isEmpty(){return 0==this.piecelist.length}}},function(e,t,n){"use strict";n.d(t,"a",function(){return r});var i=n(1);class s{constructor(e=null){this.init(e)}init(e){if(this.onboard=null,e){this.onboard=[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]];for(let t=0;t<e.length;++t){let n=e[t];n.piece&&this.setBoard(n.left,n.top,i.a.getInstance(n.piece))}}}setBoard(e,t,n){this.onboard[e][t]=n}getBoard(e,t){return this.onboard[e][t]}toList(){return this.onboard}toDict(){let e=[];for(let t=0;t<4;++t)for(let n=0;n<4;++n){let i=this.onboard[t][n];i&&(i=i.toDict());let s={left:t,top:n,piece:i};e.push(s)}return e}}class r extends s{constructor(e=null){super(e)}init(e){if(this.countPiecesNum=0,this.line_info=null,e){this.line_info=new Array(10);for(let e=0;e<10;++e)this.line_info[e]=[0,0,0,0]}super.init(e)}setBoard(e,t,n){if(super.setBoard(e,t,n),n){let i=t,s=e+4;o(this.line_info[i],n.param),o(this.line_info[s],n.param),e==t&&o(this.line_info[8],n.param),e+t==3&&o(this.line_info[9],n.param)}++this.countPiecesNum}isQuarto(){for(let e=0;e<10;++e)for(let t=0;t<4;++t){let n=this.line_info[e][t];if(4==Math.abs(n))return!0}return!1}isRiichi(){for(let e=0;e<10;++e)for(let t=0;t<4;++t){let n=this.line_info[e][t];if(3==Math.abs(n))return!0}return!1}getIsBlankList(){let e=[new Array(4),new Array(4),new Array(4),new Array(4)];for(let t=0;t<4;++t)for(let n=0;n<4;++n)e[t][n]=null==this.onboard[t][n];return e}getPiecesNum(){return this.countPiecesNum}clone(){let e=new r;e.onboard=new Array(4);for(let t=0;t<4;++t){e.onboard[t]=new Array(4);for(let n=0;n<4;++n)e.onboard[t][n]=this.onboard[t][n]}e.line_info=new Array(10);for(let t=0;t<10;++t){e.line_info[t]=new Array(4);for(let n=0;n<4;++n)e.line_info[t][n]=this.line_info[t][n]}return e.countPiecesNum=this.countPiecesNum,e}}function o(e,t){for(let n=0;n<e.length;++n)e[n]+=t[n]}},,function(e,t,n){e.exports=n.p+"img/00.png"},function(e,t,n){e.exports=n.p+"img/01.png"},function(e,t,n){e.exports=n.p+"img/02.png"},function(e,t,n){e.exports=n.p+"img/03.png"},function(e,t,n){e.exports=n.p+"img/04.png"},function(e,t,n){e.exports=n.p+"img/05.png"},function(e,t,n){e.exports=n.p+"img/06.png"},function(e,t,n){e.exports=n.p+"img/07.png"},function(e,t,n){e.exports=n.p+"img/08.png"},function(e,t,n){e.exports=n.p+"img/09.png"},function(e,t,n){e.exports=n.p+"img/10.png"},function(e,t,n){e.exports=n.p+"img/11.png"},function(e,t,n){e.exports=n.p+"img/12.png"},function(e,t,n){e.exports=n.p+"img/13.png"},function(e,t,n){e.exports=n.p+"img/14.png"},function(e,t,n){e.exports=n.p+"img/15.png"},,,function(e,t,n){"use strict";n.r(t);var i=n(3),s=n(2),r=n(1);class o{constructor(e){this.name=e}setGamesys(e){this.gamesys=e}setPlayerNo(e){this.playerno=e}actionChoice(e,t){let n=this.gamesys.nowPhase();n instanceof c&&n.playerno==this.playerno&&(n.setParam(e,t),n.action())}actionPut(e,t,n){let i=this.gamesys.nowPhase();i instanceof u&&i.playerno==this.playerno&&(i.setParam(e,t,n),i.action())}}class a extends o{constructor(e,t){super(e),this.aiName=t,this.choiceWorker=new Worker("./worker/choice.js"),this.putWorker=new Worker("./worker/put.js"),this.choiceWorker.onmessage=(e=>{let t=r.a.getInstance(e.data.piece),n=e.data.call;this.actionChoice(t,n)}),this.putWorker.onmessage=(e=>{let t=e.data.left,n=e.data.top,i=e.data.call;this.actionPut(t,n,i)})}runAiChoice(){this.choiceWorker.postMessage({aiName:this.aiName,in_board:this.gamesys.board.toDict(),in_box:this.gamesys.box.toDict()})}runAiPut(){this.putWorker.postMessage({aiName:this.aiName,in_board:this.gamesys.board.toDict(),in_piece:this.gamesys.choicePiece.toDict()})}}class l{constructor(e,t){this.gamesys=e,this.playerno=t}}class c extends l{runAi(){let e=this.gamesys.players[this.playerno];e instanceof a&&e.runAiChoice()}setParam(e,t){this.piece=e,this.call=t}action(){this.gamesys.choice(this.piece,this.call),this.gamesys.disp(),this.gamesys.nextPhase()}}class u extends l{runAi(){let e=this.gamesys.players[this.playerno];e instanceof a&&e.runAiPut()}setParam(e,t,n){this.left=e,this.top=t,this.call=n}action(){this.gamesys.put(this.left,this.top,this.call),this.gamesys.disp(),this.gamesys.nextPhase()}}var h=n(5),p=n.n(h),f=n(6),d=n.n(f),m=n(7),g=n.n(m),y=n(8),b=n.n(y),w=n(9),P=n.n(w),x=n(10),_=n.n(x),v=n(11),B=n.n(v),E=n(12),k=n.n(E),A=n(13),N=n.n(A),M=n(14),I=n.n(M),G=n(15),D=n.n(G),L=n(16),j=n.n(L),Q=n(17),C=n.n(Q),O=n(18),T=n.n(O),W=n(19),S=n.n(W),H=n(20),R=n.n(H);let q=[p.a,d.a,g.a,b.a,P.a,_.a,B.a,k.a,N.a,I.a,D.a,j.a,C.a,T.a,S.a,R.a];function z(e){let t=document.createElement("img");return t.width=50,t.height=80,t.src=q[e],t}var F=n(0);const J=new o("あなた"),K=new a("モンテ","AiMontecarlo"),U=new class{constructor(){this.phases=[new c(this,0),new u(this,1),new c(this,1),new u(this,0)]}start(){this.board=new i.a([]),this.box=new s.a(null,this.board),this.choicePiece=null,this.isGameEnd=!1,this.winner=null,this.phasecount=0,this.dispInit(),this.nowPhase().runAi()}nowPhase(){return this.phases[this.phasecount]}nowPlayerNo(){return this.phases[this.phasecount].playerno}setPlayer(e,t){this.releasePlayer(),this.players=[e,t],e.setGamesys(this),e.setPlayerNo(0),t.setGamesys(this),t.setPlayerNo(1)}releasePlayer(){if(null!=this.players){for(let e of this.players)e.setGamesys(null),e.setPlayerNo(null);this.players=null}}setDisplay(e){this.display=e}choice(e,t){this.isGameEnd||this.checkQuarto(t)||(this.choicePiece=e,this.box.remove(this.choicePiece))}put(e,t,n){this.isGameEnd||(this.board.setBoard(e,t,this.choicePiece),this.choicePiece=null,this.checkQuarto(n)||this.checkBox())}checkQuarto(e){if("Quarto"==e){let e=this.nowPhase().playerno;this.board.isQuarto()?this.winner=e:this.winner=1-e,this.isGameEnd=!0}return this.isGameEnd}checkBox(){return this.box.isEmpty()&&(this.isGameEnd=!0),this.isGameEnd}dispInit(){this.display.dispInit(),this.display.dispMain(this.board,this.box,this.choicePiece)}disp(){this.display.dispMain(this.board,this.box,this.choicePiece)}gameover(){let e=null;null!=this.winner&&(e=this.players[this.winner].name),this.display.dispGameOver(e)}nextPhase(){this.isGameEnd?this.gameover():(this.phasecount=(this.phasecount+1)%this.phases.length,this.nowPhase().runAi())}},V=new class{setBoard(e){this.canvas_board=e}setBox(e){this.canvas_box=e}setPiece(e){this.canvas_piece=e}setResult(e){this.canvas_result=e}dispInit(){this.canvas_result.innerHTML=""}dispGameOver(e){this.canvas_result.innerHTML=e?"winner:"+e:"引き分け"}dispMain(e,t,n){this.dispBoard(e),this.dispBox(t),this.dispPiece(n)}dispBoard(e){for(let t=0;t<4;++t)for(let n=0;n<4;++n){let i=e.onboard[t][n],s=this.canvas_board.querySelector("#c"+t+n);if(null!=s&&(s.innerHTML="",i)){let e=z(i.index);s.appendChild(e)}}}dispBox(e){let t=document.createElement("p");if(e.piecelist){let n=0;for(let i of e.piecelist){let e=z(i.index);e.dataset.ind=n,t.appendChild(e),++n}}this.canvas_box.innerHTML="ボックス",this.canvas_box.appendChild(t)}dispPiece(e){if(this.canvas_piece.innerHTML="選択されたコマ：",e){let t=z(e.index);this.canvas_piece.appendChild(t)}}};U.setDisplay(V);const X=document.getElementById("gamestart"),Y=document.getElementById("board"),Z=document.getElementById("box"),$=document.getElementById("piece"),ee=document.getElementById("result");function te(e,t){switch(e){case"manual":return new o(t+"(手動)");case"random":return new a(t+"(ランダム)","AiRandom");case"monte":return new a(t+"(モンテ)","AiMontecarlo")}return null}V.setBoard(Y),V.setBox(Z),V.setPiece($),V.setResult(ee),X.addEventListener("click",e=>{document.getElementById("debug_player").checked?function(){let e=document.getElementById("debug_player1"),t=document.getElementById("debug_player2"),n=te(e.value,"プレイヤー１"),i=te(t.value,"プレイヤー２");U.setPlayer(n,i),U.start()}():document.getElementById("I_plays_first").checked?(U.setPlayer(K,J),U.start()):(U.setPlayer(J,K),U.start())}),Y.addEventListener("click",e=>{let t=e.srcElement;if("TD"!=t.tagName)return;if(null==U.choicePiece)return;let n=Number(t.dataset.left),i=Number(t.dataset.top),s="Non";null==U.board.getBoard(n,i)&&(F.c(U.board,U.choicePiece)&&(s="Quarto"),J.actionPut(n,i,s))}),Z.addEventListener("click",e=>{let t=e.srcElement;if("IMG"!=t.tagName)return;if(null!=U.choicePiece)return;let n=Number(t.dataset.ind),i=U.box.piecelist[n],s="Non";U.board.isQuarto()&&(s="Quarto"),J.actionChoice(i,s)})}]);