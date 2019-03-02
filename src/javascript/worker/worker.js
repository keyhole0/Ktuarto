import {AiMontecarlo} from "../quarto/ailogic/ai_montecarlo.js";
import {AiRandom} from "../quarto/ailogic/ai_random.js";
import {GameSys} from "../quarto/gamesys/gamesys.js";

onmessage = (e) => {
    gameMain();
    postMessage(1);
};

function gameMain(){
    let sys = new GameSys(new AiMontecarlo(), new AiRandom());
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
                sys.secondPhasePut();
                break;
            case 2:
                sys.secondPhaseChoice();
                break;
            case 3:
                sys.firstPhasePut();
                break;
        }
        phase = (phase+1)%4;
    }
    sys.dispBoard();
    console.log('winner:'+sys.winner);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}