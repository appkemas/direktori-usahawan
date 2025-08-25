'use client';

import React, { useState } from 'react';
import { auth } from '@/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function TestAuth() {
  const [result, setResult] = useState('');

  const testAuth = async () => {
    try {
      setResult('Testing Firebase Auth...');
      
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        'hq@kemas.gov.my', 
        'kemas123'
      );
      
      setResult(`✅ Auth successful! User: ${userCredential.user.email}`);
    } catch (error: any) {
      setResult(`❌ Auth failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Test Firebase Auth</h1>
        <button
          onClick={testAuth}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Test Authentication
        </button>
        <pre className="mt-4 bg-gray-100 p-4 rounded text-sm">
          {result}
        </pre>
      </div>
    </div>
  );
}
