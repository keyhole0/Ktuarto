import srcPiece00 from "./img/00.png";
import srcPiece01 from "./img/01.png";
import srcPiece02 from "./img/02.png";
import srcPiece03 from "./img/03.png";
import srcPiece04 from "./img/04.png";
import srcPiece05 from "./img/05.png";
import srcPiece06 from "./img/06.png";
import srcPiece07 from "./img/07.png";
import srcPiece08 from "./img/08.png";
import srcPiece09 from "./img/09.png";
import srcPiece10 from "./img/10.png";
import srcPiece11 from "./img/11.png";
import srcPiece12 from "./img/12.png";
import srcPiece13 from "./img/13.png";
import srcPiece14 from "./img/14.png";
import srcPiece15 from "./img/15.png";

let srcPieceList = [
    srcPiece00,
    srcPiece01,
    srcPiece02,
    srcPiece03,
    srcPiece04,
    srcPiece05,
    srcPiece06,
    srcPiece07,
    srcPiece08,
    srcPiece09,
    srcPiece10,
    srcPiece11,
    srcPiece12,
    srcPiece13,
    srcPiece14,
    srcPiece15,
];

export class Display{
    setBoard(canvas_board){this.canvas_board = canvas_board;}
    setBox(canvas_box){this.canvas_box = canvas_box;}
    setPiece(canvas_piece){this.canvas_piece = canvas_piece;}
    setResult(canvas_result){this.canvas_result = canvas_result;}

    dispInit(){
        this.canvas_result.innerHTML = "";
    }

    dispGameOver(winner){
        if(winner){
            this.canvas_result.innerHTML = "winner:"+winner;
        }else{
            this.canvas_result.innerHTML = "引き分け";
        }
    }

    dispMain(board, box, piece){
        this.dispBoard(board);
        this.dispBox(box);
        this.dispPiece(piece);
    }

    dispBoard(board){
        for(let i=0; i<4; ++i){
            for(let j=0; j<4; ++j){
                let p = board.onboard[i][j];
                let td = this.canvas_board.querySelector("#c"+i+j);
                if(td == null)continue;
                td.innerHTML = "";
                if(p){
                    let pieceimg = generatePieceImg(p.index);
                    td.appendChild(pieceimg);
                }
            }
        }
    }

    dispBox(box){
        let temp = document.createElement("p");
        if(box.piecelist){
            let count = 0;
            for(let p of box.piecelist){
                let pieceimg = generatePieceImg(p.index);
                pieceimg.dataset.ind = count;
                temp.appendChild(pieceimg);
                ++count;
            }
        }
        this.canvas_box.innerHTML = "ボックス";
        this.canvas_box.appendChild(temp);
    }

    dispPiece(piece){
        this.canvas_piece.innerHTML = "選択されたコマ：";
        if(piece){
            let pieceimg = generatePieceImg(piece.index);
            this.canvas_piece.appendChild(pieceimg);
        }
    }
}

//Pieceの画像エレメント生成
function generatePieceImg(index){
    let img = document.createElement("img");
    let scale = 0.2;
    img.width = 250 * scale;
    img.height = 400 * scale;
    img.src = srcPieceList[index];
    return img;
}