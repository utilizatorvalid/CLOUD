class Player
{   
     /**
     * 
     * @param {*} id 
     * @param {*} socket 
     */
    constructor(id, socket){
        this.id = id;
        this.socket = socket;
        this.name = 'Incognito'
        this.url_img = '';
        this.in_game = false;
    }
    removeSocket(){
        return {
            id: this.id,
            name: this.name,
            url_img: this.url_img,
            in_game:this.in_game,
            symbol:this.symbol
        }
    }
}

module.exports = Player