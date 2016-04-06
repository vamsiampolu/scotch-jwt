var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var jsonwebtoken = require('jsonwebtoken');
var config = require('./config');

var app = express();
var port = process.env.PORT || 3000;
mongoose.connect(config.url);
mongoose.connection.on('error',function(err){
  console.error(err);
});
var User = require('./models/user');
app.set('supersecret',config.secret);
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/',function(req,res) {
  res.send('This api is at localhost:' + port);
});

app.get('/setup',function(req,res){
   var nick = new User({
      name:'Nick Cerminara', 
      password:'password',
      admin:true
   });
   nick.save(function(err){
      if(err) {
        console.error(err);
        return;
      } 
      console.log('User saved successfully');
      res.json({success:true});
   });
});
var apiRoutes = require('./apiRoutes');
app.use('/api',apiRoutes);

app.listen(port);
console.log('Magic happens at http://localhost:'+port);

