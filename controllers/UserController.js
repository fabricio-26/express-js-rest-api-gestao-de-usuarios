let UserModel = require('../models/UserModel')

class UserController{

    async index(req, res) {}

    async create(req, res) {
        let {email, name, password} = req.body;

        if(email == undefined){
            return res.status(400).json({err: "O e-mail é inválido!"}) //BAD REQUEST
        }
        if(name == undefined){
            return res.status(400).json({err: "O name é inválido!"}) //BAD REQUEST
        }
        if(password == undefined){
            return res.status(400).json({err: "O password é inválido!"}) //BAD REQUEST
        }

        let emailExists = await UserModel.findEmail(email);

        if(emailExists){
            res.status(406).json({err: "O e-mail já esta cadastrado!"})
            return;
        }

        await UserModel.new(name, email, password)

        res.status(200).send("Tudo Ok!")
    }
}

module.exports = new UserController();