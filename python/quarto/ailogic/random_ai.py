from . import base_ai
from ..gameobject import board, box, piece
import numpy as np
from ..gameutil import util

class RandomAi(base_ai.BaseAi):
    """
    SampleAiクラスは選択肢一番上のものを返すだけなので、
    これでは選択肢の中からランダムで返すようにする
    callだけは判定する
    """
    def choice(self, in_board, in_box):
        """
        in_boxリストにある最初の１つを返す
        """
        in_board = board.HiTechBoard(in_board)    #List, Dict形式のデータをBoardクラスに変換
        in_box = box.Box(in_box)            #List, Dict形式のデータをBoxクラスに変換

        randnum = np.random.randint( len(in_box.piecelist) )

        #駒を選択
        res_piece = in_box.piecelist[randnum]

        #callの判定
        res_call = "Quarto" if in_board.isQuarto() else "Non"

        return {\
            'piece':res_piece.toDict(),\
            'call':res_call,\
        }
    
    def put(self, in_board, in_piece):
        """
        in_boardからまだピースが置かれていない座標を返す
        """
        in_board = board.HiTechBoard(in_board)          #List, Dict形式のデータをBoardクラスに変換
        in_piece = piece.Piece.getInstance(in_piece)    #Dict形式のデータをBoardクラスに変換

        patternlist = np.where(in_board.onboard==None)
        
        #乱数生成
        randnum = np.random.randint(patternlist[0].size)

        res_left = patternlist[0][randnum]
        res_top = patternlist[1][randnum]

        #コマを置いた上でクアルトするか判定
        in_board.setBoard(res_left,res_top,in_piece)
        res_call = "Quarto" if in_board.isQuarto() else "Non"

        return {\
            'call':res_call,\
            'left':res_left,\
            'top':res_top,\
        }

class RandomAi2(base_ai.BaseAi):
    """
    RandomAiから直近の不利な手を選ばないようにした。
    callだけは判定する
    """
    def choice(self, in_board, in_box):
        """
        in_boxリストにある最初の１つを返す
        """
        in_board = board.HiTechBoard(in_board)    #List, Dict形式のデータをBoardクラスに変換
        in_box = box.Box(in_box)            #List, Dict形式のデータをBoxクラスに変換

        #駒を選択
        randnum = np.random.randint( len(in_box.piecelist) )
        res_piece = in_box.piecelist[randnum]

        #負けない手がある場合
        for p in in_box.piecelist:
            if util.endPiece(in_board, p):
                in_box.remove(p)

        #負けない手がある場合
        patternsize = len(in_box.piecelist)
        if (patternsize != 0):
            randnum = np.random.randint( len(in_box.piecelist) )
            res_piece = in_box.piecelist[randnum]

        #callの判定
        res_call = "Quarto" if in_board.isQuarto() else "Non"

        return {\
            'piece':res_piece.toDict(),\
            'call':res_call,\
        }
    
    def put(self, in_board, in_piece):
        """
        in_boardからまだピースが置かれていない座標を返す
        """
        in_board = board.HiTechBoard(in_board)          #List, Dict形式のデータをBoardクラスに変換
        in_piece = piece.Piece.getInstance(in_piece)    #Dict形式のデータをBoardクラスに変換

        patternlist = np.where(in_board.onboard==None)
        
        #乱数生成
        randnum = np.random.randint(patternlist[0].size)
        res_left = patternlist[0][randnum]
        res_top = patternlist[1][randnum]

        #勝てる手がある場合それを返す
        if(util.endPiece(in_board, in_piece)):
            res_left, res_top = util.endPiecePos(in_board, in_piece)

        #コマを置いた上でクアルトするか判定
        in_board.setBoard(res_left,res_top,in_piece)
        res_call = "Quarto" if in_board.isQuarto() else "Non"

        return {\
            'call':res_call,\
            'left':res_left,\
            'top':res_top,\
        }


class RandomAi3(base_ai.BaseAi):
    """
    RandomAi2にあったバグを解消。
    また、2ではputの自滅手を回避できていなかったが、それも回避するようにした。
    callだけは判定する
    """
    def choice(self, in_board, in_box):
        """
        in_boxリストにある最初の１つを返す
        """
        in_board = board.HiTechBoard(in_board)    #List, Dict形式のデータをBoardクラスに変換
        in_box = box.Box(in_box)            #List, Dict形式のデータをBoxクラスに変換

        #駒を選択
        randnum = np.random.randint( len(in_box.piecelist) )
        res_piece = in_box.piecelist[randnum]

        #負けない手があるか？
        oddspieces = util.oddsPieces(in_board, in_box.piecelist)

        #負けない手がある場合
        patternsize = len(oddspieces)
        if (patternsize != 0):
            randnum = np.random.randint( patternsize )
            res_piece = oddspieces[randnum]

        #callの判定
        res_call = "Quarto" if in_board.isQuarto() else "Non"

        return {\
            'piece':res_piece.toDict(),\
            'call':res_call,\
        }
    
    def put(self, in_board, in_piece):
        """
        in_boardからまだピースが置かれていない座標を返す
        """
        in_board = board.HiTechBoard(in_board)          #List, Dict形式のデータをBoardクラスに変換
        in_piece = piece.Piece.getInstance(in_piece)    #Dict形式のデータをBoardクラスに変換
        
        in_box = box.Box(board=in_board)
        in_box.remove(in_piece)

        #つんでない手を取得
        checkpattern = util.losePiecePos2(in_board, in_box, in_piece)

        #選択肢が残っていなければ負けを返す
        if ( not np.any(checkpattern) ):
            patternlist = np.where(in_board.onboard==None)
            
            #乱数生成
            randnum = np.random.randint(patternlist[0].size)
            res_left = patternlist[0][randnum]
            res_top = patternlist[1][randnum]
        else:
            patternlist = np.where(checkpattern)
            
            #乱数生成
            randnum = np.random.randint(patternlist[0].size)
            res_left = patternlist[0][randnum]
            res_top = patternlist[1][randnum]

        #勝てる手がある場合それを返す
        if(util.endPiece(in_board, in_piece)):
            res_left, res_top = util.endPiecePos(in_board, in_piece)

        #コマを置いた上でクアルトするか判定
        in_board.setBoard(res_left,res_top,in_piece)
        res_call = "Quarto" if in_board.isQuarto() else "Non"

        return {\
            'call':res_call,\
            'left':res_left,\
            'top':res_top,\
        }