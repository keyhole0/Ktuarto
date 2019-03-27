import {GameSys} from './js/quarto/gamesys/gamesys';
import {GamePlayer, AIPlayer} from './js/quarto/gamesys/gameplayer';
import {Display} from './index_disp';
import * as util from './js/quarto/gameutil/util';

//プレイヤーとゲームシステム用意
//const player1 = new GamePlayer("プレイヤー２");
const yourPlayer = new GamePlayer('あなた');
const aiPlayer = new AIPlayer('AI', 'AiMontecarlo');
const gamesys = new GameSys();
const display = new Display();
gamesys.setDisplay(display);

//エレメント取得
//const button_gamestart = document.getElementById("gamestart");
const button_gamestart_ai = document.getElementById('gamestart_ai_first');
const button_gamestart_you = document.getElementById('gamestart_you_first');
const div_board = document.getElementById('board');
const div_box = document.getElementById('box');
const div_piece = document.getElementById('piece');
const div_result = document.getElementById('result');
display.setBoard(div_board);
display.setBox(div_box);
display.setPiece(div_piece);
display.setResult(div_result);

//イベント
button_gamestart_ai.addEventListener('click', function(e) {
    gameStartAIfirst();
});

button_gamestart_you.addEventListener('click', function(e) {
    gameStartYoufirst();
});

function gameStartAIfirst() {
    gamesys.setPlayer(aiPlayer, yourPlayer);    //AIが先攻
    gamesys.start();
}

function gameStartYoufirst() {
    gamesys.setPlayer(yourPlayer, aiPlayer);    //AIが後攻
    gamesys.start();
}

div_board.addEventListener('click', function(e) {
    let src = e.srcElement;
    if (src.tagName != 'TD') return;
    if (gamesys.choicePiece == null) return; //コマが選択されていない場合は何もしない。

    let left = Number(src.dataset.left);   //left,topを取得
    let top = Number(src.dataset.top);
    let call = 'Non';

    let cellpiece = gamesys.board.getBoard(left, top);
    if (cellpiece != null) return;   //すでにコマがおいてある場合は何もしない。

    if (util.endPiece(gamesys.board, gamesys.choicePiece)) call = 'Quarto';    //勝てる場合はクアルト宣言
    yourPlayer.actionPut(left, top, call);

});

div_box.addEventListener('click', function(e) {
    let src = e.srcElement;
    if (src.tagName != 'IMG') return;
    if (gamesys.choicePiece != null) return; //コマがすでに選択されている場合は何もしない。

    let index = Number(src.dataset.ind);
    let piece = gamesys.box.piecelist[index];
    let call = 'Non';
    if (gamesys.board.isQuarto()) call = 'Quarto';   //クアルトできる場合は宣言
    yourPlayer.actionChoice(piece, call);

});

//デバッグ用のゲームスタート
function debugstart() {
    let p1 = document.getElementById('debug_player1');
    let p2 = document.getElementById('debug_player2');

    let debugPlayer1 = playerFactory(p1.value, 'プレイヤー１');
    let debugPlayer2 = playerFactory(p2.value, 'プレイヤー２');

    gamesys.setPlayer(debugPlayer1, debugPlayer2);
    gamesys.start();
}

//プレイヤーファクトリー
function playerFactory(val, name) {
    switch (val) {
        case 'manual': return new GamePlayer(name + '(手動)');
        case 'random': return new AIPlayer(name + '(ランダム)', 'AiRandom');
        case 'monte': return new AIPlayer(name + '(モンテ)', 'AiMontecarlo');
    }
    return null;
}
