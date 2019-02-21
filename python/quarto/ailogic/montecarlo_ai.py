from . import base_ai, ucb1
from ..gameobject import board, box, piece
import numpy as np
from ..gameutil import util
import time

class Parameter:
    def __init__(self):
        self.playoutTimelimit = 6   #プレイアウトの時間制限
        self.ucb1_c = 1.0           #ucb1のc定数
        self.ucb1_fpu = 100         #fpu値
        self.playoutDepthBorder = 4 #プレイアウトをさらに深くする閾値   -1はチェックしない
        self.putCgt = 10
        self.choiceCgt = 11
        #self.putCgt = 0
        #self.choiceCgt = 0

class Montecarlo(base_ai.BaseAi):
    """
    ゲーム木を生成するクラス
    内容は適当な値を返す処理を記述
    callだけは判定する
    """
    def __init__(self):
        self.param = Parameter()
        
    def choice(self, in_board, in_box):
        """
        in_boxリストにある最初の１つを返す
        """
        in_board = board.HiTechBoard(in_board)    #List, Dict形式のデータをBoardクラスに変換
        in_box = box.Box(in_box)            #List, Dict形式のデータをBoxクラスに変換

        
        if len(in_box.piecelist) == 16 :
            #負荷軽減のため、最初の一手はランダムで返す。（どれ選んでも同じでしょ、思考させるだけ無駄）
            randnum = np.random.randint( len(in_box.piecelist) )
            res_piece = in_box.piecelist[randnum]

        else:
            #モンテカルロロジック実行
            branchinfo = MonteBranchInfo(in_board, in_box, None, True, self.param)
            res_piece = branchinfo.runChoice()
        
        res_piece = res_piece.toDict()
            
        #callの判定
        res_call = "Quarto" if in_board.isQuarto() else "Non"

        return {\
            'piece':res_piece,\
            'call':res_call,\
        }
    
    def put(self, in_board, in_piece):
        """
        in_boardからまだピースが置かれていない座標を返す
        """
        in_board = board.HiTechBoard(in_board)          #List, Dict形式のデータをBoardクラスに変換
        in_piece = piece.Piece.getInstance(in_piece)    #Dict形式のデータをBoardクラスに変換
        
        #Boxを生成
        in_box = box.Box(board=in_board)
        in_box.remove(in_piece)

        #モンテカルロ木探索を行う。
        branchinfo = MonteBranchInfo(in_board, in_box, in_piece, True, self.param)
        res_left, res_top = branchinfo.runPut()
        
        #置いたときのクアルト判定
        in_board.setBoard(res_left, res_top, in_piece)
        res_call = "Quarto" if in_board.isQuarto() else "Non"

        return {\
            'call':res_call,\
            'left':res_left,\
            'top':res_top,\
        }

class MonteBranchRand:
    """
    モンテカルロ法の乱数処理部分
    """
    def __init__(self, board, box, piece, myturn):
        self.board = board
        self.box = box
        self.piece = piece
        self.myturn = myturn
        self.winner = None
    
    def run(self):
        while(self.winner is None):
            #駒がなければchoice
            if (self.piece is None):
                #choice前、boxが空ならゲーム終了なのでループを出る。
                if(len(self.box.piecelist)==0):
                    break

                self.choiceRand()
                self.myturn = not self.myturn #choiceの後プレイヤーを交代

            #駒があればput
            else:
                self.putRand()

                #put後、boxが空ならゲーム終了なのでループを出る。
                if(len(self.box.piecelist)==0):
                    break
        
        #勝者を返す
        return self.winner
    
    def putRand(self):
        #このputで勝てる場合、自分が勝って終了
        if(util.endPiece(self.board, self.piece)):
            self.winner = self.myturn
            return
        
        checkpattern = util.losePiecePos2(self.board,self.box,self.piece)

        #選択肢が残っていなければ負けを返す
        if ( not np.any(checkpattern) ):
            self.winner = not self.myturn
            return

        patternlist = np.where(checkpattern)
        
        #乱数生成
        randnum = np.random.randint(patternlist[0].size)

        #手を進める
        self.board.setBoard(patternlist[0][randnum], patternlist[1][randnum], self.piece)
        
        #選んだ駒を空にする
        self.piece = None

    def choiceRand(self):
        #勝ち目のあるピースを取得
        oddspieces = util.oddsPieces(self.board, self.box.piecelist)

        #どれを選んでも負ける場合
        patternsize = len(oddspieces)
        if (patternsize == 0):
            self.winner = not self.myturn   #相手の勝ち
            return

        #乱数生成
        randnum = np.random.randint( patternsize )

        #駒を選択
        self.piece = oddspieces[randnum]

        #boxから駒をはずす。
        self.box.remove(self.piece)

