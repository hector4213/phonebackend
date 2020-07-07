/* eslint-disable no-undef */
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  )
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://hectoradmin:${password}@cluster0.x2qgw.mongodb.net/phonebackend?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
})

// eslint-disable-next-line no-unused-vars
person.save().then((result) => {
  console.log(
    `Added ${process.argv[3]} number ${process.argv[4]} to phonebook`
  )
})

Person.find({}).then((results) => {
  console.log('phonebook:')
  results.forEach((person) => {
    console.log(`${person.name} ${person.number}`)
  })
  mongoose.connection.close()
})
