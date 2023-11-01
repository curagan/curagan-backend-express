import express from "express"
import { PrismaService } from "../prisma.service"
import { NotificationService } from "./notification.service"

const notificationRouter = express.Router()
const prismaService = new PrismaService()
const notificationService = new NotificationService(prismaService)

notificationRouter.get("/:id", async (req,res)=>{
    try{
        const userId = req.params.id
        const response = await notificationService.getNotification(userId)
        res.status(response.code).json(response.response)
    } catch(err){
        res.status(500).json(err)
    }    
})

export {notificationRouter}