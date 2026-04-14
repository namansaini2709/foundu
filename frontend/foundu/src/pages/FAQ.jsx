import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQ_DATA = [
    {
        section: "SECTION 1 — THE BIG PICTURE",
        items: [
            { q: "What is FoundU?", a: "India’s first AI-powered Startup Universe. Find co-founders, freelancers, influencers, or let our AI generate a business opportunity for you. Every match is Credibility Scored so you only meet people worth your time." },
            { q: "Why does FoundU exist?", a: "Because startups fail due to bad teams, not bad ideas. We replace scattered tools like LinkedIn and WhatsApp with a dedicated ecosystem built strictly for startup formation and execution." },
            { q: "How is it different from LinkedIn or Upwork?", a: "LinkedIn is for jobs. Upwork is for freelance transactions. FoundU is for building startups. We use AI compatibility matching and real execution-based Credibility Scores to combine all your startup needs in one place." },
            { q: "Who is FoundU built for?", a: "Founders needing a team, co-founders seeking serious ventures, freelancers wanting 0% commission gigs, influencers wanting direct brand deals, and ambitious people who need an AI-validated business idea to get started." },
            { q: "Is FoundU only for tech startups?", a: "No. D2C, SaaS, services, content—if you are building a serious business, FoundU is for you." },
            { q: "Is FoundU free to use?", a: "The core platform is free. Advanced features are freemium, but the first 100 users in each category get permanent free premium access as Founding Members." }
        ]
    },
    {
        section: "SECTION 2 — FOR FOUNDERS",
        items: [
            { q: "I already have an idea. How does FoundU help me?", a: "First, our AI validates your idea with a data-backed probability score. Second, it matches you with compatible co-founders and talent. Third, it gives you \"Startup Portals\"—plug-and-play tools to execute from day one." },
            { q: "What if I don’t have a startup idea yet?", a: "Use the Opportunity Engine. Enter your skills and city, and our AI generates a personalized, data-backed business idea, an execution roadmap, and the exact team you need to build it." },
            { q: "How does the AI find my co-founder?", a: "We use a 12-dimension \"Startup DNA\" profile. We match based on working style, risk appetite, and vision—not just overlapping skills. You get a plain-language explanation of exactly why you're a match." },
            { q: "What is the Credibility Score?", a: "A trust metric based on actual execution history—completion rates, delivery, and peer feedback. Stop guessing; make decisions based on hard evidence." },
            { q: "What is the Trial Sprint Generator?", a: "A structured 2-week paid test project to evaluate working dynamics before you hand over equity or merge work lives. Test the relationship with real data, not hope." },
            { q: "How is this different from Googling my idea?", a: "Google gives scattered articles. FoundU gives a structured business intelligence report based on real market demand, competitor analysis, and customer pain points." },
            { q: "Can I find freelancers and vendors here too?", a: "Yes. You can find AI-matched freelancers, verified vendors, and targeted influencers—all Credibility Scored for your specific startup stage." },
            { q: "I’ve wasted months on other platforms. Why is this different?", a: "1) Compatibility-based matching, not keyword matching. 2) Verified execution histories eliminate time-wasters. 3) Trial Sprints let you test commitment before signing anything." }
        ]
    },
    {
        section: "SECTION 3 — FOR CO-FOUNDERS",
        items: [
            { q: "What exactly does “co-founder” mean on FoundU?", a: "You are joining an early-stage startup as a founding partner for equity and ownership, not just exchanging time for a salary. You are a builder, not an employee." },
            { q: "How do I know the founders are serious?", a: "You see their Credibility Score, their real availability, their MVP status, and their track record before you engage. The days of committing to a slide-deck dreamer are over." },
            { q: "Why will my next startup succeed here?", a: "Because you're matched on the metrics that actually predict success: risk appetite, decision-making styles, and vision alignment." },
            { q: "Do I need to leave my current job?", a: "No. State your true availability (part-time or full-time) on your profile, and you'll match with founders whose timeline aligns with your reality." },
            { q: "What if I have an idea but need a partner?", a: "You can be a founder and a co-founder seeker simultaneously. We validate your idea and match you with the complementary talent needed to build it." },
            { q: "How do I get the best matches?", a: "Total honesty. Be real about your hours, equity expectations, past projects, and the type of founder you absolutely cannot work with." }
        ]
    },
    {
        section: "SECTION 4 — FOR FREELANCERS",
        items: [
            { q: "How is FoundU different from Upwork or Fiverr?", a: "No bidding wars, no meaningless 5-star ratings, and 0% commission on your first projects. The AI matches you directly with vetted startups that need your exact skill." },
            { q: "What is the Freelancer Credibility Score?", a: "A percentile rating based on your actual platform performance (on-time delivery, client retention). Become a vetted professional founders are waiting for, not a cheap commodity." },
            { q: "What does “0% commission” mean? Is there a catch?", a: "No catch. Every rupee the startup pays goes to you. This is a permanent, contractual perk for the first 100 founding freelancers on their first projects." },
            { q: "What kind of startups will I work with?", a: "Startups are Credibility Scored too. You see their payment history and peer feedback before accepting a gig. No more ghosting or late invoices." },
            { q: "Can I join without a massive track record?", a: "Yes. You get a baseline score based on your profile, and you can build it rapidly by taking on structured, short-term Trial Sprints." },
            { q: "Will I get matched with random, irrelevant startups?", a: "No. The AI factors in your domain relevance. A fintech writer won't be matched with a food delivery brand." },
            { q: "How do I get paid?", a: "Through a 100% secure escrow system. Founders deposit upfront; payment releases on completion." }
        ]
    },
    {
        section: "SECTION 5 — FOR INFLUENCERS",
        items: [
            { q: "What does FoundU offer influencers?", a: "1) AI matches your exact audience with a startup's target customer. 2) Zero agency commission cuts. 3) A Verified Badge system based on actual performance." },
            { q: "Do I need a huge following?", a: "No. Startups want trust, not just reach. Micro-influencers with highly engaged niches get some of the best matches on the platform." },
            { q: "How does the matching work?", a: "We cross-reference your content niche and audience demographics directly with a founder's target customer profile. You never have to promote an awkward, irrelevant product again." },
            { q: "What is the “Featured in Campaigns” benefit?", a: "The first 100 influencers get featured in FoundU's own marketing, putting your profile directly in front of startup founders." },
            { q: "How is this different from an agency?", a: "Agencies take a 30-40% cut and control the relationship. Here, you negotiate directly with founders and keep 100%." },
            { q: "What kind of deals will I get?", a: "Product collabs, sponsorships, and ambassadorships with real, vetted businesses that treat creators as partners, not ad inventory." },
            { q: "Do I need to be a business/startup influencer?", a: "No. Startups exist in every sector—fashion, tech, fitness, comedy. If you have an audience, a startup wants to reach them." }
        ]
    },
    {
        section: "SECTION 6 — THE AI AND TECHNOLOGY",
        items: [
            { q: "Can AI really match compatibility?", a: "Yes. We use advanced LLM embeddings to convert your \"Startup DNA\" into a high-dimensional vector. We match you on how you think and work—similar to Netflix's algorithm, but for human synergy." },
            { q: "Is my data safe?", a: "Yes. Fully encrypted, never sold, and compliant with India’s DPDP Act 2023. You control what is visible." },
            { q: "How does the idea validation work?", a: "The AI runs your idea against search demand, competitor data, and market gaps to give you a real probability score and a recommended execution path." },
            { q: "What is the Opportunity Engine?", a: "It analyzes your skills against ecosystem data and market gaps to surface the startup opportunity you are uniquely positioned to win." }
        ]
    },
    {
        section: "SECTION 7 — GETTING STARTED",
        items: [
            { q: "How long does it take to set up?", a: "Under 4 minutes. It feels like a personality assessment, not a job application." },
            { q: "When do I get my first match?", a: "Instantly. You’ll see your first three AI-generated matches the moment you finish onboarding." },
            { q: "What if I don’t like my matches?", a: "Request a rematch. The AI learns from your feedback and gets smarter with every recommendation." },
            { q: "What is a Founding Member?", a: "The first 100 users in each category get permanent premium features, a VIP badge, and direct input on our product roadmap. Once 100 is hit, it closes forever." },
            { q: "How do I join the waitlist?", a: "Click the button below, enter your email, select your category, and complete the short preview form to lock in your spot." },
            { q: "I have more questions. How do I reach you?", a: "DM us on Instagram @FoundU or email us. We are a small team building this, and we respond personally to every message." }
        ]
    },
    {
        section: "SECTION 8 — THE FOUNDING MEMBER OFFER",
        items: [
            { q: "What exactly do Founding Members get?", a: "Founders: Free Premium Access · Free AI Pitch Deck · 50% Off Development · VIP Badge\nCo-Founders: Free Premium Access · Priority Search · Mentorship Credits · VIP Badge\nFreelancers: 0% Commission on First Projects · Featured Profile · Priority Matching · Verified Badge\nInfluencers: 0% Commission on Brand Deals · Verified Badge · Featured in Campaigns" }
        ]
    }
];

