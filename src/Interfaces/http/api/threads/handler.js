const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');

class ThreadsHandler {
  constructor({ addThreadUseCase, getThreadDetailUseCase }) {
    this._addThreadUseCase = addThreadUseCase;
    this._getThreadDetailUseCase = getThreadDetailUseCase;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: owner } = request.auth.credentials;

    const addedThread = await this._addThreadUseCase.execute(request.payload, owner);

    return h.response({
      status: 'success',
      data: {
        addedThread,
      },
    }).code(201);
  }

  async getThreadByIdHandler(request, h) {
    try {
      const threadId = request.params.threadId;

      const thread = await this._getThreadDetailUseCase.execute(threadId);

      return h.response({
        status: 'success',
        data: {
          thread,
        },
      }).code(200);

    } catch (error) {

      if (error.message === 'THREAD_NOT_FOUND') {
        const response = h.response({
          status: 'fail',
          message: 'thread tidak ditemukan'
        });
        response.code(404);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami'
      });
      response.code(500);
      return response;
    }
  }
}

module.exports = ThreadsHandler;
