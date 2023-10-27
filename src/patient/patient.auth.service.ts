import { PrismaService } from "../prisma.service";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
	ChangePassword,
	PatientLogin,
	PatientRegister,
} from "./patient.interface";
export class PatientAuth {
	constructor(private readonly prismaService: PrismaService) {}

	async login(loginData: PatientLogin) {
		const response = await this.prismaService.patient.findFirst({
			where: {
				email: loginData.email,
			},
		});
		if (!response) {
			return {
				code: 404,
				response: "User not found",
			};
		}
		const passwordMatch = bcrypt.compareSync(
			loginData.password,
			response.password
		);
		if (!passwordMatch) {
			return {
				code: 401,
				response: "Invalid Password",
			};
		}
		const payload = {
			id: response.id,
			email: response.email,
			name: response.name,
		};
		const token = jwt.sign(payload, String(process.env["JWT_KEY"]), {
			expiresIn: "24h",
			algorithm: "HS256",
		});
		const returnValue = {
			id: response.id,
			access_token: token,
			role: "patient",
		};
		return {
			code: 200,
			response: returnValue,
		};
	}

	async register(data: PatientRegister) {
		const isExist = await this.prismaService.patient.findUnique({
			where: {
				email: data.email,
			},
		});
		if (isExist) {
			return {
				code: 409,
				response: "User already registered",
			};
		}
		const response = await this.prismaService.patient.create({
			data: {
				...data,
				password: bcrypt.hashSync(
					data.password,
					Number(process.env["HASH_SALT"])
				),
			},
		});
		response.password = "";
		return {
			code: 201,
			response: response,
		};
	}

	async changePassword(id: string, data: ChangePassword) {
		const isExist = await this.prismaService.patient.findFirst({
			where: {
				id: id,
			},
		});
		if (!isExist) {
			return {
				code: 404,
				response: "Patient not found",
			};
		}
		const passwordMatch = bcrypt.compareSync(
			data.oldPassword,
			isExist.password
		);
		if (!passwordMatch) {
			return {
				code: 401,
				response: "Invalid password",
			};
		}
		const response = await this.prismaService.patient.update({
			where: {
				id: id,
			},
			data: {
				password: data.newPassword,
			},
		});
		response.password = "";
		return {
			code: 201,
			response: response,
		};
	}
}
