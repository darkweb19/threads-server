import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

//this function will initialize the server
async function initServer() {
	const server = new ApolloServer({
		typeDefs: `
        type Query {
            hello : String
        }
        `,
		resolvers: {
			Query: {
				hello: () => "hello",
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
