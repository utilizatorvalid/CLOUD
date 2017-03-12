const Server = require("./my_server.js");

const app = new Server();
const EventDataService = require('./models/event_service')

const es = new EventDataService();
app.get('/events',(req, res)=>{
    console.log('req id:',req.eventID);
    if(!req.eventID)
        es.getAllEvents((err, data)=>{
            if(err){
                res.send500();
                return;
            }
            res.send200(data);
        });
    else
        es.findEvent(req.eventID,(err, data)=>{
            if(err!=null){
                res.send500();
                return;
            }

            if(!data){  
                res.send404()
                return;    
            }
            
            res.send200(data);
        })    
})

app.serve();
