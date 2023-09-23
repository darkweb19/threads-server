import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import { User } from "./app/user";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

//this function will initialize the server
async function initServer() {
	const server = new ApolloServer({
		typeDefs: `
		${User.types}
        type Query {
            ${User.queries}
        }
        `,
		resolvers: {
			Query: {
				...User.resolvers.queries,
			},
		},
	});
	await server.start();
	app.use("/graphql", expressMiddleware(server));
}

//this will run the server and go to htto://localhost:8000/graphql
initServer();

//listening on port
app.listen(8000, () => [console.log("Server started at port 8000")]);
