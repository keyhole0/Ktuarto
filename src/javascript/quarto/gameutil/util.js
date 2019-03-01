
export function endPiece(board, piece){
    /*
    ボードに対してその駒を置いたとき、勝てるか？
    board:HiTechBoardクラス
    piece:Pieceクラス
    */
    for(let line of board.line_info){
        for(let i=0; i<4; ++i){
            let n = line[i] + piece.param[i];       //駒のパラメータを加算
            if(n == 4 || n == -4)   return true;    //正か負で4があれば（そろっていれば）終了
        }
    }
    return false;
}

export function endPiecePos(board, piece){
    /*
    ボードに対してその駒を置いたとき、勝てる場所は
    board:HiTechBoardクラス
    piece:置くPieceクラス
    */
    let temp_l; //最後の適当な値用
    let temp_t;
    
    for(let left=0; left<4; ++left){
        for(let top=0; top<4; ++top){
            if(board.onboard[left][top] != null)   continue;   //ブランクじゃないマスはスキップ
            
            //ボードをコピーして実際にコマを割り当てて確認する。
            let tboard = board.clone();
            tboard.setBoard(left,top,piece);
            if(tboard.isQuarto()) return [left, top]; //勝てる場合、その座標を配列にして返す。
            temp_l = left;
            temp_t = top;
        }
    }

    //勝てる手がないときは適当な値
    return [temp_l, temp_t];
}

//負けないコマを取得する
export function oddsPieces(board, pieces){
    let tempbox = [];
    for(let p of pieces){
        if(endPiece(board, p)) continue;    //ゲームが終わるコマは負けるコマ
        tempbox.push(p);                    //ゲームが終わらないコマ（負けないコマ）をリストアップ
    }
    return tempbox
}

//ある座標に駒を置いたときに負けるか
//戻り値をboardに対応した4×4の配列で返す。
//trueは負けないマス
//falseは負けるマス
export function losePiecePos2(board, box, piece){
    //戻り値用の配列を初期化 まずブランクの箇所をtrueとする。
    let checkpos = board.getIsBlankList();
    
    if(box.piecelist.length==0) return checkpos;   //boxが空なら負けはしないので即リターン
    
    for(let left=0;left<4;++left){
        for(let top=0; top<4; ++top){
            if(!checkpos[left][top]) continue;  //先のチェックでfalseとなっている箇所はスキップ

            let tboard = board.clone();
            tboard.setBoard(left,top,piece);

            if(tboard.isRiichi()){
                let tb = false;
                for(p of box.piecelist){
                    if( !endPiece(tboard, p) ){   //box内のコマのうち、１つでも相手が上がれないコマがあればセーフ
                        tb = true;
                        break;
                    }
                }
                checkpos[left][top] = tb;
            }
        }
    }

    return checkpos;
}

//乱数生成（整数）
//max未満の整数を生成
export function randint(max){
    max = Math.floor(max);
    return Math.floor(Math.random() * max);
}

//4×4の配列からtrueのインデックスを取得する
export function getTrueIndex(matrix){
    let result = [];
    for(let left=0;left<4;++left){
        for(let top=0; top<4; ++top){
            if(matrix[left][top]){
                result.push([left, top]);
            }
        }
    }
    return result;
}

//いずれかがtrue
export function any(list){
    for(let i=0; i<list.length; ++i){
        for(let j=0; j<list[i].length; ++j){
            if(list[i][j])  return true;
        }
    }
    return false;
}

//リスト内でもっとも大きい値を持つインデックスを返す
export function argmax(list){
    let m = list[0];
    let retind = 0;
    for(let i=1; i<list.length; ++i){
        if(m < list[i]){
            retind = i;
            m = list[i];
        }
    }
    return retind;
}

//リストの値を合算する
export function sum(list){
    let sum = 0;
    for(let i=0; i<list.length; ++i){
        sum += list[i];
    }
    return sum;
}

//ゼロ配列の生成
export function zeros(num){
    let list = new Array(num);
    for(let i=0; i<list.length; ++i){
        list[i] = 0;
    }
    return list;
}

export class p{
    //_file=None

    static open(filename){
        //print('open file ' + filename)
        //cls._file = open(filename,'w',encoding='utf-8_sig')
    }

    static close(){
        //if(cls._file is not None){
        //    cls._file.close()
        //    cls._file = None
        //    print('close file ')
        //}
    }

    static print(str){
        //if(cls._file is not None){
        //    print(str, file=cls._file);
        //}
        //print(str);
    }

}