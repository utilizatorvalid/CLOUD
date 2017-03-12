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
            console.log(e);
            if (e.id == eventID)
                s_event = e;
        }
        next(null, s_event);
    }

}

module.exports = EventDataService;