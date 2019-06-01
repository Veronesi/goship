const express = require('express')
const path = require('path')
const morgan = require('morgan')
const mysql = require('mysql')
const myConnection = require('express-myconnection')

const app = express()

// Settings
app.set('port', process.env.PORT || 3000)
app.set('json spaces', 2)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// importing routes
const userRoutes = require('./routes/index')

// Middlewares
app.use(morgan('dev'))
app.use(myConnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '123456789',
    port: 3306,
    database: 'goship'
}, 'single'))

app.use(express.urlencoded({extended: false}))
/*app.use(express.json())*/

// routes
app.use('/', userRoutes)


// Static files

app.listen(app.get('port'), function () {  
    console.log(`Example app listening on port ${app.get('port')}!`)
});