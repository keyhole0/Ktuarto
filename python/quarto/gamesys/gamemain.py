from ..gameobject import board, box, piece
from . import gameplayer
from . import gameplayerinfo
import numpy as np
from ..gameutil import util
import time

class GameMain:
    """
    クアルトゲームの簡易実行クラス
    コンソール上で動作する。
    プレイヤーに適用するAIは gameplayerinfo.py に記述
    以下のコマンドで実行
    > python -m quarto
    
    駒の情報は簡素化のために4つの整数配列で表現する。
    例：[2 1 2 2]
    左から 色,形,穴,高
    色 1:"light"    2:"dark"
    形 1:"circular" 2:"square"
    穴 1:"hollow"   2:"solid"
    高 1:"tall"     2:"short"
    コンソール上でプレイする上では１か２かで判断すればよいため元の値がなんだったかは特に意識する必要はない。

    playerAi を Noneとするとコンソールから手入力で操作できるようになる。（マニュアルモード）
    choiceの入力
    選択可能な駒の一覧が表示される。そこから駒のNoを入力
    例 choice >> 10
    
    putの入力
    スペース区切りでleft topの順番で座標を入力
    例 put(left top) >> 2 3
    
    細かい入力チェックは用意していないので文字を入力するとエラーとなる。
    プログラムを中断したいときはエラーを起こす値を入力して強制終了させる。
    """

    def __init__(self, player0, player1):
        self.board = board.HiTechBoard([])    #空配列を渡すことでボードをNoneで初期化
        self.box = box.Box(board=self.board)
        self.choicepiece = None
        self.call = "Non"
        self.playerlist = [\
            gameplayer.GamePlayer(player0),\
            gameplayer.GamePlayer(player1),\
        ]
        self.gameEnd = False
        self.turn = 0
        self.winner = None
        self.turncounter = 0

    def run(self):
        #ゲームループ
        while not self.gameEnd:
            self.gameLoop()
        
        #ゲーム終了時の状態
        util.p.print('ゲーム終了')
        self.drawBoard()

        #勝敗判定
        if self.winner is None:
            util.p.print('引き分け')
        else:
            util.p.print('Player'+str(self.winner)+'の勝利')
        
        return self.winner
    
    def gameLoop(self):
        if self.choicepiece is not None:
            util.p.print(str(self.turncounter)+' Player'+str(self.turn)+' put')
            self.putPhase()
            self.drawPutPos()
            self.drawBoard()
            self.turncounter += 1
            if self.gameEnd: return
        
        if len(self.box.piecelist) != 0:
            self.drawBox()
            util.p.print(str(self.turncounter)+' Player'+str(self.turn)+' choice')
            self.choicePhase()
            self.drawChoicePiece()
            self.drawBoard()
            if self.gameEnd: return
        
        else:
            #boxの駒がなくなったらゲーム終了
            self.gameEnd = True
            return

        #ターンの切り替え
        self.turn = (self.turn + 1) % 2
    
    def putPhase(self):
        ts = time.time()    #処理時間計測用

        #aiのput呼び出し
        presult = self.playerlist[self.turn].put(self.board.toJsonObject(), self.choicepiece.toDict())
        
        #処理時間印字
        util.p.print('Player'+str(self.turn)+" put 処理時間：{0}".format(time.time() - ts)+"[sec]")

        #結果を反映
        self.left = presult['left']
        self.top = presult['top']
        self.board.setBoard(self.left, self.top, self.choicepiece)    #駒をセット
        self.call = presult['call']     #コールを取得

        #コールチェック
        self.checkCall()
    
    def choicePhase(self):
        ts = time.time()    #処理時間計測用

        #aiのchoice呼び出し
        cresult = self.playerlist[self.turn].choice(self.board.toJsonObject(), self.box.toJsonObject())
        
        #処理時間印字
        util.p.print('Player'+str(self.turn)+" choice 処理時間：{0}".format(time.time() - ts)+"[sec]")

        #結果を反映
        self.choicepiece = piece.Piece.getInstance(cresult['piece'])    #選ばれた駒を取得
        self.box.remove(self.choicepiece)     #選ばれた駒をboxから取り出す
        self.call = cresult['call']     #コールを取得
        
        #コールチェック
        self.checkCall()
    
    def checkCall(self):
        #宣言のチェック
        if self.call == "Quarto":
            util.p.print('Player'+str(self.turn)+' Quarto')
            if self.board.isQuarto():
                self.winner = self.turn #勝者をセット
                self.gameEnd = True     #ゲーム終了
            
            else:
                util.p.print('間違った宣言')
                self.winner = (self.turn+1)%2 #間違った宣言。相手を勝者にセット
                self.gameEnd = True     #ゲーム終了
    
    def drawBoard(self):
        drawstrarray = np.full((4,4),None)
        for left in range(4):
            for top in range(4):
                p = self.board.getBoard(left,top)
                p = self.nonePiece() if p is None else str(p.toNumList()) 
                drawstrarray[left,top] = p
        util.p.print(drawstrarray)
        util.p.print('')
    
    def nonePiece(self):
        return '[0 0 0 0]'
    
    def drawBox(self):
        s = len(self.box.piecelist)
        for i in range(s):
            space = '  ' if i<10 else ' '
            util.p.print(str(i)+space+str(self.box.piecelist[i].toNumList()))
        util.p.print('')

    def drawChoicePiece(self):
        util.p.print('choice '+str(self.choicepiece.toNumList()))
        util.p.print('')
    
    def drawPutPos(self):
        util.p.print('put '+str(self.left)+','+str(self.top))
        util.p.print('')

