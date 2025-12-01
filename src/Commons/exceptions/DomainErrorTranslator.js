const InvariantError = require('./InvariantError');
const NotFoundError = require('./NotFoundError');
const AuthorizationError = require('./AuthorizationError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'ADD_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menambah thread karena properti yang dibutuhkan tidak ada'),
  'ADD_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat menambah thread karena tipe data tidak sesuai'),
  'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menambah thread karena properti yang dibutuhkan tidak ada'),
  'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat menambah thread karena tipe data tidak sesuai'),
  'ADD_COMMENT.INVALID_PAYLOAD': new InvariantError('payload komentar tidak sesuai'),
  'ADD_COMMENT.NOT_CONTAIN_CONTENT': new InvariantError('konten komentar tidak boleh kosong'),
  'ADD_COMMENT.CONTENT_NOT_A_STRING': new InvariantError('konten komentar harus berupa string'),
  'THREAD_NOT_FOUND': new NotFoundError('thread tidak ditemukan'),
  'COMMENT_NOT_FOUND': new NotFoundError('comment tidak ditemukan'),
  'ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menambah reply karena properti yang dibutuhkan tidak ada'),
  'ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat menambah reply karena tipe data tidak sesuai'),
  'ADD_REPLY.INVALID_PAYLOAD': new InvariantError('payload reply tidak sesuai'),
  'NEW_REPLY.INVALID_PAYLOAD': new InvariantError('payload reply tidak sesuai'),
  'NEW_REPLY.NOT_CONTAIN_CONTENT': new InvariantError('konten reply tidak boleh kosong'),
  'NEW_REPLY.CONTENT_NOT_STRING': new InvariantError('konten reply harus berupa string'),
  'COMMENT_NOT_OWNER': new AuthorizationError('anda tidak berhak mengakses resource ini'),
};

module.exports = DomainErrorTranslator;

