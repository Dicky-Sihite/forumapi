const CommentsHandler = require('./handler');

function routes(container) {
  const handler = new CommentsHandler({
    addCommentUseCase: container.getInstance('AddCommentUseCase'),
    deleteCommentUseCase: container.getInstance('DeleteCommentUseCase'),
    toggleCommentLikeUseCase: container.getInstance('ToggleCommentLikeUseCase'),
  });

  return [
    {
      method: 'POST',
      path: '/threads/{threadId}/comments',
      handler: handler.postCommentHandler,
      options: { auth: 'forum_jwt' },
    },
    {
      method: 'DELETE',
      path: '/threads/{threadId}/comments/{commentId}',
      handler: handler.deleteCommentHandler,
      options: { auth: 'forum_jwt' },
    },
    {
      method: 'PUT',
      path: '/threads/{threadId}/comments/{commentId}/likes',
      handler: handler.putCommentLikeHandler,
      options: { auth: 'forum_jwt' },
    },
  ];
}

module.exports = routes;
