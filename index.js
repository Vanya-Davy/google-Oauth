const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const authRoutes = require("./routes/auth-routes")
const profileRoutes = require('./routes/profile-routes')
// 直接執行下面一行的程式碼
require('./config/passport')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')

// 連接 MongoDB
mongoose.connect('mongodb://localhost:27017/GoogleDB')
    .then(() => {
        console.log('Connecting to mongodb...')
    })
    .catch((e) => {
        console.log(e)
    })

// 設定 Middlewares 和排版引擎
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded( { extended: true } ))
app.use(session( { 
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
})
)
// 下兩行讓passport可以運行認證功能,可以使用 session
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_mag')
    res.locals.error_msg=req.flash('error_mag')
    res.locals.error=req.flash('error')
    next()
})

// 設定 routes
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)
app.get('/', (req,res) =>{
    return res.render('index',{user:req.user})
})

app.listen(8080, () => {
    console.log('Sever running on port 8080...')
})

// const我們npm install的東西、連接資料庫、設定middleware、app.listen

// 設置route 連接 ejs至首頁

// npm install passport-google-oauth20 和 npm install passport

// 建立routes資料夾，建立auth-routes.js，記得export和require到index.js