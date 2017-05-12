// require('./Player')
class Game
{   
     /**
     * 
     * @param {*} p1 :Player
     * @param {*} p2 
     */
    constructor(p1, p2){
        this.p1 = p1;
        this.status = 'wait p2';
        this.p2 = p2;
        this.table= [
            [0,0,0]
            [0,0,0]
            [0,0,0]
        ];
        this.p1.symbol = 'X';
        this.p2.symbol = 'O'
        
    }

}

module.exports = Game