from ..ailogic import gametree, montecarlo_ai, sample_ai, random_ai

playerAiList = [
    #[0] プレイヤー0（先行）のAi1
    #[1] プレイヤー1（後攻）のAi2
    #２戦目以降は先行、後攻を交互に切り替えるように変更。
    
    random_ai.RandomAi(),
    random_ai.RandomAi(),
    
    #montecarlo_ai.Montecarlo(),        #モンテカルロAI
    #random_ai.RandomAi(),              #ランダムAI 完全にランダムな手を返す。 自滅手を打つので長く続かない
    #random_ai.RandomAi3(),             #ランダムAI3 choiceのバグを直し、putの自滅手を打たない。
    #random_ai.RandomAi2(),             #ランダムAI2 choiceで自滅手を打たない
    #None,                              #手動操作
]



