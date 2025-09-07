import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = auth()
  if (!userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = params

  const meal = await prisma.meal.findFirst({
    where: { id: parseInt(id), userId },
  })

  if (!meal)
    return NextResponse.json({ error: 'Meal not found' }, { status: 404 })

  await prisma.meal.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ success: true })
}
