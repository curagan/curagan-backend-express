export interface Data {
	role: string;
	userId: string;
}

export interface PatientDoctor {
	senderId: string;
	senderRole: string;
	targetId: string;
	targetRole: string;
	message: string;
	appointmentId: string;
	createdAt: string;
}
