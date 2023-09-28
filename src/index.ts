import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import { User } from "./app/user";
import cors from "cors";
import { GraphqlContext } from "./interfaces";
import JWTService from "./authentication/Jwt";
import { Thread } from "./app/threads";

const app = express();
app.use(bodyParser.json());
app.use(cors());

//this function will initialize the server
async function initServer() {
	const server = new ApolloServer<GraphqlContext>({
		typeDefs: `
		${User.types}
		${Thread.types}
        type Query {
            ${User.queries}
			${Thread.queries}
        }

		type Mutation {
			${Thread.mutations}
		}
        `,
		resolvers: {
			Query: {
				...User.resolvers.queries,
				...Thread.resolvers.queries,
			},

			Mutation: {
				...Thread.resolvers.mutations,
			},
			...Thread.resolvers.extraResolvers,
			...User.resolvers.extraResolvers,
		},
	});
	await server.start();

	app.use(
		"/graphql",
		expressMiddleware(server, {
			context: async ({ req, res }) => {
				return {
					user: req.headers.authorization
						? JWTService.decodeToken(
								req.headers.authorization.split("Bearer ")[1]
						  )
						: undefined,
				};
			},
		})
	);
}

//this will run the server and go to htto://localhost:8000/graphql
initServer();

//listening on port
app.listen(8000, () => [console.log("Server started at port 8000")]);
