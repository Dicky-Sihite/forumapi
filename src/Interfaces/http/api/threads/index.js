const routes = require('./routes');
const ThreadsHandler = require('./handler');

module.exports = {
  name: 'threads',
  register: async (server, { container }) => {
    const handler = new ThreadsHandler({
      addThreadUseCase: container.getInstance('AddThreadUseCase'),
      getThreadDetailUseCase: container.getInstance('GetThreadDetailUseCase'),
    });

    server.route(routes(handler));
  },
};
