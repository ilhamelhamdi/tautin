import { User as UserScheme } from "@prisma/client";
import { User } from "../models/user";
import Repository from ".";

class UserRepository extends Repository<User> {
  private static instance: UserRepository

  constructor() {
    super()
    this.setModel(this.dataSource.user)
  }

  static getInstance() {
    return UserRepository.instance || (UserRepository.instance = new UserRepository())
  }


  toEntity(user: UserScheme) {
    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.model.findUnique({
        where: { email: email },
        include: { urls: true }
      })
      return (user != null) ? this.toEntity(user) : null
    } catch (error) {
      throw error
    } finally {
      this.disconnect()
    }
  }
}

export default UserRepository