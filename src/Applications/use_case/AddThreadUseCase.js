class AddThreadUseCase {
  constructor({ threadsRepository }) {
    this._threadsRepository = threadsRepository;
  }

  async execute(useCasePayload, owner) {
    const { title, body } = useCasePayload;

    if (!title || !body) {
      throw new Error('ADD_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('ADD_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    return this._threadsRepository.addThread({ title, body, owner });
  }
}

module.exports = AddThreadUseCase;