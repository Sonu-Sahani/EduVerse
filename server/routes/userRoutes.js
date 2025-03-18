import express from 'express'
import { getUserData, purchaseCourse, userEnrollledCourse } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.get('/data', getUserData)
userRouter.get('/enrolled-courses', userEnrollledCourse)
userRouter.post('/purchase', purchaseCourse)

export default userRouter;