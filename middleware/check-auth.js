const { userModel } = require("../model/user.model")
const { verifyToken } = require("../utils/auth.util")

async function checkAuth(req, res, next) {
    try {
        const authorization = req?.headers?.authorization
        const [ bearer, token ] = authorization?.split(" ")

        if (bearer && bearer.toLowerCase() === "bearer") {
            if (token) {
                const verifyResult = verifyToken(token)
                const user = await userModel.findOne({ email: verifyResult.email })
                req.isAuthenticated = !!user
                if (!user) throw { status: 401, message: 'not found user account, login again' }
                req.user = {
                    fullName: user.fullName,
                    email: user.email
                }
                return next()
            }
            throw { status: 401, message: 'authorization failed, please again' }
        }
        throw { status: 401, message: 'authorization failed, please again' }
    } catch (error) {
        next(error)
    }
}

module.exports = { checkAuth }