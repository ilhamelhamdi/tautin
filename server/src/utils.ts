import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import config from "./config";

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
}

const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
}

const createToken = (user: any) => {
  return jwt.sign({ id: user.id, email: user.email }, config.JWT_SECRET as string, { expiresIn: '24h' })
}

const verifyToken = (token: string) => {
  return <any>jwt.verify(token, config.JWT_SECRET as string)
}

export default { hashPassword, comparePassword, createToken, verifyToken }