var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiUsersRouter = require('./routes/api/users');
var app = express();
// configuring the config.dev.js
var config = require('./config.dev');
// creating connection to the database
var mongoose = require('mongoose');

/routes/api/users.js
var express = require('express');
var router = express.Router();
var Users = require('../../models/users');

router.get('/', function(req, res, next) {
  Users.find({},function(err, users){
    if(err){
     return res.json({'success':false, 'error': err});
   }
    return res.json({'success':true, 'users': users});
  });
});

module.exports = router;

router.get('/:userId', function(req,res){
  
    var userId = req.params.userId;
     Users.findOne({'_id':userId}, function(err, user){
       if(err){
        return res.json({'success':false, 'error': err});
      }
       return res.json({'success':true, 'user': user});
     });
   });

router.post('/', function(req, res) {
  Users.create(new Users({
    username: req.body.username,
    email: req.body.email,
    first_name: req.body.first_name,
    last_name: req.body.last_name
  }), function(err, user){
    
    if(err){
      return res.json({success: false, user: req.body, error: err});
    }

    return res.json({success: true, user: user});
    
  });
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/users', apiUsersRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
//Connect to MongoDB
mongoose.connect(config.mongodb, { useNewUrlParser: true });
module.exports = app;

router.put('/', function(req, res){

    Users.findOne({'_id': req.body._id}, function(err, user){
  
     if(err) {
       return res.json({success: false, error: err});
     }
  
     if(user) {
  
      let data = req.body;
  
      if(data.username){
        user.username = data.username;
      };
  
      if(data.email){
      user.email = data.email;
      };
  
      if(data.first_name){
      user.first_name = data.first_name;
      };
  
      if(data.last_name){
      user.last_name = data.last_name;
      };
  
      user.save(function(err){
        if(err){
          return res.json({success: false, error: err});
        }else{
          return res.json({success: true, user:user});
        }
      });
  
     }
  
    });
    
  });

  router.delete('/:userId', function(req,res){

    var userId = req.params.userId;
  
    Users.remove({'_id':userId}, function(err,removed){
  
      if(err){
        return res.json({success: false, error: err});
      }
  
      return res.json({success: true, status: removed});
  
    });
  
  });