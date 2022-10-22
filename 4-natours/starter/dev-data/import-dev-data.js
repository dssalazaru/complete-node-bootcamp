const mongoose = require('mongoose')
const fs = require('fs')
const Tour = require(`${__dirname}/../models/tourModel`)
const dotenv = require('dotenv')

dotenv.config({ path: './config.env' })

const DB = {
  con: '',
  env: process.env.DB_ENV || 'local'
}

if (DB.env === 'cloud') {
  DB.con = process.env.DATABASE_CLOUD.replace('<password>', process.env.DATABASE_PASSWORD)
} else { DB.con = process.env.DATABASE_LOCAL }

mongoose.connect(DB.con, {
  useNewUrlParser: true
}).then(() => console.log(`Connected to MongoDB ${DB.env}!`))

const tours = JSON.parse(fs.readFileSync(`${__dirname}/data/tours-simple.json`, 'utf-8'))

const importData = async () => {
  try {
    await Tour.create(tours)
    console.log('Data imported')
    process.exit()
  } catch (err) {
    console.log(err)
  }
}

// DELETE ALL Tours from DB

const deleteData = async () => {
  try {
    await Tour.deleteMany()
    console.log('Tours deleted')
    process.exit()
  } catch (err) {
    console.log(err)
  }
}

if (process.argv[2] === '--import') {
  importData()
} else if (process.argv[2] === '--delete') {
  deleteData()
}
