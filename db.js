const Sequelize = require('sequelize')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'users.db'
})

const Users= sequelize.define('users',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        validate:{ 
        min:100034,
        max:100300,
        }

    },
    Username:{
        type:Sequelize.STRING,
        
    
    },
    password:{
        type:Sequelize.STRING,

        },
    Balance:{
            type:Sequelize.INTEGER,
            defaultValue:'0'
        },
    Email:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
            isEmail:true
        },
        unique:{
            args:true,
            msg:'Email address already in use'
        },
        name:'email',
    }

})


module.exports = {
    Users,
    sequelize
}