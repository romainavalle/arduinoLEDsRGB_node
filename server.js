//setup Dependencies
var app = require('http').createServer();
var io = require('socket.io'),
    port = (process.env.PORT || 8081),
    _ = require('./node_modules/backbone/node_modules/underscore'),
    Shoot = require('./models/Shoot.js').Shoot,
    ShootCollection = require('./models/Shoot.js').ShootCollection,
    canal = "node";

io = io.listen(app);

io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
  io.set("close timeout", 10);
  io.set("log level", 1);
});

var shootCollection = new ShootCollection();
shootCollection.on('add',checkShoot);


function checkShoot(){
  //
  var obj = {
    'green': 0,
    'blue': 0,
    'red': 0
  };
  obj = _.countBy(shootCollection.models,function(e){
    return e.color;
  });
  var real_obj = {
    'green': obj.green / _.size(shootCollection),
    'blue': obj.blue / _.size(shootCollection),
    'red': obj.red / _.size(shootCollection)
  };
  io.sockets.emit('response',{obj:real_obj});
  //
}
io.sockets.on('connection', function(socket){
  socket.on(canal, function(data){
    if(data.type == 'shoot'){
      var shoot = new Shoot({color: data.color});
      if(_.size(shootCollection) == 256)shootCollection.shift();
      shootCollection.add(shoot);
    }
  });
});
app.listen(port);
console.log('Listening on ' + port );

