import { getUsers } from "./users"

const express = require('express')
const app = express()

// returns list of all rows basically in the users table
app.get('/api', async (request, response) => {
    getUsers(1).then(rowlist => {
        console.log(rowlist);
        response.status(200).json(rowlist)
    }).catch(err => {
        console.log(err)
        response.sendStatus(501)
    })
})

module.exports = app