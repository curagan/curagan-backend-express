import { PrismaService } from "../prisma.service";

export class PreferencesService {
	private readonly prismaService: PrismaService;

	constructor() {
		this.prismaService = new PrismaService();
	}

	async updatePreferences(patientId: string, doctorId: string) {
		const doctor = await this.prismaService.doctor.findUnique({
			where: {
				id: doctorId,
			},
		});
		if (doctor) {
			await this.prismaService.preferences.create({
				data: {
					patientId: patientId,
					preferences: doctor.specialization,
				},
			});
		}
	}
}
