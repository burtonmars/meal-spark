import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { prompt, imageSize, numImages, seed, outputFormat } =
      await req.json()

    const body = {
      input: {
        prompt,
        ...(imageSize && { image_size: imageSize }),
        ...(numImages && { num_images: numImages }),
        ...(seed && { seed }),
        ...(outputFormat && { output_format: outputFormat }),
      },
    }
    console.log('Received request body:', body)

    const response = await fetch('https://api.together.ai/v1/images/generate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.TOGETHER_AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`API call failed with status ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json(
      { error: 'Image generation failed' },
      { status: 500 }
    )
  }
}
