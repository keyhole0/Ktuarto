import {GameSys} from "./gamesys";

/**プレイヤークラス */
export class GamePlayer{

    /**
     * @param {GameSys} gamesys 
     * @param {number} playerno 
     */
    constructor(name){
        this.name = name;
    }

    setGamesys(gamesys){
        this.gamesys = gamesys;
    }

    setPlayerNo(playerno){
        this.playerno = playerno;
    }

    /** */
    actionChoice(piece, call){
        let nowPhase = this.gamesys.nowPhase();
        if(nowPhase instanceof PhaseChoice 
            && nowPhase.playerno == this.playerno){
            nowPhase.setParam(piece, call);
            nowPhase.action();
        }
    }

    /** */
    actionPut(left, top, call){
        let nowPhase = this.gamesys.nowPhase();
        if(nowPhase instanceof PhasePut
            && nowPhase.playerno == this.playerno){
            nowPhase.setParam(left, top, call);
            nowPhase.action();
        }
    }
}

export class AIPlayer extends GamePlayer{
    /**
     * @param {string} aiName 
     */
    constructor(aiName){
        this.aiName = aiName;
        this.choiceWorker = new Worker("./worker/choice.js");
        this.putWorker = new Worker("./worker/put.js");
        this.choiceWorker.onmessage = (e)=>{
            let piece = e.data[0];
            let call = e.data[1];
            this.actionChoice(piece, call);
        };
        this.putWorker.onmessage = (e)=>{
            let left = e.data[0];
            let top = e.data[1];
            let call = e.data[2];
            this.actionPut(left, top, call);
        };

    }

    /** */
    runAiChoice(){
        this.choiceWorker.postMessage({
            aiName:this.aiName, //AIクラスのインスタンスが直接渡せないので名前を渡す。
        });
    }

    /** */
    runAiPut(){
        this.putWorker.postMessage({
            aiName:this.aiName, //AIクラスのインスタンスが直接渡せないので名前を渡す。
        });
    }
}

