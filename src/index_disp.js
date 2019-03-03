export class Display{
    setBoard(canvas_board){this.canvas_board = canvas_board;}
    setBox(canvas_box){this.canvas_box = canvas_box;}
    setPiece(canvas_piece){this.canvas_piece = canvas_piece;}
    setResult(canvas_result){this.canvas_result = canvas_result;}

    dispInit(){
        this.canvas_result.innerHTML = '';
    }

    dispGameOver(winner){
        this.canvas_result.innerHTML = 'winner:'+winner;
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
                let td = this.canvas_board.querySelector('#c'+i+j);
                if(td == null)continue;
                if(p != null){
                    td.innerHTML = ''+p.toNumList();
                }else{
                    td.innerHTML = "       ";
                }
            }
        }
    }

    dispBox(box){

    }

    dispPiece(piece){
        if(piece){
            this.canvas_piece.innerHTML = '選択されたコマ：'+piece.toNumList();
        }else{
            this.canvas_piece.innerHTML = '選択されたコマ：';
        }
    }
}