import numpy as np
import copy
import codecs

def endPiece(board, piece):
    """
    ボードに対してその駒を置いたとき、勝てるか？
    board:HiTechBoardクラス
    piece:Pieceクラス
    """
    putPieceResult = board.line_info + piece.param      #駒のパラメータを加算
    putPieceResult = np.absolute( putPieceResult )      #負数を正数にする
    return len(np.where(putPieceResult == 4)[0]) != 0   #4があれば（そろっていれば）終了

def endPiecePos(board, piece):
    """
    ボードに対してその駒を置いたとき、勝てる場所は
    board:HiTechBoardクラス
    piece:Pieceクラス
    """
    patternlist = np.where(board.onboard==None)
    for left,top in zip(patternlist[0], patternlist[1]):
        tboard = board.clone()
        tboard.setBoard(left,top,piece)
        if(tboard.isQuarto()):
            return left, top
    
    #勝てる手がないときは適当な値
    return patternlist[0][0], patternlist[1][0]

def oddsPieces(board, pieces):
    tempbox = copy.copy(pieces)
    for p in pieces:
        #if endPiece(board, p):continue
        #tempbox.append(p)
        if endPiece(board, p):tempbox.remove(p)
    return tempbox

#ある座標に駒を置いたときに負けるか
def losePiecePos(board, box, piece, plist_left, plist_top):
    psize = plist_left.size
    checkpattern = np.full((psize),False)

    #駒の属性行列を作成
    if(len(box.piecelist)==0): return checkpattern  #駒が無いときは終了
    
    for i in range(psize):
        #この処理で極端に動作が重くなっている。どうにかして軽くしなければ
        
        #駒を置いた上でリーチがあるか
        tboard = board.clone()
        tboard.setBoard(plist_left[i],plist_top[i],piece)
        reach = np.where(np.absolute(tboard.line_info) == 3)
        
        if reach[0].size == 0:
            checkpattern[i] = True
            continue

        #リーチしている上で渡してもゲームが終わらない（負けない）駒があれば即終了
        for bp in box.piecelist:
            if(not endPiece(tboard, bp)):
                checkpattern[i] = True
    
    return checkpattern

#ある座標に駒を置いたときに負けるか（改良版）無印より少し早い
def losePiecePos2(board, box, piece):
    checkpos = board.onboard == None
    if(len(box.piecelist)==0):return checkpos   #boxが空なら負けはしないので即リターン
    cw = np.where(checkpos)
    
    for left, top in zip(cw[0],cw[1]):
        tli = board.line_info.copy()
        tli[top] += piece.param
        tli[left+4] += piece.param
        tli[8] += piece.param if left == top else 0
        tli[9] += piece.param if left + top == 3 else 0
        if np.any(np.logical_or(tli == 3 ,tli == -3)):
            for p in box.piecelist:
                if not np.any(np.absolute(tli + p.param) == 4): break
            else:
                checkpos[left,top] = False

    return checkpos

class p:
    _file=None

    @classmethod
    def open(cls,filename):
        print('open file ' + filename)
        cls._file = open(filename,'w',encoding='utf-8_sig')

    @classmethod
    def close(cls):
        if(cls._file is not None):
            cls._file.close()
            cls._file = None
            print('close file ')

    @classmethod
    def print(cls,str):
        if(cls._file is not None):
            print(str, file=cls._file)
        print(str)
        #pass
