const models = require('../models');

const { Post } = models.Post;
const { Account } = models.Account;

const homePage = async (req, res) => res.render('app');

// create a new post
const createPost = async (req, res) => {
  const { content, author } = req.body;
  try {
    const newPost = new Post({ content, author });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const makePost = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Both name and age are required!' });
  }

  const postData = {
    content: req.body.name,
    author: req.session.account._id,
  };

  try {
    const newPost = new Post(postData);
    await newPost.save();
    return res.status(201).json({ content: newPost.name });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured making post!' });
  }
};

// get all posts of a user
const getUserPosts = async (req, res) => {
  const { userId } = req.params;
  try {
    const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Post.find(query).select('content').lean().exec();

    return res.json({ posts: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving posts!' });
  }
};

// get feed of posts by followed users
const getFeed = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await Account.findById(userId).populate('following');
    const posts = await Post.find({ author: { $in: user.following } })
      .populate('author')
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Like a post
const likePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;
  try {
    const post = await Post.findById(postId);
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      await post.save();
      res.status(200).json({ message: 'Post liked successfully' });
    } else {
      res.status(400).json({ message: 'Post already liked' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Unlike a post
const unlikePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;
  try {
    const post = await Post.findById(postId);
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
      await post.save();
      res.status(200).json({ message: 'Post unliked successfully' });
    } else {
      res.status(400).json({ message: 'Post not liked' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body; // Ensure only the author can delete the post
  try {
    const post = await Post.findById(postId);
    if (post.author.toString() === userId) {
      await post.remove();
      res.status(200).json({ message: 'Post deleted successfully' });
    } else {
      res.status(403).json({ message: 'You are not authorized to delete this post' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  homePage,
  createPost,
  makePost,
  getUserPosts,
  getFeed,
  getPosts,
  likePost,
  unlikePost,
  deletePost,
};
