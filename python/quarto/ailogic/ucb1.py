import numpy as np

class UCB1:
    """
    UCB1計算関連のクラス
    numpyを前提に構成
    """
    @classmethod
    def ucb1(cls, count, win, total, c=1.5, fpu=100):
        #0があると除算が計算できないので除外
        notzerocount = np.where(count == 0, 1, count)   
        
        #ucb1値を計算
        result = win / notzerocount + c * np.sqrt( ( 2 * np.log(total) ) / notzerocount )
        
        #0の箇所は事前に決めたfpu値を返す
        return np.where(count == 0, fpu, result)
