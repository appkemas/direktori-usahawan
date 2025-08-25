'use client';

import { useEffect, useState } from 'react';
import { db } from '@/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export default function TestSetup() {
  const [firebaseStatus, setFirebaseStatus] = useState('Testing...');
  const [cloudinaryStatus, setCloudinaryStatus] = useState('Testing...');

  useEffect(() => {
    // Test Firebase
    const testFirebase = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'test'));
        setFirebaseStatus('✅ Firebase connection successful!');
      } catch (error) {
        setFirebaseStatus(`❌ Firebase error: ${error}`);
      }
    };

    // Test Cloudinary
    const testCloudinary = async () => {
      try {
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', entrepreneurId: 'test' })
        });
        
        if (response.ok) {
          setCloudinaryStatus('✅ Cloudinary API working!');
        } else {
          setCloudinaryStatus('❌ Cloudinary API error');
        }
      } catch (error) {
        setCloudinaryStatus(`❌ Cloudinary error: ${error}`);
      }
    };

    testFirebase();
    testCloudinary();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Setup Test</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Firebase Status:</h3>
            <p className="text-sm">{firebaseStatus}</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Cloudinary Status:</h3>
            <p className="text-sm">{cloudinaryStatus}</p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <a 
            href="/"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
