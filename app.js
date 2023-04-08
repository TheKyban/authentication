//jshint esversion:6
require('dotenv').config()
const express = require('express')
const encryption = require('mongoose-encryption')
const ejs = require('ejs')
const bodyParser = require('body-parser')



const mongoose = require('mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/userAuth").then(()=>{
    console.log("connected")
}).catch(()=>{
    console.log("error while connecting database")
})

const userSchema = new mongoose.Schema({
    email:String,
    password:String
})


userSchema.plugin(encryption,{secret:process.env.SECRET,encryptedFields:["password"]})
const User = mongoose.model("User",userSchema)


const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs")

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register',(req,res)=>{
	const newUser = new User({
		email:req.body.username,
		password:req.body.password
	})

	newUser.save().then(()=>{
		res.render('secrets')
	}).catch((err)=>{
		console.log(err)
	})
})

app.post('/login',(req,res)=>{
	const username = req.body.username
	const password = req.body.password
	User.findOne({email:username}).then((data)=>{
		console.log("found")
		if(data.password === password) {
			console.log("password matched")
			res.render("secrets")
		}

	}).catch(()=>{
		console.log("not found")
	})
})

app.listen(7575, () => {
    console.log("http://localhost:7575")
})