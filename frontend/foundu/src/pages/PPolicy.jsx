import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const gradientBlackToBlue = {
  background: 'linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)'
}

export default function PPolicy() {
  return (
    <div className="min-h-screen flex flex-col pt-20" style={gradientBlackToBlue}>
      <Navbar />
      <div className="flex-grow flex flex-col items-center w-full z-10 px-4">
        <h1 className="text-4xl font-bold text-white mb-8 mt-10">Privacy Policy</h1>
        <div
          style={{ width: '85%', backgroundColor: 'rgba(255,255,255,0.85)' }}
          className="p-8 rounded-xl shadow-lg backdrop-blur-sm"
        >
          <p className="mb-4">This Privacy Policy describes how we collect, use, and disclose your information.</p>
          <p className="mb-4">We collect only the data necessary to provide and improve our services. We do not sell personal data.</p>
          <p className="mb-4">If you have questions about your data or this policy, contact our support team.</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
