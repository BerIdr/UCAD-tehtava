import {
  fetchComments,
  fetchCommentById,
  addComment,
  updateComment,
} from '../models/comments-model.js';

const getComments = async (req, res) => {
  try {
    res.json(await fetchComments());
  } catch (e) {
    console.error('getComments', e.message);
    res.status(503).json({error: 503, message: 'DB error'});
  }
};

const getCommentById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const comment = await fetchCommentById(id);
    if (comment) {
      res.json(comment);
    } else {
      res.status(404).json({message: 'Comment not found'});
    }
  } catch (e) {
    console.error('getCommentById', e.message);
    res.status(503).json({error: 503, message: e.message});
  }
};

const postComment = async (req, res) => {
  const {media_id, user_id, comment_text} = req.body;
  if (!media_id || !user_id || !comment_text) {
    return res
      .status(400)
      .json({message: 'Media ID, user ID, and comment text required'});
  }
  try {
    const id = await addComment({
      media_id,
      user_id,
      comment_text,
      created_at: new Date().toISOString(),
    });
    res.status(201).json({message: 'Comment added', id});
  } catch (e) {
    console.error('postComment', e.message);
    res.status(400).json({message: 'Something went wrong: ' + e.message});
  }
};

export {getComments, getCommentById, postComment};
