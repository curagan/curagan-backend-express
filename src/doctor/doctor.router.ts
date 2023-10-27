import express, { NextFunction, Request, Response } from "express";
import { PrismaService } from "../prisma.service";
import { DoctorAuth } from "./doctor.auth.service";
import { DoctorService } from "./doctor.service";
import { ChangePassword, EditDoctor } from "./doctor.interface";
import { DoctorGuard } from "./doctor.guard";

const prismaService = new PrismaService();
const doctorAuth = new DoctorAuth(prismaService);
const doctorService = new DoctorService(prismaService);
const doctorRouter = express.Router();
const doctorGuard = new DoctorGuard();

const authenticationMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = String(
			req.headers["authorization"]?.split(" ")[1].replace("'", "")
		);
		const checkToken = doctorGuard.authentication(token);
		if (checkToken) {
			next();
		} else {
			res.status(401).json("Invalid Token");
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
		if (doctorGuard.authorization(req.params.id, token)) {
			next();
		} else {
			res.status(403).json("Forbidden");
		}
	} catch (err) {
		res.status(500).json("Server Error");
	}
};

doctorRouter.post("/auth/register", async (req, res) => {
	try {
		const response = await doctorAuth.register(req.body);
		res.status(response.code).json(response.response);
	} catch (err) {
		res.status(500).json(err);
	}
});

doctorRouter.post("/auth/login", async (req, res) => {
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

doctorRouter
	.route("/:id")
	.get(async (req, res) => {
		try {
			const id = req.params.id;
			const response = await doctorService.getDoctorById(id);
			res.status(response.code).json(response.response);
		} catch (err) {
			res.status(500).json(err);
		}
	})
	.put(authenticationMiddleware, authorizationMiddleware, async (req, res) => {
		try {
			const id = req.params.id;
			const data: EditDoctor = req.body;
			const response = await doctorService.editDoctorData(id, data);
			res.status(response.code).json(response.response);
		} catch (err) {
			res.status(500).json(err);
		}
	})
	.delete(
		authenticationMiddleware,
		authorizationMiddleware,
		async (req, res) => {
			try {
				const id = req.params.id;
				const response = await doctorService.deleteDoctor(id);
				res.status(response.code).json(response.response);
			} catch (err) {
				res.status(500).json(err);
			}
		}
	);

doctorRouter.patch(
	"/change-password/:id",
	authenticationMiddleware,
	authorizationMiddleware,
	async (req, res) => {
		try {
			const id = req.params.id;
			const data: ChangePassword = req.body;
			const response = await doctorAuth.changePassword(id, data);
			res.status(response.code).json(response.response);
		} catch (err) {
			res.status(500).json(err);
		}
	}
);

export { doctorRouter };
