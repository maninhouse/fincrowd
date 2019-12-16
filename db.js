/*
var settings = require('../simple-website-with-nodejs/settings');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

module.exports = new Db(settings.db, new Server(settings.host,
    Connection.DEFAULT_PORT, {}));
*/
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb+srv://user1:user1@cluster-first-dneha.gcp.mongodb.net/test?retryWrites=true&w=majority";
var client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  var collection = client.db("test").collection("devices");
  // perform actions on the collection object
  //client.close();
});
if (client.isConnected()){
    kitty = {
        name: 'chu',
        age: 10
    };
    client.db("test").collection("devices").save(kitty);
    console.log(client.db("test").collection("devices").findOne({age: 10}));
}

/*
client.connect(uri,  function(err, db){
    db.collection('data', function(err, collection){
        collection.find({}, function(err, rows){
            for(var index in rows)
                console.log(rows[index]);
        });
    })  
});
var db = client.db()

data.insert({
    name: 'Fred',
    data:{
        tel: '000',
        address: '555'
    }
}, function(err, docs){
    if (err){
        //insert fail
        return;
    }

        //insert success
});
*/