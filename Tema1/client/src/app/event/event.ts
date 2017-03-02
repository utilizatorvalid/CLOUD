export class Event{
    id: string;
    name:string;
    coverPicture:string;
    description: string;
    fb_link: string;
    constructor(id:string, 
                name:string,
                coverPicture:string,
                description: string,
                ){
        this.id = id;
        this.name = name;
        this.coverPicture = coverPicture,
        this.description = description,
        this.fb_link = "https://www.facebook.com/events/"+id+'/'
    }
}