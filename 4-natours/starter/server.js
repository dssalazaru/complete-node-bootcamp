const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('./app')

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

const port = process.env.PORT || 3010
app.listen(port, () =>
  console.log(`App listening on port ${port}!`)
)
