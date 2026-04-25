import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.' }, { status: 400 });
    }
    
    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
    }
    
    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomString}.${fileExtension}`;
    
    // Define upload path
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'comics');
    const filePath = path.join(uploadDir, filename);
    
    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });
    
    // Write file
    await fs.writeFile(filePath, buffer);
    
    // Return success response with file URL
    const fileUrl = `/uploads/comics/${filename}`;
    
    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      fileUrl,
      filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
