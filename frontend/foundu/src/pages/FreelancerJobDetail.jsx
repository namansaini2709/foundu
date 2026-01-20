import { useNavigate, useSearchParams } from 'react-router-dom'
import { DollarSign, Clock, MapPin, Briefcase, CheckCircle, ArrowLeft } from 'lucide-react'

// Gradient styles - same as HomePage
const gradientBlackToBlue = {
  background: 'linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)'
}

function FreelancerJobDetail() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const jobId = searchParams.get('id')

  // Dummy job data (in real app, this would come from API/state)
  const jobDetails = {
    1: {
      logo: 'FD',
      name: 'Frontend Developer',
      stipend: '$3,500',
      level: 'Mid Level',
      type: 'Remote',
      match: 95,
      details: 'We are seeking a talented Frontend Developer to join our dynamic team. You will be responsible for building responsive web applications using React and Next.js, working closely with our design team to create beautiful user interfaces, and ensuring optimal performance across all devices.',
      requirements: [
        '3+ years of experience in React and Next.js',
        'Strong knowledge of JavaScript, HTML, and CSS',
        'Experience with TypeScript',
        'Familiarity with Git version control',
        'Understanding of RESTful APIs',
        'Experience with responsive design',
        'Strong problem-solving skills',
        'Good communication skills'
      ]
    },
    2: {
      logo: 'UX',
      name: 'UI/UX Designer',
      stipend: '$2,800',
      level: 'Mid Level',
      type: 'Contract',
      match: 88,
      details: 'Join our creative team as a UI/UX Designer and help create stunning user interfaces for mobile and web platforms. You will work on innovative design projects, collaborate with developers, and contribute to our product design strategy.',
      requirements: [
        '4+ years of UI/UX design experience',
        'Proficiency in Figma, Adobe XD, or Sketch',
        'Strong portfolio showcasing mobile and web designs',
        'Understanding of user research and testing',
        'Knowledge of design systems and components',
        'Experience with prototyping tools',
        'Strong visual design skills',
        'Ability to work in a fast-paced environment'
      ]
    },
    3: {
      logo: 'MA',
      name: 'Mobile App Developer',
      stipend: '$4,200',
      level: 'Senior Level',
      type: 'Remote',
      match: 92,
      details: 'We are looking for an experienced Mobile App Developer to develop cross-platform mobile apps using React Native. You will be working on cutting-edge mobile applications that serve thousands of users daily.',
      requirements: [
        '5+ years of mobile development experience',
        'Expert knowledge of React Native',
        'Experience with iOS and Android development',
        'Knowledge of native modules integration',
        'Understanding of app store deployment',
        'Experience with state management (Redux, MobX)',
        'Strong debugging and testing skills',
        'Experience with CI/CD pipelines'
      ]
    },
    4: {
      logo: 'AI',
      name: 'AI/ML Engineer',
      stipend: '$5,500',
      level: 'Senior Level',
      type: 'Full-time',
      match: 87,
      details: 'Join our AI team to design and implement machine learning models for startups. You will work on challenging problems, develop ML solutions, and help shape the future of AI-powered products.',
      requirements: [
        'Master\'s degree in Computer Science or related field',
        '5+ years of ML/AI experience',
        'Proficiency in Python and ML frameworks (TensorFlow, PyTorch)',
        'Experience with NLP and computer vision',
        'Strong mathematical and statistical background',
        'Experience with cloud ML platforms (AWS, GCP)',
        'Published research papers (preferred)',
        'Strong problem-solving abilities'
      ]
    },
    5: {
      logo: 'DA',
      name: 'Data Analyst',
      stipend: '$2,500',
      level: 'Mid Level',
      type: 'Part-time',
      match: 90,
      details: 'We need a skilled Data Analyst to analyze business data and create insightful visualizations. You will help drive data-driven decisions and provide actionable insights to stakeholders.',
      requirements: [
        '3+ years of data analysis experience',
        'Proficiency in SQL and Python',
        'Experience with data visualization tools (Tableau, Power BI)',
        'Strong Excel and spreadsheet skills',
        'Understanding of statistical analysis',
        'Experience with data cleaning and preprocessing',
        'Strong analytical thinking',
        'Excellent communication skills'
      ]
    }
  }

  const job = jobDetails[jobId] || jobDetails[1]

  // Navbar Component
  const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 opacity-100" style={gradientBlackToBlue}>
      <div className="bg-black/20 backdrop-blur-md border-b border-blue-700/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/freelancer-jobs')}>
            <span className="text-2xl font-bold text-blue-300">F</span>
            <span className="text-xl font-bold text-white ml-1">OUNDU</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">Hire Freelancer</a>
            <a href="/" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">Find Best Match</a>
            <a href="/" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">For Startups</a>
            <a href="/" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">About Us</a>
          </div>
          <button 
            onClick={() => navigate('/freelancer-jobs')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    </nav>
  )

  // Footer Component
  const Footer = () => (
    <footer className="relative py-16 px-4" style={gradientBlackToBlue}>
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-12 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold text-white">F</span>
                <span className="text-white text-2xl font-bold ml-2">OUNDU</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                The central platform for startups to discover, connect, and collaborate with skilled freelancers and co-founders. AI-powered matching, instant connections.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-white/80 text-sm">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  foundu@example.com
                </li>
                <li className="flex items-center text-white/80 text-sm">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +1 (555) 123-4567
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">About Us</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Our Team</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">FAQ</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">For Startups</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Browse Talent</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Create Profile</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Post Gig</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Explore Community</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Partner With Us</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-6xl md:text-8xl font-bold text-white/10 mb-6">FOUNDU</div>
          <div className="flex justify-center gap-8 mb-6">
            <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Terms of Service</a>
            <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Cookie Policy</a>
          </div>
          <div className="text-white/60 text-sm">
            © 2025 Foundu, All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )

  return (
    <div className="min-h-screen" style={gradientBlackToBlue}>
      <Navbar />
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <section className="pt-32 pb-16 px-4 relative z-10">
        <div className="w-[85vw] mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/freelancer-jobs')}
            className="flex items-center gap-2 text-blue-300 hover:text-blue-400 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Jobs</span>
          </button>

          {/* Main Content Container */}
          <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-white/30 rounded-3xl p-8 md:p-12 shadow-2xl relative">
            {/* Header Section */}
            <div className="flex items-start gap-6 mb-8 pb-8 border-b border-white/20">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/40 to-blue-600/40 rounded-xl flex items-center justify-center border-2 border-blue-400/60 shadow-lg shadow-blue-400/20 flex-shrink-0">
                <span className="text-3xl font-bold text-blue-200">{job.logo}</span>
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{job.name}</h1>
                
                {/* Job Details Row */}
                <div className="flex flex-wrap gap-6 items-center">
                  <div className="flex items-center gap-2 text-blue-300">
                    <DollarSign className="w-5 h-5" />
                    <span className="font-semibold text-lg">{job.stipend}</span>
                    <span className="text-gray-400 text-sm">/month</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-blue-300">
                    <Briefcase className="w-5 h-5" />
                    <span className="font-medium">{job.level}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-blue-300">
                    <Briefcase className="w-5 h-5" />
                    <span className="font-medium">{job.type}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply Now Button */}
            <div className="absolute top-6 right-4">
              <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-bold text-base transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Apply Now
              </button>
            </div>

            {/* Startup Details Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-blue-400 rounded-full"></div>
                Startup Details
              </h2>
              <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-blue-700/30">
                <p className="text-gray-300 leading-relaxed text-base">TechNova Solutions is a cutting-edge startup focused on innovative software solutions. Founded in 2020, we're a team of passionate developers and designers building the future of digital experiences. Located in San Francisco, CA, we offer a dynamic work environment with opportunities for growth and creativity.</p>
              </div>
            </div>

            {/* Job Description Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-blue-400 rounded-full"></div>
                Job Description
              </h2>
              <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-blue-700/30">
                <p className="text-gray-300 leading-relaxed text-base">{job.details}</p>
              </div>
            </div>

            {/* Requirements Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-blue-400 rounded-full"></div>
                Requirements
              </h2>
              <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-blue-700/30">
                <ul className="space-y-3">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 leading-relaxed">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}

export default FreelancerJobDetail;

