import { PrismaService } from "../prisma.service";
import {
	ChangePassword,
	DoctorLogin,
	DoctorRegister,
} from "./doctor.interface";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class DoctorAuth {
	constructor(private readonly prismaService: PrismaService) {}

	async register(data: DoctorRegister) {
		const isExist = await this.prismaService.doctor.findFirst({
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
		const response = await this.prismaService.doctor.create({
			data: {
				...data,
				password: bcrypt.hashSync(
					data.password,
					Number(process.env["HASH_SALT"])
				),
			},
		});
		response.password = "";
		if (response) {
			return {
				code: 201,
				response: response,
			};
		}
		return {
			code: 400,
			response: "Bad Request",
		};
	}

	async login(data: DoctorLogin) {
		const response = await this.prismaService.doctor.findFirst({
			where: {
				email: data.email,
			},
		});
		if (response) {
			const passwordMatch = bcrypt.compareSync(
				data.password,
				response.password
			);
			if (!passwordMatch) {
				return {
					code: 401,
					response: "Incorrect Password",
				};
			}
			const payload = {
				id: response.id,
				email: response.email,
				name: response.name,
				role: "doctor",
			};
			const token = jwt.sign(payload, String(process.env["JWT_KEY"]), {
				expiresIn: "24h",
				algorithm: "HS256",
			});
			const returnValue = {
				id: response.id,
				access_token: token,
				role: "doctor",
			};
			return {
				code: 200,
				response: returnValue,
			};
		}
		return {
			code: 404,
			response: "Username not found",
		};
	}

	async changePassword(id: string, data: ChangePassword) {
		const isExist = await this.prismaService.doctor.findFirst({
			where: {
				id: id,
			},
		});
		if (!isExist) {
			return {
				code: 404,
				response: "User Not Found",
			};
		}
		const passwordCheck = bcrypt.compareSync(
			data.oldPassword,
			isExist.password
		);
		if (!passwordCheck) {
			return {
				code: 403,
				response: "Invalid Password",
			};
		}
		const response = await this.prismaService.doctor.update({
			where: {
				id: id,
			},
			data: {
				password: data.newPassword,
			},
		});
		return {
			code: 201,
			response: response,
		};
	}
}
