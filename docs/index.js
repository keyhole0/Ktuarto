//import {Piece} from './javascript/quarto/gameobject/piece.js';
//import {Board, HiTechBoard} from './javascript/quarto/gameobject/board.js';
//import {Box} from './javascript/quarto/gameobject/box.js';
//import * as util from "./javascript/quarto/gameutil/util.js";
//import {AiBase} from "./javascript/quarto/ailogic/ai_base.js";
import {AiMontecarlo} from "./javascript/quarto/ailogic/ai_montecarlo.js";
import {AiRandom} from "./javascript/quarto/ailogic/ai_random.js";
import {GameSys} from "./javascript/quarto/gamesys/gamesys.js";

//エレメント取得
var button_gamestart = document.getElementById('gamestart');
var div_board = document.getElementById('board');
var button_enter = document.getElementById('enter');
var text_command = document.getElementById('command');

//イベント
function onclick(ev){
    gameMain();
}

button_gamestart.addEventListener('click', onclick);

function gameMain(){
    let sys = new GameSys(new AiRandom(), new AiMontecarlo());
    let phase = 0;
    while(!sys.isGameEnd){
        sys.dispBoard();
        console.log('choicePiece:'+((sys.choicePiece)? sys.choicePiece.toNumList():null));
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        switch(phase){
            case 0:
                sys.firstPhaseChoice();
                break;
            case 1:
                sys.firstPhasePut();
                break;
            case 2:
                sys.secondPhaseChoice();
                break;
            case 3:
                sys.secondPhasePut();
                break;

        }
        phase = (phase+1)%4;
    }
    sys.dispBoard();
    console.log('winner:'+sys.winner);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

//テストコード
/*
function testAiRandom(){
    let ai = new AiRandom();

    let board = new HiTechBoard([]);
    let bo = new Box(null, board);
    
    let rc;
    let rp;
    let call;
    while(1){
        rc = ai.choice(board, bo);
        console.log(rc);
        bo.remove(rc.piece);
        call = rc.call;
        if(call == "Quarto") break;
        rp = ai.put(board, rc.piece);
        console.log(rp);
        board.setBoard(rp.left, rp.top, rc.piece);
        call = rp.call ;
        if(call == "Quarto") break;
        if(bo.piecelist.length == 0) break;
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    for(let i=0; i<4; ++i){
        let l = [];
        for(let j=0; j<4; ++j){
            let p = board.onboard[i][j];
            if(p != null){
                p = ''+p.toNumList();
            }else{
                p = "       ";
            }
            l[j] = p;
        }
        console.log(l);
    }
    console.log(call);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

function testUtil(){
    let m = [
        {"left":1,"top":2,
            "piece":{
                "color":"dark",
                "shape":"circular",
                "top":"solid",
                "height":"tall"
            }//10
        }
    ];
    let p = Piece.getAllPiece();
    let board = new HiTechBoard(m);
    board.setBoard(0,3,p[9]);
    board.setBoard(2,1,p[11]);
    //b.setBoard(3,0,p[12]);
    console.log('util.endPiece:'+util.endPiece(board, p[12]));
    console.log('util.endPiecePos:'+util.endPiecePos(board, p[12]));
    console.log('util.oddsPieces:');
    console.log(util.oddsPieces(board, p));

    let board2 = new HiTechBoard([]);
    board2.setBoard(0,0,p[0]);
    board2.setBoard(1,0,p[1]);
    board2.setBoard(2,0,p[2]);

    board2.setBoard(0,1,p[4]);
    board2.setBoard(1,1,p[5]);
    let bo = new Box(null, board2);
    bo.remove(p[6]);
    console.log('util.losePiecePos2:');
    console.log(util.losePiecePos2(board2, bo, p[6]));
}

function testBox(){
    let m = [
        {"left":1,"top":2,
            "piece":{
                "color":"dark",
                "shape":"circular",
                "top":"solid",
                "height":"tall"
            }//10
        }
    ];
    let p = Piece.getAllPiece();
    let board = new HiTechBoard(m);
    let b = new Box(null, board);
    let b3 = b.clone();
    b3.remove(p[4]);
    console.log(b);
    console.log(b3);

    let m2 = [{
        "color":"dark",
        "shape":"circular",
        "top":"solid",
        "height":"tall"
    }];
    let b2 = new Box(m2, null);
    console.log(b2);

}

function testBoard(){
    let m = [
        {"left":1,"top":2,
            "piece":{
                "color":"dark",
                "shape":"circular",
                "top":"solid",
                "height":"tall"
            }//10
        }
    ];
    let p = Piece.getAllPiece();
    let b = new HiTechBoard(m);
    b.setBoard(0,3,p[9]);
    b.setBoard(2,1,p[11]);
    let b2 = b.clone();
    b.setBoard(3,0,p[12]);
    b2.setBoard(3,0,p[5]);
    console.log(b);
    console.log(b.isQuarto());
    console.log(b2);
    console.log(b2.isQuarto());

}

function testPiece(){
    let p = Piece.getAllPiece();
    p[0]=1;
    let p2 = Piece.getAllPiece();
    p[1].param[0]='a';
    
    console.log(p);
    console.log(p2);
}
*/