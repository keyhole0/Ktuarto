import * as piece from "./piece.js";

export class Board{
    /*
    ボード上のコマの配置を管理する
    */
    constructor(boardlist=null){
        this.init(boardlist);
    }

    //初期化
    init(boardlist){
        this.onboard=null
        if(boardlist){
            this.onboard = [
                [null,null,null,null],
                [null,null,null,null],
                [null,null,null,null],
                [null,null,null,null],
            ];
            for(let i=0; i<boardlist.length; ++i){
                let cell = boardlist[i];
                if(cell["piece"]){
                    this.setBoard(
                        cell["left"],
                        cell["top"],
                        piece.Piece.getInstance(cell["piece"])
                    );
                }
            }
        }
    }

    setBoard(left, top, piece){
        /*
        指定した座標にコマをセットする
        */
        this.onboard[left][top] = piece;
    }
    getBoard(left, top){
        /*
        指定した座標のコマを取得する
        */
        return this.onboard[left][top];
    }
    
    toList(){
        return this.onboard;
    }
    
    toDict(){
        let obj = [];
        for(let left=0; left<4; ++left){
            for (let top=0; top<4; ++top){
                let p = this.onboard[left][top];
                if(p) p = p.toDict();
                let dic = {
                    "left":left,
                    "top":top,
                    "piece":p,
                };
                obj.push(dic);
            }
        }
        return obj
    }
}


export class HiTechBoard extends Board{
    
    /*
    Boardの拡張クラス。Board上の情報をさらに整理するための機能を追加する。
    */

    constructor(boardlist=null){
        //コンストラクタでスーパークラスのコンストラクタより前に自身の初期化ができない(thisが使えない)ため、
        //初期化処理をinitメソッドに外出しした。
        super(boardlist);
    }

    //Boardのinitメソッドをオーバーライドする。
    //Boardのコンストラクタからこのメソッドを呼んでもらう
    init(boardlist){
        this.countPiecesNum = 0;    //おいてあるコマの数
        this.line_info = null;
        
        if(boardlist){
            this.line_info = new Array(10);
            for(let i=0; i<10; ++i){
                this.line_info[i] = [0,0,0,0];
            }
        }

        super.init(boardlist);  //
        
        /*
        line_infoに関する備考
        line_info[0]：列1 条件：top == 0
        line_info[1]：列2 条件：top == 1
        line_info[2]：列3 条件：top == 2
        line_info[3]：列4 条件：top == 3
        line_info[4]：行1 条件：left == 0
        line_info[5]：行2 条件：left == 1
        line_info[6]：行3 条件：left == 2
        line_info[7]：行4 条件：left == 3
        line_info[8]：斜1 条件：left == top
        line_info[9]：斜2 条件：left + top == 3
        
        LEFT \ TOP
        斜1 列1 列2 列3 列4 斜2
        　 ━━━━━━━━━
        行1│　 │　 │　 │　 │
        　 ━━━━━━━━━
        行2│　 │　 │　 │　 │
        　 ━━━━━━━━━
        行3│　 │　 │　 │　 │
        　 ━━━━━━━━━
        行4│　 │　 │　 │　 │
        　 ━━━━━━━━━
        */
    }

    setBoard(left, top, piece){
        /*
        セットの機能拡張
        ライン毎のリーチ状況を更新
        */
        super.setBoard(left,top,piece);
        if (piece){
            let col_index = top;     //列のインデックス
            let row_index = left+4;  //行のインデックス

            addList(this.line_info[col_index], piece.param);
            addList(this.line_info[row_index], piece.param);
            
            //斜1の判定
            if (left == top)
                addList(this.line_info[8], piece.param);

            //斜2の判定
            if (left + top == 3)
                addList(this.line_info[9], piece.param);
        }
        ++this.countPiecesNum;  //コマの数をカウントアップ
    }

    //クアルト宣言できるかどうか
    isQuarto(){
        /*
        ボードが現在クアルトできるか
        */
        //absoluteで配列の絶対値を取得
        //whereで4となっている要素のインデックスを取得
        //lenでそのサイズを測って件数を調べる
        for(let i=0; i<10; ++i){
            for(let j=0; j<4; ++j){
                let n = this.line_info[i][j];
                if(Math.abs(n) == 4)    return true;
            }
        }

        return false
    }

    //リーチかどうか
    isRiichi(){
        for(let i=0; i<10; ++i){
            for(let j=0; j<4; ++j){
                let n = this.line_info[i][j];
                if(Math.abs(n) == 3)    return true;
            }
        }

        return false
    }

    //ブランクになっている箇所を取得する。
    getIsBlankList(){
        let checkpos = [new Array(4),new Array(4),new Array(4),new Array(4)];
        for(let i=0;i<4;++i){
            for(let j=0; j<4; ++j){
                checkpos[i][j] = this.onboard[i][j] == null;
            }
        }
        return checkpos;
    }

    //おいてあるコマの数
    getPiecesNum(){
        return this.countPiecesNum;
    }
    
    clone(){
        let cobj = new HiTechBoard();

        //onboard内のPieceクラスのコピーを作成しないようにシャローコピーをする
        cobj.onboard = new Array(4);
        for(let i=0; i<4; ++i){
            cobj.onboard[i] = new Array(4);
            for(let j=0; j<4; ++j){
                cobj.onboard[i][j] = this.onboard[i][j];
            }
        }

        //line_infoはすべてコピーされていいため、ディープコピーをする
        cobj.line_info = new Array(10);
        for(let i=0; i<10; ++i){
            cobj.line_info[i] = new Array(4);
            for(let j=0; j<4; ++j){
                cobj.line_info[i][j] = this.line_info[i][j];
            }
        }

        //コマの数をコピー
        cobj.countPiecesNum = this.countPiecesNum;

        return cobj
    }
}

//リスト内の値を加算する。
function addList(l1, l2){

    for(let i=0; i<l1.length; ++i){
        l1[i] += l2[i];
    }
}
            

        
