let UserModel = require('../models/UserModel')

class UserController{

    async index(req, res) {
        var user = await UserModel.findAll();
        res.json(user)
    }

    async findUserId(req, res) {
        let id = req.params.id
        let user = await UserModel.findById(id);
        if(user == undefined){
            res.status(404).json({})
        }else{
            res.status(200).json(user)
        }

    }

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

    async edit(req, res) {
        let {id, name, email, role} = req.body;
        let result = await UserModel.update(id, name, email, role);
        if(result != undefined){
            if(result.status){
                res.status(200).send("Tudo OK!")
            }else{
                res.status(406).send(result.err)
            }
        }else{
            res.status(406).send("Ocorreu um erro no servidor!")
        }
    }

    async remove(req, res){
        let id = req.params.id;

        let result = await UserModel.delete(id);

        if(result.status){
            res.status(200).send("Tudo OK!")
        }else{
            res.status(406).send(result.err)
        }
    }
}

module.exports = new UserController();