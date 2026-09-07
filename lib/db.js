import { Pool } from "pg";

const pool = global._pgPool || new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
if (!global._pgPool) global._pgPool = pool;

let ready;
function init() {
  if (!ready) {
    ready = pool.query(`create table if not exists user_data(
      user_email text primary key,
      tasks jsonb,
      name text,
      updated_at timestamptz not null default now()
    )`);
  }
  return ready;
}

export async function getUserData(email) {
  await init();
  const { rows } = await pool.query("select tasks,name from user_data where user_email=$1", [email]);
  return rows[0] || { tasks: null, name: null };
}

export async function saveUserData(email, tasks, name) {
  await init();
  await pool.query(
    `insert into user_data(user_email,tasks,name,updated_at) values($1,$2,$3,now())
     on conflict(user_email) do update set tasks=$2,name=$3,updated_at=now()`,
    [email, JSON.stringify(tasks), name]
  );
}
