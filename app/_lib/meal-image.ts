import { generateImage } from 'ai'

export const DEFAULT_MEAL_IMAGE =
  'https://res.cloudinary.com/dv54qhjnt/image/upload/v1713567949/pexels-yente-van-eynde-1263034-2403392_nv2ihw.jpg'

const IMAGE_MODEL = 'bfl/flux-3-image-klein'

// Generates a photo of the meal through AI Gateway and stores it in Cloudinary,
// since the generated image isn't hosted anywhere permanent.
// Falls back to the default image so a failed generation never blocks saving.
export async function generateMealImage(
  mainTitle: string,
  secondaryTitle: string
): Promise<string> {
  try {
    const { image } = await generateImage({
      model: IMAGE_MODEL,
      prompt: `Appetizing overhead food photograph of ${mainTitle}, ${secondaryTitle}. Plated on a rustic table, natural light, no text.`,
      size: '1024x1024',
    })

    const formData = new FormData()
    formData.append('file', `data:${image.mediaType};base64,${image.base64}`)
    formData.append('upload_preset', 'ml_default')

    const response = await fetch(
      'https://api.cloudinary.com/v1_1/dv54qhjnt/image/upload',
      { method: 'POST', body: formData }
    )
    if (!response.ok) {
      throw new Error(`Cloudinary upload failed with status ${response.status}`)
    }

    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Error generating meal image:', error)
    return DEFAULT_MEAL_IMAGE
  }
}
