import { useParams, useNavigate } from "react-router-dom";
import {
  DollarSign,
  Briefcase,
  MapPin,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Gradient styles - same as HomePage
const gradientBlackToBlue = {
  background:
    "linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)",
};

function CoFounderJobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Job data keyed by id
  const jobDetails = {
    1: {
      logo: "TV",
      startupName: "TechVenture",
      salary: "$8,000 - $15,000",
      experienceLevel: "Intermediate",
      location: "Remote",
      about:
        "We are building the next generation of AI-powered solutions for enterprise clients. Our platform helps businesses automate complex workflows and make data-driven decisions. We are looking for passionate co-founders who share our vision of transforming how businesses operate.",
      jobDescription:
        "We are looking for an experienced co-founder to join our innovative team. You will be responsible for leading technical development and strategic decisions. Your role will involve working on both frontend and backend systems, ensuring high performance and scalability of our platform.",
      responsibilities: [
        "Lead technical architecture and development decisions",
        "Build scalable and maintainable systems for enterprise clients",
        "Collaborate with the founding team on product strategy",
        "Hire and manage the technical team as we grow",
        "Ensure high code quality and best practices",
        "Participate in fundraising and investor meetings",
        "Translate business requirements into technical solutions",
      ],
      requirements: [
        "5+ years of experience in full stack development",
        "Strong background in AI/ML technologies",
        "Experience with cloud infrastructure (AWS, Azure, GCP)",
        "Proven track record of building scalable applications",
        "Excellent leadership and communication skills",
        "Entrepreneurial mindset and passion for startups",
        "Ability to work in a fast-paced environment",
      ],
    },
    2: {
      logo: "IL",
      startupName: "InnovateLab",
      salary: "$6,000 - $12,000",
      experienceLevel: "Senior",
      location: "Hybrid",
      about:
        "Revolutionizing the healthcare industry with cutting-edge telemedicine solutions. We connect patients with doctors seamlessly through our innovative platform. Join us in making healthcare accessible to everyone.",
      jobDescription:
        "We are seeking a co-founder with deep expertise in healthcare technology and product development. You will play a crucial role in shaping our product roadmap and building solutions that improve patient outcomes.",
      responsibilities: [
        "Develop and execute product strategy",
        "Build telemedicine platform features",
        "Ensure HIPAA compliance and security",
        "Work with healthcare providers and stakeholders",
        "Lead product development team",
        "Participate in regulatory discussions",
      ],
      requirements: [
        "7+ years in healthcare technology",
        "Experience with telemedicine platforms",
        "Knowledge of healthcare regulations",
        "Strong product management skills",
        "Background in healthcare or medical field preferred",
      ],
    },
    3: {
      logo: "DF",
      startupName: "DataFlow",
      salary: "$7,000 - $14,000",
      experienceLevel: "Intermediate",
      location: "Remote",
      about:
        "Transforming how businesses handle big data with our cloud-native analytics platform. We make complex data analysis simple and accessible for everyone. Join us in democratizing data analytics.",
      jobDescription:
        "We are looking for a co-founder who can lead our technical team and help build a world-class data analytics platform. You will work on cutting-edge technologies and solve complex data challenges.",
      responsibilities: [
        "Design and implement scalable data processing systems",
        "Build intuitive analytics dashboards",
        "Lead the engineering team",
        "Work with data scientists and analysts",
        "Ensure platform reliability and performance",
        "Participate in product strategy discussions",
      ],
      requirements: [
        "6+ years in data engineering or analytics",
        "Experience with big data technologies (Spark, Hadoop)",
        "Strong background in cloud platforms",
        "Knowledge of data visualization tools",
        "Excellent problem-solving skills",
      ],
    },
    4: {
      logo: "GT",
      startupName: "GreenTech Solutions",
      salary: "$5,000 - $10,000",
      experienceLevel: "Entry",
      location: "Hybrid",
      about:
        "Leading the charge in sustainable technology solutions. We develop eco-friendly software and hardware products that help reduce carbon footprint. Be part of the green revolution.",
      jobDescription:
        "Join us as a co-founder to build sustainable technology solutions. You will help shape our product vision and lead development of eco-friendly tech products.",
      responsibilities: [
        "Develop sustainable technology solutions",
        "Lead product development initiatives",
        "Build partnerships with green tech organizations",
        "Ensure products meet sustainability standards",
        "Lead technical team",
        "Participate in sustainability initiatives",
      ],
      requirements: [
        "4+ years in software or hardware development",
        "Passion for sustainability and green technology",
        "Experience with IoT or hardware preferred",
        "Strong technical and leadership skills",
        "Commitment to environmental causes",
      ],
    },
    5: {
      logo: "FP",
      startupName: "FinTech Pro",
      salary: "$9,000 - $18,000",
      experienceLevel: "Senior",
      location: "Remote",
      about:
        "Disrupting the financial services industry with blockchain technology and AI. Our platform enables secure, fast, and transparent financial transactions. Join the fintech revolution.",
      jobDescription:
        "We are seeking an experienced co-founder to lead our technical development in the fintech space. You will work on cutting-edge blockchain and AI technologies.",
      responsibilities: [
        "Lead blockchain and AI development",
        "Ensure security and compliance in financial systems",
        "Build scalable fintech platform",
        "Work with financial institutions",
        "Lead technical team",
        "Participate in regulatory compliance",
      ],
      requirements: [
        "8+ years in fintech or financial services",
        "Experience with blockchain technology",
        "Knowledge of financial regulations",
        "Strong security and compliance background",
        "Experience with payment systems",
      ],
    },
    6: {
      logo: "CS",
      startupName: "CloudSync",
      salary: "$6,000 - $12,000",
      experienceLevel: "Intermediate",
      location: "Remote",
      about:
        "Enterprise cloud solutions provider helping businesses migrate to the cloud seamlessly. We offer comprehensive cloud consulting and implementation services.",
      jobDescription:
        "Join us as a co-founder to help businesses transform through cloud technology. You will lead technical initiatives and build cloud migration solutions.",
      responsibilities: [
        "Lead cloud architecture and migration projects",
        "Build cloud-native applications",
        "Work with enterprise clients",
        "Lead technical consulting team",
        "Ensure cloud security and best practices",
        "Participate in client meetings and presentations",
      ],
      requirements: [
        "5+ years in cloud computing",
        "Experience with AWS, Azure, or GCP",
        "Strong consulting and client-facing skills",
        "Knowledge of cloud migration strategies",
        "Excellent communication skills",
      ],
    },
    7: {
      logo: "MH",
      startupName: "MarketPlace Hub",
      salary: "$5,500 - $11,000",
      experienceLevel: "Intermediate",
      location: "Hybrid",
      about:
        "Creating the largest B2B marketplace for small businesses. Our platform connects suppliers with buyers, making commerce easier and more efficient.",
      jobDescription:
        "We are looking for a co-founder to help build and scale our B2B marketplace platform. You will work on product growth, technical architecture, and partnerships.",
      responsibilities: [
        "Build and scale the marketplace platform",
        "Define product strategy and roadmap",
        "Develop supplier and buyer onboarding flows",
        "Grow partnerships with small businesses",
        "Lead engineering and product teams",
        "Participate in fundraising and growth strategy",
      ],
      requirements: [
        "5+ years in marketplace or e-commerce platforms",
        "Experience with product-led growth",
        "Strong understanding of B2B dynamics",
        "Technical and entrepreneurial mindset",
        "Excellent networking and partnership skills",
      ],
    },
    8: {
      logo: "EI",
      startupName: "EduTech Innovations",
      salary: "$5,000 - $9,000",
      experienceLevel: "Entry",
      location: "Remote",
      about:
        "Transforming education through technology. We build learning platforms that make education accessible, engaging, and effective for students worldwide.",
      jobDescription:
        "Join us as a co-founder to revolutionize how students learn. You will lead technical development of our adaptive learning platform and help shape our education strategy.",
      responsibilities: [
        "Build adaptive learning platform features",
        "Lead edtech product development",
        "Partner with schools and institutions",
        "Ensure accessibility and inclusivity",
        "Lead engineering team",
        "Participate in curriculum and content strategy",
      ],
      requirements: [
        "4+ years in edtech or consumer apps",
        "Passion for education and accessibility",
        "Experience with mobile and web platforms",
        "Strong UX and product instincts",
        "Ability to work with educators and students",
      ],
    },
    9: {
      logo: "HC",
      startupName: "HealthConnect",
      salary: "$6,500 - $13,000",
      experienceLevel: "Senior",
      location: "Hybrid",
      about:
        "Connecting healthcare providers with patients through innovative digital solutions. We streamline healthcare delivery and improve patient outcomes.",
      jobDescription:
        "We are seeking a co-founder to help build digital healthcare solutions. You will work on connecting patients with healthcare providers seamlessly.",
      responsibilities: [
        "Develop healthcare platform features",
        "Ensure HIPAA compliance",
        "Work with healthcare providers",
        "Build patient engagement tools",
        "Lead technical development",
        "Participate in healthcare partnerships",
      ],
      requirements: [
        "6+ years in healthcare technology",
        "Knowledge of healthcare regulations",
        "Experience with healthcare systems",
        "Strong security and compliance background",
        "Understanding of healthcare workflows",
      ],
    },
    10: {
      logo: "RM",
      startupName: "RetailMax",
      salary: "$5,500 - $10,000",
      experienceLevel: "Intermediate",
      location: "Remote",
      about:
        "Empowering retailers with AI-driven inventory management and customer analytics. We help retail businesses optimize operations and increase sales.",
      jobDescription:
        "Join us as a co-founder to transform retail operations. You will help build AI-powered solutions for inventory management and customer analytics.",
      responsibilities: [
        "Develop AI-powered retail solutions",
        "Build inventory management systems",
        "Create customer analytics tools",
        "Work with retail businesses",
        "Lead technical team",
        "Participate in retail partnerships",
      ],
      requirements: [
        "5+ years in retail technology or e-commerce",
        "Experience with AI/ML applications",
        "Knowledge of inventory management",
        "Understanding of retail operations",
        "Strong analytical skills",
      ],
    },
  };

  const job = jobDetails[id] || jobDetails[1];

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
            onClick={() => navigate("/cofounder-jobs")}
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
                <span className="text-3xl font-bold text-blue-200">
                  {job.logo}
                </span>
              </div>

              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {job.startupName}
                </h1>

                {/* Job Details Row */}
                <div className="flex flex-wrap gap-6 items-center">
                  <div className="flex items-center gap-2 text-blue-300">
                    <DollarSign className="w-5 h-5" />
                    <span className="font-semibold text-lg">{job.salary}</span>
                    <span className="text-gray-400 text-sm">/month</span>
                  </div>

                  <div className="flex items-center gap-2 text-blue-300">
                    <Briefcase className="w-5 h-5" />
                    <span className="font-medium">{job.experienceLevel}</span>
                  </div>

                  <div className="flex items-center gap-2 text-blue-300">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">{job.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Show Interest Button - Top Right */}
            <div className="absolute top-6 right-4">
              <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-bold text-base transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Show Interest
              </button>
            </div>

            {/* About Startup Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-blue-400 rounded-full"></div>
                About {job.startupName}
              </h2>
              <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-blue-700/30">
                <p className="text-gray-300 leading-relaxed text-base">
                  {job.about}
                </p>
              </div>
            </div>

            {/* Job Description Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-blue-400 rounded-full"></div>
                Job Description
              </h2>
              <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-blue-700/30">
                <p className="text-gray-300 leading-relaxed text-base">
                  {job.jobDescription}
                </p>
              </div>
            </div>

            {/* Responsibilities Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-blue-400 rounded-full"></div>
                Responsibilities
              </h2>
              <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-blue-700/30">
                <ul className="space-y-3">
                  {job.responsibilities.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
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
                      <span className="text-gray-300 leading-relaxed">
                        {requirement}
                      </span>
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
  );
}

export default CoFounderJobDetail;