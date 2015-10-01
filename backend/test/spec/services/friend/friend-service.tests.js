
describe('FriendService Tests', function() {

  var friendService;

  beforeEach(function() {
    friendService = require('../../../../app/services/friend/friend-service');
  });

  describe('lookupFriend', function() {

    it('should be a function', function(done) {
      expect(friendService.lookupFriend).to.be.a('function');
      done();
    });

  });
});
