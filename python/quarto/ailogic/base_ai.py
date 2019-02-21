from abc import ABCMeta, abstractmethod

class BaseAi(metaclass=ABCMeta):
    """
    BaseAiクラス
    AIクラスを作成するときに継承させるクラス。
    """
    @abstractmethod
    def choice(self, in_board, in_box):
        """
        choiceメソッド
        in_board：入力されたboard (ListとDictに変換済み)
        in_box：入力されたbox (ListとDictに変換済み)
        戻り値は'piece','call'の２つを持ったDict形式で返す
        例：{'piece':res_piece, 'call':res_call,}
        """
        pass
    
    @abstractmethod
    def put(self, in_board, in_piece):
        """
        putメソッド
        in_board：入力されたboard (ListとDictに変換済み)
        in_piece：入力されたpiece (Dictに変換済み)
        戻り値は'call','left','top'の３つを持ったDict形式で返す
        例：{'call':res_call, 'left':res_left,'top':res_top,}
        """
        pass
    
