import {HiTechBoard} from "../../gameobject/board";
import {Box} from "../../gameobject/box";
import {aiFactory} from "./ai_factory";

onmessage = function(e) {
    let ai = aiFactory(e.data.aiName);
    let in_board = new HiTechBoard(e.data.in_board);
    let in_box = new Box(e.data.in_box);
    postMessage(ai.choice(in_board, in_box));
}
  