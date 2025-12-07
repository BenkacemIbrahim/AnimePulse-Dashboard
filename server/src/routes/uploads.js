import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { requireAuth } from '../middlewares/auth.js'

const router = Router()

function ensureUploadsDir() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const projectDir = path.resolve(__dirname, '../../../project')
  const uploadsDir = path.join(projectDir, 'uploads')
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
  return uploadsDir
}

router.post('/', requireAuth, async (req, res) => {
  try {
    const { data_url } = req.body || {}
    if (!data_url || typeof data_url !== 'string') return res.status(400).json({ error: 'data_url is required' })
    const match = data_url.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/)
    if (!match) return res.status(400).json({ error: 'Invalid data URL' })
    const mime = match[1]
    const base64 = match[2]
    const buffer = Buffer.from(base64, 'base64')
    const ext = mime.includes('png') ? '.png' : mime.includes('jpeg') || mime.includes('jpg') ? '.jpg' : '.bin'
    const uploadsDir = ensureUploadsDir()
    const filename = `story_${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`
    const filepath = path.join(uploadsDir, filename)
    fs.writeFileSync(filepath, buffer)
    const url = `/uploads/${filename}`
    res.status(201).json({ url })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Upload failed' })
  }
})

export default router

