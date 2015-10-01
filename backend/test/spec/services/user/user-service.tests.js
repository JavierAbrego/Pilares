
describe('UserService Tests', function() {

  var userService;

  beforeEach(function() {
    userService = require('../../../../app/services/user/user-service');
  });

  describe('lookupUser', function() {

    it('should be a function', function(done) {
      expect(userService.lookupUser).to.be.a('function');
      done();
    });

  });
});
