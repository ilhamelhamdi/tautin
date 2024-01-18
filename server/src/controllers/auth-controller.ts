import { Request, Response } from "express";
import UserRepository from "../repositories/user-repository";
import utils from "../utils";

const userRepo = UserRepository.getInstance()

const register = async (req: Request, res: Response) => {
  // Check if user already exists
  const email = req.body.email as string
  const user = await userRepo.findByEmail(email)
  if (user) {
    return res.status(400).send({ status: 'failed', message: 'User already exists' })
  }

  // Create user
  try {
    const data = {
      name: req.body.name as string,
      email: req.body.email as string,
      password: await utils.hashPassword(req.body.password as string),
      createdAt: new Date(),
      lastLogin: new Date(),
    }
    const user = await userRepo.create(data)
    res.status(201).send({ status: 'success', message: 'User registered successfully!' })
  } catch (error) {
    res.status(500).send({ status: 'failed', message: error })
  }

}

const login = async (req: Request, res: Response) => {
  try {
    const email = req.body.email as string
    const password = req.body.password as string
    const user = await userRepo.findByEmail(email)
    if (!user) return res.status(401).send({ status: 'failed', message: 'Invalid credentials' })

    const isPasswordValid = await utils.comparePassword(password, user.password)
    if (!isPasswordValid) return res.status(401).send({ status: 'failed', message: 'Invalid credentials' })

    await userRepo.update(user.id, { ...user, lastLogin: new Date() }) // update lastLogin
    const token = utils.createToken(user)

    res.send({ status: 'success', message: 'User registered successfully!', token: token, user: user })

  } catch (error) {
    res.status(500).send({ status: 'failed', message: error })
  }
}


export default { register, login }