import { getUsers, insertUser } from "./users"
import { User } from "./models/user"
import express from 'express'
const app = express()

app.use(express.json())

// returns list of all rows basically in the users table
app.get('/api/users', async (request, response) => {
    getUsers(1).then(rowlist => {
        response.status(200).send(rowlist)
    }).catch(err => {
        console.log(err)
        response.sendStatus(501)
    })
})
// lets the front post to back, returns
app.post('/api/users', async (request, response) => {
    
    response.set('Content-Type', 'application/json')
    insertUser(request.body as User).then( us =>{
        response.status(200).send(us[0])
    }  
    ).catch(err => {
        console.log(err)
        response.sendStatus(501)
    })
})

export default app