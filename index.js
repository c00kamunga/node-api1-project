const express = require('express')
const server = express()
const port = 2319

server.use(express.json())

server.listen(port, () => {
    console.log(`\n *** server is listening on port ${port} *** \n`)
})