import {HiTechBoard} from '../gameobject/board.js';
import {Box} from '../gameobject/box.js';
import {GamePlayer, AIPlayer} from './gameplayer';

export class GameSys{

    //コンストラクタ
    constructor() {
        this.phases = [
            new PhaseChoice(this, 0),
            new PhasePut(this, 1),
            new PhaseChoice(this, 1),
            new PhasePut(this, 0),
        ];
    }

    start() {
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

    nowPhase() {
        return this.phases[this.phasecount];
    }

    nowPlayerNo() {
        return this.phases[this.phasecount].playerno;
    }

    /**
     *
     * @param {GamePlayer} player0
     * @param {GamePlayer} player1
     */
    setPlayer(player0, player1) {
        this.releasePlayer();
        this.players = [player0, player1];
        player0.setGamesys(this);
        player0.setPlayerNo(0);
        player1.setGamesys(this);
        player1.setPlayerNo(1);
    }

    releasePlayer() {
        if (this.players == null) return;
        for (let p of this.players) {
            p.setGamesys(null);
            p.setPlayerNo(null);
        }
        this.players = null;
    }

    setDisplay(display) {
        this.display = display;
    }

    choice(piece, call) {
        if (this.isGameEnd) return; //ゲームが終わっている場合は受け付けない

        //現在のフェーズおよびプレイヤーで無いときは受け付けない。
        //if(this.nowPhase != "choice" || this.nowTurn != playerno) return;

        //クアルト宣言処理
        if (this.checkQuarto(call)) return;  //ゲームが終わる場合は終了

        //選択したコマを確保
        this.choicePiece = piece;
        this.box.remove(this.choicePiece);

    }

    put(left, top, call) {
        if (this.isGameEnd) return; //ゲームが終わっている場合は受け付けない

        //現在のフェーズおよびプレイヤーで無いときは受け付けない。
        //if(this.nowPhase != "put" || this.nowTurn != playerno) return;

        //コマをボードに置く
        this.board.setBoard(left, top, this.choicePiece);
        this.choicePiece = null;

        //クアルト宣言処理
        if (this.checkQuarto(call)) return;  //ゲームが終わる場合は終了
        if (this.checkBox()) return;

    }

    checkQuarto(call) {
        if (call == 'Quarto') {
            let playerno = this.nowPhase().playerno;
            //クアルト宣言があったら終了処理
            if (this.board.isQuarto()) {
                this.winner = playerno; //正しく宣言できていたらそのプレイヤーの勝ち
            }else {
                this.winner = 1 - playerno; //誤った宣言の場合はもう一方のプレイヤーの勝ち
            }

            //ゲーム終了フラグON
            this.isGameEnd = true;
        }
        return this.isGameEnd;
    }

    checkBox() {
        if (this.box.isEmpty()) {
            this.isGameEnd = true;
        }
        return this.isGameEnd;
    }

    dispInit() {
        this.display.dispInit();
        this.display.dispMain(this.board, this.box, this.choicePiece);
        this.dispTurn();
    }

    disp() {
        this.display.dispMain(this.board, this.box, this.choicePiece);
    }

    dispTurn(){
        let phase = this.nowPhase();
        let step = 'put';
        if(phase instanceof PhaseChoice){
            step = 'choice';
        }
        this.display.dispTurn(this.players[phase.playerno].name, step);
    }

    gameover() {
        let winner = null;
        if (this.winner != null) winner = this.players[this.winner].name;
        this.display.dispGameOver(winner);
    }

    nextPhase() {
        if (this.isGameEnd) {
            this.gameover();
            return;
        }

        //フェーズカウントを進める。
        this.phasecount = (this.phasecount + 1) % this.phases.length;

        //現在のターンを表示
        this.dispTurn();

        //AIの実行
        this.nowPhase().runAi();
    }
};

export class Phase{
    constructor(gamesys, playerno) {
        this.gamesys = gamesys;
        this.playerno = playerno;
    }
};

export class PhaseChoice extends Phase{
    runAi() {
        let player = this.gamesys.players[this.playerno];
        if (player instanceof AIPlayer) {
            player.runAiChoice();
        }
    }
    setParam(piece, call) {
        this.piece = piece;
        this.call = call;
    }
    action() {
        this.gamesys.choice(this.piece, this.call);
        this.gamesys.disp();
        this.gamesys.nextPhase();
    }
};

export class PhasePut extends Phase{
    runAi() {
        let player = this.gamesys.players[this.playerno];
        if (player instanceof AIPlayer) {
            player.runAiPut();
        }
    }
    setParam(left, top, call) {
        this.left = left;
        this.top = top;
        this.call = call;
    }
    action() {
        this.gamesys.put(this.left, this.top, this.call);
        this.gamesys.disp();
        this.gamesys.nextPhase();
    }
};
