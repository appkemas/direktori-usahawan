import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const { image, entrepreneurId } = await request.json();
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: `kemas/entrepreneurs/${entrepreneurId}`,
      transformation: [
        { width: 800, height: 600, crop: 'limit' }, // Optimize size
        { quality: 'auto' } // Auto quality
      ]
    });

    return NextResponse.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}
