const router = require('express').Router()

//確認使用者是否登入，授權可以使用thumbnail
const authCheck = (req,res,next)=>{
    if(req.isAuthenticated()) {
        next()
    }else{
        return res.redirect('/auth/login')
    }
}

router.get('/', authCheck, async(req,res) =>{
    return res.render('profile',{user:req.user}) //deSerializeUser()
})

module.exports = router