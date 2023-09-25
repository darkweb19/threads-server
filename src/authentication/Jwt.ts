import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { JWTUser } from "../interfaces";

const jwt_secret = "!@#Secret123";

class JWTService {
	public static async generateJwtToken(user: User) {
		const payload: JWTUser = {
			id: user.id,
			email: user.email,
		};

		const token = jwt.sign(payload, jwt_secret);
		return token;
	}

	public static decodeToken(token: string) {
		try {
			return jwt.verify(token, jwt_secret) as JWTUser;
		} catch (err) {
			return null;
		}
	}
}
export default JWTService;
