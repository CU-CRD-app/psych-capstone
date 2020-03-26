// JavaScript source code
const { Pool } = require('pg')

/**
const pool = new Pool({
  user: 'iwuqnqakqrlaru',
  host: 'ec2-3-230-106-126.compute-1.amazonaws.com',
  database: 'd9elri12h02o2g',
  password: 'cbc9f5e4182671cd7da0926aa5b19fda12c2c0d41656436f7c8e5550487b80d5',
  port: 5432,
})
**/

/**
const connectionString = postgres://iwuqnqakqrlaru:cbc9f5e4182671cd7da0926aa5b19fda12c2c0d41656436f7c8e5550487b80d5@ec2-3-230-106-126.compute-1.amazonaws.com:5432/d9elri12h02o2g'

const pool = new Pool({
  connectionString: connectionString,
})
**/

const databaseConfig = { connectionString: process.env.DATABASE_URL };

const pool = new Pool(databaseConfig);

// get all users' tasks'
const getTasks = (request, response) => {
  pool.query('SELECT * FROM learningtask ORDER BY Userid ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


//create task info
const createTaskinfo = (request, response) => {
  const {completestatus, difficulty, errorrate, progressrate, taskname } = request.body

  pool.query('INSERT INTO Userinfo (completestatus, difficulty, errorrate, progressrate, taskname) VALUES ($1, $2, $3, $4, $5)', [completestatus, difficulty, errorrate, progressrate, taskname], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`learningtask added with ID: ${result.insertId}`)
  })
}


//update user task info
const updateTaskinfo = (request, response) => {
  const id = parseInt(request.params.id)
  const { Firstname,Lastname,Hashedpassword,Feedback } = request.body

  pool.query(
    'UPDATE Userinfo SET Firstname = $1, Lastname = $2 , Hashedpassword=$3 , Feedback=$4 WHERE id = $5',
    [Firstname,Lastname,Hashedpassword,Feedback, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

//delete user
const deleteUserTasks = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM learningtask WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`learningtask deleted with ID: ${id}`)
  })
}

module.exports = {
  getTasks,
  createTaskinfo,
  updateTaskinfo,
  deleteUserTasks,
}