const { Router } = require("express")
const { AuthRouters } = require("./auth.routes")
const { ProfileRouters } = require("./profile.routes")
const { checkAuth } = require("../middleware/check-auth")

const router = Router()

router.use("/auth", AuthRouters)
router.use("/user", checkAuth, ProfileRouters)

module.exports = {
    AllRouters: router
}