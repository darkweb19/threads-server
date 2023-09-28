import { Thread } from "@prisma/client";
import { prismaClient } from "../../clients/db";
import { GraphqlContext } from "../../interfaces";

interface CreateThreadPayload {
	content: string;
}

const queries = {
	getAllThreads: () =>
		prismaClient.thread.findMany({ orderBy: { createdAt: "desc" } }),
};
const mutations = {
	createThread: async (
		parent: any,
		{ payload }: { payload: CreateThreadPayload },
		ctx: GraphqlContext
	) => {
		if (!ctx.user?.id) throw new Error("You are not authenticated");
		console.log(ctx.user.id);

		const thread = await prismaClient.thread.create({
			data: {
				content: payload.content,
				author: { connect: { id: ctx.user?.id } },
			},
		});
		return thread;
	},
};
const extraResolvers = {
	Thread: {
		author: (parent: Thread) =>
			prismaClient.user.findUnique({ where: { id: parent.authorId } }),
	},
};

export const resolvers = { mutations, extraResolvers, queries };
