const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const path = require('path')
const express = require('express')

const port = process.env.PORT || 3000
const hbs = require('hbs')

const app = express()
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

app.set('view engine', 'hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))
app.get('',(req,res) => {
    res.render('index',{
        name : 'iniesta',
        title: 'robben'
    })
})

app.get('/about',(req,res) =>{
    res.render('about',{
        name : '<ABOUT>',
        title : 'Hi'
    })
})

app.get('/help',(req,res) => {
    res.render('help',{
        name: '<help>',
        title:'HELPER'
    })
})

app.get('/products',(req,res) => {
    if(!req.query.search){
        return res.send({
            error:'no search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products:[]
    })
})
app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error:'Address is not found'
        })
    }

    geocode(req.query.address,(error,{latitude, longitude, location} = {}) => {
        if(error){
            return res.send({error})
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({error})
            }
            res.send({
                forecastData,
                location,
                address: req.query.address

            })
        })

    })
    // res.send({
    //     forecast: 'It is snowing',
    //     location: 'Philadelphia',
    //     address: req.query.address
    // })
})
app.get('*', (req,res) => {
    res.send('404 error')
})
app.listen(port, () => {
    console.log('Server is up on port 3000.')
})