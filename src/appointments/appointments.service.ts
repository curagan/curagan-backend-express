import { CreateAppointment } from "./appointments.interface";
import { PrismaService } from "../prisma.service";

type Status = "Pending" | "Submitted" | "Accepted" | "Rejected" | "Done";
export class AppointmentService {
	constructor(private readonly prismaService: PrismaService) {}

	async getAppointmentsById(id: string) {
		const response =
			await this.prismaService.appointmentPatientDoctor.findFirst({
				where: {
					appointmentId: id,
				},
				include: {
					patient: true,
					doctor: true,
				},
			});
		if (!response) {
			return {
				code: 404,
				response: "Not Found",
			};
		}
		if (response.patient && response.doctor) {
			response.patient.password = "";
			response.doctor.password = "";
		}
		return {
			code: 200,
			response: response,
		};
	}

	async createApointment(data: CreateAppointment) {
		data.datetime = new Date(data.datetime);
		const response = await this.prismaService.appointmentPatientDoctor.create({
			data: data,
		});
		const connect = await this.prismaService.appointmentPatientDoctor.update({
			where: {
				appointmentId: response.appointmentId,
			},
			data: {
				patient: {
					connect: {
						id: data.patientID,
					},
				},
				doctor: {
					connect: {
						id: data.doctorID,
					},
				},
			},
		});
		return {
			code: 201,
			response: connect,
		};
	}

	async getAppointmentByUserId(userId: string, start: string, end: string) {
		const startDate =
			start !== "undefined" ? new Date(start) : new Date("2023-01-01");
		const endDate = end !== "undefined" ? new Date(end) : new Date();
		const response = await this.prismaService.appointmentPatientDoctor.findMany(
			{
				where: {
					OR: [
						{
							patientID: userId,
						},
						{
							doctorID: userId,
						},
					],
					datetime: {
						gte: startDate,
						lte: endDate,
					},
				},
			}
		);
		return {
			code: 200,
			response: response,
		};
	}

	async updateAppointmentStatus(
		appointmentId: string,
		data: {
			status: Status;
			message: string;
		}
	) {
		const response = await this.prismaService.appointmentPatientDoctor.update({
			where: {
				appointmentId: appointmentId,
			},
			data: {
				status: data.status,
				message: data.message,
			},
		});
		if (!response) {
			return {
				code: 400,
				response: "Update Failed",
			};
		}
		return {
			code: 201,
			response: response,
		};
	}
}
