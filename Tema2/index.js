const Server = require("./my_server.js");
const EventDataService = require('./models/event_service')

const app = new Server();
const es = new EventDataService();
app.get('/events', (req, res) => {
    if (!req.eventID)
        return es.getAllEvents((err, data) => {
            if (err)
                return res.send500(err);
            res.send200(data);
        });

    es.findEvent(req.eventID, (err, data) => {
        if (err)
            return res.send500(err);

        if (!data)
            return res.send404("Seems like there is no event u looking for")

        res.send200(data);
    })
})
app.post("/events", (req, res) => {

    if (!req.body)
        return res.send400("malformatted json");

    es.createEvent(req.body, (err, data) => {
        if (err)
            return res.send400(err);

        res.send200(data)
    })
});

app.put("/events", (req, res) => {
    if (!req.eventID)
        return res.send400("give us an id for event to modiffy");
    if (!req.body)
        return res.send400("malformatted json");

    es.updateEvent(req.eventID, req.body, (err, data) => {
        if (err)
            return res.send400(err);

        res.send200(data)
    });
});

app.patch("/events", (req, res) => {
    if (!req.eventID)
        return res.send400("give us an id for event to modiffy");
    if (!req.body)
        return res.send400("malformatted json");

    es.patchEvent(req.eventID, req.body, (err, data) => {
        if (err)
            return res.send400(err);

        res.send200(data)
    });
});

app.delete('/events', (req, res) => {
    if (!req.eventID)
        return es.deleteAllEvents((err, data) => {
            if (err)
                return res.send404(err);
            res.send200(data);
        });

    es.removeEvent(req.eventID, (err, data) => {
        if (err)
            return res.send404(err);

        if (!data)
            return res.send404()

        res.send200(data);
    })
});

app.serve();