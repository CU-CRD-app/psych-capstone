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

// get all users' Dashboard info
const getDashboard = (request, response) => {
  pool.query('SELECT * FROM History ORDER BY Userid ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

//get single Dashinfo
const getDashinfoById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM History WHERE Userid = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

//create Dashboard info
const createDashinfo = (request, response) => {
  const {currentlevel,notificationtime,overallerrorrate,overallprogressrate,taskfinishednum,taskunfinishednum } = request.body

  pool.query('INSERT INTO History (currentlevel,notificationtime,overallerrorrate,overallprogressrate,taskfinishednum,taskunfinishednum) VALUES ($1, $2, $3, $4, $5, $6)', [currentlevel,notificationtime,overallerrorrate,overallprogressrate,taskfinishednum,taskunfinishednum], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Dashboardinfo added with ID: ${result.insertId}`)
  })
}


//update user Dashboard info
const updateDashinfo = (request, response) => {
  const id = parseInt(request.params.id)
  const {currentlevel,notificationtime,overallerrorrate,overallprogressrate,taskfinishednum,taskunfinishednum } = request.body

  pool.query(
    'UPDATE History SET currentlevel = $1, notificationtime = $2 , overallerrorrate=$3 , overallprogressrate=$4 , taskfinishednum=$5, taskunfinishednum=$6 WHERE id = $7',
    [currentlevel,notificationtime,overallerrorrate,overallprogressrate,taskfinishednum,taskunfinishednum, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Dashinfo modified with ID: ${id}`)
    }
  )
}

//delete user Dashboard info
const deleteDashinfo = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM History WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Dashinfo deleted with ID: ${id}`)
  })
}

module.exports = {
  getDashboard,
  getDashinfoById,
  createDashinfo,
  updateDashinfo,
  deleteDashinfo,
}