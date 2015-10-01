var User = require('../../models/user');
function UserService() {
}

function lookupUser(id) {
  return { id: id };
}

var checkCredentialsGenericCallback = function(err, count, callback){
  if(err){
    console.log(err);
    callback(false);
    return;
  }

  if(count>0){
    callback(true);
  }else{
    callback(false);
  }
};

function checkUserId(userId, callback){
  var checkCredentialsCallback = function(err, count){
    checkCredentialsGenericCallback(err, count, callback);
  };
  User.count({userId: userId}, checkCredentialsCallback );
}
function checkCredentials(userId, accessToken, callback){
  var checkCredentialsCallback = function(err, count){
    checkCredentialsGenericCallback(err, count, callback);
  };
  User.count({userId: userId, accessToken: accessToken}, checkCredentialsCallback );
}

function addCredentials(userId, accessToken, email, name, successHandler, errorHandler){
  var user = new User();
  user.email = email;
  user.name = name;
  user.accessToken = [accessToken];
  user.userId = userId;
  if(typeof (user.accessToken)=='undefined'||typeof (user.userId)=='undefined'){
    res.json({message:'No params'});
    return;
  }
  user.save(function onError(err){
    if(err){
      errorHandler(err);
    }else{
      successHandler();
    }

  });
}

function getUserName(userId, successHandler, errorHandler){
  User.find({userId: userId}, function(err, data){
    if(err) errorHandler();
    successHandler(data[0].name);
  });
}

function addAccessToken(userId, accessToken, successHandler, errorHandler){
  User.findOneAndUpdate({ 'userId': userId }, {$push: {"accessToken": accessToken}},function onError(err){
    if(err){
      console.log(JSON.stringify(err));
      errorHandler(err);
    }else{
      successHandler();
    }
  });
}

UserService.prototype = {
  lookupUser: lookupUser,
  checkCredentials: checkCredentials,
  addCredentials :  addCredentials,
  addAccessToken : addAccessToken,
  checkUserId: checkUserId,
  getUserName:getUserName
};

var userService = new UserService();

module.exports = userService;
