export class Url {
  public short: string
  public long: string
  public createdAt: Date
  public expiresAt: Date
  public lastVisited: Date | null
  public userId: number | null

  constructor(url: {
    short: string,
    long: string,
    createdAt: Date,
    expiresAt: Date,
    lastVisited: Date | null,
    userId: number | null,
  }) {
    this.short = url.short
    this.long = url.long
    this.createdAt = url.createdAt
    this.expiresAt = url.expiresAt
    this.lastVisited = url.lastVisited
    this.userId = url.userId
  }
}