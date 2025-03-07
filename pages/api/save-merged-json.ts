import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const data = req.body;
    
    // Create directory if it doesn't exist
    const dir = path.join(process.cwd(), 'data', 'ai-json');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Save the file using the ID from the merged results
    const filePath = path.join(dir, `${data.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.status(200).json({ message: 'File saved successfully', id: data.id });
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).json({ message: 'Error saving file' });
  }
} 