const path = require('path')
const express = require('express')
const hbs = require('hbs')



const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const { rmSync } = require('fs')



//Accessing expresss application
const app = express()

const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'V N Karthik'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'V N karthik'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'V N Karthik'
    })
})

app.get('/weather', (req, res) => {

    if(!req.query.address)
    {
        return res.send({
             error : "Enter the  address"
        })
    }

    let address = req.query.address
    geocode(address, (error, data ) => {
        if (error) {
            return res.send({
                error : error
            })
           
        }

        forecast(data.latitude, data.longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error : error
                })
            }
            
             loc = data.location
             forecastinfo = forecastData
        })
    })
    res.send({
        forecast:  loc,
        location:  forecastinfo,
        address 
    })
})


app.get('*' , (req , res)=>{
    res.render( 'error', {
        helpText: 'This is some helpful text.',
        title: 'Error ',
        name: 'V N Karthik'
    })
})

app.listen(port, () => {
    console.log('Server is up on port '+port+'.')
})