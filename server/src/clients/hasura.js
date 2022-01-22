import { GraphQLClient } from "graphql-request";

import dotenv from "dotenv";
dotenv.config();

const headers = {
    "Content-Type": "application/json",
    "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
};

export default new GraphQLClient("http://localhost:8080/v1/graphql", {
    headers,
});
