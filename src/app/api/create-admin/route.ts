import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const adminAuth = getAuth();
const adminDb = getFirestore();

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone, role, state, district } = await request.json();

    // Create Firebase Auth user
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // Save to Firestore
    await adminDb.collection('admins').add({
      uid: userRecord.uid,
      email,
      name,
      phone,
      role,
      state,
      district,
      createdAt: new Date(),
      status: 'active',
      tempPassword: password,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Admin account created successfully',
      uid: userRecord.uid 
    });

  } catch (error: any) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
