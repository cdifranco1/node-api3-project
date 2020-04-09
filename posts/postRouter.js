const express = require('express');
const postDb = require('./postDb')
const userDb = require('../users/userDb')
const router = express.Router();

router.use('/:id', validatePostId)

router.get('/', (req, res) => {
  postDb
    .get()
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(500).json({ error: "Posts could not be retrieved."}))
});

router.get('/:id', (req, res) => {
  postDb
    .getById(req.params.id)
    .then(post => res.status(200).json(post))
    .catch(err => res.status(500).json({ message: "Could not retrieve post with the specified id."}))
});

router.delete('/:id', (req, res) => {
  postDb
    .remove(req.params.id)
    .then(() => res.status(200).json(req.post))
    .catch(err => res.status(500).json({ message: "Could not delete post with specified ID."}))
});

router.put('/:id', validatePostUserId, async (req, res) => {
  try {
    const updateCount = await postDb.update(req.params.id, req.body)
    if (updateCount === 1){
      const updatedPost = await postDb.getById(req.params.id)
      console.log(updatedPost)
      res.status(201).json(updatedPost)
    }
  } catch {
    res.status(500).json({ message: "The post could not be updated. "})
  }
});

// custom middleware

async function validatePostId(req, res, next) {
  const post = await postDb.getById(req.params.id)
  if (!post) {
    res.status(404).json({ message: "Invalid post ID."})
  } else {
    req.post = post
    next()
  } 
}

async function validatePostUserId(req, res, next) {
  const user = await userDb.getById(req.body.user_id)
  if (!user) {
    res.status(404).json({ message: "Invalid user ID."})
  } else {
    req.user = user
    next()
  } 
}

module.exports = router;
