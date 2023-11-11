// internal user stuff, should never be leaked in a get request.
export class User {
    username: string
    first_name: string
    last_name: string
    age: number
    email: string
    password: string
    profession_id: number
    
    constructor(userObject){
        this.username = userObject.username,
        this.first_name = userObject.first_name,
        this.last_name = userObject.last_name,
        this.age = userObject.age,
        this.email = userObject.email,
        this.password = userObject.password,
        this.profession_id = userObject.profession_id
    }

}

// information that should be available to the public.
export class PublicUser {
    username: string
    first_name: string
    last_name: string
    profession_id: number

    constructor(user: User){
        this.username = user.username
        this.first_name = user.first_name
        this.last_name = user.last_name
        this.profession_id = user.profession_id

    }
}
// for logins and such. never shared in get requests.
export class UserLoginDetails {
    username: string
    password: string
    constructor(name: string, pass: string) {
        this.username = name
        this.password = pass
    }
}