import { PrismaService } from "../prisma.service";
import { Notification } from "./notification.interface";

export class NotificationService {
	constructor(private readonly prismaService: PrismaService) {}

	async createNotification(data: Notification) {
		const response = await this.prismaService.notification.create({
			data: data,
		});
		if (response) {
			return {
				code: 201,
				response: response.notificationId,
			};
		} else {
			return {
				code: 201,
				response: "Notification Creation Error",
			};
		}
	}

	async getNotification(receiverId: string) {
		const response = await this.prismaService.notification.findMany({
			where: {
				targetId: receiverId,
			},
		});
		return {
			code: 200,
			response: response,
		};
	}
}
