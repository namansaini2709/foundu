import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const gradientBlackToBlue = {
  background: 'linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)'
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col pt-20" style={gradientBlackToBlue}>
      <Navbar />
      <div className="flex-grow flex flex-col items-center w-full z-10 px-4">
        <h1 className="text-4xl font-bold text-white mb-8 mt-10">Terms of Service</h1>
        <div
          style={{ width: '85%', backgroundColor: 'rgba(255,255,255,0.85)' }}
          className="p-8 rounded-xl shadow-lg backdrop-blur-sm"
        >
          <p className="mb-4">By using our service, you agree to these Terms of Service.</p>
          <p className="mb-4">Use the platform responsibly. Respect other users and follow applicable laws.</p>
          <p className="mb-4">We may update these terms; continued use means you accept changes.</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
