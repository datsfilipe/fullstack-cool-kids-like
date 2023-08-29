import { Elysia } from "elysia"
import { yoga } from "@elysiajs/graphql-yoga"
import { swagger } from "@elysiajs/swagger"

const app = new Elysia()
  .use(
    yoga({
      typeDefs: /* GraphQL */`
        type Query {
          hi: String
        }
      `,
      resolvers: {
        Query: {
          hi: async () => "Hello World!"
        }
      }
    })
  )
  .use(swagger())
  .listen(8080)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
