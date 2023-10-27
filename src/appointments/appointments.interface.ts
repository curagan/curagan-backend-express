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
