import { GraphQLClient } from "graphql-request";

export function getGraphQLClient(token?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  return new GraphQLClient(process.env.WP_GRAPHQL_ENDPOINT!, {
    headers,
  });
}
