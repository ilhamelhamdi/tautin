import { Request, Response, NextFunction } from "express";
import UserRepository from "../repositories/user-repository";
import utils from "../utils";

const userRepo = UserRepository.getInstance()

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // If there is no token or invalid token, skip. No user.
    const tokenHeader = req.headers.authorization
    if (!tokenHeader) return next()
    if (tokenHeader.split(' ')[0] !== 'Bearer') return next()
    let token = tokenHeader.split(' ')[1];
    if (!token) return next()

    const decoded = utils.verifyToken(token)
    const user = await userRepo.findByEmail(decoded.email)
    if (user) req.body.user = user
    next()
  } catch (error) {
    next()
  }

}

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.body.user
  if (!user) return res.status(401).send({ status: 'failed', message: 'Unauthorized' })
  next()
}

export default { verifyToken, requireAuth }