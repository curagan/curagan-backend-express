import { PrismaService } from "../prisma.service";

export class DoctorService {
	constructor(private readonly prismaService: PrismaService) {}

	async getAllDoctor() {
		const response = await this.prismaService.doctor.findMany();
		response.map((res) => {
			res.password = "";
		});
		return {
			code: 200,
			response: response,
		};
	}

	async getDoctorByName(name: string) {
		const response = await this.prismaService.doctor.findMany({
			where: {
				name: name,
			},
		});
		response.map((res) => {
			res.password = "";
		});
		return {
			code: 200,
			response: response,
		};
	}

	async getDoctorById(id: string) {
		const response = await this.prismaService.doctor.findFirst({
			where: {
				id: id,
			},
		});
		if (response) {
			response.password = "";
			return {
				code: 200,
				response: response,
			};
		}
		return {
			code: 404,
			response: "Not Found",
		};
	}
}
