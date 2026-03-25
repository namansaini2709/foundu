import React from 'react'
import Footer from '../components/Footer'
const gradientBlackToBlue = {
  background: 'linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)'
}
export default function CPolicy() {
  return (
    <div className="min-h-screen flex flex-col pt-20" style={gradientBlackToBlue}>
      <div className="flex-grow flex flex-col items-center w-full z-10 px-4">
        <h1 className="text-4xl font-bold text-white mb-8 mt-10">Cookie Policy</h1>
        <div
          style={{ width: '85%', backgroundColor: 'rgba(255,255,255,0.85)' }}
          className="p-8 rounded-xl shadow-lg backdrop-blur-sm"
        >
          <p className="mb-4">We use cookies to enhance your experience and analyze site usage.</p>
          <p className="mb-4">You can control cookie preferences through your browser settings.</p>
          <p className="mb-4">Third-party services used on the site may also set their own cookies.</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
