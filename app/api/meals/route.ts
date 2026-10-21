import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/app/_lib/prisma'
import { DEFAULT_MEAL_IMAGE, generateMealImage } from '@/app/_lib/meal-image'
import { DEMO_MEALS, DEMO_USER_ID } from '@/app/_lib/demo'

// Image generation can take several seconds
export const maxDuration = 60

export async function GET() {
  const { userId } = await auth()
  if (!userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const meals = await prisma.meal.findMany({
    where: { userId },
    orderBy: { id: 'desc' },
  })
  return NextResponse.json(
    userId === DEMO_USER_ID ? [...meals, ...DEMO_MEALS] : meals
  )
}

export async function POST(request: NextRequest) {
  const { userId } = await auth()
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
      // The demo account gets the default image so visitors can't spend credits
      imagePath:
        imagePath ||
        (userId === DEMO_USER_ID
          ? DEFAULT_MEAL_IMAGE
          : await generateMealImage(mainTitle, secondaryTitle)),
      tags,
      ingredients,
      notes,
    },
  })

  return NextResponse.json(newMeal)
}
