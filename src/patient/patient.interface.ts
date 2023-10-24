export interface PatientLogin {
	email: string;
	password: string;
}

export interface PatientRegister {
	email: string;
	password: string;
	name: string;
	imageURL: string;
}

export interface PatchPatient {
	email: string | undefined;
	name: string | undefined;
	imageURL: string | undefined;
}

export interface ChangePassword {
	oldPassword: string;
	newPassword: string;
}