def winningPercentageRun(gamenum, p0=None, p1=None):
    start = time.time()
    
    if(p0 is None):p0 = gameplayerinfo.playerAiList[0]
    if(p1 is None):p1 = gameplayerinfo.playerAiList[1]
        
    player0 = p0
    player1 = p1

    score = {
        player0:0,
        player1:0,
        None:0,
    }
    scoreper = {}

    for i in range(gamenum):
        #ゲーム実行
        res = GameMain(player0, player1).run()
        
        #情報印字
        util.p.print(str(i)+'戦目終了')
        util.p.print('先行 Player0：'+str(player0))    #ログは最後のほうが見やすいと思うのでプレイヤー情報などは後に出す。
        util.p.print('後攻 player1：'+str(player1))
        if (res == 0):
            util.p.print('勝利AI：'+str(player0))
        elif (res == 1):
            util.p.print('勝利AI：'+str(player1))
        util.p.print('')
        
        #スコア加算
        score[player0] += 1 if res == 0 else 0
        score[player1] += 1 if res == 1 else 0
        score[None   ] += 1 if res is None else 0

        #先攻後攻入れ替え
        tempp = player0
        player0 = player1
        player1 = tempp
    
    scoreper[player0] = score[player0] / gamenum * 100
    scoreper[player1] = score[player1] / gamenum * 100
    scoreper[None   ] = score[None   ] / gamenum * 100
    
    player0 = p0
    player1 = p1

    util.p.print('対戦数：'+str(gamenum))
    util.p.print('AI1:'+str(player0))
    util.p.print('AI2:'+str(player1))
    util.p.print('AI1の勝率：'+str(scoreper[player0]))
    util.p.print('AI2の勝率：'+str(scoreper[player1]))
    util.p.print('引き分け率：'+str(scoreper[None   ]))

    playtime = time.time() - start
    util.p.print("処理時間：{0}".format(playtime)+"[sec]")
    result = {
        '対戦回数：':gamenum,
        'AI1：':str(player0),
        'AI2：':str(player1),
        'AI1勝利数：':score[player0],
        'AI2勝利数：':score[player1],
        '引き分け数：':score[None   ],
        'AI1の勝率：':scoreper[player0],
        'AI2の勝率：':scoreper[player1],
        '引き分け率：':scoreper[None   ],
        '処理時間：':playtime,
    }
    return result

def winningPercentageRunMultiprocess(args):
    result = winningPercentageRun(args[0],args[1],args[2])
    return result

