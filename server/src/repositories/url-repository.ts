import Repository from ".";
import { Url as UrlScheme } from "@prisma/client";
import { Url } from "../models/url";

class UrlRepository extends Repository<Url> {
  private static instance: UrlRepository

  constructor() {
    super()
    this.setModel(this.dataSource.url)
  }

  static getInstance() {
    return UrlRepository.instance || (UrlRepository.instance = new UrlRepository())
  }

  toEntity(url: UrlScheme) {
    return new Url({
      short: url.short,
      long: url.long,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
      lastVisited: url.lastVisited,
      userId: url.userId,
    })
  }

  async findByShortUrl(short: string): Promise<Url | null> {
    try {
      const url: UrlScheme = await this.model.findUnique({ where: { short: short } })
      if (!url) return null
      return this.toEntity(url)
    } catch (error) {
      throw error
    } finally {
      this.disconnect()
    }
  }

  async filterByUserId(userId: number): Promise<Url[]> {
    try {
      const urls: UrlScheme[] = await this.model.findMany({ where: { userId: userId } })
      return urls.map(url => this.toEntity(url))
    } catch (error) {
      throw error
    } finally {
      this.disconnect()
    }
  }

  async update(short: string, data: any): Promise<any> {
    try {
      return await this.model.update({
        where: { short },
        data: {
          ...data
        },
      })
    } catch (error) {
      throw error
    } finally {
      await this.disconnect()
    }
  }

  async delete(short: string) {
    try {
      const item = await this.model.delete({
        where: { short }
      })
      return this.toEntity(item)
    } catch (error) {
      throw error
    } finally {
      await this.disconnect()
    }
  }
}

export default UrlRepository