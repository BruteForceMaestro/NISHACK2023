import { addProfessionByName, addRoadmapToUser, deleteUser, getProfessionIdByName, getProfessionNameById, getUserByUsername, getUsers, insertUser, updateProfForUser } from "./users"
import { User, PublicUser, UserLoginDetails } from "./models/user"
import express, { response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { generateResponse } from "./openai"
import { ProfessionAspects } from "./models/professionAspects"
import cors from 'cors'
import { request } from "http"

dotenv.config()
const app = express()

app.use(express.json())
app.use(cors({credentials: true, origin: true}))


// sends in json so tests don't fail and shit
function sendShortMessage(response, msg: string, statusCode: number = 400){
    response.status(statusCode).send({message: msg})
}

// only called the first time when doing the gpt
app.post('/api/users/:username/roadmap', authenticateToken, async(req, res) => {
    try {
        let user = (await getUserByUsername(req.params.username))[0];
        const s = await addRoadmapToUser(user, req.body.roadmap)
        sendShortMessage(res, "Succesfully updated.", 200)
    } catch (err) {
        console.log(err)
        sendShortMessage(res, "Invalid request.")
    }
})

app.post('/api/users/:username/prof', authenticateToken, async (req, res) => {
    try {
        let user = (await getUserByUsername(req.params.username))[0];
        let profId = (await getProfessionIdByName(req.body.profName))[0]
        const s = await updateProfForUser(user, profId.id)
        
        sendShortMessage(res, "Succesfully updated.", 200)
    } catch (err) {
        console.error(err)
        sendShortMessage(res, "Invalid request.")
    }
})

app.get('/api/professions/id/:id', async (req, res) => {
    let rowlist = await getProfessionNameById(parseInt(req.params.id))
    let prof_name = rowlist[0]
    if (prof_name == undefined){
        sendShortMessage(res, "Invalid profession ID.")
        return;
    }
    res.status(200).send({prof_name: prof_name})
})

app.get('/api/professions/:name', async (req, res) => {
    let rowlist = await getProfessionIdByName(req.params.name)
    let prof_id = rowlist[0]
    if (prof_id == undefined){
        prof_id = (await addProfessionByName(req.params.name))[0]
    }

    res.status(200).send({prof_id: prof_id})
})

// post test info from frontend to here
app.post('/api/test', async (req, res) => {
    // Assuming req.body.professionAspects contains the data sent in the POST request
    const professionAspects = new ProfessionAspects(req.body);
    if (professionAspects?.challenges == undefined){
        sendShortMessage(res, "Invalid profession aspects object")
        return
    }
    // Do something with the data (e.g., process it, query a database, etc.)
    let gpt_ans = await generateResponse(professionAspects);
    // For demonstration purposes, let's just send the same data back as a response
    res.status(200).send({ receivedData: gpt_ans });
});

// returns public knowledge about users
app.get('/api/users', async (request, response) => {
    getUsers(1).then(rowlist => {
        
        let publicInfo : PublicUser[] = [];
        rowlist.forEach(user => {
            publicInfo.push(new PublicUser(user))
        });

        response.status(200).send(publicInfo)

    }).catch(err => {
        response.sendStatus(501)
    })
})
// lets the front post to back, returns
app.post('/api/users', async (request, response) => {
    
    response.set('Content-Type', 'application/json')

    const newUser = new User(request.body)

    if (newUser.username == undefined){
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
        response.status(501).send(err)
        return
    }
    
    insertUser(newUser).then( us =>{
        response.status(200).send(us[0])
        return
    }  
    ).catch(err => {
        response.status(400).send(err)
    })
})

app.post('/api/users/login', async (request, response) => {
    
    response.set('Content-Type', 'application/json')


    const loginDetails = new UserLoginDetails(request.body?.username, request.body?.password)

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

    if (token == undefined){
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