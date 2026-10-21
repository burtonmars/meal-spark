'use server'

import { auth } from '@clerk/nextjs/server'
import { Meal } from './definitions'
import { prisma } from './prisma'

export async function fetchMeals() {
  const { userId } = await auth()
  if (userId) {
    const meals = await prisma.meal.findMany({
      where: {
        userId: userId,
      },
      orderBy: { id: 'desc' },
    })
    return meals
  } else {
    console.error('Error fetching meals: User not signed in')
    return []
  }
}

export async function updateMeal(meal: Meal): Promise<void> {
  const { userId } = await auth()
  if (userId) {
    try {
      // Scoping by userId keeps users from editing someone else's meal
      await prisma.meal.updateMany({
        where: {
          id: meal.id,
          userId: userId,
        },
        data: {
          mainTitle: meal.mainTitle,
          secondaryTitle: meal.secondaryTitle,
          imagePath: meal.imagePath,
          tags: meal.tags,
          ingredients: meal.ingredients,
          notes: meal.notes,
        },
      })
    } catch (error) {
      console.error('Error updating meal:', error)
    }
  } else {
    console.error('Error updating meal: User not signed in')
  }
}

export async function saveNewMeal(meal: Meal): Promise<void> {
  const { userId } = await auth()
  if (!meal.imagePath) {
    meal.imagePath =
      'https://res.cloudinary.com/dv54qhjnt/image/upload/v1713567949/pexels-yente-van-eynde-1263034-2403392_nv2ihw.jpg'
  }

  if (userId) {
    try {
      await prisma.meal.create({
        data: {
          userId: userId,
          mainTitle: meal.mainTitle,
          secondaryTitle: meal.secondaryTitle,
          imagePath: meal.imagePath,
          tags: meal.tags,
          ingredients: meal.ingredients,
          notes: meal.notes,
        },
      })
    } catch (error) {
      console.error('Error saving new meal:', error)
    }
  } else {
    console.error('Error saving new meal: User not signed in')
  }
}

export async function deleteMeal(mealId: number): Promise<void> {
  const { userId } = await auth()
  if (userId) {
    try {
      await prisma.meal.deleteMany({
        where: {
          id: mealId,
          userId: userId,
        },
      })
    } catch (error) {
      console.error('Error deleting meal:', error)
    }
  } else {
    console.error('Error deleting meal: User not signed in')
  }
}
