import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const { userId } = auth()
  if (!userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const meals = await prisma.meal.findMany({
    where: { userId },
    orderBy: { id: 'desc' },
  })
  return NextResponse.json(meals)
}

export async function POST(request: NextRequest) {
  const { userId } = auth()
  if (!userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { mainTitle, secondaryTitle, imagePath, tags, ingredients, notes } =
    body

  const newMeal = await prisma.meal.create({
    data: {
      userId,
      mainTitle,
      secondaryTitle,
      imagePath:
        imagePath ||
        'https://res.cloudinary.com/dv54qhjnt/image/upload/v1713567949/pexels-yente-van-eynde-1263034-2403392_nv2ihw.jpg',
      tags,
      ingredients,
      notes,
    },
  })

  return NextResponse.json(newMeal)
}
