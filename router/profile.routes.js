const { Router } = require("express")
const { getProfile } = require("../controller/profile.controller")

const router = Router()

router.get("/profile", getProfile)

module.exports = {
    ProfileRouters: router
}