import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  const { id } = req.query
  const noticeId = parseInt(id, 10)

  if (isNaN(noticeId)) {
    return res.status(400).json({ error: 'Invalid notice ID format' })
  }

  // Check if notice exists
  let notice
  try {
    notice = await prisma.notice.findUnique({
      where: { id: noticeId }
    })
  } catch (error) {
    console.error('Prisma search error:', error)
    return res.status(500).json({ error: 'Internal database error' })
  }

  if (!notice) {
    return res.status(404).json({ error: 'Notice not found' })
  }

  if (req.method === 'GET') {
    return res.status(200).json(notice)
  } 
  
  else if (req.method === 'PUT') {
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

      // Update notice
      const updatedNotice = await prisma.notice.update({
        where: { id: noticeId },
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: new Date(publishDate),
          image: image && image.trim() !== '' ? image.trim() : null
        }
      })

      return res.status(200).json(updatedNotice)
    } catch (error) {
      console.error('PUT /api/notices/[id] error:', error)
      return res.status(500).json({ error: 'Failed to update notice' })
    }
  } 
  
  else if (req.method === 'DELETE') {
    try {
      await prisma.notice.delete({
        where: { id: noticeId }
      })
      return res.status(200).json({ message: 'Notice deleted successfully', id: noticeId })
    } catch (error) {
      console.error('DELETE /api/notices/[id] error:', error)
      return res.status(500).json({ error: 'Failed to delete notice' })
    }
  } 
  
  else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}
