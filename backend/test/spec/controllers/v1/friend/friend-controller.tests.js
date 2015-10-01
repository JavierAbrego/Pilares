
describe('FriendController Tests', function() {

  var friendController;
  var req;
  var res;
  var next;

  beforeEach(function() {
    req = {};
    res = { status: function(code) { return { json: function(obj) {} }} };

    sinon.spy(res, "status");

    friendController = require('../../../../../app/controllers/v1/friend/friend-controller');
  });

  describe('post()', function() {

    it('should be a function', function(done) {
      expect(friendController.post).to.be.a('function');
      done();
    });

    it('should call res.status() one time', function(done) {
      friendController.post(req, res, next);

      expect(res.status.callCount).to.equal(1);
      done();
    });

    it('should call res.status() with 200', function(done) {
        friendController.post(req, res, next);

      expect(res.status.calledWith(200)).to.equal(true);
      done();
    });

  });
});
