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
            next(true, "");
            return;
        }
        next(false, this._events);

    }
    findEvent(eventID, next) {
        var s_event = null;
        for (var e of this._events) {
            // console.log(e);
            if (e.id == eventID)
                s_event = e;
        }
        next(null, s_event);
    }
    createEvent(eventJson, next) {
        //create event from eventJson
        var good_json = true;
        var new_event = new Event();
        for (var key in eventJson) {
            if (eventJson.hasOwnProperty(key) && new_event.hasOwnProperty(key)) {
                // console.log(key + " = " + eventJson[key]);
                new_event[key] = eventJson[key];
            } else
                good_json = false;
        }
        // console.log(new_event, good_json);
        //
        // console.log(this._events);
        
        if (!good_json)
            next(true, "bad body to many/few attributes")

        for (var e of this._events) {
                if (e.id == new_event.id) {
                    good_json = false;
                    break
                }
            }
        if(!good_json)
           return next(true,"event with this id already exists")

        this._events.push(new_event)
        return next(false, "event added succesfully");
    }
    updateEvent(eventID, eventJson, next){
        this.findEvent(eventID, (err,event_to_update)=>{
            if(err || event_to_update === null)
                return next(true,"Looks like event u want to update is not there")
            if(eventJson.hasOwnProperty("id"))
                if(event_to_update.id != eventJson.id)
                return next(true,"Looks like u want to update other event :( bad boy");
            
            var good_json = true;
            for(var key in eventJson){
                if(!(eventJson.hasOwnProperty(key) && event_to_update.hasOwnProperty(key)))
                good_json = false;
            }
            if(!good_json)
                return next(true,"bad body to many/few attributes" )    
            
            for(var key in eventJson){
                        event_to_update[key] = eventJson[key];         
                }
            return next(false, "updated succesfully");
        })
    }

}

module.exports = EventDataService;