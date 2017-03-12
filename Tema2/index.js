const Server = require("./my_server.js");

const app = new Server();
const EventDataService = require('./models/event_service')

const es = new EventDataService();
app.get('/events', (req, res) => {
    // console.log('req id:',req.eventID);
    if (!req.eventID)
        es.getAllEvents((err, data) => {
            if (err) {
                res.send500();
                return;
            }
            res.send200(data);
        });
    else
        es.findEvent(req.eventID, (err, data) => {
            if (err != null) {
                res.send500();
                return;
            }

            if (!data) {
                res.send404()
                return;
            }

            res.send200(data);
        })
})
app.post("/events", (req, res) => {
    
    // console.log(req.body)
    if(!req.body){
        res.send400("malformatted json");
        return;
    }
    es.createEvent(req.body, (err, data)=>{
        if(err)
            return res.send400(data); 

        res.send200(data)   
    })
});

app.put("/events", (req, res)=>{
    if (!req.eventID)
        res.send400("give us an id for event to modiffy");
    if(!req.body){
        res.send400("malformatted json");
        return;
    }
    es.updateEvent(req.eventID, req.body, (err, data)=>{
        if(err)
            return res.send400(data); 

        res.send200(data)   
    })
});

app.serve();