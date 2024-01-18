import { Request, Response, NextFunction } from "express";
import UrlRepository from "../repositories/url-repository";
import { Url } from "../models/url";
import { User } from "../models/user";

const urlRepo = UrlRepository.getInstance()

const retrieve = async (req: Request, res: Response) => {
  if (!req.params.shortUrl)
    return res.status(400).send({ status: 'failed', message: 'Short URL is required' })

  const url: Url | null = await urlRepo.findByShortUrl(req.params.shortUrl as string)
  if (url) {
    // update lastVisited
    await urlRepo.update(url.short, { ...url, lastVisited: new Date() })
    return res.redirect(url.long)
  } else {
    return res.status(404).send({ status: 'failed', message: 'URL not found' })
  }
}

const shorten = async (req: Request, res: Response) => {
  const EXPIRATION_YEAR = 1;

  // Check if short URL already exists
  const short = req.body.short as string
  const url = await urlRepo.findByShortUrl(short)
  if (url) 
    return res.status(400).send({ status: 'failed', message: 'Short URL already exists' })

  // Create URL
  try {
    const data: Url = {
      long: req.body.long as string,
      short: req.body.short as string,
      createdAt: new Date(),
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + EXPIRATION_YEAR)),
      lastVisited: null,
      userId: null,
    }

    if (req.body.user) { data.userId = req.body.user.id }

    const url = await urlRepo.create(data)

    res.status(201).send({ status: 'success', message: 'URL is shortened successfully!', data: url })
  } catch (error) {
    res.status(500).send({ status: 'failed', message: error })
  }

}

const list = async (req: Request, res: Response) => {
  try {
    const user = req.body.user
    const urls = await urlRepo.filterByUserId(user.id)
    res.send({ status: 'success', message: 'URLs retrieved successfully!', data: urls })
  } catch (error) {
    res.status(500).send({ status: 'failed', message: error })
  }
}

const update = async (req: Request, res: Response) => {
  // Check if short URL exists
  const currentShort = req.params.shortUrl
  const currentUrl = await urlRepo.findByShortUrl(currentShort)
  if (!currentUrl)
    return res.status(404).send({ status: 'failed', message: 'URL not found' })

  // Check if this user owns this URL
  const user:User = req.body.user
  if (currentUrl.userId !== user.id)
    return res.status(403).send({ status: 'failed', message: 'Unauthorized' })

  try {
    const data: Url = {
      ...currentUrl,
      long: req.body.long as string,
      short: req.body.short as string,
    }
    const updatedUrl = await urlRepo.update(currentShort, data)
    res.status(201).send({ status: 'success', message: 'URL is shortened successfully!', data: updatedUrl })
  } catch (error) {
    res.status(500).send({ status: 'failed', message: error })
  }
}


const deleteUrl = async (req: Request, res: Response) => {
  // Check if short URL exists
  const currentShort = req.params.shortUrl
  const currentUrl = await urlRepo.findByShortUrl(currentShort)
  if (!currentUrl)
    return res.status(404).send({ status: 'failed', message: 'URL not found' })

  // Check if this user owns this URL
  const user:User = req.body.user
  if (currentUrl.userId !== user.id)
    return res.status(403).send({ status: 'failed', message: 'Unauthorized' })

  try {
    const deletedUrl = await urlRepo.delete(currentShort)
    res.status(201).send({ status: 'success', message: 'URL is shortened successfully!', data: deletedUrl })
  } catch (error) {
    res.status(500).send({ status: 'failed', message: error })
  }
}



export default { retrieve, shorten, list, update, deleteUrl }