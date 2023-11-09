export interface Notification {
	senderId: string;
	senderRole: string;
	targetId: string;
	targetRole: string;
	message: string;
	appointmentId: string;
	createdAt: String;
}
