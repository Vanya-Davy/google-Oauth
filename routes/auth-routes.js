const router = require('express').Router()
const passport = require('passport')
const User = require('../models/user-model')
const bcrypt = require('bcrypt')

router.get('/login', (req,res) => {
    return res.render('login',{user:req.user})
})

router.get('/logout', (req,res) =>{
    req.logOut((error) =>{
        if(error){
            return res.send(error)
        }else{
            return res.redirect('/')
        }
    })
})

router.get('/signup', (req,res) =>{
    return res.render('signup',{user:req.user})
})

// 這個指示連接到google，還要特別做一個 config-passport並放入strategy，製作google登入
router.get('/google', passport.authenticate('google',
        //取得 client 資料，並選定一個帳號使用email登入
        {scope: ['profile','email'],
        prompt:'select_account'
    })
)

router.post('/signup', async (req,res) => {
    let {name, email, password} = req.body
    if(password.length<8){
        req.flash('error_msg', '密碼長度過短，至少需要8個數字或英文字。')
        return res.redirect('/auth/signup')
    }

    const foundEmail = await User.findOne({email})
    if(foundEmail){
        req.flash('error_mag','信箱已被註冊過')
        return res.redirect('/auth/signup')
    }

    const hashedPassword = await bcrypt.hash(password,10)
    let newUser = new User({name,email,passpord:hashedPassword})
    await newUser.save()
    req.flash('success_mag','恭喜註冊成功')
    return res.redirect('/auth/login')
})

router.post('/login',passport.authenticate('local',{
    failureRedirect:'/auth/login',
    failureFlash:'登入失敗!帳號或密碼不正確。'
}),
    (req,res) => {
        return res.redirect('/profile')
    })

// redirect the resourse owner to a page，要先設定passport才能執行
router.get('/google/redirect',passport.authenticate('google'), (req,res) =>{
    return res.redirect('/profile')
})

module.exports = router