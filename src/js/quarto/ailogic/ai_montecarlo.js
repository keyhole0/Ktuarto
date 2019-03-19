import * as ai_base from "./ai_base.js";
import * as board from "../gameobject/board.js";
import * as box from "../gameobject/box.js";
import * as piece from "../gameobject/piece.js";
import * as util from "../gameutil/util.js";

/*
UCB1計算関連のクラス
numpyを前提に構成
*/
function ucb1(count, win, total, c=1.5, fpu=100){
    let result = count.slice();

    for(let i=0; i<count.length; ++i){
        if(count[i] == 0){  //0の箇所は計算不能のため、事前に決めたfpu値を返す
            result[i] = fpu;
            continue;
        }
        let notzerocount = count[i];
        
        //ucb1値を計算
        result[i] = win[i] / notzerocount + c * Math.sqrt( ( 2 * Math.log(total) ) / notzerocount );
    }

    return result;
}

/**
 * モンテカルロ用パラメータクラス
 */
export class MontecarloParameter{
    constructor(){
        this.playoutTimelimit = 1000;   //プレイアウトの時間制限（ミリ秒）
        this.ucb1_c = 1.0;           //ucb1のc定数
        this.ucb1_fpu = 100;         //fpu値
        this.playoutDepthBorder = 4; //プレイアウトをさらに深くする閾値   -1はチェックしない
        this.putCgt = 10;
        this.choiceCgt = 11;
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
            branchinfo.releaseRelation();   //内部で保持している参照関係を外す（メモリリーク対策）
        }
            
        //callの判定
        let res_call = (in_board.isQuarto())? "Quarto":"Non";

