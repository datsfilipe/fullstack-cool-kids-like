import { Database } from "bun:sqlite"
import { createTablesQuery } from "./init"

const db = new Database("mydb.sqlite", { create: true })
const query = db.prepare(createTablesQuery)
query.run()

export default db
