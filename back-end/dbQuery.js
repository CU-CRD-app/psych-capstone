const { Pool } = require('pg')

const pool = new Pool({
  user: 'iwuqnqakqrlaru',
  host: 'ec2-3-230-106-126.compute-1.amazonaws.com',
  database: 'd9elri12h02o2g',
  password: 'cbc9f5e4182671cd7da0926aa5b19fda12c2c0d41656436f7c8e5550487b80d5',
  port: 5432,
})

/**
const connectionString = postgres://iwuqnqakqrlaru:cbc9f5e4182671cd7da0926aa5b19fda12c2c0d41656436f7c8e5550487b80d5@ec2-3-230-106-126.compute-1.amazonaws.com:5432/d9elri12h02o2g'

const pool = new Pool({
  connectionString: connectionString,
})
**/

/**
const databaseConfig = { connectionString: process.env.DATABASE_URL };

const pool = new Pool(databaseConfig);
**/

// get all users
const getUsers = (request, response) => {
  pool.query('SELECT * FROM Userinfo ORDER BY Userid ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

//get single user
const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM Userinfo WHERE Userid = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

//create user
const createUser = (request, response) => {
  const { Firstname,Lastname,Hashedpassword,Feedback} = request.body

  pool.query('INSERT INTO Userinfo (Firstname,Lastname,Hashedpassword,Feedback) VALUES ($1, $2, $3, $4)', [Firstname,Lastname,Hashedpassword,Feedback], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${result.insertId}`)
  })
}


//update user
const updateUser = (request, response) => {
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
const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM Userinfo WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}