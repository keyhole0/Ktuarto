import numpy as np

class Piece:
    def __init__(self, color, shape, top, height):
        #色,形,穴,高さ
        self.param = np.array([color,shape,top,height])
        
        #文字列で格納された値を0,1に変換する
        c   = 1 if color  == 1      else 0
        s   = 1 if shape  == 1      else 0
        t   = 1 if top    == 1      else 0
        h   = 1 if height == 1      else 0

        #0,1からインデックスを作成する
        self.index = (c<<0) + (s<<1) + (t<<2) + (h<<3)
    
    def toDict(self):
        c = "light"     if self.param[0]  == 1 else "dark"
        s = "circular"  if self.param[1]  == 1 else "square"
        t = "hollow"    if self.param[2]  == 1 else "solid"
        h = "tall"      if self.param[3]  == 1 else "short"
        return {\
            'color':c,\
            'shape':s,\
            'top':t,\
            'height':h,\
        }

    def toNumList(self):
        return np.where(self.param==1,1,2)
    
    @classmethod
    def getInstance(cls, pieceDict):
        #文字列で格納された値を0,1に変換する
        c   = 1 if pieceDict['color']  == "light"     else 0
        s   = 1 if pieceDict['shape']  == "circular"  else 0
        t   = 1 if pieceDict['top']    == "hollow"    else 0
        h   = 1 if pieceDict['height'] == "tall"      else 0

        #0,1からインデックスを作成する
        index = (c<<0) + (s<<1) + (t<<2) + (h<<3)
        return __piece_list__[index]
    
    @classmethod
    def getAllPiece(cls):
        return list(__piece_list__)

__piece_list__ = (\
    Piece(-1,-1,-1,-1),\
    Piece( 1,-1,-1,-1),\
    Piece(-1, 1,-1,-1),\
    Piece( 1, 1,-1,-1),\
    Piece(-1,-1, 1,-1),\
    Piece( 1,-1, 1,-1),\
    Piece(-1, 1, 1,-1),\
    Piece( 1, 1, 1,-1),\
    Piece(-1,-1,-1, 1),\
    Piece( 1,-1,-1, 1),\
    Piece(-1, 1,-1, 1),\
    Piece( 1, 1,-1, 1),\
    Piece(-1,-1, 1, 1),\
    Piece( 1,-1, 1, 1),\
    Piece(-1, 1, 1, 1),\
    Piece( 1, 1, 1, 1),\
)
