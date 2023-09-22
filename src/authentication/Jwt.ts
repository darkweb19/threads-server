import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

const jwt_secret = "!@#Secret123";

class JWTService {
	public static async generateJwtToken(user: User) {
		const payload = {
			id: user.id,
			email: user.email,
		};

		const token = jwt.sign(payload, jwt_secret);
		return token;
	}
}
export default JWTService;
