import jwt, { JwtPayload } from "jsonwebtoken";

export class AppointmentGuard {
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
			console.log("authorization: ", decodedToken);
			console.log("userId: ", userID);
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

	roleGuard(userID: string, token: string) {
		try {
			const isAuthorized = this.authorization(userID, token);
			console.log("isAuthorized:", isAuthorized);
			if (!isAuthorized) {
				return false;
			}
			const decodedToken = this.authentication(token);

			if (typeof decodedToken === "boolean") {
				return false;
			}
			if (decodedToken.role !== "doctor") {
				return false;
			}
			console.log(decodedToken);
			return true;
		} catch (err) {
			return false;
		}
	}
}
