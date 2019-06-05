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

        let that = this;
        that.aiName = aiName;
        that.choiceWorker = new Worker('./worker/choice.js');
        that.putWorker = new Worker('./worker/put.js');

        that.choiceWorker.onmessage = function(e){
            let piece = Piece.getInstance(e.data.piece);
            let call = e.data.call;
            that.actionChoice(piece, call);
        };

        that.putWorker.onmessage = function(e){
            let left = e.data.left;
            let top = e.data.top;
            let call = e.data.call;
            that.actionPut(left, top, call);
        };

    }

    /** */
    runAiChoice() {
        this.choiceWorker.postMessage({
            aiName: this.aiName, //AIクラスのインスタンスが直接渡せないので名前を渡して向こうで生成する。
            in_board: this.gamesys.board.toDict(),
            in_box: this.gamesys.box.toDict(),
        });
    }

    /** */
    runAiPut() {
        this.putWorker.postMessage({
            aiName: this.aiName, //AIクラスのインスタンスが直接渡せないので名前を渡して向こうで生成する。
            in_board: this.gamesys.board.toDict(),
            in_piece: this.gamesys.choicePiece.toDict(),
        });
    }
};

