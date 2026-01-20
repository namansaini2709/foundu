import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const gradientBlackToBlue = {
  background: 'linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)'
};

const CoFounderJobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Sample data - in real app, this would be fetched based on ID
  const jobDetails = {
    1: {
      startupName: 'TechVenture',
      logo: '🚀',
      salary: '$8,000 - $15,000',
      experienceLevel: 'Intermediate',
      location: 'Remote',
      about: 'We are building the next generation of AI-powered solutions for enterprise clients. Our platform helps businesses automate complex workflows and make data-driven decisions. We are looking for passionate co-founders who share our vision of transforming how businesses operate.',
      jobDescription: 'We are looking for an experienced co-founder to join our innovative team. You will be responsible for leading technical development and strategic decisions. Your role will involve working on both frontend and backend systems, ensuring high performance and scalability of our platform.',
      responsibilities: [
        'Lead technical architecture and development decisions',
        'Build scalable and maintainable systems for enterprise clients',
        'Collaborate with the founding team on product strategy',
        'Hire and manage the technical team as we grow',
        'Ensure high code quality and best practices',
        'Participate in fundraising and investor meetings',
        'Translate business requirements into technical solutions',
      ],
      requirements: [
        '5+ years of experience in full stack development',
        'Strong background in AI/ML technologies',
        'Experience with cloud infrastructure (AWS, Azure, GCP)',
        'Proven track record of building scalable applications',
        'Excellent leadership and communication skills',
        'Entrepreneurial mindset and passion for startups',
        'Ability to work in a fast-paced environment',
      ],
    },
    2: {
      startupName: 'InnovateLab',
      logo: '💡',
      salary: '$6,000 - $12,000',
      experienceLevel: 'Senior',
      location: 'Hybrid',
      about: 'Revolutionizing the healthcare industry with cutting-edge telemedicine solutions. We connect patients with doctors seamlessly through our innovative platform. Join us in making healthcare accessible to everyone.',
      jobDescription: 'We are seeking a co-founder with deep expertise in healthcare technology and product development. You will play a crucial role in shaping our product roadmap and building solutions that improve patient outcomes.',
      responsibilities: [
        'Develop and execute product strategy',
        'Build telemedicine platform features',
        'Ensure HIPAA compliance and security',
        'Work with healthcare providers and stakeholders',
        'Lead product development team',
        'Participate in regulatory discussions',
      ],
      requirements: [
        '7+ years in healthcare technology',
        'Experience with telemedicine platforms',
        'Knowledge of healthcare regulations',
        'Strong product management skills',
        'Background in healthcare or medical field preferred',
      ],
    },
    3: {
      startupName: 'DataFlow',
      logo: '🌟',
      salary: '$7,000 - $14,000',
      experienceLevel: 'Intermediate',
      location: 'Remote',
      about: 'Transforming how businesses handle big data with our cloud-native analytics platform. We make complex data analysis simple and accessible for everyone. Join us in democratizing data analytics.',
      jobDescription: 'We are looking for a co-founder who can lead our technical team and help build a world-class data analytics platform. You will work on cutting-edge technologies and solve complex data challenges.',
      responsibilities: [
        'Design and implement scalable data processing systems',
        'Build intuitive analytics dashboards',
        'Lead the engineering team',
        'Work with data scientists and analysts',
        'Ensure platform reliability and performance',
        'Participate in product strategy discussions',
      ],
      requirements: [
        '6+ years in data engineering or analytics',
        'Experience with big data technologies (Spark, Hadoop)',
        'Strong background in cloud platforms',
        'Knowledge of data visualization tools',
        'Excellent problem-solving skills',
      ],
    },
    4: {
      startupName: 'GreenTech Solutions',
      logo: '⚡',
      salary: '$5,000 - $10,000',
      experienceLevel: 'Entry',
      location: 'Hybrid',
      about: 'Leading the charge in sustainable technology solutions. We develop eco-friendly software and hardware products that help reduce carbon footprint. Be part of the green revolution.',
      jobDescription: 'Join us as a co-founder to build sustainable technology solutions. You will help shape our product vision and lead development of eco-friendly tech products.',
      responsibilities: [
        'Develop sustainable technology solutions',
        'Lead product development initiatives',
        'Build partnerships with green tech organizations',
        'Ensure products meet sustainability standards',
        'Lead technical team',
        'Participate in sustainability initiatives',
      ],
      requirements: [
        '4+ years in software or hardware development',
        'Passion for sustainability and green technology',
        'Experience with IoT or hardware preferred',
        'Strong technical and leadership skills',
        'Commitment to environmental causes',
      ],
    },
    5: {
      startupName: 'FinTech Pro',
      logo: '🎯',
      salary: '$9,000 - $18,000',
      experienceLevel: 'Senior',
      location: 'Remote',
      about: 'Disrupting the financial services industry with blockchain technology and AI. Our platform enables secure, fast, and transparent financial transactions. Join the fintech revolution.',
      jobDescription: 'We are seeking an experienced co-founder to lead our technical development in the fintech space. You will work on cutting-edge blockchain and AI technologies.',
      responsibilities: [
        'Lead blockchain and AI development',
        'Ensure security and compliance in financial systems',
        'Build scalable fintech platform',
        'Work with financial institutions',
        'Lead technical team',
        'Participate in regulatory compliance',
      ],
      requirements: [
        '8+ years in fintech or financial services',
        'Experience with blockchain technology',
        'Knowledge of financial regulations',
        'Strong security and compliance background',
        'Experience with payment systems',
      ],
    },
    6: {
      startupName: 'CloudSync',
      logo: '🔷',
      salary: '$6,000 - $12,000',
      experienceLevel: 'Intermediate',
      location: 'Remote',
      about: 'Enterprise cloud solutions provider helping businesses migrate to the cloud seamlessly. We offer comprehensive cloud consulting and implementation services.',
      jobDescription: 'Join us as a co-founder to help businesses transform through cloud technology. You will lead technical initiatives and build cloud migration solutions.',
      responsibilities: [
        'Lead cloud architecture and migration projects',
        'Build cloud-native applications',
        'Work with enterprise clients',
        'Lead technical consulting team',
        'Ensure cloud security and best practices',
        'Participate in client meetings and presentations',
      ],
      requirements: [
        '5+ years in cloud computing',
        'Experience with AWS, Azure, or GCP',
        'Strong consulting and client-facing skills',
        'Knowledge of cloud migration strategies',
        'Excellent communication skills',
      ],
    },
    7: {
      startupName: 'MarketPlace Hub',
      logo: '🔶',
      salary: '$5,000 - $11,000',
      experienceLevel: 'Intermediate',
      location: 'Hybrid',
      about: 'Creating the largest B2B marketplace for small businesses. Our platform connects suppliers with buyers, making commerce easier and more efficient.',
      jobDescription: 'We are looking for a co-founder to help build our B2B marketplace platform. You will work on creating seamless connections between businesses.',
      responsibilities: [
        'Build marketplace platform features',
        'Develop matching and recommendation algorithms',
        'Lead technical team',
        'Work on payment and transaction systems',
        'Ensure platform scalability',
        'Participate in business development',
      ],
      requirements: [
        '5+ years in e-commerce or marketplace development',
        'Experience with payment systems',
        'Knowledge of recommendation algorithms',
        'Strong full-stack development skills',
        'Understanding of B2B commerce',
      ],
    },
    8: {
      startupName: 'EduTech Innovations',
      logo: '🔴',
      salary: '$4,000 - $9,000',
      experienceLevel: 'Entry',
      location: 'Remote',
      about: 'Transforming education through technology. We build learning platforms that make education accessible, engaging, and effective for students worldwide.',
      jobDescription: 'Join us as a co-founder to revolutionize education. You will help build learning platforms that make quality education accessible to everyone.',
      responsibilities: [
        'Develop educational technology platforms',
        'Build engaging learning experiences',
        'Work with educators and institutions',
        'Lead product development',
        'Ensure platform accessibility',
        'Participate in educational initiatives',
      ],
      requirements: [
        '4+ years in edtech or education technology',
        'Passion for education and learning',
        'Experience with learning management systems',
        'Strong product development skills',
        'Understanding of educational needs',
      ],
    },
    9: {
      startupName: 'HealthConnect',
      logo: '🟢',
      salary: '$7,000 - $13,000',
      experienceLevel: 'Intermediate',
      location: 'Hybrid',
      about: 'Connecting healthcare providers with patients through innovative digital solutions. We streamline healthcare delivery and improve patient outcomes.',
      jobDescription: 'We are seeking a co-founder to help build digital healthcare solutions. You will work on connecting patients with healthcare providers seamlessly.',
      responsibilities: [
        'Develop healthcare platform features',
        'Ensure HIPAA compliance',
        'Work with healthcare providers',
        'Build patient engagement tools',
        'Lead technical development',
        'Participate in healthcare partnerships',
      ],
      requirements: [
        '6+ years in healthcare technology',
        'Knowledge of healthcare regulations',
        'Experience with healthcare systems',
        'Strong security and compliance background',
        'Understanding of healthcare workflows',
      ],
    },
    10: {
      startupName: 'RetailMax',
      logo: '🟡',
      salary: '$5,500 - $10,000',
      experienceLevel: 'Intermediate',
      location: 'Remote',
      about: 'Empowering retailers with AI-driven inventory management and customer analytics. We help retail businesses optimize operations and increase sales.',
      jobDescription: 'Join us as a co-founder to transform retail operations. You will help build AI-powered solutions for inventory management and customer analytics.',
      responsibilities: [
        'Develop AI-powered retail solutions',
        'Build inventory management systems',
        'Create customer analytics tools',
        'Work with retail businesses',
        'Lead technical team',
        'Participate in retail partnerships',
      ],
      requirements: [
        '5+ years in retail technology or e-commerce',
        'Experience with AI/ML applications',
        'Knowledge of inventory management',
        'Understanding of retail operations',
        'Strong analytical skills',
      ],
    },
  };

  const job = jobDetails[id] || jobDetails[1];

  return (
    <div className="min-h-screen flex flex-col" style={gradientBlackToBlue}>
      <Navbar />

      <div className="pt-24 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Jobs Link */}
          <button
            onClick={() => navigate('/cofounder-jobs')}
            className="text-blue-300 hover:text-blue-200 mb-6 flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Jobs
          </button>

          {/* Main Container */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 border border-blue-700/30">
            {/* Header with Apply Button */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-green-500/20 rounded-lg flex items-center justify-center text-3xl mr-4 border border-green-500/30">
                    {job.logo}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">{job.startupName}</h1>
                </div>
              </div>
              <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mt-4 md:mt-0">
                Apply Now
              </button>
            </div>

            {/* Key Details */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2 text-white">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">{job.salary}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-semibold">{job.experienceLevel}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-semibold">{job.location}</span>
              </div>
            </div>

            {/* About Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">About {job.startupName}</h2>
              <p className="text-gray-300 leading-relaxed">{job.about}</p>
            </div>

            {/* Job Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Job Description</h2>
              <p className="text-gray-300 leading-relaxed mb-4">{job.jobDescription}</p>
            </div>

            {/* Responsibilities */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Responsibilities</h2>
              <ul className="space-y-3">
                {job.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300">
                    <span className="text-green-400 mt-1">•</span>
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Requirements</h2>
              <ul className="space-y-3">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300">
                    <span className="text-green-400 mt-1">•</span>
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Apply Button at Bottom */}
            <div className="pt-6 border-t border-blue-700/30">
              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CoFounderJobDetail;

