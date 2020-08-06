const express = require('express')
const server = express()
const db = require('./db')
const port = 7654

server.use(express.json())

server.listen(port, () => {
    console.log(`\n *** server is listening on port ${port} *** \n`)
})


server.get('/', (req, res) => {
    res.send("hello world")
})

server.get('/api/users', async(req, res) => {
    try{
        const users = await db.getUsers()
        res.status(200).json(users)
    } catch (error) {
        res
        .status(500)
        .json({ error: 'the user information could not be retrieved'})
    }
})