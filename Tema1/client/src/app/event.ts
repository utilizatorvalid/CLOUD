export class Event{
    id: string;
    name:string;
    coverPicture:string;
    description: string;
    constructor(id:string, 
                name:string,
                coverPicture:string,
                description: string,
                ){
        this.id = id;
        this.name = name;
        this.coverPicture = coverPicture,
        this.description = description
    }
}