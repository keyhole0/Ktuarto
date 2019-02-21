from . import piece
import copy
import numpy as np

class Board:
    """
    ボード上のコマの配置を管理する
    """
    def __init__(self, boardlist=None):
        self.onboard=None
        if(boardlist is not None):
            self.onboard = np.full((4,4), None)
            for cell in boardlist:
                if cell["piece"] is not None:
                    self.setBoard(\
                        cell["left"],\
                        cell["top"],\
                        piece.Piece.getInstance(cell["piece"])\
                    )

    def setBoard(self, left, top, piece):
        """
        指定した座標にコマをセットする
        """
        self.onboard[left,top] = piece

    def getBoard(self, left, top):
        """
        指定した座標のコマを取得する
        """
        return self.onboard[left,top]
    
    def toList(self):
        return self.onboard
    
    def toJsonObject(self):
        obj = []
        for left in range(4):
            for top in range(4):
                p = self.onboard[left,top]
                if p is not None: p = p.toDict()
                dic = {\
                    "left":left,\
                    "top":top,\
                    "piece":p,\
                }
                obj.append(dic)
        return obj


class HiTechBoard(Board):
    """
    Boardの拡張クラス。Board上の情報をさらに整理するための機能を追加する。
    """
    def __init__(self, boardlist=None):
        self.line_info = None
        if(boardlist is not None):
            #self.line_info = [{'c':0,'s':0,'t':0,'h':0} for j in range(10)]
            self.line_info = np.zeros((10,4))
        """
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
        """
        super(HiTechBoard,self).__init__(boardlist)

    def setBoard(self, left, top, piece):
        """
        セットの機能拡張
        ライン毎のリーチ状況を更新
        """
        super(HiTechBoard,self).setBoard(left,top,piece)
        if piece is not None:
            col_index = top     #列のインデックス
            row_index = left+4  #行のインデックス

            self.line_info[col_index] += piece.param
            self.line_info[row_index] += piece.param

            #斜1の判定
            if left == top:
                self.line_info[8] += piece.param

            #斜2の判定
            if left + top == 3:
                self.line_info[9] += piece.param

    def isQuarto(self):
        """
        ボードが現在クアルトできるか
        """
        #absoluteで配列の絶対値を取得
        #whereで4となっている要素のインデックスを取得
        #lenでそのサイズを測って件数を調べる
        if len(np.where(np.absolute(self.line_info)==4)[0]) != 0 : return True

        return False
    
    def clone(self):
        cobj = HiTechBoard()

        #onboard内のPieceクラスのコピーを作成しないようにシャローコピーをする
        #numpyのcopyメソッドはちゃんと多次元配列でも機能するので楽。
        #（標準のlistは多次元配列をうまいことシャローコピーしてくれない）
        cobj.onboard = self.onboard.copy()

        #line_infoはすべてコピーされていいため、ディープコピーをする
        cobj.line_info = self.line_info.copy()

        return cobj

            

        
