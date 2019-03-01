import * as ai_base from "./ai_base.js";
export class AiWorker extends ai_base.AiBase{
    constructor(ai){
        super();
        this.ai = ai;
        this.choiceWorker = new Worker("./worker/choice.js");
        this.putWorker = new Worker("./worker/put.js");
    }

    choice(in_board, in_box){
    }
    put(in_board, in_piece){
    }
    
}