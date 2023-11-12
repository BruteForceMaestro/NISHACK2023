import sql from "./db"
import { User } from "./models/user"

export async function getUsers(numberOfUsers: number) {
    const users = await sql<User[]>`
        SELECT
        *
        FROM
        users
    `

    return users
}

export async function getUserByUsername(username: string){
    const users = await sql<User[]>`
        SELECT
        * 
        FROM 
        users
        WHERE username
        IN (${username})
    `

    return users
}

// all these functions basically return rowlists, which have to be indexed to get the user.
export async function insertUser(user: User) {
    const users = await sql<User[]>`
        INSERT INTO users
            (username, first_name, last_name, age, email, password, profession_id)
        VALUES
            (${user.username}, ${user.first_name}, ${user.last_name}, ${user.age}, ${user.email}, ${user.password}, ${user.profession_id} )
        RETURNING *
    `
    return users
}

export async function addRoadmapToUser(user: User, roadmap: string){
    user.roadmap = roadmap
    
    const users = await sql<User[]>`
        UPDATE users
        SET roadmap = ${roadmap}
        WHERE username
        IN (${user.username})
    `

    return users
}

export async function getProfessionNameById(id: number){
    const users = await sql`
        SELECT
        (name) 
        FROM 
        professions
        WHERE id
        IN (${id})
    `

    return users
}

export async function updateProfForUser(user: User, prof_id: number){
    const users = await sql<User[]>`
        UPDATE users
        SET profession_id = ${prof_id}
        WHERE username
        IN (${user.username})
    `

    return users
}


export async function getProfessionIdByName(profName: string){
    const users = await sql`
        SELECT
        (id) 
        FROM 
        professions
        WHERE name
        IN (${profName})
    `

    return users
}

export async function addProfessionByName(profName: string){
    const users = await sql<User[]>`
        INSERT INTO professions
        (name) 
        VALUES (${profName})
        RETURNING *
    `

    return users
}

export async function deleteUser(user: User){
    const users = await sql<User[]>`
        DELETE FROM users
        WHERE username
        IN (${user.username})
        RETURNING *
    `

    return users
}

