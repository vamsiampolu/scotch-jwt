var router = require('express').Router();
var User = require('./models/user');
var jsonwebtoken = require('jsonwebtoken');

router.use(function(req,res,next){
 var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if(token) {
    jsonwebtoken.verify(token,'supersecret',function(err,decoded) {
       if(err) {  
          return res.json({
            success:false,
	    message:'Failed to authenticate token'
          });
       }
       else {
       	 req.decoded = decoded;
         next();	
       }
       
    }); 
  } else {
  	res.status(403).send({
	  success:false,
	  message:'No Token provided'
	});	
  }
    
});

router.get('/',function(req,res){
  res.json({message:'Welcome to the coolest api on earth'});
});

router.get('/users',function(req,res){
  User.find({},function(err,users){
    if(err) {
      console.error(err);
      return;
    } 
    res.json({users:users});
  });
})

router.post('/authenticate',function(req,res){
  User.findOne({ name:req.body.name},
  	function(err,user) {
        if(err) throw err;
	if(!user) {
	  res.json({
	    success: false,
	    message: 'Authentication failed, user not found'
	  });
	} 
	else if(user.password != req.body.password ){
		res.json({
			success:false,
			message:'Authentication failed, wrong password'
   		});
   }
   else {
     var token = jsonwebtoken.sign(user,'supersecret');
     res.json({
        token:token,
		success:true,
		message:'Enjoy your token'
     });
   }	
  });
});

module.exports = router;