class DammyBranch:
    """
    MonteBranchRandのonLeafメソッドを仮で行うためのクラス
    if(self.parent is not None)で毎回チェックをなくすための処置
    """
    def __init__(self):
        self.myturn = True
        self.winner = False
        self.isLeaf = False
        self.branchlostcounter = 0
        self.leafcounter = 0
        self.branchnum = 1
    
    def onLeaf(self):
        pass

class MonteBranchInfo:
    
    def __init__(self, board, box, piece, myturn, param, parent=DammyBranch()):
        self.board = board              #ボード
        self.box = box                  #ボックス
        self.piece = piece              #駒
        self.myturn = myturn            #ターン（trueが自分）
        self.param = param              #プレイアウト試行回数

        self.branchList = None          #ブランチリスト
        self.left = None                #putのleft座標
        self.top = None                 #putのtop座標
        
        self.branchnum = 0              #ブランチの数
        self.branchPlayoutCount = None  #ブランチプレイアウト数（numpy配列）
        self.branchPlayoutWin = None    #ブランチプレイアウト勝利数（numpy配列）
        self.branchPlayoutDraw = None   #ブランチプレイアウト引分数（numpy配列）
        self.branchPlayoutTotal = 0     #ブランチプレイアウトの合計（数値）

        self.branchPlayoutTarget = 0    #ブランチプレイアウトを行う対象
        self.branchlostcounter = 0      #負けブランチの数をカウントする
        self.leafcounter = 0            #枝が葉になった数をカウントする

        self.isLeaf = False             #ゲーム葉フラグ。ゲームの決着がついたフラグ。gameoverとほぼ同義
        self.winner = None              #ゲームの勝者
        self.parent = parent            #親ブランチ

    def runChoice(self):
        #ブランチ生成
        cgtflag = len(np.where(self.board.onboard != None)[0]) >= self.param.choiceCgt
        self.createChoiceBranch(cgtflag)

        #勝てる手がなければ（ブランチがなければ）先頭を返す。
        if( self.branchList is None ):return self.box.piecelist[0]
        
        #ルート探査
        topScoreIndex = self.searchRoute()
        return self.branchList[topScoreIndex].piece
    
    def runPut(self):
        #このputで勝てる場合、勝てる手を選んで終了
        if(util.endPiece(self.board, self.piece)):
            return util.endPiecePos(self.board, self.piece)  #戻り値はleft, topの二つ
        
        #ブランチの生成
        cgtflag = len(np.where(self.board.onboard != None)[0]) >= self.param.putCgt
        self.createPutBranch(cgtflag)
        
        #勝てる手がなければ（ブランチがなければ）先頭を返す。
        if( self.branchList is None ):
            index = np.where(self.board.onboard == None)
            return index[0][0], index[1][0]

        #ルート探査
        topScoreIndex = self.searchRoute()
        return self.branchList[topScoreIndex].left, self.branchList[topScoreIndex].top

    def createChoiceBranch(self, cgtflag):
        """
        ゲーム木生成処理（choice）
        cgtflag：Trueのとき完全ゲーム木を生成する。
        """
        #駒が無ければ終了
        if(len(self.box.piecelist)==0):
            self.isLeaf = True
            self.onLeaf()
            return

        #勝ち目の無い選択を減らす
        oddspieces = util.oddsPieces(self.board, self.box.piecelist)

        #ブランチの数を設定
        self.branchnum = len(oddspieces)

        #手がなかったら何もしない
        if(self.branchnum == 0):
            self.winner = not self.myturn   #相手の勝ち
            self.isLeaf = True
            self.onLeaf()
            return
        
        self.branchList = []
        for p in oddspieces:
            tbox = self.box.clone()
            tbox.remove(p)
            bi = MonteBranchInfo(
                self.board.clone(),     #現状のボードのクローンを渡す
                tbox,                   #次の想定の残り駒を渡す
                p,                      #次の想定のピースを渡す
                not self.myturn,        #相手プレイヤーの手版になる
                self.param,             #パラメータ
                self
            )
            self.branchList.append(bi)
        
        if(cgtflag):
            #choiceの完全ゲーム木探索
            self.createChoiceCgt()

        else:
            #プレイアウトのための初期化
            self.playoutinit()
    
    def createChoiceCgt(self):
        """
        完全ゲーム木探索処理（choice）
        """
        #枝の成長と勝敗の判定
        for bi in self.branchList:
            
            #先のput枝生成
            bi.createPutBranch(True)
            bi.branchList = None    #debug
            
            #ブランチを生成し、それがisLeafとなるとonLeafメソッドが実行される。
            #それをチェックして葉になっていたら終了
            if(self.isLeaf): break


    def createPutBranch(self, cgtflag):
        """
        ゲーム木生成処理（put）
        cgtflag：Trueのとき完全ゲーム木を生成する。
        """
        #このputで勝てる場合、自分が勝って終了
        if(util.endPiece(self.board, self.piece)):
            self.winner = self.myturn
            self.isLeaf = True
            self.onLeaf()
            return
        
        #駒が無ければ終了
        if(len(self.box.piecelist)==0):
            self.isLeaf = True
            self.onLeaf()
            return

        #勝ち目のある駒のない箇所のインデックス一覧を取得
        checkpattern = util.losePiecePos2(self.board,self.box,self.piece)
        patternlist = np.where(checkpattern)
        
        #ブランチの数を設定
        self.branchnum = patternlist[0].size

        #勝ち目のある手がなかったら何もしない
        if(self.branchnum == 0):
            self.winner = not self.myturn   #相手の勝ち
            self.isLeaf = True
            self.onLeaf()
            return
        
        #ブランチの生成
        self.branchList = []
        for left, top in zip(patternlist[0], patternlist[1]):
            tboard = self.board.clone()
            tboard.setBoard(left, top, self.piece)
            bi = MonteBranchInfo(
                tboard,                 #現状のボードのクローンを渡す
                self.box.clone(),       #次の想定の残り駒を渡す
                None,                   #putでは次の想定のピースは無い
                self.myturn,            #私の手版
                self.param,             #パラメータ
                self
            )
            bi.left = left              #left座標
            bi.top = top                #top座標
            self.branchList.append(bi)
        
        if(cgtflag):
            #putの完全ゲーム木探索
            self.createPutCgt()

        else:
            #プレイアウトのための初期化
            self.playoutinit()
    
    def createPutCgt(self):
        """
        完全ゲーム木探索処理（put）
        """
        #枝の成長と勝敗の判定
        for bi in self.branchList:
            #先のchoice枝生成
            bi.createChoiceBranch(True)
            
            #枝先を残すとメモリを食うため、メモリ開放
            bi.branchList = None    #debug

            if(self.isLeaf):break


    def playoutinit(self):
        #ucb1値を出すためのplayoutカウントをリセット
        self.branchPlayoutCount = np.zeros((self.branchnum))
        self.branchPlayoutWin = np.zeros((self.branchnum))
        self.branchPlayoutDraw = np.zeros((self.branchnum))
        self.branchPlayoutTotal = 0
        self.branchPlayoutTarget = 0    #始めはucb1値はどれも同じため、0番目から実施。あとtotalが0だとlog関数でエラーでる。
        self.branchlostcounter = 0

    def onLeaf(self):
        #葉の数カウント
        self.parent.leafcounter += 1

        if(self.parent.myturn == self.winner):
            #親が勝てる手ならこのブランチも勝利手に昇格する。
            self.parent.winner = self.winner
            self.parent.isLeaf = True
            self.parent.onLeaf()
            return

        if((not self.parent.myturn) == self.winner):
            #親が負ける手なら負けカウンターを増やす。
            self.parent.branchlostcounter += 1
            if(self.parent.branchlostcounter == self.parent.branchnum):
                #負けカウンターとブランチの数が同じ＝すべてのブランチが負けならば
                self.parent.winner = self.winner
                self.parent.isLeaf = True
                self.parent.onLeaf()
                return

        if(self.parent.leafcounter == self.parent.branchnum):
            #枝がすべて葉になったら。引き分け判定用
            self.parent.isLeaf = True
            self.parent.onLeaf()
            return


    def playout(self):
        result = False

        #葉の場合、その判定を返す。
        if(self.isLeaf):
            result = self.winner

        #ブランチが無い場合、自分のパラメータでプレイアウトした結果を返す。
        elif(self.branchList is None): 
            result = MonteBranchRand(self.board.clone(), self.box.clone(), self.piece, self.myturn).run()
        
        #枝の場合。ブランチがある場合、さらにその配下のplayoutを実行し、その結果を返す。
        else:
            #各カウントアップ
            self.branchPlayoutCount[self.branchPlayoutTarget] += 1          #そのブランチのプレイアウト数加算
            self.branchPlayoutTotal += 1                                    #全体のプレイアウト数加算

            #配列への参照回数を減らすため変数に格納
            targetbi = self.branchList[self.branchPlayoutTarget]
            
            #枝のプレイアウトカウントが閾値を超えたらさらに枝を伸ばす。
            #重複して生成しないようにNoneチェック
            if(self.branchPlayoutCount[self.branchPlayoutTarget] == self.param.playoutDepthBorder and targetbi.branchList is None):
                if(targetbi.piece is None):
                    #choiceの場合、choiceの枝を生成
                    cgtflag = len(np.where(targetbi.board.onboard != None)[0]) >= self.param.choiceCgt
                    targetbi.createChoiceBranch(cgtflag)

                else:
                    #putの場合、putの枝を生成
                    cgtflag = len(np.where(targetbi.board.onboard != None)[0]) >= self.param.putCgt
                    targetbi.createPutBranch(cgtflag)

            #枝先のプレイアウトを実行。結果は戻り値にする。
            result = targetbi.playout()

            #そのブランチの勝利数を加算
            if result == self.myturn:
                self.branchPlayoutWin[self.branchPlayoutTarget] += 1  #（敵のターンの時は敵の勝率を見るため自分のターンと一致しているかで判定）
            elif result == None:
                self.branchPlayoutDraw[self.branchPlayoutTarget] += 1   #引き分けカウント
            
            #ucb1値を算出し、次に調査すべきインデックスを取得
            if(np.sum(self.branchPlayoutWin) != 0): #勝率が少しでもあるならそれを使う。
                u = ucb1.UCB1.ucb1(self.branchPlayoutCount, self.branchPlayoutWin, self.branchPlayoutTotal, self.param.ucb1_c, self.param.ucb1_fpu)
            else: #勝率0パーセントなら引き分けのucb1値を使う。
                u = ucb1.UCB1.ucb1(self.branchPlayoutCount, self.branchPlayoutDraw, self.branchPlayoutTotal, self.param.ucb1_c, self.param.ucb1_fpu)

            #次の周回でターゲットにするインデックスを取得
            self.branchPlayoutTarget = u.argmax()

        return result
    
    def searchRoute(self):
        """
        最善手を探してそのインデックスを返す
        """
        #自身が枝の場合、プレイアウト実行
        if(not self.isLeaf):
            endtime = time.time() + self.param.playoutTimelimit
            while(time.time() < endtime):
                self.playout()
                if(self.isLeaf):break
        
        #戻り値インデックス 未入力状態 -1
        returnIndex = -1
        countmax = -1
        
        for i in range(self.branchnum):
            if self.branchList[i].winner == True:
                #勝ち確定のインデックスを返す。
                returnIndex = i
                break

            elif self.branchList[i].winner is None:
                #もっともプレイアウト回数の多い引き分けがあれば格納。（勝ちパターンがあるかもなのでbreakはしないで探索続行）
                if self.isLeaf:
                    returnIndex = i
                elif countmax < self.branchPlayoutCount[i]:
                    countmax = self.branchPlayoutCount[i]
                    returnIndex = i
        
        #勝利、引き分け手が無いとき、プレイアウトの結果から最有力候補を取得
        if(returnIndex == -1):
            if self.isLeaf:
                returnIndex = 0
            else:
                returnIndex = self.branchPlayoutCount.argmax()

        #情報の印字
        #util.p.print('depth\tplayer\tphase\tpattern\tisLeaf\twinner\ttotal\tcount\twin\tdraw\twinpre\tdrawper\twinucb\tdrawucb')
        #self.myprint(0)
        self.simpleLog()
        
        return returnIndex

    def myprint(self, depth):
        """
        情報の印字処理
        """
        if self.branchList is None: return
        if depth > 1 : return   #debug

        #プレイアウト時の記録
        count = None
        if(self.branchPlayoutCount is not None):
            count = self.branchPlayoutCount
            win = self.branchPlayoutWin
            draw = self.branchPlayoutDraw
            wper = self.branchPlayoutWin/self.branchPlayoutCount
            dper = self.branchPlayoutDraw/self.branchPlayoutCount
            wucb = ucb1.UCB1.ucb1(self.branchPlayoutCount, self.branchPlayoutWin, self.branchPlayoutTotal)
            ducb = ucb1.UCB1.ucb1(self.branchPlayoutCount, self.branchPlayoutDraw, self.branchPlayoutTotal)
        
        for i in range(self.branchnum):
            bi = self.branchList[i]
            c  = None if count is None else count[i]
            w  = None if count is None else win[i]
            d  = None if count is None else draw[i]
            wp = None if count is None else wper[i]
            dp = None if count is None else dper[i]
            wu = None if count is None else wucb[i]
            du = None if count is None else ducb[i]

            val = str(depth)+'\t'+str(self.myturn)
            if(bi.piece is not None):
                val += '\tchoice\t'+str(bi.piece.toNumList())
            else:
                val += '\tput\t'+str(bi.left)+','+str(bi.top)
            val += '\t'+str(bi.isLeaf)
            val += '\t'+str(bi.winner)
            val += '\t'+str(self.branchPlayoutTotal)
            val += '\t'+str(c)
            val += '\t'+str(w)
            val += '\t'+str(d)
            val += '\t'+str(wp)
            val += '\t'+str(dp)
            val += '\t'+str(wu)
            val += '\t'+str(du)            
            util.p.print(val)
            bi.myprint(depth+1)
        
    def simpleLog(self):
        util.p.print(str(self.isLeaf)+' '+str(self.winner)+' '+str(self.branchPlayoutTotal))
