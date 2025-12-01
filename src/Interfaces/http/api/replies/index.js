const RepliesHandler = require('./handler');
const routes = require('./routes');
const RepliesValidator = require('../validator/RepliesValidator');

module.exports = {
  name: 'replies',
  register: async (server, { container }) => {
    const addReplyUseCase = container.getInstance('AddReplyUseCase');
    const deleteReplyUseCase = container.getInstance('DeleteReplyUseCase');

    const repliesValidator = new RepliesValidator();

    const repliesHandler = new RepliesHandler({
      addReplyUseCase,
      deleteReplyUseCase,
      repliesValidator,
    });

    server.route(routes(repliesHandler));
  },
};
