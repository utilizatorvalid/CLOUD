var long_live_access_token = "EAAZAmBDkPjOoBALsLlr5o4nXTnDxDoKZAr6lgMpZAU8pv5nUfMvl59hHD51QZAt7Dl2NJXOg0RpnsxBwEEuWzeuerGRCVl8eVhisXzh96UfQyTbBiBvRtTBKFaKNdeWHrIBgj6VAZAcRdlloDlENJoJOMXCNW1bwZD"
var c9_endpoint = "https://facebook-crawler-utilizatorvalid.c9users.io/events?"
var geolocationapi = 'http://ip-api.com/json'//+  /ip


var request = require('request');
var express = require('express');
var app = express();
var distance = 1000;
app.get('/events',function(req, res){
    // console.log(req)
    
    var ip = getClientIp(req);
    console.log("adresa ip:", ip)
    get_golocation(ip, function(error, json_body){
        if(json_body.status =='success'){
            get_events(json_body.lat, json_body.lon, (data)=>{
              res.json(data)
            })
        }
    })
    // res.json({ipAddress: ip})
    })

app.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0")

function getClientIp(req) {
  var ipAddress;
  // The request may be forwarded from local web server.
  var forwardedIpsStr = req.header('x-forwarded-for'); 
  if (forwardedIpsStr) {
    // 'x-forwarded-for' header may return multiple IP addresses in
    // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
    // the first one
    var forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    // If request was not forwarded
    ipAddress = req.connection.remoteAddress;
  }
  return ipAddress;
};



function get_golocation(ip,cb){
  request(geolocationapi+'/'+ip,
          function(error, response, body){
              console.log('error',error)
              console.log('statusCode', response && response.statusCode)
              var json_body = JSON.parse(body);
              console.log(json_body); 
              cb(error, json_body)
          });
}

function get_events(lat, lng, cb){
  
    request(c9_endpoint+'lat='+lat+'&lng='+lng+'&distance='+distance+'&accessToken='+long_live_access_token,
        function(error, response, body){
            console.log('error:',error);
            console.log('statusCode:', response && response.statusCode);
            //console.log("body:",body);
            return cb(JSON.parse(body));
    });

}
    
// function postprocess_response(body){
//     console.log('POSTPROCESS:');
//     var jsonbody = JSON.parse(body)
//     var i = 0;
//     var events = jsonbody.events;
//     //console.log(events);
//     for(var event of events){
//         console.log(event.name);
//         console.log("time:",event.startTime);
//         i++;
//     }
//     console.log("numar de evenimente:", i);
// }