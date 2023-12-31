import request from 'supertest';
import app from '../server';
import sql from "../db"
import { User } from "../models/user";
import { time } from 'console';


let accessToken;
const payload = {
  username: "ivan_123",
  first_name: "Ivan",
  last_name: "Ivanov",
  age: 123,
  email: "ivanivanov@gmail.com",
  password: "ivanpass123",
  profession_id: 1
}

const regExp = new RegExp(String.raw`Profession: (\w+(\s*\w*)+)`)

describe ('Post Endpoints And Authentication', () => {
  it('generates correct response with chatgpt', async () => {
    const res = await request(app).post(
      '/api/test'
    ).send(
      {
        education: "High school",
        skills: "Programming, Math, Communication, Good In High-Stress Environments",
        interests: "Programming, Physics, Math, Philosophy",
        workExperience: "None",
        values: "Creativity",
        env: "8-10 hours of work per day, no work at home",
        goals: "High earning job, 100K plus dollars per year",
        geo: "United States",
        lifestyle: "Night Owl",
        challenges: "Compassionate, Good communicator"
      }
    ).expect( 'Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .set( 'Accept', 'application/json')
    
    let regExpResult = regExp.exec(res.body.receivedData)
    expect(regExpResult).not.toEqual(undefined)
    
    
    console.log(regExpResult![1])
    
  }, 60000)

  it('posts user to database and returns it', async () => {

    const res = await request(app).post(
      '/api/users'
    ).send(payload)
    .expect( 'Content-Type', 'application/json; charset=utf-8')
    .set( 'Accept', 'application/json')
    
    if (res.status == 200){
      // here res.body is the User class
      expect(payload.username).toEqual(res.body.username)
    }
    else if (res.status == 400){
      // here res.body is an error message defined in server.ts
      expect(res.body.message)
    }
  })
  
  describe('Login checks', () => {
    it('says no such user found for inexisting login', async () => {
      const res = await request(app).post(
        '/api/users/login'
      ).send({username: "THIS_SHOULD_NOT_EXIST123", password: "anything"})
      .expect( 'Content-Type', 'application/json; charset=utf-8')
      .expect(400)
      .set( 'Accept', 'application/json')
      }
    )

    it('returns 400 when password is incorrect', async () => {
      const res = await request(app).post(
        '/api/users/login'
      ).send({username: "dimash", password: "among us"})
      .expect( 'Content-Type', 'application/json; charset=utf-8')
      .expect(400)
      .set( 'Accept', 'application/json')
      }
    )

    it('returns 200 when login and password are correct', async () => {
      const res = await request(app).post(
        '/api/users/login'
      ).send({username: "ivan_123", password: "ivanpass123"}) // delete should run after because. the pass needs to match and shit
      .expect( 'Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .set( 'Accept', 'application/json')

      accessToken = res.body.accessToken
      }
    )
  })

  it('changes roadmap when provided with good input', async () => {
    const res = await request(app).post(
      '/api/users/ivan_123/roadmap'
    ).send({roadmap: "come on"})
    .set( 'Accept', 'application/json').set('authorization', 'Bearer ' + accessToken)
    .expect( 'Content-Type', 'application/json; charset=utf-8')
    .expect(200)
    
    console.log(res.body)
    }
  )
  it('changes roadmap when provided with good input', async () => {
    const res = await request(app).post(
      '/api/users/ivan_123/prof'
    ).send({ profName: "Software Engineer"})
    .set( 'Accept', 'application/json').set('authorization', 'Bearer ' + accessToken)
    .expect( 'Content-Type', 'application/json; charset=utf-8')
    .expect(200)

    console.log(res.body)
    }
  )


})


describe('Get Endpoints', () => {
  it('gets data about the first user correct, returns only public knowledge', async () => {
    const res = await request(app)
      .get('/api/users') 
      .expect( 'Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .set( 'Accept', 'application/json').set('authorization', 'Bearer ' + accessToken)
    // ahh. res.body is the users i am retrieving
    let first_user = res.body[0] as User
    expect(first_user.username).toEqual("dimash")
    expect(first_user.first_name).toEqual("Dimash")
    expect(first_user.last_name).toEqual("Tabay")
    expect(first_user.age).toEqual(undefined)
    expect(first_user.email).toEqual(undefined)
    expect(first_user.password).toEqual(undefined)
    expect(first_user.profession_id).toEqual(1)
  })

  it('gets data about user with a specific username correct, with authorization', async () => {
    const res = await request(app)
      .get('/api/users/ivan_123') 
      .expect( 'Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .set( 'Accept', 'application/json').set('authorization', 'Bearer ' + accessToken)
    
    // ahh. res.body is the users i am retrieving
    let user = res.body as User
    expect(user.username).toEqual(payload.username) // checks public
    expect(user.age).toEqual(payload.age) // checks private
    
  })
  it('returns only public data about user when without proper authorization', async () => {
    const res = await request(app)
      .get('/api/users/dimash') 
      .expect( 'Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .set( 'Accept', 'application/json').set('authorization', 'Bearer ' + accessToken)
    
    // ahh. res.body is the users i am retrieving
    let returned_user = res.body as User
    expect(returned_user.username).toEqual("dimash")
    expect(returned_user.first_name).toEqual("Dimash")
    expect(returned_user.last_name).toEqual("Tabay")
    expect(returned_user.age).toEqual(undefined)
    expect(returned_user.email).toEqual(undefined)
    expect(returned_user.password).toEqual(undefined)
    expect(returned_user.profession_id).toEqual(1)
    
  })
  
  describe('Deletion checks', () => {
    it('detects unauthorized deletion, rejects the post request', async () => {
      const res = await request(app).get(
          '/api/users/dimash/delete'
        ) // delete should run after because. the pass needs to match and shit
        .expect( 'Content-Type', 'application/json; charset=utf-8')
        .expect(401)
        .set( 'Accept', 'application/json').set('authorization', 'Bearer ' + accessToken)
    })

    it('allows to delete the user once authenticated, returns 200', async () => {
      const res = await request(app).get(
        '/api/users/ivan_123/delete'
      ) // delete should run after because. the pass needs to match and shit
        .expect( 'Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .set( 'Accept', 'application/json').set('authorization', 'Bearer ' + accessToken)
    })
  })
})

beforeAll(done => {
  done()
})

afterAll(done => {
  sql.end().then(
    done()
  )
})