import * as ai_base from './ai_base.js';
import * as board from '../gameobject/board.js';
import * as box from '../gameobject/box.js';
import * as piece from '../gameobject/piece.js';
import * as util from '../gameutil/util.js';
//import numpy as np

export class AiRandom extends ai_base.AiBase{
    /*
    RandomAi2にあったバグを解消。
    また、2ではputの自滅手を回避できていなかったが、それも回避するようにした。
    callだけは判定する
    */
    choice(in_board, in_box) {
        /*
        in_boxリストにある最初の１つを返す
        */
        in_board = in_board.clone();
        in_box = in_box.clone();

        //駒を選択
        let random = util.randint(in_box.piecelist.length);
        let res_piece = in_box.piecelist[random];

        //負けない手があるか？
        let oddspieces = util.oddsPieces(in_board, in_box.piecelist);

        //負けない手がある場合
        let patternsize = oddspieces.length;
        if (patternsize != 0) {
            random = util.randint(patternsize);
            res_piece = oddspieces[random];
        }

        //callの判定
        let res_call = (in_board.isQuarto()) ? 'Quarto' : 'Non';

        return {
            'piece': res_piece.toDict(),
            'call': res_call,
        };
    }

    put(in_board, in_piece) {
        /*
        in_boardからまだピースが置かれていない座標を返す
        */
        in_board = in_board.clone();

        let in_box = new box.Box(null, in_board);
        in_box.remove(in_piece);

        //つんでない手を取得
        let checkpattern = util.losePiecePos2(in_board, in_box, in_piece);
        let patternlist = util.getTrueIndex(checkpattern);

        //選択肢が残っていなければ今開いてるマスから選択
        if (patternlist.length == 0) {
            patternlist = util.getTrueIndex(in_board.getIsBlankList());
        }

        //乱数生成
        let random = util.randint(patternlist.length);
        let res_left = patternlist[random][0];
        let res_top = patternlist[random][1];

        //勝てる手がある場合それを返す
        if (util.endPiece(in_board, in_piece)) {
            let ret = util.endPiecePos(in_board, in_piece);
            res_left = ret[0];
            res_top = ret[1];
        }

        //コマを置いた上でクアルトするか判定
        in_board.setBoard(res_left, res_top, in_piece);
        let res_call = (in_board.isQuarto()) ? 'Quarto' : 'Non';

        return {
            'call': res_call,
            'left': res_left,
            'top': res_top,
        };
    }
};
