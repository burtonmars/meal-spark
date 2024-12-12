import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { prompt, imageSize, numImages, seed, outputFormat } =
      await req.json()

    const body = {
      input: {
        prompt,
        ...(imageSize && { image_size: imageSize }),
        ...(numImages && { num_images: numImages }),
        ...(seed && { seed }), // random number assigned during the generation to ensure results are reproducible (generate multiple images with same prompt and same seed = receive the same results) Default value is -1 (random value), with a range of 0 to 2147483647, inclusive.
        ...(outputFormat && { output_format: outputFormat }), // current possible file types include: png, jpeg
      },
    }

    const response = await fetch(
      'https://api.thehive.ai/api/v3/black-forest-labs/flux-schnell',
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${process.env.THE_HIVE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )

    if (!response.ok) {
      throw new Error(`API call failed with status ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error processing the request' },
      { status: 500 }
    )
  }
}
