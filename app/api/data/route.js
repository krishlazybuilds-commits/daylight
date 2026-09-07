import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { getUserData, saveUserData } from "../../../lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return Response.json({ error: "unauthorized" }, { status: 401 });
  const data = await getUserData(session.user.email);
  return Response.json(data);
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { tasks, name } = await req.json();
  await saveUserData(session.user.email, tasks, name);
  return Response.json({ ok: true });
}
