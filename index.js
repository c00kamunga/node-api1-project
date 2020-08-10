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
    const id = req.params.id;
    const userToDelete = db.getUserById(id)

    if (!userToDelete) {
        res.status(500).json({
            errorMessage: "This does not work!"
        })
    } else if (userToDelete) {
            db.deleteUser(id)
            res.status(200).json(userToDelete);
        } else {
            res.status(404).json({ errorMessage: "The ID does not exist"})
        }
})
//console.log(req.params.id)
// .then(removedUser => {
//     db.deleteUser(req.params.id)
//         //console.log(removedUser)
//         if(!removedUser){
//             res.status(404)
//             .json({ message: "The user with the specified ID does not exist" })
//         } else {
//             res
//             .status(200)
//             .json(removedUser)
//         }
//     })
    // .catch(error => {
    //     res
    //     .status(500)
    //     .json({ error: "The user could not be removed"})
    // })

//Endpoint for updating a users information
server.put('/api/users/:id', (req, res) => {


    const updatedUser = req.body
    const id = req.params.id
    const userID = db.getUserById(id)
     
console.log(updatedUser)

    if(!userID) {
        res
        .status(404)
        .json({ errorMessage: "User ID does not exist" })
    } else if (!updatedUser.name && !updatedUser.bio) {
        res
        .status(400)
        .json({errorMessage: "Please edit name and bio"})
    } else if (userID) {
        db.updateUser(userID, updatedUser)
        res
        .status(200)
        .json(updatedUser)
    } else {
        res
        .status(500)
        .json({ errorMessage: "There was an issue with the server" })
    }

    // if(!req.body.name && !req.body.bio) {
    //     return res
    //     .status(400)
    //     .json({ errorMessage: "Please provide the name and bio of the user" })
    // }
    // return db.updateUser(req.params.id, ...req.body)
    // .then(updatedUser => {
    //     console.log(updatedUser)
    //     if(updatedUser) {
    //         res
    //         .status(200)
    //         .json(updatedUser)
    //     } else {
    //         res
    //         .status(404)
    //         .json({ message: "The user with the specified ID does not exist" })
    //     }
    // })
    // .catch(error => {
    //     res
    //     .status(500)
    //     .json({ error: "The post information could not be modified" })
    // })
})


