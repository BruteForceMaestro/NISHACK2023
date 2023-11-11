import { deleteUser, getUserByUsername, getUsers, insertUser } from "./users"
import { User, PublicUser, UserLoginDetails } from "./models/user"
import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()
const app = express()

app.use(express.json())
app.use(cors({credentials: true, origin: true}))
// checks body of request for type
function typeCheck<T>(body: Object){
    let instanceOfT : T | undefined = undefined;
    try {
        instanceOfT = body as T
    }
    catch {
        console.log("Malformed request recieved.")
        return undefined
    }

    return instanceOfT;
}

// sends in json so tests don't fail and shit
function sendShortMessage(response, msg: string, statusCode: number = 400){
    response.status(statusCode).send({message: msg})
}

// returns public knowledge about users
app.get('/api/users', async (request, response) => {
    getUsers(1).then(rowlist => {
        
        let publicInfo : PublicUser[] = [];
        rowlist.forEach(user => {
            publicInfo.push(new PublicUser(user))
        });

        response.status(200).send(publicInfo)

    }).catch(err => {
        console.log(err)
        response.sendStatus(501)
    })
})
// lets the front post to back, returns
app.post('/api/users', async (request, response) => {
    
    response.set('Content-Type', 'application/json')

    const newUser = typeCheck<User>(request.body)

    if (newUser == undefined){
        sendShortMessage(response, "Improper request")
        return
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(newUser.password, 10)
        newUser.password = hashedPassword

    } catch (err) {
        console.error("Failed to hash password!")
        console.error(err)
        response.status(501).send()
    }
    
    insertUser(newUser).then( us =>{
        response.status(200).send(us[0])
    }  
    ).catch(err => {
        console.log(err)
        response.sendStatus(501)
    })
})

app.post('/api/users/login', async (request, response) => {
    
    response.set('Content-Type', 'application/json')

    console.log(request.body)

    const loginDetails = typeCheck<UserLoginDetails>(request.body)

    if (loginDetails?.username == undefined){
        sendShortMessage(response, "Improper request")
        return
    }

    const userRowList = await getUserByUsername(loginDetails.username);
    const user = userRowList[0]

    if (user == undefined){
        sendShortMessage(response, `No such user found with username: ${loginDetails.username}`)
        return
    }

    try {
        console.log(loginDetails.password)
        console.log(user.password)
        if (await bcrypt.compare(loginDetails.password, user.password)){
            console.log("Login success.")

            let accessTokenSecret : string = "";
            if (process.env.ACCESS_TOKEN_SECRET != undefined){
                accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
            } else {
                console.log("JWT error: env ACCESS TOKEN is undefined")
                sendShortMessage(response, "Error occured while logging in.")
                return
            }

            // if you get error here add ACCESS_TOKEN_SECRET to your .env
            const accessToken = jwt.sign(user, accessTokenSecret)
            response.status(200).send( { accessToken: accessToken } )
        } else {
            sendShortMessage(response, "Error occured while logging in.")
        }

    } catch (err) {
        console.error({message: "Caught exception while login:"})
        console.error(err)
        sendShortMessage(response, "Error occured while logging in.")
    }
})

// section --------authenticated user stuff
app.get('/api/users/:username', authenticateToken, async (request, response) => {
    let caller_user = request["user"] as User
    if (caller_user.username != request.params.username){
        const UserRowList = await getUserByUsername(request.params.username)
        const returned_user = UserRowList[0]
        response.status(200).send(new PublicUser(returned_user))
        return
    }
    response.status(200).send(caller_user)
})


app.get('/api/users/:username/delete', authenticateToken, async (request, response) => {
    
    let user = request["user"] as User
    if (user.username != request.params.username){
        console.log("Unauthorized deletion tried.")
        sendShortMessage(response, "Unauthorized", 401)
        return
    }
    deleteUser(user).then( _ => {
        response.status(200).send(user)
    }).catch(err => {
        console.error("Error while deleting a user:")
        console.error(err)
        sendShortMessage(response, "Internal Error", 501)
    })
})

function authenticateToken(req, res, next) {
    const bearer = req.headers['authorization']
    const token = bearer && bearer.split(' ')[1]

    if (token == null){
        return res.sendStatus(401) // no access
    }

    let accessTokenSecret : string = "";
    if (process.env.ACCESS_TOKEN_SECRET != undefined){
        accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
    } else {
        console.log("JWT error: env ACCESS TOKEN is undefined")
        sendShortMessage(res, "Error occured while logging in.")
        return
    }

    jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403)
        }
        req["user"] = user
        next()
    })
}

export default app