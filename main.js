
const express= require('express')
const app = express()
const hbs = require('hbs')
let { Users, sequelize } = require('./db')
const LocalStrategy = require('passport-local').Strategy
const passport = require('passport')
const session = require('express-session')


app.use(express.json())

app.set('view engine','hbs')

app.use(express.urlencoded({ extended: true }))

//passport
app.use(session({
    secret: 'averylongstring',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 60 * 1000,
    },
}))


app.use(passport.initialize())

app.use(passport.session())

passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (user, done) {
       done(null, user)
       console.log(user)
})



app.get('/register',(req,res)=>{
    res.render('register')
})

app.post('/register',(req,res)=>{
    Users.create({
        Username:req.body.username,
        password:req.body.password,
        Email:req.body.email
    }).then(()=>{
        res.redirect('/login')
    })
})

app.get('/login',(req,res)=>{
    res.render('login')
})


app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
   }),(req,res)=>{
       res.redirect('/')
   })


passport.use('local', new LocalStrategy(function (username, password, done) {
    Users.findOne({
        where: {
            Username: username,
        }
    }).then((user) => {
        if (!user) {
            console.log('no user')
            return done(null, false, { message: "No such user" })
        }
        if (user.password != password) {
            console.log('incorrect password')
            return done(null, false, { message: "Wrong Password" })
        }
        console.log('user found')

        done(null, user)


    }).catch(done)
}))


let al={}

app.get('/',(req,res)=>{
    if(req.user)
    {
       if(req.user.Username!=undefined)
       {
        al = req.user.Username
           Users.findAll({
               where:{
                   Username:al
               }
           }).then((el)=>{
               res.render('details',{el})
               
           })
           console.log("hey")
            
           
       }
}
    else{
        res.redirect('/login')
    }
})


app.get('/deposit',(req,res)=>{
    if(req.user)
    {
    res.render('deposit')
    }
    else{
        res.redirect('/login')
    }
})

app.post('/deposit',(req,res,err)=>{
    if(req.user)
    {
        let p = req.user.Username
    Users.findOne({
        where:{
            Username:p
        }
    }).then((el)=>{
        if(!el)
        {   
            res.redirect('/deposit')
        }
        else
        {
        let all=el.Balance
        all = all + parseInt(req.body.NB)
     Users.update(
         {Balance: all},
         {where:{Username:p}}
     ).then((p)=>{
         res.redirect('/')
     })
    }
        
})
    }
})
    


app.get('/withdraw',(req,res)=>{
    if(req.user)
    {
    res.render('Withdraw')
    }
    else{
        res.redirect('/login')
    }
})

app.post('/withdraw',(req,res)=>{
    if(req.user)
    {
        const q=req.user.Username
   Users.findOne({
        where:{
            Username:q
        }
    }).then((ell)=>{
        if(!ell)
        {
            console.log("Wrong Account Number")
            
            res.redirect('/deposit')
        }
        else
        {
        let pl = ell.Balance
        pl = pl - parseInt(req.body.WM)
        Users.update(
            {Balance:pl},
            {where:{
                Username:q
            }}
            ).then(()=>{
                res.redirect('/')
            })
     } })
    }
})

app.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/login')
})






sequelize.sync().then(() => {
    app.listen(5000,()=>{
        console.log("created")
    })
        console.log("Successfully Created")
    })

