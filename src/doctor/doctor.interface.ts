export interface DoctorRegister {
	email: string;
	password: string;
	name: string;
	imageURL: string;
	location: string;
	hospital: string;
}

export interface EditDoctor {
	email: string | undefined;
	name: string | undefined;
	imageURL: string | undefined;
	location: string | undefined;
	hospital: string | undefined;
	schedule: string | undefined;
}

export interface DoctorLogin {
	email: string;
	password: string;
}

export interface ChangePassword {
	oldPassword: string;
	newPassword: string;
}