const gradientBlueToBlack = {
    background: "linear-gradient(180deg, rgba(9, 9, 121, 1) 16%, rgba(2, 0, 36, 1) 100%)",
};

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen flex flex-col" style={gradientBlueToBlack}>
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-6">
                            <HelpCircle size={16} />
                            <span>HELP CENTER</span>
                        </div>
                        <h1 className="text-3xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                            FREQUENTLY ASKED <span className="text-blue-500 uppercase">QUESTIONS</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Everything you need to know about the FoundU ecosystem.
                        </p>
                    </div>

                    <div className="w-full lg:w-3/4 space-y-12">
                        {FAQ_DATA.map((section, sIdx) => (
                            <div key={sIdx} className="space-y-4">
                                <h2 className="text-blue-500 font-bold text-sm tracking-[0.2em] px-4 uppercase">
                                    {section.section}
                                </h2>
                                <div className="space-y-3">
                                    {section.items.map((item, iIdx) => {
                                        const uniqueIdx = `${sIdx}-${iIdx}`;
                                        const isOpen = openIndex === uniqueIdx;
                                        return (
                                            <div
                                                key={iIdx}
                                                className={`group border border-white/10 rounded-2xl transition-all duration-300 ${isOpen ? 'bg-white/5 border-white/20' : 'hover:bg-white/[0.02]'}`}
                                            >
                                                <button
                                                    onClick={() => toggleAccordion(uniqueIdx)}
                                                    className="w-full px-6 py-5 flex items-center justify-between text-left"
                                                >
                                                    <span className={`text-lg font-semibold transition-colors ${isOpen ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                                        {item.q}
                                                    </span>
                                                    <div className={`flex-shrink-0 ml-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : 'text-gray-500'}`}>
                                                        <ChevronDown size={20} />
                                                    </div>
                                                </button>
                                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                    <div className="px-6 pb-6 text-gray-400 leading-relaxed whitespace-pre-line">
                                                        {item.a}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default FAQ;
