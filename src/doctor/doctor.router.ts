import express from "express";
import { PrismaService } from "../prisma.service";
import { DoctorAuth } from "./doctor.auth.service";
import { DoctorService } from "./doctor.service";

const prismaService = new PrismaService();
const doctorAuth = new DoctorAuth(prismaService);
const doctorService = new DoctorService(prismaService);
const doctorRouter = express.Router();

doctorRouter.post("auth/register", async (req, res) => {
	try {
		const response = await doctorAuth.register(req.body);
		res.status(response.code).json(response.response);
	} catch (err) {
		res.status(500).json(err);
	}
});

doctorRouter.post("auth/login", async (req, res) => {
	try {
		const response = await doctorAuth.login(req.body);
		res.status(response.code).json(response.response);
	} catch (err) {
		res.status(500).json(err);
	}
});

doctorRouter.get("/", async (req, res) => {
	try {
		const response = await doctorService.getAllDoctor();
		res.status(response.code).json(response.response);
	} catch (err) {
		res.status(500).json(err);
	}
});

doctorRouter.get("/search/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const response = await doctorService.getDoctorById(id);
		res.status(response.code).json(response.response);
	} catch (err) {
		res.status(500).json(err);
	}
});

doctorRouter.get("/search", async (req, res) => {
	try {
		let name: string;
		if (typeof req.query.name === "string") {
			name = req.query.name;
		} else {
			name = "";
		}
		const response = await doctorService.getDoctorByName(name);
		res.status(response.code).json(response.response);
	} catch (err) {
		res.status(500).json(err);
	}
});

export { doctorRouter };
