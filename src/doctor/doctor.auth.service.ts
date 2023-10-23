import { PrismaService } from "../prisma.service";
import { DoctorLogin, DoctorRegister } from "./doctor.interface";
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
				email: response.email,
				name: response.name,
			};
			const token = jwt.sign(payload, String(process.env["JWT_KEY"]), {
				expiresIn: "24h",
				algorithm: "HS256",
			});
			return {
				code: 200,
				response: token,
			};
		}
		return {
			code: 404,
			response: "Username not found",
		};
	}
}
