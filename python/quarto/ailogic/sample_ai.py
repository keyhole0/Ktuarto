from . import base_ai
from ..gameobject import board, box, piece

class SampleAi(base_ai.BaseAi):
    """
    SampleAiクラス
    AIクラスのサンプルとして提供
    内容は適当な値を返す処理を記述
    callだけは判定する
    """
    def choice(self, in_board, in_box):
        """
        in_boxリストにある最初の１つを返す
        """
        in_board = board.HiTechBoard(in_board)    #List, Dict形式のデータをBoardクラスに変換
        in_box = box.Box(in_box)            #List, Dict形式のデータをBoxクラスに変換

        #callの判定
        res_call = "Quarto" if in_board.isQuarto() else "Non"

        return {\
            'piece':in_box.piecelist[0].toDict(),\
            'call':res_call,\
        }
    
    def put(self, in_board, in_piece):
        """
        in_boardからまだピースが置かれていない座標を返す
        """
        in_board = board.HiTechBoard(in_board)          #List, Dict形式のデータをBoardクラスに変換
        in_piece = piece.Piece.getInstance(in_piece)    #Dict形式のデータをBoardクラスに変換

        res_left = 0
        res_top = 0

        for x in range(4):
            for y in range(4):
                p = in_board.getBoard(x,y)
                if p is None:
                    res_left = x
                    res_top = y
                    break
            else:continue
            break

        #コマを置いた上でクアルトするか判定
        in_board.setBoard(res_left,res_top,in_piece)
        res_call = "Quarto" if in_board.isQuarto() else "Non"

        return {\
            'call':res_call,\
            'left':res_left,\
            'top':res_top,\
        }