        return {
            "piece":res_piece.toDict(),
            "call":res_call,
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
        branchinfo.releaseRelation();   //内部で保持している参照関係を外す（メモリリーク対策）
        let res_left = putres[0];
        let res_top = putres[1];
        
        //コマを置いた上でクアルトするか判定
        in_board.setBoard(res_left, res_top, in_piece);
        let res_call = (in_board.isQuarto())? "Quarto":"Non";

        return {
            "call":res_call,
            "left":res_left,
            "top":res_top,
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
        //ブランチ生成
        let cgtflag = this.board.getPiecesNum() >= this.param.choiceCgt;
        this.createChoiceBranch(cgtflag);

        //勝てる手がなければ（ブランチがなければ）先頭を返す。
        if( this.branchList == null ){
            return this.box.piecelist[0];
        }
        
        //ルート探査
        let topScoreIndex = this.searchRoute();
        return this.branchList[topScoreIndex].piece;
    }

    runPut(){
        //このputで勝てる場合、勝てる手を選んで終了
        if(util.endPiece(this.board, this.piece)){
            return util.endPiecePos(this.board, this.piece);  //戻り値はleft, topの二つ
        }
        
        //ブランチの生成
        let cgtflag = this.board.getPiecesNum() >= this.param.putCgt;
        this.createPutBranch(cgtflag);
        
        //勝てる手がなければ（ブランチがなければ）先頭を返す。
        if( this.branchList == null ){
            let index = util.getTrueIndex(this.board.getIsBlankList());
            return index[0];
        }

        //ルート探査
        let topScoreIndex = this.searchRoute();
        return [this.branchList[topScoreIndex].left, this.branchList[topScoreIndex].top];
    }

    /**
     * ゲーム木生成処理（choice）
     * @param cgtflag Trueのとき完全ゲーム木を生成する。
     */
    createChoiceBranch(cgtflag){
        //駒が無ければ終了
        if(this.box.isEmpty()){
            this.isLeaf = true;
            this.onLeaf();
            return;
        }

        //勝ち目の無い選択を減らす
        let oddspieces = util.oddsPieces(this.board, this.box.piecelist);

        //ブランチの数を設定
        this.branchnum = oddspieces.length;

        //手がなかったら何もしない
        if(this.branchnum == 0){
            this.winner = !this.myturn;   //相手の勝ち
            this.isLeaf = true;
            this.onLeaf();
            return;
        }
        
        this.branchList = [];
        for(let p of oddspieces){
            let tbox = this.box.clone();
            tbox.remove(p);
            let bi = new MonteBranchInfo(
                this.board.clone(),     //現状のボードのクローンを渡す
                tbox,                   //次の想定の残り駒を渡す
                p,                      //次の想定のピースを渡す
                !this.myturn,           //相手プレイヤーの手版になる
                this.param,             //パラメータ
                this
            );
            this.branchList.push(bi);
        }
        
        if(cgtflag){
            //choiceの完全ゲーム木探索
            this.createChoiceCgt();

        }else{
            //プレイアウトのための初期化
            this.playoutinit();
        }
    }
    
    /**完全ゲーム木探索処理（choice） */
    createChoiceCgt(){
        //枝の成長と勝敗の判定
        for(let bi of this.branchList){
            
            //先のput枝生成
            bi.createPutBranch(true);
            bi.branchList = null;    //debug
            
            //ブランチを生成し、それがisLeafとなるとonLeafメソッドが実行される。
            //それをチェックして葉になっていたら終了
            if(this.isLeaf) break;
        }
    }
    
    /**
     * ゲーム木生成処理（put）
     * @param cgtflag Trueのとき完全ゲーム木を生成する。
     */
    createPutBranch(cgtflag){
        //このputで勝てる場合、自分が勝って終了
        if(util.endPiece(this.board, this.piece)){
            this.winner = this.myturn;
            this.isLeaf = true;
            this.onLeaf();
            return;
        }
        
        //駒が無ければ終了
        if(this.box.isEmpty()){
            this.isLeaf = true;
            this.onLeaf();
            return;
        }

        //勝ち目のある駒のない箇所のインデックス一覧を取得
        let checkpattern = util.losePiecePos2(this.board,this.box,this.piece);
        let patternlist = util.getTrueIndex(checkpattern);
        
        //ブランチの数を設定
        this.branchnum = patternlist.length;

        //勝ち目のある手がなかったら何もしない
        if(this.branchnum == 0){
            this.winner = !this.myturn;   //相手の勝ち
            this.isLeaf = true;
            this.onLeaf();
            return;
        }
        
        //ブランチの生成
        this.branchList = [];
        for(let pattern of patternlist){
            let left = pattern[0];
            let top = pattern[1];

            let tboard = this.board.clone();
            tboard.setBoard(left, top, this.piece);
            let bi = new MonteBranchInfo(
                tboard,                 //現状のボードのクローンを渡す
                this.box.clone(),       //次の想定の残り駒を渡す
                null,                   //putでは次の想定のピースは無い
                this.myturn,            //私の手版
                this.param,             //パラメータ
                this
            );
            bi.left = left;              //left座標
            bi.top = top;                //top座標
            this.branchList.push(bi);
        }
        
        if(cgtflag){
            //putの完全ゲーム木探索
            this.createPutCgt();

        }else{
            //プレイアウトのための初期化
            this.playoutinit();
        }
    }
    
    /**完全ゲーム木探索処理（put） */
    createPutCgt(){
        //枝の成長と勝敗の判定
        for(let bi of this.branchList){
            //先のchoice枝生成
            bi.createChoiceBranch(true);
            
            //枝先を残すとメモリを食うため、メモリ開放
            bi.branchList = null;    //debug

            if(this.isLeaf) break;
        }
    }

    playoutinit(){
        //ucb1値を出すためのplayoutカウントをリセット
        this.branchPlayoutCount = util.zeros(this.branchnum);
        this.branchPlayoutWin = util.zeros(this.branchnum);
        this.branchPlayoutDraw = util.zeros(this.branchnum);
        this.branchPlayoutTotal = 0;
        this.branchPlayoutTarget = 0;    //始めはucb1値はどれも同じため、0番目から実施。あとtotalが0だとlog関数でエラーでる。
        this.branchlostcounter = 0;
    }

    onLeaf(){
        //葉の数カウント
        this.parent.leafcounter += 1

        if(this.parent.myturn == this.winner){
            //親が勝てる手ならこのブランチも勝利手に昇格する。
            this.parent.winner = this.winner;
            this.parent.isLeaf = true;
            this.parent.onLeaf();
            return;
        }

        if(!this.parent.myturn == this.winner){
            //親が負ける手なら負けカウンターを増やす。
            this.parent.branchlostcounter += 1;
            if(this.parent.branchlostcounter == this.parent.branchnum){
                //負けカウンターとブランチの数が同じ＝すべてのブランチが負けならば
                this.parent.winner = this.winner;
                this.parent.isLeaf = true;
                this.parent.onLeaf();
                return;
            }
        }

        if(this.parent.leafcounter == this.parent.branchnum){
            //枝がすべて葉になったら。引き分け判定用
            this.parent.isLeaf = true;
            this.parent.onLeaf();
            return;
        }
    }

    playout(){

        //葉の場合、その判定を返す。
        if(this.isLeaf){
            return this.winner;
        }
        //ブランチが無い場合、自分のパラメータでプレイアウトした結果を返す。
        if(this.branchList == null){
            return new MonteBranchRand(this.board.clone(), this.box.clone(), this.piece, this.myturn).run();
        }
        
        //枝の場合。ブランチがある場合、さらにその配下のplayoutを実行し、その結果を返す。
        //各カウントアップ
        this.branchPlayoutCount[this.branchPlayoutTarget] += 1;          //そのブランチのプレイアウト数加算
        this.branchPlayoutTotal += 1;                                    //全体のプレイアウト数加算

        //配列への参照回数を減らすため変数に格納
        let targetbi = this.branchList[this.branchPlayoutTarget];
        
        //枝のプレイアウトカウントが閾値を超えたらさらに枝を伸ばす。
        //重複して生成しないようにnullチェック
        if(this.branchPlayoutCount[this.branchPlayoutTarget] == this.param.playoutDepthBorder && targetbi.branchList == null){
            if(targetbi.piece == null){
                //choiceの場合、choiceの枝を生成
                let cgtflag = targetbi.board.getPiecesNum() >= this.param.choiceCgt;    //完全ゲーム木生成判定
                targetbi.createChoiceBranch(cgtflag);

            }else{
                //putの場合、putの枝を生成
                let cgtflag = targetbi.board.getPiecesNum() >= this.param.putCgt;   //完全ゲーム木生成判定
                targetbi.createPutBranch(cgtflag);
            }
        }

        //枝先のプレイアウトを実行。結果は戻り値にする。
        let result = targetbi.playout();

        //そのブランチの勝利数を加算
        if(result == this.myturn){
            this.branchPlayoutWin[this.branchPlayoutTarget] += 1;  //（敵のターンの時は敵の勝率を見るため自分のターンと一致しているかで判定）
        }else if(result == null){
            this.branchPlayoutDraw[this.branchPlayoutTarget] += 1;   //引き分けカウント
        }

        //ucb1値を算出し、次に調査すべきインデックスを取得
        let u;
        if(util.sum(this.branchPlayoutWin) != 0){ //勝率が少しでもあるならそれを使う。
            u = ucb1(this.branchPlayoutCount, this.branchPlayoutWin, this.branchPlayoutTotal, this.param.ucb1_c, this.param.ucb1_fpu);
        }else{ //勝率0パーセントなら引き分けのucb1値を使う。
            u = ucb1(this.branchPlayoutCount, this.branchPlayoutDraw, this.branchPlayoutTotal, this.param.ucb1_c, this.param.ucb1_fpu);
        }

        //次の周回でターゲットにするインデックスを取得
        this.branchPlayoutTarget = util.argmax(u);

        return result;
    }
    
    /**最善手を探してそのインデックスを返す */
    searchRoute(){
        //自身が枝の場合、プレイアウト実行
        if(!this.isLeaf){
            
            let endtime = new Date().getTime() + this.param.playoutTimelimit;
            while(new Date().getTime() < endtime){
                this.playout();
                if(this.isLeaf) break;
            }
        }
        
        //戻り値インデックス 未入力状態 -1
        let returnIndex = -1;
        let countmax = -1;
        
        for(let i=0; i<this.branchnum; ++i){
            if(this.branchList[i].winner){
                //勝ち確定のインデックスを返す。
                returnIndex = i;
                break;

            }else if(this.branchList[i].winner == null){
                //もっともプレイアウト回数の多い引き分けがあれば格納。（勝ちパターンがあるかもなのでbreakはしないで探索続行）
                if(this.isLeaf){
                    returnIndex = i;
                }else if(countmax < this.branchPlayoutCount[i]){
                    countmax = this.branchPlayoutCount[i];
                    returnIndex = i;
                }
            }
        }
        
        //勝利、引き分け手が無いとき、プレイアウトの結果から最有力候補を取得
        if(returnIndex == -1){
            if(this.isLeaf){
                returnIndex = 0;
            }else{
                returnIndex = util.argmax(this.branchPlayoutCount);
            }
        }

        //情報の印字
        //util.p.print("depth\tplayer\tphase\tpattern\tisLeaf\twinner\ttotal\tcount\twin\tdraw\twinpre\tdrawper\twinucb\tdrawucb")
        //this.myprint(0)
        //this.simpleLog()
        
        return returnIndex;
    }
    
    /**他のインスタンスを参照している箇所を外す */
    releaseRelation(){
        //ブランチがある場合、その先のreleaseRelationも呼び出す。
        if(this.branchList != null){
            for(let b of this.branchList){
                b.releaseRelation();
            }
        }
        this.branchList = null;
        this.parent = null;
    }

}