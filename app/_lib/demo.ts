import { Meal } from './definitions'

export const DEMO_USER_ID = 'user_2fspa7LOhbh3lozBaKUzrKkJOUz'

// Demo meals live in code rather than the database so they can never be
// deleted. Negative IDs keep them from colliding with real meals.
export const DEMO_MEALS: Meal[] = [
  {
    id: -1,
    userId: DEMO_USER_ID,
    mainTitle: 'Pan Seared Salmon Filets',
    secondaryTitle: 'with lemon parmesan orzo',
    imagePath:
      'https://res.cloudinary.com/dv54qhjnt/image/upload/v1792608092/jyvcmmjkogr0w22bipli.jpg',
    tags: ['dinner', 'fish', 'healthy', 'quick'],
    ingredients: [
      '2 salmon filets',
      '1 cup orzo',
      '1 lemon',
      '1/2 cup grated parmesan',
      '2 cloves garlic',
      '2 cups chicken broth',
      'fresh dill',
    ],
    notes:
      'Pat the salmon dry and get the pan very hot for a crispy skin. Stir the lemon zest and parmesan into the orzo right before serving.',
  },
  {
    id: -2,
    userId: DEMO_USER_ID,
    mainTitle: 'Chicken Tikka Masala',
    secondaryTitle: 'with basmati rice and garlic naan',
    imagePath:
      'https://res.cloudinary.com/dv54qhjnt/image/upload/v1792608376/xzyreif56csuaf6bcujh.jpg',
    tags: ['dinner', 'chicken', 'comfort food', 'freezer friendly'],
    ingredients: [
      '1.5 lbs chicken thighs',
      '1 cup plain yogurt',
      '1 can crushed tomatoes',
      '1 cup heavy cream',
      '1 onion',
      '2 tbsp garam masala',
      'basmati rice',
      'naan',
    ],
    notes:
      'Marinate the chicken in the yogurt and spices overnight if you can. The sauce freezes well, so make a double batch.',
  },
  {
    id: -3,
    userId: DEMO_USER_ID,
    mainTitle: 'Black Bean Sweet Potato Tacos',
    secondaryTitle: 'with lime crema and pickled onions',
    imagePath:
      'https://res.cloudinary.com/dv54qhjnt/image/upload/v1792608384/cschzlkpzbn0shbfnmyt.jpg',
    tags: ['lunch', 'vegetarian', 'budget', 'quick'],
    ingredients: [
      '1 large sweet potato',
      '1 can black beans',
      '8 small tortillas',
      '1/2 cup sour cream',
      '2 limes',
      '1 red onion',
      'cilantro',
    ],
    notes:
      'Quick pickle the onions in lime juice and a pinch of salt while the sweet potatoes roast at 425°F.',
  },
]

export const isDemoMeal = (id: number) => DEMO_MEALS.some((meal) => meal.id === id)
