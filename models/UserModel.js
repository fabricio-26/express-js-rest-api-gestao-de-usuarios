const knex = require('../database/connection');
let bcrypt = require('bcrypt'); 

// Service
class UserModel{

    async new(name, email, password){
        try{
            let hash = await bcrypt.hash(password, 10)
            await knex.insert({name, email, password: hash, role: 0}).table('users')
        }catch(err){
            console.log(err)
        }
    }

    async findEmail(email){
        try{
            let result = await knex.select("*").from("users").where({email: email})
            
            if(result.length > 0 ){
                return true;
            }else{
                return false;
            }
        }catch(err){
            console.log(err)
            return false;
        }
    }
}

module.exports = new UserModel();