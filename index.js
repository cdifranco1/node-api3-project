// code away!
const server = require('./server')
const express = require('express')

//routers
const userRouter = require('./users/userRouter')
const postsRouter = require('./posts/postRouter')

//middleware
server.use(express.json())

server.use('/api/users', userRouter)
server.use('/api/posts', postsRouter)




