import {GameSys, PhaseChoice, PhasePut} from './gamesys';
import {Piece} from '../gameobject/piece';

/**プレイヤークラス */
export class GamePlayer{

    /**
     * @param {GameSys} gamesys
     * @param {number} playerno
     */
    constructor(name) {
        this.name = name;
    }

    setGamesys(gamesys) {
        this.gamesys = gamesys;
    }

    setPlayerNo(playerno) {
        this.playerno = playerno;
    }

    /** */
    actionChoice(piece, call) {
        let nowPhase = this.gamesys.nowPhase();
        if (nowPhase instanceof PhaseChoice &&
            nowPhase.playerno == this.playerno) {
            nowPhase.setParam(piece, call);
            nowPhase.action();
        }
    }

    /** */
    actionPut(left, top, call) {
        let nowPhase = this.gamesys.nowPhase();
        if (nowPhase instanceof PhasePut &&
            nowPhase.playerno == this.playerno) {
            nowPhase.setParam(left, top, call);
            nowPhase.action();
        }
    }
};

export class AIPlayer extends GamePlayer{
    /**
     * @param {string} aiName
     */
    constructor(name, aiName) {
        super(name);
        this.aiName = aiName;
        this.choiceWorker = new Worker('./worker/choice.js');
        this.putWorker = new Worker('./worker/put.js');
        this.choiceWorker.onmessage = (e) => {
            let piece = Piece.getInstance(e.data.piece);
            let call = e.data.call;
            this.actionChoice(piece, call);
        };
        this.putWorker.onmessage = (e) => {
            let left = e.data.left;
            let top = e.data.top;
            let call = e.data.call;
            this.actionPut(left, top, call);
        };

    }

    /** */
    runAiChoice(){
        this.choiceWorker.postMessage({
            aiName:this.aiName, //AIクラスのインスタンスが直接渡せないので名前を渡して向こうで生成する。
            in_board:this.gamesys.board.toDict(),
            in_box:this.gamesys.box.toDict(),
        });
    }

    /** */
    runAiPut(){
        this.putWorker.postMessage({
            aiName:this.aiName, //AIクラスのインスタンスが直接渡せないので名前を渡して向こうで生成する。
            in_board:this.gamesys.board.toDict(), 
            in_piece:this.gamesys.choicePiece.toDict(),
        });
    }
}

