const express = require('express')
const server = express()
const db = require('./db')
const { json } = require('express')
const port = 7654

server.use(express.json())

server.listen(port, () => {
    console.log(`\n *** server is listening on port ${port} *** \n`)
})

//endpoint for testing API
server.get('/', (req, res) => {
    res.send("hello world")
})


//end point for getting a list of all the users
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


//endpoint for posting a single user
server.post('/api/users', (req, res) => {
    if(req.body.name && req.body.bio) {
        const newUser = db.createUser({name: req.body.name, bio: req.body.bio})
        const users = db.getUsers()
        if(users){
            res.json(users)
            res.status(201)
        }
        else {
            res
            .status(500)
            .json({ errorMessage: "error saving user to database"})
        }
    } else {
        res
        .status(400)
        .json({ errorMessage: "no name or bio for user" })
    }
})

//endpoint for getting single user with specified ID
server.get('/api/users/:id', (req, res) => {
   const id = req.params.id
   const user = db.getUserById(id)

   if (user){
       try{
           res
           .json(user)
       }
       catch (error){
           res
           .status(500)
           .json ({ errorMessage: "user information not found"})
       }
   } else {
       res
       .status(404)
       .json({ message: "user with specified ID does not exist"})
   }
})

//Endpoint for deleting a user with a specified ID
server.delete('/api/users/:id', (req, res) => {
    db.deleteUser(req.params.id)
    .then(removedUser => {
        if(!removedUser){
            res.status(404)
            .json({ message: "The user with the specified ID does not exist" })
        } else {
            res
            .status(200)
            .json(removedUser)
        }
    })
    .catch(error => {
        res
        .status(500)
        .json({ error: "The user could not be removed"})
    })
})


