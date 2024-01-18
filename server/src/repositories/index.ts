import { PrismaClient } from "@prisma/client";

abstract class Repository<T> {
  dataSource: PrismaClient = new PrismaClient() 
  model: any

  constructor() {
    this.findAll = this.findAll.bind(this)
    this.create = this.create.bind(this)
    this.findById = this.findById.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
  }

  setModel(model: any) {
    this.model = model
  }

  async disconnect() {
    await this.dataSource.$disconnect()
  }

  abstract toEntity(data: any): T

  async findAll() {
    try {
      const items = await this.model.findMany()
      return items.map((item: any) => this.toEntity(item))
    } catch (error) {
      throw error
    } finally {
      await this.disconnect()
    }
  }

  async create(data: any) {
    try {
      const item = await this.model.create({
        data: {
          ...data,
        },
      })
      return this.toEntity(item)
    } catch (error) {
      throw error
    } finally {
      await this.disconnect()
    }
  }

  async findById(id: number) {
    try {
      const item = await this.model.findOne({
        where: {
          id
        }
      })
      return this.toEntity(item)
    } catch (error) {
      throw error
    } finally {
      await this.disconnect()
    }
  }

  async update(id: any, data: any) {
    try {
      const item = await this.model.update({
        where: { id },
        data: {
          ...data
        },
      })
      return this.toEntity(item)
    } catch (error) {
      throw error
    } finally {
      await this.disconnect()
    }
  }

  async delete(id: any) {
    try {
      const item = await this.model.delete({
        where: { id }
      })
      return this.toEntity(item)
    } catch (error) {
      throw error
    } finally {
      await this.disconnect()
    }
  }
}

export default Repository