import express from "express";
import { AppointmentService } from "./appointments.service";
import { PrismaService } from "../prisma.service";

const appointmentRouter = express.Router();
const prismaService = new PrismaService();
const appointmentService = new AppointmentService(prismaService);

appointmentRouter.post("/", async (req, res) => {
	try {
		const data = req.body;
		const response = await appointmentService.createApointment(data);
		res.status(response.code).json(response.response);
	} catch (err) {
		res.status(500).json(err);
	}
});

appointmentRouter.get("/:id", async (req, res) => {
	try {
		const appointmentId = req.params.id;
		const response = await appointmentService.getAppointmentsById(
			appointmentId
		);
		res.status(response.code).json(response.response);
	} catch (err) {
		res.status(500).json(err);
	}
});

appointmentRouter.get("/my-appointments/:id", async (req, res) => {
	try {
		const userid = req.params.id;
		const response = await appointmentService.getAppointmentByUserId(userid);
		res.status(response.code).json(response.response);
	} catch (err) {
		res.status(500).json(err);
	}
});

appointmentRouter.patch("/:appointmentId", async (req, res) => {
	try {
		const appointmentId = req.params.appointmentId;
		const data = req.body;
		console.log(data);
		const response = await appointmentService.updateAppointmentStatus(
			appointmentId,
			data
		);
		res.status(response.code).json(response.response);
	} catch (err) {
		res.status(500).json(err);
	}
});

export { appointmentRouter };
