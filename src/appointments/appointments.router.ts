import express, { NextFunction, Request, Response } from "express";
import { AppointmentService } from "./appointments.service";
import { PrismaService } from "../prisma.service";
import { AppointmentGuard } from "./appointment.guard";

const appointmentRouter = express.Router();
const prismaService = new PrismaService();
const appointmentService = new AppointmentService(prismaService);
const appointmentGuard = new AppointmentGuard();

const authenticationMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = String(
			req.headers["authorization"]?.split(" ")[1].replace("'", "")
		);
		const checkToken = appointmentGuard.authentication(token);
		if (checkToken) {
			next();
		} else {
			res.status(401).json("Invalid Token");
		}
	} catch (err) {
		res.status(500).json("Error authenticating");
	}
};

const doctorAuthorizationMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = String(
			req.headers["authorization"]?.split(" ")[1].replace("'", "")
		);
		if (appointmentGuard.authorization(req.params.doctorId, token)) {
			next();
		} else {
			res.status(403).json("Forbidden");
		}
	} catch (err) {
		res.status(500).json("Server Error");
	}
};

const roleGuard = (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = String(
			req.headers["authorization"]?.split(" ")[1].replace("'", "")
		);
		if (appointmentGuard.roleGuard(req.params.id, token)) {
			next();
		}
	} catch (err) {}
};

appointmentRouter.post("/", authenticationMiddleware, async (req, res) => {
	try {
		const data = req.body;
		const response = await appointmentService.createApointment(data);
		res.status(response.code).json(response.response);
	} catch (err) {
		res.status(500).json(err);
	}
});

appointmentRouter.get(
	"/:appointmentId",
	authenticationMiddleware,
	async (req, res) => {
		try {
			const appointmentId = req.params.appointmentId;
			const response = await appointmentService.getAppointmentsById(
				appointmentId
			);
			res.status(response.code).json(response.response);
		} catch (err) {
			res.status(500).json(err);
		}
	}
);

appointmentRouter.get(
	"/my-appointments/:userId",
	authenticationMiddleware,
	async (req, res) => {
		try {
			const userId = req.params.userId;
			const response = await appointmentService.getAppointmentByUserId(userId);
			res.status(response.code).json(response.response);
		} catch (err) {
			res.status(500).json(err);
		}
	}
);

appointmentRouter.patch(
	"/:appointmentId/:doctorId",
	authenticationMiddleware,
	doctorAuthorizationMiddleware,
	roleGuard,
	async (req, res) => {
		try {
			const appointmentId = req.params.appointmentId;
			const data = req.body;
			const response = await appointmentService.updateAppointmentStatus(
				appointmentId,
				data
			);
			res.status(response.code).json(response.response);
		} catch (err) {
			res.status(500).json(err);
		}
	}
);

export { appointmentRouter };
