const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const User = require('../models/user-model')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local')

passport.serializeUser((user, done) =>{
  //將mongoDB的id，存在session，並且將id簽名後，以cookie的形式給使用者
  done(null,user._id)
})

passport.deserializeUser(async (_id, done) =>{
  let foundUser = await User.findOne({ _id })
  //將req.user這個屬性設定為foundUser
  done(null,foundUser)
})

// 看passport的Configure Strategy做調整，製作google登入
passport.use(new GoogleStrategy({
    // 使用.env將id、secret藏起來不上傳至github
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/redirect"
  },
  async (accessToken, refreshToken, profile, cb) => {
    // 進入到google strategy的區域
    let foundUser = await User.findOne({googleID:profile.id})
    if(foundUser){
      // 執行 serializeUser
      cb(null,foundUser)
    }else{
      //儲存新用戶
      let newUser = new User({
        name:profile.displayName,
        googleID:profile.id,
        email:profile.email
      })
      let savedUser = await newUser.save()
      cb(null,savedUser)
    }
  }
));

passport.use(new LocalStrategy( async (username,password, done) =>{
  let foundUser = await User.findOne({email:username})
  if(foundUser){
    let result = await bcrypt.compare(password,foundUser.password)
    if(result){
      done(null,foundUser)
    }else{
      done(null,false)
    }
  }else{
    done(null,false)
  }
}
))