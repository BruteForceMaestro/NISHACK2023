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

export async function deleteUser(user: User){
    const users = await sql<User[]>`
        DELETE FROM users
        WHERE username
        IN (${user.username})
        RETURNING *
    `

    return users
}

