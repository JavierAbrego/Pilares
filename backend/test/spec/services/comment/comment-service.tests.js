
describe('CommentService Tests', function() {

  var commentService;

  beforeEach(function() {
    commentService = require('../../../../app/services/comment/comment-service');
  });

  describe('lookupComment', function() {

    it('should be a function', function(done) {
      expect(commentService.lookupComment).to.be.a('function');
      done();
    });

  });
});
