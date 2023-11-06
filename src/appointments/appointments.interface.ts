export interface CreateAppointment {
	patientID: string;
	doctorID: string;
	datetime: Date;
}

export enum Status {
	Pending,
	Submitted,
	Accepted,
	Rejected,
	Done,
}

export interface EditAppointment {
	appointmentId: string;
	patientID: string | null;
	doctorID: string | null;
	datetime: Date;
	status: Status;
	message: string | null;
}
