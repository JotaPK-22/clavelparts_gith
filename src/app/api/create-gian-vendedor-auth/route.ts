export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY

  if (!supabaseUrl) {
    return Response.json(
      { error: 'Missing NEXT_PUBLIC_SUPABASE_URL environment variable.' },
      { status: 500 },
    )
  }

  if (!supabaseKey) {
    return Response.json(
      {
        error:
          'Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY in .env.local. The public publishable key is not enough for this Edge Function.',
      },
      { status: 500 },
    )
  }

  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/create-gian-vendedor-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${supabaseKey}`,
        apikey: supabaseKey,
      },
      body: JSON.stringify({
        email: 'gian16valori@gmail.com',
        password: 'opel2026',
        nombre: 'GIANLUCA VALORI',
      }),
    })

    const data = await res.json().catch(() => ({
      error: 'The Edge Function did not return valid JSON.',
    }))

    return Response.json(data, { status: res.status })
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Unexpected error calling Edge Function.',
      },
      { status: 500 },
    )
  }
}
