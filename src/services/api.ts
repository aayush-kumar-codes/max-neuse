export async function processUrl(url: string) {
  try {
    const response = await fetch('/api/process-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to process URL')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error processing URL:', error)
    throw error
  }
} 