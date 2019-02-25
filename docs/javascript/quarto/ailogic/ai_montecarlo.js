import * as ai_base from "./ai_base.js";
import * as board from "../gameobject/board.js";
import * as box from "../gameobject/box.js";
import * as piece from "../gameobject/piece.js";
import * as util from "../gameutil/util.js";
import "https://cdn.jsdelivr.net/gh/nicolaspanel/numjs@0.15.1/dist/numjs.min.js";   //numpyライクなnumjsライブラリをimport
let np = nj;    //numjsをnumpyのエイリアスに合わせる

/*
UCB1計算関連のクラス
numpyを前提に構成
*/
function ucb1(count, win, total, c=1.5, fpu=100){
    //0があると除算が計算できないので除外
    let notzerocount = np.where(count == 0, 1, count);
    
    //ucb1値を計算
    let result = win / notzerocount + c * np.sqrt( ( 2 * np.log(total) ) / notzerocount );
    
    //0の箇所は事前に決めたfpu値を返す
    return np.where(count == 0, fpu, result);
}

/**
 * モンテカルロ用パラメータクラス
 */
export class MontecarloParameter{
    constructor(){
        this.playoutTimelimit = 6   //プレイアウトの時間制限
        this.ucb1_c = 1.0           //ucb1のc定数
        this.ucb1_fpu = 100         //fpu値
        this.playoutDepthBorder = 4 //プレイアウトをさらに深くする閾値   -1はチェックしない
        this.putCgt = 10
        this.choiceCgt = 11
    }
}

/**
 * ゲーム木を生成するクラス
 * 内容は適当な値を返す処理を記述
 * callだけは判定する
 */
export class AiMontecarlo extends ai_base.AiBase{
    constructor(param = new MontecarloParameter()){
        super();
        this.param = param;
    }

    /**in_boxリストにある最初の１つを返す */
    choice(in_board, in_box){
        in_board = in_board.clone();
        in_box = in_box.clone();

        let res_piece = null;
        
        if(in_box.piecelist.length == 16){
            //負荷軽減のため、最初の一手はランダムで返す。（どれ選んでも同じでしょ、思考させるだけ無駄）
            let randnum = util.randint( in_box.piecelist.length );
            res_piece = in_box.piecelist[randnum];

        }else{
            //モンテカルロロジック実行
            let branchinfo = new MonteBranchInfo(in_board, in_box, null, true, this.param);
            res_piece = branchinfo.runChoice();
        }
            
        //callの判定
        let res_call = (in_board.isQuarto())? "Quarto":"Non";

        return {
            'piece':res_piece,
            'call':res_call,
        };
    }

    /**in_boardからまだピースが置かれていない座標を返す */
    put(in_board, in_piece){
        in_board = in_board.clone();
        
        //Boxを生成
        let in_box = new box.Box(null, in_board);
        in_box.remove(in_piece);

        //モンテカルロ木探索を行う。
        let branchinfo = new MonteBranchInfo(in_board, in_box, in_piece, true, this.param);
        let putres = branchinfo.runPut();
        let res_left = putres[0];
        let res_top = putres[1];
        
        //コマを置いた上でクアルトするか判定
        in_board.setBoard(res_left, res_top, in_piece);
        let res_call = (in_board.isQuarto())? "Quarto":"Non";

        return {
            'call':res_call,
            'left':res_left,
            'top':res_top,
        };
    }
}

/**モンテカルロ法の乱数処理部分 */
class MonteBranchRand{
    
    constructor(board, box, piece, myturn){
        this.board = board;
        this.box = box;
        this.piece = piece;
        this.myturn = myturn;
        this.winner = null;
    }
    
    run(){
        while(this.winner == null){
            //駒がなければchoice
            if (this.piece == null){
                //choice前、boxが空ならゲーム終了なのでループを出る。
                if(this.box.piecelist.length==0){
                    break;
                }

                this.choiceRand();
                this.myturn = !this.myturn; //choiceの後プレイヤーを交代

            //駒があればput
            }else{
                this.putRand();

                //put後、boxが空ならゲーム終了なのでループを出る。
                if(this.box.piecelist.length==0){
                    break;
                }
            }
        }
        
        //勝者を返す
        return this.winner;
    }
    
    putRand(){
        //このputで勝てる場合、自分が勝って終了
        if(util.endPiece(this.board, this.piece)){
            this.winner = this.myturn;
            return;
        }
        
        let checkpattern = util.losePiecePos2(this.board,this.box,this.piece);

        //選択肢が残っていなければ負けを返す
        if ( !util.any(checkpattern) ){
            this.winner = !this.myturn;
            return;
        }
        
        let patternlist = util.getTrueIndex(checkpattern);
        
        //乱数生成
        let random = util.randint(patternlist.length);

        //手を進める
        this.board.setBoard(patternlist[random][0], patternlist[random][1], this.piece);
        
        //選んだ駒を空にする
        this.piece = null;
    }

    choiceRand(){
        //勝ち目のあるピースを取得
        let oddspieces = util.oddsPieces(this.board, this.box.piecelist);

        //どれを選んでも負ける場合
        let patternsize = oddspieces.length;
        if (patternsize == 0){
            this.winner = !this.myturn;   //相手の勝ち
            return;
        }

        //乱数生成
        let random = util.randint( patternsize );

        //駒を選択
        this.piece = oddspieces[random];

        //boxから駒をはずす。
        this.box.remove(this.piece);
    }

}


/**
 * MonteBranchRandのonLeafメソッドを仮で行うためのクラス
 * if(this.parent is not null)で毎回チェックをなくすための処置
 */
class DammyBranch{
    constructor(){
        this.myturn = true;
        this.winner = false;
        this.isLeaf = false;
        this.branchlostcounter = 0;
        this.leafcounter = 0;
        this.branchnum = 1;
    }
    
    onLeaf(){}
}


class MonteBranchInfo{
    
    constructor(board, box, piece, myturn, param, parent=new DammyBranch()){
        this.board = board;              //ボード
        this.box = box;                  //ボックス
        this.piece = piece;              //駒
        this.myturn = myturn;            //ターン（trueが自分）
        this.param = param;              //プレイアウト試行回数

        this.branchList = null;          //ブランチリスト
        this.left = null;                //putのleft座標
        this.top = null;                 //putのtop座標
        
        this.branchnum = 0;              //ブランチの数
        this.branchPlayoutCount = null;  //ブランチプレイアウト数（numpy配列）
        this.branchPlayoutWin = null;    //ブランチプレイアウト勝利数（numpy配列）
        this.branchPlayoutDraw = null;   //ブランチプレイアウト引分数（numpy配列）
        this.branchPlayoutTotal = 0;     //ブランチプレイアウトの合計（数値）

        this.branchPlayoutTarget = 0;    //ブランチプレイアウトを行う対象
        this.branchlostcounter = 0;      //負けブランチの数をカウントする
        this.leafcounter = 0;            //枝が葉になった数をカウントする

        this.isLeaf = false;             //ゲーム葉フラグ。ゲームの決着がついたフラグ。gameoverとほぼ同義
        this.winner = null;              //ゲームの勝者
        this.parent = parent;            //親ブランチ
    }

    runChoice(){
        let randnum = util.randint( this.box.piecelist.length );
        return this.box.piecelist[randnum];
    }

    runPut(){
        let patternlist = util.getTrueIndex(this.board.getIsBlankList());
        
        //乱数生成
        let random = util.randint(patternlist.length);
        return patternlist[random];
    }
}