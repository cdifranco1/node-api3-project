const express = require('express');
const userDb = require('./userDb')
const postsDb = require('../posts/postDb')
const router = express.Router();

router.use('/:id', validateUserId)

router.post('/', validateUser, async (req, res) => {
  try {
    newUser = await userDb.insert(req.body)
    res.status(201).json(newUser)
  } catch {
    res.status(500).json({ message: "Error adding user to the database."})
  }
});

router.post('/:id/posts', validatePost, validateUserId, async (req, res) => {
  postsDb.insert(req.body)
    .then(post => res.status(201).json(post))
    .catch(err => res.status(400).json({ message: "Error creating user post."}))
});

router.get('/', (req, res) => {
  userDb
    .get()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({ message: "Could not retrieve users."}))
});

router.get('/:id', (req, res) => {
  console.log("Running")
  userDb
    .getById(req.params.id)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json({message: "Could not retrieve user."}))
});

router.get('/:id/posts', async (req, res) => {
  try {
    const posts = await userDb.getUserPosts(req.user.id)
    res.status(200).json(posts)
  } catch {
    res.status(500).json({ message: "Error retrieving posts for user."})
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await userDb.remove(req.user.id)
    res.status(204).end()
  } catch {
    res.status(500).json({ message: "Could not remove user."})
  }
});

router.put('/:id', async (req, res) => {
  try {
    const count = await userDb.update(req.user.id, req.body)
    if (count === 1){
      const updatedUser = await userDb.getById(req.user.id)
      res.status(200).json(updatedUser) 
    }
  } catch {
    res.status(500).json({ message: "Could not update user."})
  }
});

//custom middleware

async function validateUserId(req, res, next) {
  const user = await userDb.getById(req.params.id)
  if (!user){
    res.status(400).json({ message: "Invalid user id."})
  } else {
    req.user = user
    next()
  }
}

function validateUser(req, res, next) {
  if (!req.body){
    res.status(400).json({ message: "Missing user data."})
  } else if (!req.body.name) {
    res.status(400).json({ message: "Missing required name field."})
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  if (!req.body){
    res.status(400).json({ message: "Missing post data."})
  } else if (!req.body.text){
    res.status(400).json({ message: "Missing required text field."})
  } else {
    next()
  }
}

module.exports = router;
