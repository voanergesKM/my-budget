import postgres from "postgres";
import bcryptjs from "bcryptjs";
import { User } from "../definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export const addUser = async (
  email: string,
  password: string,
  name: string,
  image = ""
) => {
  const hashedPassword = password ? await bcryptjs.hash(password, 10) : "";

  return await sql`INSERT INTO users (email, password, name, image) VALUES (${email}, ${hashedPassword}, ${name}, ${image})`;
};

export const requestUser = async (email: string): Promise<User[]> => {
  return await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
};

export const updateUser = async (
  email: string,
  image: string,
  name: string
) => {
  return await sql`
    UPDATE users 
    SET image = ${image}, name = ${name}
    WHERE email = ${email}
  `;
};
