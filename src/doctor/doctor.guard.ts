import jwt, { JwtPayload } from "jsonwebtoken";

export class DoctorGuard {
	authentication(token: string) {
		try {
			return jwt.verify(token, String(process.env["JWT_KEY"])) as JwtPayload;
		} catch (err) {
			return false;
		}
	}

	authorization(userID: string, token: string) {
		try {
			const decodedToken = this.authentication(token);
			console.log(decodedToken);
			if (typeof decodedToken === "boolean") {
				return false;
			}
			if (decodedToken.id !== userID) {
				return false;
			}
			return true;
		} catch {
			return false;
		}
	}
}
