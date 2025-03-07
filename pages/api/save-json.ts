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

    // Get the next file number
    const files = fs.readdirSync(dir);
    const nextNum = files.length > 0 
      ? Math.max(...files.map(f => parseInt(f.split('.')[0]))) + 1 
      : 1;

    // Save the file
    const filePath = path.join(dir, `${nextNum}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.status(200).json({ message: 'File saved successfully', id: nextNum });
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).json({ message: 'Error saving file' });
  }
} 