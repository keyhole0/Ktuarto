import {GameSys} from "./js/quarto/gamesys/gamesys";
import {GamePlayer, AIPlayer} from "./js/quarto/gamesys/gameplayer";
import {Display} from "./index_disp";
import * as util from "./js/quarto/gameutil/util";

//プレイヤーとゲームシステム用意
//const player1 = new GamePlayer('プレイヤー２');
const yourPlayer = new GamePlayer('あなた');
const montePlayer = new AIPlayer('プレイヤー１', 'AiMontecarlo');
const randPlayer = new AIPlayer('プレイヤー２', 'AiRandom');
var aiPlayer = montePlayer;
const gamesys = new GameSys(yourPlayer, aiPlayer);
const display = new Display();
gamesys.setDisplay(display);

//エレメント取得
const button_gamestart = document.getElementById('gamestart');
const div_board = document.getElementById('board');
const div_box = document.getElementById('box');
const div_piece = document.getElementById('piece');
const div_result = document.getElementById('result');
display.setBoard(div_board);
display.setBox(div_box);
display.setPiece(div_piece);
display.setResult(div_result);

//イベント
button_gamestart.addEventListener('click', e=>{
    let radio_iplaysfirst = document.getElementById('I_plays_first');
    if(radio_iplaysfirst.checked){
        gamesys.setPlayer(aiPlayer, yourPlayer);
    }else{
        gamesys.setPlayer(yourPlayer, aiPlayer);
    }
    gamesys.start();
});


div_board.addEventListener('click', e=>{
    let src = e.srcElement;
    if(src.tagName != 'TD') return;
    if(gamesys.choicePiece == null) return; //コマが選択されていない場合は何もしない。
    
    let left = Number(src.dataset.left);   //left,topを取得
    let top = Number(src.dataset.top);
    let call = 'Non';

    let cellpiece = gamesys.board.getBoard(left, top);
    if(cellpiece != null) return;   //すでにコマがおいてある場合は何もしない。
    
    if(util.endPiece(gamesys.board, gamesys.choicePiece))   call = 'Quarto';    //勝てる場合はクアルト宣言
    yourPlayer.actionPut(left, top, call);
});

div_box.addEventListener('click', e=>{
    let src = e.srcElement;
    if(src.tagName != 'SPAN') return;
    if(gamesys.choicePiece != null) return; //コマがすでに選択されている場合は何もしない。

    let index = Number(src.dataset.ind);
    let piece = gamesys.box.piecelist[index];
    let call = 'Non';
    if(gamesys.board.isQuarto()) call = 'Quarto';   //クアルトできる場合は宣言

    yourPlayer.actionChoice(piece, call);
});


