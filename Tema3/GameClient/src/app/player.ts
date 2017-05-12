export class Player {
    name:string
    url_img:string
    id:string;
    in_game:boolean = false;
    symbol;
    constructor(name:string, url_img: string){
        this.name = name;
        this.url_img = url_img;
        this.in_game= false;
    }
}
