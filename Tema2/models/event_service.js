const Event = require("./event")
class EventDataService {
    constructor() {
        this._events = [
            new Event("1", "Eveniment frumos", "Prezentarea temei 2 la Cloud"),
            new Event("2", "Eveniment 2", "Prezentarea temei 2 la CN"),
            new Event("3", "Eveniment 3", "Prezentarea temei 2 la GPC"),
            new Event("4", "Eveniment 4", "Prezentarea temei 2 la PDJ")
        ]
    }

    getAllEvents(next) {
        if (!this._events) {
            next("Internal error", "");
            return;
        }
        next(null, this._events);

    }
    deleteAllEvents(next){
        if (!this._events) {
            next("Internal error", "");
            return;
        }
        this._events = [];
        next(null, "All events are removed");

    }
    
    removeEvent(eventID, next) {
        var s_event;
        var index = 0;
        for (var e of this._events) {
            // console.log(e);
            if (e.id == eventID) {
                s_event = e;
                break
            }
        index++;
        }
        
        if (!s_event)
            return next("Sems like element wasn't there :(", "");
        this._events.splice(index, 1);
     
        next(null, "Element removed succesfully");
    }
    findEvent(eventID, next) {
        var s_event;
        for (var e of this._events) {
            // console.log(e);
            if (e.id == eventID)
                s_event = e;
        }
        if(!s_event)
            return next("Event not found","")
        next(null, s_event);
    }
    createEvent(eventJson, next) {
        //create event from eventJson
        var good_json = true;
        var new_event = new Event();
        for (var key in eventJson) {
            if (eventJson.hasOwnProperty(key) && new_event.hasOwnProperty(key)) {
                new_event[key] = eventJson[key];
            } else
                good_json = false;
        }
        
        if (!good_json)
            next("Bad body to many/few attributes", "")

        for (var e of this._events) {
                if (e.id == new_event.id) {
                    good_json = false;
                    break
                }
            }
        if(!good_json)
           return next("Event with this id already exists","")

        this._events.push(new_event)
        return next(null, "Event added succesfully");
    }
    updateEvent(eventID, eventJson, next){
        this.findEvent(eventID, (err,event_to_update)=>{
            
            if(err || event_to_update === null)
                return next("Looks like event u want to update is not there","")
            
            if(!eventJson.hasOwnProperty("id"))
                return next("Please specify and id attribute inside json","");
                
            if(event_to_update.id != eventJson.id)
                return next("Looks like u want to update other event :( bad boy","");

            var good_json = true;
            for(var key in eventJson){
                if(!(eventJson.hasOwnProperty(key) && event_to_update.hasOwnProperty(key)))
                good_json = false;
            }
            if(!good_json)
                return next("Bad body to many/few attributes","")    
            
            for(var key in eventJson){
                        event_to_update[key] = eventJson[key];         
                }
            return next(null, "updated succesfully");
        })
    }

    patchEvent(eventID, eventJson, next){
        this.findEvent(eventID, (err,event_to_update)=>{
            
            if(err || event_to_update === null)
                return next("Looks like event u want to update is not there","")
            
            if(eventJson.hasOwnProperty("id")) 
                if(event_to_update.id != eventJson.id)
                    return next("u cannot change your ID sorry :(","");

            var good_json = true;
            for(var key in eventJson){
                if((eventJson.hasOwnProperty(key) && !event_to_update.hasOwnProperty(key)))
                good_json = false;
            }

            if(!good_json)
                return next("Bad body to many or invalid attributes","")    
            
            for(var key in eventJson){
                        event_to_update[key] = eventJson[key];         
                }
            return next(null, "patched succesfully");
        })
    }
    

}

module.exports = EventDataService;