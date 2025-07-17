


export interface AddCommentArgs {
  postId: string;
  content: string;
  userId: string;
};

export interface AddReplyComment {
    postId: string;
    content: string;
    userId: string;
    parentId: string;
}