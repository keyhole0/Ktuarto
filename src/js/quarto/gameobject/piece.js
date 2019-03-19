export class Piece{
    constructor(color, shape, top, height){
        //色,形,穴,高さ
        this.param = [color,shape,top,height];
        
        //文字列で格納された値を0,1に変換する
        let c   = (color  == 1)? 1:0;
        let s   = (shape  == 1)? 1:0;
        let t   = (top    == 1)? 1:0;
        let h   = (height == 1)? 1:0;

        //0,1からインデックスを作成する
        this.index = (c<<0) + (s<<1) + (t<<2) + (h<<3);
    }
    
    toDict(){
        let c = (this.param[0]  == 1)? "light"    : "dark";
        let s = (this.param[1]  == 1)? "circular" : "square";
        let t = (this.param[2]  == 1)? "hollow"   : "solid";
        let h = (this.param[3]  == 1)? "tall"     : "short";
        return {
            "color":c,
            "shape":s,
            "top":t,
            "height":h,
        };
    }

    toNumList(){
        //return np.where(this.param==1,1,2);
        let res = new Array(4);
        for(let i=0; i<4; ++i){
            res[i] = (this.param[i]==1)? 1:2;
        }
        return res;
    }
    
    static getInstance(pieceDict){
        //文字列で格納された値を0,1に変換する
        let c   = (pieceDict["color"]  == "light"   )? 1:0;
        let s   = (pieceDict["shape"]  == "circular")? 1:0;
        let t   = (pieceDict["top"]    == "hollow"  )? 1:0;
        let h   = (pieceDict["height"] == "tall"    )? 1:0;

        //0,1からインデックスを作成する
        let index = (c<<0) + (s<<1) + (t<<2) + (h<<3);
        return __piece_list__[index];
    }
    
    static getAllPiece(){
        return __piece_list__.slice();  //シャローコピー
    }
}

const __piece_list__ = [
    new Piece(-1,-1,-1,-1), //0
    new Piece( 1,-1,-1,-1), //1
    new Piece(-1, 1,-1,-1), //2
    new Piece( 1, 1,-1,-1), //3
    new Piece(-1,-1, 1,-1), //4
    new Piece( 1,-1, 1,-1), //5
    new Piece(-1, 1, 1,-1), //6
    new Piece( 1, 1, 1,-1), //7
    new Piece(-1,-1,-1, 1), //8
    new Piece( 1,-1,-1, 1), //9
    new Piece(-1, 1,-1, 1), //10
    new Piece( 1, 1,-1, 1), //11
    new Piece(-1,-1, 1, 1), //12
    new Piece( 1,-1, 1, 1), //13
    new Piece(-1, 1, 1, 1), //14
    new Piece( 1, 1, 1, 1), //15
];
