
describe('EventService Tests', function() {

  var eventService;

  beforeEach(function() {
    eventService = require('../../../../app/services/event/event-service');
  });

  describe('lookupEvent', function() {

    it('should be a function', function(done) {
      expect(eventService.lookupEvent).to.be.a('function');
      done();
    });

  });
});
