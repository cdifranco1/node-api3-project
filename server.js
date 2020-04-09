const express = require('express');

const server = express();

server.use(logger)
// server.use(morgan(":method :url"))

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`\n*******`)
  console.log(`Method: ${req.method}`)
  console.log(`URL: ${req.originalUrl}`)
  console.log(`Time: ${new Date()}`)
  console.log(`*******\n`)

  next()
}


server.listen(5000, (req, res) => {
  console.log('Listening at port 5000')
})

module.exports = server;
