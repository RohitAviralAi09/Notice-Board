import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Sorting directly in the Prisma query:
      // 'Urgent' starts with 'U' and 'Normal' starts with 'N'.
      // Sorting priority descending ('desc') puts 'Urgent' first and 'Normal' second.
      // Secondarily, we sort by publishDate descending so newest notices appear first.
      const notices = await prisma.notice.findMany({
        orderBy: [
          { priority: 'desc' },
          { publishDate: 'desc' }
        ]
      })

      return res.status(200).json(notices)
    } catch (error) {
      console.error('GET /api/notices error:', error)
      return res.status(500).json({ error: 'Failed to fetch notices' })
    }
  } 
  
  else if (req.method === 'POST') {
    try {
      const { title, body, category, priority, publishDate, image } = req.body

      // Server-side Validation
      const errors = {}

      if (!title || typeof title !== 'string' || title.trim() === '') {
        errors.title = 'Title is required'
      }
      if (!body || typeof body !== 'string' || body.trim() === '') {
        errors.body = 'Body is required'
      }
      if (!category || !['Exam', 'Event', 'General'].includes(category)) {
        errors.category = 'Category must be one of: Exam, Event, General'
      }
      if (!priority || !['Urgent', 'Normal'].includes(priority)) {
        errors.priority = 'Priority must be one of: Urgent, Normal'
      }
      if (!publishDate || isNaN(Date.parse(publishDate))) {
        errors.publishDate = 'A valid publish date is required'
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors })
      }

      // Create new notice
      const newNotice = await prisma.notice.create({
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: new Date(publishDate),
          image: image && image.trim() !== '' ? image.trim() : null
        }
      })

      return res.status(201).json(newNotice)
    } catch (error) {
      console.error('POST /api/notices error:', error)
      return res.status(500).json({ error: 'Failed to create notice' })
    }
  } 
  
  else {
    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}
