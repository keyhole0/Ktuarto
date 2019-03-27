import {HiTechBoard} from '../../gameobject/board';
import {Piece} from '../../gameobject/piece';
import {aiFactory} from './ai_factory';

onmessage = function(e) {
    let ai = aiFactory(e.data.aiName);
    let in_board = new HiTechBoard(e.data.in_board);
    let in_piece = Piece.getInstance(e.data.in_piece);
    postMessage(ai.put(in_board, in_piece));
};

