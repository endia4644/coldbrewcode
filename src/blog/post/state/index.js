import {
  createReducer,
  createSetValueAction,
  FETCH_KEY,
  setValueReducer,
} from "../../../common/redux-helper";

export const Types = {
  SetValue: "post/SetValue",
  SetComment: "post/SetComment",
  FetchGetPost: "post/FetchGetPost",
  FetchAddPostLike: "post/FetchAddPostLike",
  FetchRemovePostLike: "post/FetchRemovePostLike",
  FetchGetComment: "post/FetchGetComment",
  FetchAddComment: "post/FetchAddComment",
  FetchUpdateComment: "post/FetchUpdateComment",
  FetchRemoveComment: "post/FetchRemoveComment",
  FetchRemovePost: "post/FetchRemovePost",
};

export const actions = {
  setValue: createSetValueAction(Types.SetValue),
  fetchGetPost: ({ id, postType }) => ({
    type: Types.FetchGetPost,
    id: id,
    postType: postType,
    [FETCH_KEY]: id,
  }),
  setComment: (comment) => ({
    type: Types.SetComment,
    comment,
  }),
  fetchAddPostLike: (id) => ({
    type: Types.FetchAddPostLike,
    id: id,
    [FETCH_KEY]: id,
  }),
  fetchRemovePostLike: (id) => ({
    type: Types.FetchRemovePostLike,
    id: id,
    [FETCH_KEY]: id,
  }),
  fetchGetComment: (id, postId, fetchKey) => ({
    type: Types.FetchGetComment,
    id,
    postId,
    [FETCH_KEY]: fetchKey,
  }),
  fetchAddComment: ({
    postId,
    parentId,
    commentContent,
    commentDepth,
    comment,
    commentCount,
  }) => ({
    type: Types.FetchAddComment,
    postId: postId,
    parentId: parentId,
    commentContent,
    commentDepth,
    comment,
    commentCount,
    [FETCH_KEY]: postId,
  }),
  fetchUpdateComment: ({ id, parentId, commentContent, commentDepth, commentCount, postId }) => ({
    type: Types.FetchUpdateComment,
    id,
    parentId,
    commentContent: commentContent,
    commentDepth,
    commentCount,
    postId,
    [FETCH_KEY]: id,
  }),
  fetchRemoveComment: (id, parentId, commentDepth, commentCount, postId) => ({
    type: Types.FetchRemoveComment,
    id,
    parentId,
    commentDepth,
    commentCount,
    postId,
    [FETCH_KEY]: id,
  }),
  fetchRemovePost: ({ postId }) => ({
    type: Types.FetchRemovePost,
    postId,
    [FETCH_KEY]: postId,
  }),
};

const INITIAL_STATE = {
  post: null,
  comment: [],
  commentCount: 0,
  comment_0: [],
};
const reducer = createReducer(INITIAL_STATE, {
  [Types.SetValue]: setValueReducer,
});
export default reducer;
