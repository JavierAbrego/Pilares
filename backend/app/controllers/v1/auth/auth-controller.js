var userService =  require('../../../services/user/user-service');

function AuthController() {
}

function addAuthentication(req, res, next){
  var credentialsAddedSuccess = function(){
    res.json({message:'OK'});
  };

  var credentialsAddedError = function(){
    res.json({message:'Error'});
  };

  var onUserIdChecked = function(exist){
    if(exist){
      userService.addAccessToken(req.body.userId,
        req.body.accessToken,
        credentialsAddedSuccess,
        credentialsAddedError);
    }else{
      userService.addCredentials(req.body.userId,
        req.body.accessToken,
        req.body.email,
        req.body.name,
        credentialsAddedSuccess,
        credentialsAddedError);
    }
  };
  userService.checkUserId(req.body.userId, onUserIdChecked);
}


AuthController.prototype = {
  addAuthentication: addAuthentication
};

var authController = new AuthController();

module.exports = authController;
