import express, { NextFunction, Request, Response } from "express";
import { PrismaService } from "../prisma.service";
import { PatientAuth } from "./patient.auth.service";
import {
	ChangePassword,
	PatchPatient,
	PatientLogin,
	PatientRegister,
} from "./patient.interface";
import { PatientService } from "./patient.service";
import { PatientGuard } from "./patient.guard";

const patientRouter = express.Router();
const prismaService = new PrismaService();
const patientAuth = new PatientAuth(prismaService);
const patientService = new PatientService(prismaService);
const patientGuard = new PatientGuard();

const authenticationMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = String(
			req.headers["authorization"]?.split(" ")[1].replace("'", "")
		);
		const checkToken = patientGuard.authentication(token);
		if (checkToken) {
			next();
		} else {
			res.status(401).json("Invalid token");
		}
	} catch (err) {
		res.status(500).json("Error authenticating");
	}
};

const authorizationMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = String(
			req.headers["authorization"]?.split(" ")[1].replace("'", "")
		);
		if (patientGuard.authorization(req.params.id, token)) {
			next();
		} else {
			res.status(401).json("Unauthorized");
		}
	} catch (err) {
		res.status(500).json("Error Authorization");
	}
};

patientRouter.post("/auth/login", async (req, res) => {
	try {
		const loginData: PatientLogin = req.body;
		const response = await patientAuth.login(loginData);
		res.status(response.code).json(response.response);
	} catch (err) {
		res.status(500).json(err);
	}
});

patientRouter.post("/auth/register", async (req, res) => {
	try {
		const registerData: PatientRegister = req.body;
		const response = await patientAuth.register(registerData);
		res.status(response.code).json(response.response);
	} catch (err) {
		res.status(500).json(err);
	}
});

patientRouter
	.route("/:id")
	.get(async (req, res) => {
		try {
			const id = req.params.id;
			const response = await patientService.getPatientsById(id);
			res.status(response.code).json(response.response);
		} catch (err) {
			res.status(500).json(err);
		}
	})
	.patch(
		authenticationMiddleware,
		authorizationMiddleware,
		async (req, res) => {
			try {
				const id = req.params.id;
				const data: PatchPatient = req.body;
				const response = await patientService.patchPatientById(id, data);
				res.status(response.code).json(response.response);
			} catch (err) {
				res.status(500).json(err);
			}
		}
	)
	.delete(
		authenticationMiddleware,
		authorizationMiddleware,
		async (req, res) => {
			try {
				const id = req.params.id;
				const response = await patientService.deletePatient(id);
				res.status(response.code).json(response.response);
			} catch (err) {
				res.status(500).json(err);
			}
		}
	);

patientRouter.post(
	"/change-password//:id",
	authenticationMiddleware,
	authorizationMiddleware,
	async (req, res) => {
		try {
			const id = req.params.id;
			const data: ChangePassword = req.body;
			const response = await patientAuth.changePassword(id, data);
			res.status(response.code).json(response.response);
		} catch (err) {
			res.status(500).json(err);
		}
	}
);

export { patientRouter };
