import {GameSys} from "./js/quarto/gamesys/gamesys";
import {GamePlayer, AIPlayer} from "./js/quarto/gamesys/gameplayer";
import {Display} from "./index_disp";

//プレイヤーとゲームシステム用意
//const player1 = new GamePlayer('プレイヤー２');
const player1 = new AIPlayer('プレイヤー１', 'AiMontecarlo');
const player2 = new AIPlayer('プレイヤー２', 'AiRandom');
const gamesys = new GameSys(player1, player2);
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
    gamesys.start();
});
