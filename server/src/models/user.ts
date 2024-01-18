import { Url } from "./url"

export class User {
  public id: number
  public name: string | null
  public email: string
  public password: string
  public createdAt: Date
  public lastLogin: Date
  // public urls?: Url[]

  constructor(user: {
    id: number,
    name: string | null,
    email: string,
    password: string,
    createdAt: Date,
    lastLogin: Date,
    // urls?: Url[],
  }) {
    this.id = user.id
    this.name = user.name
    this.email = user.email
    this.password = user.password
    this.createdAt = user.createdAt
    this.lastLogin = user.lastLogin
    // this.urls = user.urls
  }
}