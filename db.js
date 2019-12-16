mongoose = require('mongoose');
var uri = "mongodb://localhost/test";

var schema = mongoose.Schema;
var Block = new schema({
    index: Number,
    data: String,
    timestamp: Date,
    previoushash: String,
    hash: String
})
mongoose.model('Block', Block);

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
/*
var cat = mongoose.model('cat',{
    name: String,
    age: Number
});
var kitty = new cat({
    name: 'chu',
    age: 10
});
kitty.save(function (err){
    if(err){
        console.log('wrong');
        return;
    }
    console.log('meow');
});

cat.find( function(err, cats){
    for(var index in cats){
        var cat = cats[index];
        console.log(cat.name);
    }
        
});*/