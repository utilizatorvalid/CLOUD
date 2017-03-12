class Event {
    /**
     * 
     * @param {string} id 
     * @param {string} name 
     * @param {string} description 
     */
    constructor(id, name, description){
        this.id = id;
        this.name = name;
        this.description = description;
    }
}
module.exports= Event;