import dotenv from 'dotenv'
dotenv.config()
import express from 'express'

const app = express()
const port = process.env.PORT
// console.log(process);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/about', (req, res) => {
  res.send('About Page')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
