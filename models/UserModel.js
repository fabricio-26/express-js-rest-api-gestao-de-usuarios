const knex = require('../database/connection');
let bcrypt = require('bcrypt'); 
const PasswordToken = require("./PasswordToken")

// Service
class UserModel{

    async findAll(){
        try{
            let result = await knex.select(["id", "name","email", "role"]).table("users");
            return result
        }catch(err){
            console.log(err);
            return [];
        }
    }

    async findById(id){
        try{
            let result = await knex.select(["id", "name","email", "role"]).where({id:id}).table("users")
            if(result.length > 0){
                return result[0];
            }else{
                return undefined
            }
        }catch(err){
            console.log(err);
            return undefined
        }
    }

    async findByEmail(email){
        try{
            let result = await knex.select(["id", "name","email", "role"]).where({email:email}).table("users")
            if(result.length > 0){
                return result[0];
            }else{
                return undefined
            }
        }catch(err){
            console.log(err);
            return undefined
        }
    }

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

    async update(id, name, email, role){
        var user = await this.findById(id);

        if(user != undefined){

            let editUser = {};

            if(email != undefined){
                if(email != user.email){
                    let result = await this.findEmail(email);
                    if(result == false){
                        editUser.email = email;
                    }else{
                        return {status: false,err:"O e-mail já esta cadastrado!"}
                    }
                }
            }

            if(name != undefined){
                editUser.name = name
            }

            if(role != undefined){
                editUser.role = role
            }

            try{
                await knex.update(editUser).where({id: id}).table("users")
                return {status: true}
            }catch(err){
                return {status: false,err: "O usuário já existe!"}
            }

        }else{
            return {status: false,err:"O usuário não existe!"}
        }
    }

    async delete(id){
        var user = await this.findById(id);

        if(user != undefined){
           try{
            await knex.delete().where({id: id}).table("users");
            return {status: true}
           }catch(err){
            return {status: false,err: err}
           }
        }else{
            return {status: false,err: "O ususario não existe, portanto não pode ser deletado."}
        }
    }

    async changePassword(newPassword,id,token){
        let hash = await bcrypt.hash(newPassword, 10);
        await knex.update({password: hash}).where({id: id}).table("users");
        await PasswordToken.setUsed(token)
    }
}

module.exports = new UserModel();