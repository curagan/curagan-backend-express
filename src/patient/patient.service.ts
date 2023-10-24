import { PrismaService } from "../prisma.service";
import { PatchPatient } from "./patient.interface";
export class PatientService {
	constructor(private readonly prismaService: PrismaService) {}

	async getPatientsById(id: string) {
		const response = await this.prismaService.patient.findFirst({
			where: {
				id: id,
			},
		});
		if (!response) {
			return {
				code: 404,
				response: "No patient found",
			};
		}
		response.password = "";
		return {
			code: 200,
			response: response,
		};
	}

	async patchPatientById(id: string, data: PatchPatient) {
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
		const updatedData = {
			name: data.name || isExist.name,
			email: data.email || isExist.email,
			imageURL: data.imageURL || isExist.imageURL,
		};
		const response = await this.prismaService.patient.update({
			where: {
				id: id,
			},
			data: updatedData,
		});
		response.password = "";
		return {
			code: 201,
			response: response,
		};
	}

	async deletePatient(id: string) {
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
		const response = await this.prismaService.patient.delete({
			where: {
				id: id,
			},
		});
		response.password = "";
		return {
			code: 200,
			response: response,
		};
	}
}
