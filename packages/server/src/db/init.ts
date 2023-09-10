export const createTablesQuery = `
create table if not exists users (
  id integer primary key,
  name text not null,
  email text not null unique,
  banned boolean default false
);
`
