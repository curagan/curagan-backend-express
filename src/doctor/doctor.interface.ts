export interface DoctorRegister {
	email: string;
	password: string;
	name: string;
	imageURL: string;
	location: string;
	hospital: string;
}

export interface DoctorLogin {
	email: string;
	password: string;
}
