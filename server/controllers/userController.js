import { model as userModel } from '../models/userModel.js'

const controller = {}

controller.getUsers = async (req, res) => {
    try {
        const users = await userModel.findUsers()
        res.json(users)
    }
    catch (err) {
        res.status(500).json({
            error: err.stack
        })
    }
}

controller.getUserById = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10)
        const user = await userModel.findUserById(id)
        if (user) {
            res.json(user)
        } else {
            res.status(404).json({
                error: 'No such user found'
            })
        }
    } catch (err) {
        res.status(500).json({
            error: err.stack
        })
    }
}

controller.addUser = async (req, res) => {
    try {
        const user = req.body
        const userId = await userModel.addUser(user)
        res.status(201).json({
            userId
        })
    } catch (err) {
        res.status(500).json({
            error: err.stack
        })
    }
}

export { controller }