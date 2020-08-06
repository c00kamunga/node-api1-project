const express = require('express')
const server = express()
const port = 7654

server.use(express.json())

server.listen(port, () => {
    console.log(`\n *** server is listening on port ${port} *** \n`)
})


server.get('/', (req, res) => {
    res.send("hello world")
})