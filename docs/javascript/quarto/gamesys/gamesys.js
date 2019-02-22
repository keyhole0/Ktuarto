import {HiTechBoard} from './javascript/quarto/gameobject/board.js';
import {Box} from './javascript/quarto/gameobject/box.js';

export class GameSys{

    //コンストラクタ
    constructor(p1, p2){
        this.firstPlayer = p1;
        this.secondPlayer = p2;
        this.board = new HiTechBoard([]);
        this.box = new Box(null, this.board);
        this.choicePiece = null;
        this.isGameEnd = false;
        this.winner = null; //先攻が勝ったときは1, 後攻が勝ったときは2
    }

    firstPhaseChoice(){
        let result = this.phaseChoice(this.firstPlayer);
        this.checkEnd(1, result);
    }

    firstPhasePut(){
        let result = this.phasePut(this.firstPlayer);
        this.checkEnd(1, result);
    }

    secondPhaseChoice(){
        let result = this.phaseChoice(this.secondPlayer);
        this.checkEnd(2, result);
    }

    secondPhasePut(){
        let result = this.phasePut(this.secondPlayer);
        this.checkEnd(2, result);
    }

    checkEnd(p, result){
        //ゲーム終了フラグ
        this.isGameEnd = (result != null);
        
        //勝者
        if(result == "winner"){ //勝利
            this.winner = p;
        }else if(result == "loser"){ //負け
            this.winner = 3 - p;
        }else if(result == "draw"){ //引き分け

        }
    }

    //コマ選択フェーズ
    //引数：操作するプレイヤー
    //戻り値："winner"   そのプレイヤーの勝ち
    //       "loser"    そのプレイヤーの負け
    //       null       ゲーム続行
    phaseChoice(player){
        //プレイ
        let result = player.choice(this.board, this.box);
        
        //クアルト宣言処理
        if(result.call == "Quarto"){
            return (this.board.isQuarto())? "winner":"loser";
        }

        //選択したコマを確保
        this.choicePiece = result.piece;
        this.box.remove(this.choicePiece);

        //続行
        return null;
    }

    //コマ置くフェーズ
    //引数：操作するプレイヤー
    //戻り値："winner"   そのプレイヤーの勝ち
    //       "loser"    そのプレイヤーの負け
    //       "draw"     引き分け
    //       null       ゲーム続行
    phasePut(player){
        //プレイ
        let result =  player.put(this.board, this.choicePiece);
        
        //コマをボードに置く
        this.board.setBoard(result.left, result.top, this.choicePiece);
        this.choicePiece = null;

        //クアルト宣言処理
        if(result.call == "Quarto"){
            return (this.board.isQuarto())? "winner":"loser";
        }

        //ボックスが空なら引き分け
        if(this.box.isEmpty()) return "draw";

        //続行
        return null;
    }

    dispBoard(){
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
    }
}