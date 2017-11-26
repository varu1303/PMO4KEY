const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const path = require('path');
const db = require('./server/mongo/mongoDb');
const route = require('./server/routes/userRouter');

app.use(express.static('./client'));
app.use(bodyparser.json());


route(app);

app.get('*',function(req,res) {
    res.sendFile(path.join(__dirname + '/client/index.html'));
});

    
db.on('connected',function() {
    console.log('Connected to Mongo');
    app.listen(process.env.PORT || 3000,function() {
    console.log('Listenting at port');
    });
});
    
db.on('error',function(err) {
    console.log(`MongoDB default connection error ${err}`);
});
