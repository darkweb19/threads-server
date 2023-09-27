import axios from "axios";
import { prismaClient } from "../../clients/db";
import JWTService from "../../authentication/Jwt";
import { GraphqlContext } from "../../interfaces";
import { User } from "@prisma/client";

interface GoogleTokenResult {
	iss: string;
	nbf: string;
	aud: string;
	sub: string;
	email: string;
	email_verified: string;
	azp: string;
	name: string;
	picture: string;
	given_name: string;
	family_name: string;
	iat: string;
	exp: string;
	jti: string;
	alg: string;
	kid: string;
	typ: string;
}

const queries = {
	verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
		const googleToken = token;
		const { data } = await axios.get<GoogleTokenResult>(
			`https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`
		);
		//checking first if the user is already present in the database
		const checkUser = await prismaClient.user.findUnique({
			where: { email: data.email },
		});

		//if no user then create a user in database
		if (!checkUser) {
			await prismaClient.user.create({
				data: {
					firstName: data.given_name,
					lastName: data.family_name,
					email: data.email,
					profileImageUrl: data.picture,
				},
			});
		}

		//generating a token
		const user = await prismaClient.user.findUnique({
			where: { email: data.email },
		});

		if (!user) throw new Error("User in db not found");
		const jwtToken = await JWTService.generateJwtToken(user);
		return jwtToken;
	},

	getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext) => {
		const id = ctx?.user?.id;
		if (!id) return null;
		const user = await prismaClient.user.findUnique({ where: { id } });
		return user;
	},
};

const extraResolvers = {
	User: {
		threads: (parent: User) =>
			prismaClient.thread.findMany({
				where: {
					id: parent.id,
				},
			}),
	},
};
export const resolvers = { queries, extraResolvers };
