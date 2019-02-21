from . import base_ai
from ..gameobject import board, box, piece
import numpy as np

class GameTree(base_ai.BaseAi):
    """
    ゲーム木を生成するクラス
    内容は適当な値を返す処理を記述
    callだけは判定する
    """
    def __init__(self, choice_deepness, put_deepness):
        """
        deepness ゲーム木の深さを設定する
        """
        self.choice_deepness = choice_deepness
        self.put_deepness = put_deepness
        
    def choice(self, in_board, in_box):
        """
        in_boxリストにある最初の１つを返す
        """
        in_board = board.HiTechBoard(in_board)    #List, Dict形式のデータをBoardクラスに変換
        in_box = box.Box(in_box)            #List, Dict形式のデータをBoxクラスに変換

        branchinfo = BranchInfo(self.choice_deepness, in_board, in_box, None, None, None, True)

        maxscore = -1
        res_piece = in_box.piecelist[0].toDict()
        for bi in branchinfo.branchList:
            if(bi.iwin == False):continue
            if(maxscore < bi.score):
                maxscore = bi.score
                res_piece = bi.piece.toDict()
            
        #callの判定
        res_call = "Quarto" if branchinfo.iwin else "Non"

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

        branchinfo = BranchInfo(self.put_deepness, in_board, in_box, in_piece, None, None, True)
        
        maxscore = -1
        res_left = 0
        res_top = 0

        for bi in branchinfo.branchList:
            #自分が勝てるパターンを見つけたら
            if(bi.iwin == True):
                res_left = bi.putleft
                res_top = bi.puttop
                res_call = "Quarto"
                break
            
            #まだ勝ちではないパターン
            if(maxscore < bi.score):
                maxscore = bi.score
                res_left = bi.putleft
                res_top = bi.puttop
                res_call = "Non"
        
        #res_call = "Quarto" if bi.board.isQuarto() else "Non"

        return {\
            'call':res_call,\
            'left':res_left,\
            'top':res_top,\
        }

class BranchInfo:
    def __init__(self, deepness, board, box, piece, putleft, puttop, myturn):
        self.deepness = deepness
        self.board = board
        self.box = box
        self.piece = piece
        self.putleft = putleft
        self.puttop = puttop
        self.myturn = myturn
        self.score = 0
        self.iwin = None
        self.branchList = None
        self.winbranch = None

        #p = None if self.piece is None else self.piece.toDict()
        #print('BranchInfo:'+str({'deepness':self.deepness,'board':self.board.toList(),'piece':p,'putleft':self.putleft,'puttop':self.puttop}))

        #駒が渡されていたらput
        if self.piece:  self.createPutBranch()
            
        #駒が渡されなかったらchoice
        else:
            #choiceの前のボードを評価
            self.evalBoard()

            #決着がついていなければチョイスする。
            if self.iwin is None: self.createChoiceBranch()
        
        #現状の評価
        self.eval()

    def createChoiceBranch(self):
        #探索深層が0ならブランチを生成しない
        if self.deepness == 0:return

        self.branchList = []
        for p in self.box.piecelist:
            tbox = self.box.clone()
            tbox.remove(p)
            bi = BranchInfo(
                self.deepness - 1,      #今の深層より一つ下に遷移
                self.board,             #現状のボードのクローンを渡す
                tbox,                   #次の想定の残り駒を渡す
                p,                      #次の想定のピースを渡す
                None,                   #choiceでは配置の指定はない
                None,                   #choiceでは配置の指定はない
                not self.myturn         #相手プレイヤーの晩になる
            )
            #敵が勝つパターンなら
            if (bi.iwin == False):continue

            self.branchList.append(bi)
    
    def createPutBranch(self):
        #探索深層が0ならブランチを生成しない
        if self.deepness == 0:return
            
        self.branchList = []
        for left in range(4):
            for top in range(4):
                if (self.board.getBoard(left,top) is None):
                    tboard = self.board.clone()
                    tboard.setBoard(left, top, self.piece)
                    bi = BranchInfo(
                        self.deepness - 1,      #今の深層より一つ下に遷移
                        tboard,                 #現状のボードのクローンを渡す
                        self.box,               #次の想定の残り駒を渡す
                        None,                   #putでは次の想定のピースは無い
                        left,                   #配置予定のleft
                        top,                    #配置予定のtop
                        self.myturn             #私の手版
                    )
                    self.branchList.append(bi)
                    #決着がつくパターンだったら即終了
                    if(bi.iwin is not None):
                        self.iwin = bi.iwin #決着フラグを引き継ぎ
                        self.winbranch = bi #勝ちパターンにセット
                        return

    def evalBoard(self):
        self.score = 0
        count = np.array([0,0,0,0,0])
        
        absarray = np.absolute(self.board.line_info)
        count[0] = len(np.where(absarray==0)[0])
        count[1] = len(np.where(absarray==1)[0])
        count[2] = len(np.where(absarray==2)[0])
        count[3] = len(np.where(absarray==3)[0])
        count[4] = len(np.where(absarray==4)[0])
        
        #ゲームが終了していたら
        if(count[4] != 0):
            self.iwin = self.myturn #自分のターンなら自分の勝ち
            return 

        self.score = np.sum( count * np.array([0,1,2,4,0]) )

    def eval(self):
        """
        渡されたボードの評価
        """
        #末端で無いなら子ブランチからの情報で評価
        if self.iwin is None and self.branchList is not None:
            self.score = 0
            count = 0
            for bl in self.branchList:
                count += 1
                self.score + bl.score
            if count != 0: self.score /= count
