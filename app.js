const express = require('express')
const { notFoundError, errorHandler } = require('./utils/error-handling')
const { AllRouters } = require('./router/index.routes')
const { default: mongoose } = require("mongoose")

const app = express()

mongoose.connect("mongodb://localhost:27017/authorization-system", {})
    .then(() => console.log("connected to mongodb"))
    .catch((err) => console.log(err.message))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(AllRouters)

app.use(notFoundError)
app.use(errorHandler)

app.listen(3000, () => console.log("Server Run http://localhost:3000"))