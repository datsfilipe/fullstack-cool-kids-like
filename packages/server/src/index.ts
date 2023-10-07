import { Elysia } from "elysia"
import { yoga } from "@elysiajs/graphql-yoga"
import { swagger } from "@elysiajs/swagger"
import { cors } from '@elysiajs/cors'

import db from "./db"

interface User { id?: string, name?: string, email?: string, banned?: boolean }

const app = new Elysia()
  .use(
    yoga({
      typeDefs: /* GraphQL */`
        type User {
          id: ID!
          name: String!
          email: String!
          banned: Boolean!
        }
        
        type Query {
          user(id: ID): [User]
          createUser(name: String!, email: String!): User
          banUser(id: ID!): User
        }
      `,
      resolvers: {
        Query: {
          user: (_, args) => {
            if (args?.id) {
              const query = db.query("SELECT * FROM users WHERE id = $id")
              const result = query.all({ $id: args.id })
              return result as User[]
            } else {
              const query = db.query("SELECT * FROM users")
              const result = query.all()
              return result as User[]
            }
          },
          createUser: (_, args) => {
            const id = Math.random().toString(36).substring(7)
            const user = { id, name: args.name, email: args.email, banned: false }
            const query = db.prepare("INSERT INTO users (id, name, email, banned) VALUES ($id, $name, $email, $banned)")
            query.run({
              $id: user.id,
              $name: user.name,
              $email: user.email,
              $banned: user.banned
            })
            return user
          },
          banUser: (_, args) => {
            const user = db.query("SELECT * FROM users WHERE id = $id").get({ $id: args.id }) as User | undefined
            if (!user) return null

            const query = db.prepare("UPDATE users SET banned = $banned WHERE id = $id")
            if (user.banned) query.run({ $id: args.id, $banned: false })
            else query.run({ $id: args.id, $banned: true })

            return {
              ...user,
              banned: !user.banned
            }
          }
        }
      }
    })
  )
  .use(cors())
  .use(swagger())
  .listen(8080)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
