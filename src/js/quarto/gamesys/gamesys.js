import {HiTechBoard} from '../gameobject/board.js';
import {Box} from '../gameobject/box.js';
import {GamePlayer, AIPlayer} from './gameplayer';

export class GameSys{
    
    //コンストラクタ
    constructor(player0, player1){
        this.setPlayer(player0, player1);
        this.phases = [
            new PhaseChoice(this, player0.playerno),
            new PhasePut(this, player1.playerno),
            new PhaseChoice(this, player1.playerno),
            new PhasePut(this, player0.playerno),
        ];
    }

    start(){
        this.board = new HiTechBoard([]);
        this.box = new Box(null, this.board);
        this.choicePiece = null;
        this.isGameEnd = false;
        this.winner = null; //先攻が勝ったときは1, 後攻が勝ったときは2
        this.phasecount = 0;

        //AI実行
        this.dispInit();
        this.nowPhase().runAi();
    }

    nowPhase(){
        return this.phases[this.phasecount];
    }

    nowPlayerNo(){
        return this.phases[this.phasecount].playerno;
    }

    /**
     * 
     * @param {GamePlayer} player0
     * @param {GamePlayer} player1
     */
    setPlayer(player0, player1){
        this.players = [player0, player1];
        player0.setGamesys(this);
        player0.setPlayerNo(0);
        player1.setGamesys(this);
        player1.setPlayerNo(1);
    }

    setDisplay(display){
        this.display = display;
    }

    choice(piece, call){
        if(this.isGameEnd)  return; //ゲームが終わっている場合は受け付けない

        //現在のフェーズおよびプレイヤーで無いときは受け付けない。
        //if(this.nowPhase != 'choice' || this.nowTurn != playerno) return;
        
        //クアルト宣言処理
        if(this.checkQuarto(call))  return;  //ゲームが終わる場合は終了

        //選択したコマを確保
        this.choicePiece = piece;
        this.box.remove(this.choicePiece);

    }

    put(left, top, call){
        if(this.isGameEnd)  return; //ゲームが終わっている場合は受け付けない

        //現在のフェーズおよびプレイヤーで無いときは受け付けない。
        //if(this.nowPhase != 'put' || this.nowTurn != playerno) return;
        
        //コマをボードに置く
        this.board.setBoard(left, top, this.choicePiece);
        this.choicePiece = null;
        
        //クアルト宣言処理
        if(this.checkQuarto(call))  return;  //ゲームが終わる場合は終了
        if(this.checkBox())  return;

    }

    checkQuarto(call){
        if(call == "Quarto"){
            let playerno = this.nowPhase().playerno;
            //クアルト宣言があったら終了処理
            if(this.board.isQuarto()){
                this.winner = playerno; //正しく宣言できていたらそのプレイヤーの勝ち
            }else{
                this.winner = 1-playerno; //誤った宣言の場合はもう一方のプレイヤーの勝ち
            }

            //ゲーム終了フラグON
            this.isGameEnd = true;
        }
        return this.isGameEnd;
    }

    checkBox(){
        if(this.box.isEmpty()){
            this.isGameEnd = true;
        }
        return this.isGameEnd;
    }

    dispInit(){
        this.display.dispInit();
        this.display.dispMain(this.board, this.box, this.choicePiece);
    }

    disp(){
        this.display.dispMain(this.board, this.box, this.choicePiece);
        //this.dispBoard();
        //console.log('choicePiece:'+((this.choicePiece)? this.choicePiece.toNumList():null));
        //console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    gameover(){
        let winner = null;
        if(this.winner != null) winner = this.players[this.winner].name;
        this.display.dispGameOver(winner);
        //console.log('winner:'+this.players[this.winner].name);
        //console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    nextPhase(){
        if(this.isGameEnd){
            this.gameover();
            return;
        }  

        //フェーズカウントを進める。
        this.phasecount = (this.phasecount+1) % this.phases.length;
        
        //AIの実行
        this.nowPhase().runAi();
    }
}

export class Phase{
    constructor(gamesys, playerno){
        this.gamesys = gamesys;
        this.playerno = playerno;
    }
}

export class PhaseChoice extends Phase{
    runAi(){
        let player = this.gamesys.players[this.playerno];
        if(player instanceof AIPlayer){
            player.runAiChoice();
        }
    }
    setParam(piece, call){
        this.piece = piece;
        this.call = call;
    }
    action(){
        this.gamesys.choice(this.piece, this.call);
        this.gamesys.disp();
        this.gamesys.nextPhase();
    }
}

export class PhasePut extends Phase{
    runAi(){
        let player = this.gamesys.players[this.playerno];
        if(player instanceof AIPlayer){
            player.runAiPut();
        }
    }
    setParam(left, top, call){
        this.left = left;
        this.top = top;
        this.call = call;
    }
    action(){
        this.gamesys.put(this.left, this.top, this.call);
        this.gamesys.disp();
        this.gamesys.nextPhase();
    }
}

/*
export class GameSys{

    //コンストラクタ
    constructor(p1, p2){
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

    phaseChoice(piece, call){
        
        //クアルト宣言処理
        if(call == "Quarto"){
            return (this.board.isQuarto())? "winner":"loser";
        }

        //選択したコマを確保
        this.choicePiece = piece;
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
                let p = this.board.onboard[i][j];
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
*/