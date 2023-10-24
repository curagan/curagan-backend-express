import { PrismaService } from "../prisma.service";
import { EditDoctor } from "./doctor.interface";

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

	async editDoctorData(id: string, data: EditDoctor) {
		const isExist = await this.prismaService.doctor.findFirst({
			where: {
				id: id,
			},
		});
		if (isExist) {
			const dataToUpdate = {
				email: data.email || isExist.email,
				name: data.name || isExist.name,
				imageURL: data.imageURL || isExist.imageURL,
				location: data.location || isExist.location,
				hospital: data.hospital || isExist.hospital,
				schedule: data.schedule || isExist.schedule,
			};
			const response = await this.prismaService.doctor.update({
				where: {
					id: id,
				},
				data: dataToUpdate,
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
		return {
			code: 404,
			response: "User not found",
		};
	}

	async deleteDoctor(id: string) {
		const isExist = await this.prismaService.doctor.findFirst({
			where: {
				id: id,
			},
		});
		if (isExist) {
			const response = await this.prismaService.doctor.delete({
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
				code: 400,
				response: response,
			};
		}
		return {
			code: 404,
			response: "User not found",
		};
	}
}
