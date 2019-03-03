import * as piece from "./piece.js";

export class Box{
    constructor(boxlist=null, board=null){
        this.piecelist = null;
        if(boxlist){
            let tlist = [];
            for(let piecedict of boxlist){
                let p = piece.Piece.getInstance(piecedict);
                tlist.push(p);
            }
            this.piecelist = tlist;
        }
                
        if(board){
            this.piecelist = piece.Piece.getAllPiece();
            for(let i=0; i<4; ++i){
                for(let j=0; j<4; ++j){
                    let bp = board.onboard[i][j];
                    if(bp){
                        this.remove(bp);
                    }
                }
            }
        }
    }
            
    clone(){
        let cobj = new Box();

        //piecelist内のPieceクラスのコピーを作成しないようにシャローコピーをする
        //cobj.piecelist = this.piecelist.copy()
        cobj.piecelist = this.piecelist.slice();

        return cobj
    }

    remove(p){
        //nw = np.where(this.piecelist == piece)
        //this.piecelist = np.delete(this.piecelist,nw)
        for(let i=0; i<this.piecelist.length; ++i){
            if(this.piecelist[i] == p){
                this.piecelist.splice(i,1);
            }
        }
    }
    
    toDict(){
        let obj = [];
        for(let p of this.piecelist){
            obj.push(p.toDict());
        }
        return obj
    }

    isEmpty(){
        return (this.piecelist.length == 0);
    }
}