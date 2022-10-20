let knex = require("../database/connection");
const UserModel = require("./UserModel");


class PasswordToken{

    async create(email){
        let user = await UserModel.findByEmail(email);
        if(user != undefined){

            try{
                let token = Date.now();
                await knex.insert({
                    user_id: user.id,
                    used: 0,
                    token: token
                }).table("passwordTokens");
                return {status: true, token: token}
            }catch(err){
                console.log(err);
                return {status: false, err:err}
            }

        }else{
            return {status: false, err: "O e-mail passado não existe no banco de dados!"}
        }
    }

}

module.exports = new PasswordToken();