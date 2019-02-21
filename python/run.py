"""
Quartoゲーム実行コマンド
python python/run.py [arg1] [arg2] [arg3]
arg1:対戦回数 数字で入力
arg2:マルチプロセスの実行 'm'を入力でマルチプロセス 未入力 or 'm'以外でシングルプロセス
arg3:ログのファイル出力 '1'を入力でログファイル生成 未入力 or '1'以外でログファイルを生成しない
"""

from quarto.gamesys import gamemain
import time
from quarto.gameutil import util
from datetime import datetime
import sys
from multiprocessing import pool
import multiprocessing as multi
import math
from quarto.ailogic import montecarlo_ai

def singleprocRun(num = 1):
    gamemain.winningPercentageRun(num)

def multiprocRun(num = 1):
    st = time.time()
    num = math.ceil(num/2)#勝敗の均等性をとるため、1回の処理で先行後攻の2回は必ずまわす。よって、2で割って切り上げた回数を指定。
    
    ai1 = montecarlo_ai.Montecarlo()
    ai1.param.ucb1_c = 0.8
    ai2 = montecarlo_ai.Montecarlo()
    ai2.param.ucb1_cucb1_c = 0.9
    ai3 = montecarlo_ai.Montecarlo()
    ai3.param.ucb1_c = 1.1
    ai4 = montecarlo_ai.Montecarlo()
    ai4.param.ucb1_c = 1.2

    #マルチプロセス実行
    p = pool.Pool(multi.cpu_count()-1)
    paramlist = [
        #一つのプロセス実行回数、AI1、AI2
        #[2,None,None] for i in range(num)
        [1,None,None] for i in range(num)
        #[50,ai1,None],
        #[50,ai2,None],
        #[50,ai3,None],
        #[50,ai4,None],
    ]
    result = p.map(gamemain.winningPercentageRunMultiprocess, paramlist)
    p.close()

    #ログ出力
    total = 0
    win1 = 0
    win2 = 0
    draw = 0
    for r,p in zip(result,paramlist):
        total += r['対戦回数：']
        win1 += r['AI1勝利数：']
        win2 += r['AI2勝利数：']
        draw += r['引き分け数：']
        util.p.print(str(r))

    util.p.print('')
    util.p.print('len result:'+str(len(result)))
    util.p.print('全体対戦回数：'+str(total))
    util.p.print('全体AI1勝率：'+str(win1/total*100))
    util.p.print('全体AI2勝率：'+str(win2/total*100))
    util.p.print('全体引き分け率：'+str(draw/total*100))
    util.p.print('全体処理時間：'+str(time.time()-st))


if __name__ == "__main__":
    #１つ目のパラメータに数字を入力されたらその回数だけ対戦をする
    num = 1
    if len(sys.argv) >= 2:
        num = int(sys.argv[1])

    #２つ目のパラメータに'm'と入力されたらマルチプロセスで実行
    multiflag = False
    if len(sys.argv) >= 3 and sys.argv[2] == 'm':
        multiflag = True
    
    #３つ目のパラメータに'1'と入力されたらログファイルを出力
    outputlog = False
    if len(sys.argv) >= 4 and sys.argv[3] == '1':
        outputlog = True
    
    #ログファイルを開く
    if(outputlog):
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        util.p.open('quarto_'+timestamp+'.log')

    #ゲームを実行
    if multiflag:   multiprocRun(num)
    else:           singleprocRun(num)
        
    #ログファイルを閉じる
    util.p.close()
