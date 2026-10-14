import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { Footer } from '../components/Footer';

// Hero Illustration: One principal student illustration from the approved reference
import heroIllustration from '../assets/images/approved_hero_illustration.png';

// Six Student Concern Card Illustrations
import cardFamilyExpectations from '../assets/images/1.png';
import cardCareerConfusion from '../assets/images/22.png';
import cardLostMotivation from '../assets/images/3.png';
import cardFindingStrengths from '../assets/images/card_finding_strengths_1791984244674.jpg';
import cardFeelingBehind from '../assets/images/card_feeling_behind_1791984272837.jpg';
import cardMyVoiceChoices from '../assets/images/card_my_voice_choices_1791984301899.jpg';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

interface StudentConcern {
  id: string;
  heading: string;
  description: string;
  image: string;
  alt: string;
}

const STUDENT_CONCERNS: StudentConcern[] = [
  {
    id: 'family-expectations',
    heading: 'Family expectations',
    description: "I don't want to disappoint my parents.",
    image: cardFamilyExpectations,
    alt: 'Student experiencing pressure from family expectations',
  },
  {
    id: 'career-confusion',
    heading: 'Career confusion',
    description: "Everyone asks what I want to become. I'm not sure yet.",
    image: cardCareerConfusion,
    alt: 'Student unsure about career direction',
  },
  {
    id: 'lost-motivation',
    heading: 'Lost motivation',
    description: "I'm studying because I have to, not because I know what I want.",
    image: cardLostMotivation,
    alt: 'Student searching for personal meaning and motivation in studies',
  },
  {
    id: 'finding-strengths',
    heading: 'Finding my strengths',
    description: "I know my marks, but not always what I'm good at.",
    image: cardFindingStrengths,
    alt: 'Student exploring innate strengths and interests beyond marks',
  },
  {
    id: 'feeling-behind',
    heading: 'Feeling behind',
    description: "Everyone seems ahead. I'm still figuring things out.",
    image: cardFeelingBehind,
    alt: 'Student realizing growth is a personal journey, not a race',
  },
  {
    id: 'my-voice-choices',
    heading: 'My voice, my choices',
    description: 'I wish people would ask what matters to me.',
    image: cardMyVoiceChoices,
    alt: 'Student voicing authentic interests and personal agency',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-w-0 w-full flex flex-col bg-white text-[#102C46] overflow-x-hidden">
      {/* =========================================================================
          SECTION A: HERO
          Purpose: Introduce DeRote's central idea & establish an emotional connection.
          - Airy daylight sunlit room atmosphere with subtle pale-blue depth
          - Headline on left with "going on" highlighted in DeRote Blue (#0866C6)
          - ONE principal student illustration on the right
          - Prominent primary CTA button & simple secondary text link
          - Organic wave transition into the next section
          ========================================================================= */}
      <section className="relative w-full bg-gradient-to-b from-[#EBF3FB] via-[#F3F8FD] to-[#FFFFFF] overflow-hidden">
        {/* Soft atmospheric ambient daylight washes */}
        <div
          className="absolute -top-32 -left-20 w-[550px] h-[550px] bg-gradient-to-br from-[#D9EAFB]/70 to-[#EBF3FB]/30 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-10 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#E2EFFC]/80 via-[#EDF5FE]/40 to-transparent rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Subtle indoor botanical silhouette accent on far left edge */}
        <div
          className="absolute -left-12 bottom-12 w-48 h-72 opacity-20 pointer-events-none hidden md:block"
          aria-hidden="true"
        >
          <svg viewBox="0 0 100 200" fill="none" className="w-full h-full text-[#0866C6]">
            <path
              d="M10,190 Q30,120 15,60 Q35,80 50,40 Q40,90 70,80 Q55,120 75,140 Q40,150 10,190 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 lg:pt-18 pb-6 sm:pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* LEFT COLUMN: Editorial Typography & Actions */}
            <div className="lg:col-span-5 xl:col-span-5 text-left flex flex-col items-start z-10">
              {/* Playful Blue Accent Mark above headline */}
              <div className="flex items-center gap-1.5 mb-3.5 text-[#0866C6]" aria-hidden="true">
                <span className="w-1.5 h-4.5 bg-[#0866C6] rounded-full -rotate-25" />
                <span className="w-1.5 h-2.5 bg-[#0866C6] rounded-full -rotate-25" />
              </div>

              {/* Main Headline with exact deliberate breaks and blue highlight */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] xl:text-[58px] font-extrabold tracking-tight text-[#062B50] leading-[1.09] mb-5 sm:mb-6">
                There's more <br />
                <span className="text-[#0866C6]">going on</span> <br />
                than just school.
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg lg:text-[19px] text-[#5A6E85] leading-relaxed mb-8 max-w-md font-normal">
                Your future. Your expectations. Your interests. <br className="hidden sm:inline" />
                It can be a lot to figure out.
              </p>

              {/* Primary CTA & Secondary Sign-In Link */}
              <div className="w-full sm:w-auto flex flex-col items-start gap-3.5">
                <button
                  type="button"
                  onClick={() => onNavigate('/signup')}
                  className="w-full sm:w-auto min-h-[52px] sm:min-h-[56px] px-8 py-3.5 sm:py-4 rounded-2xl bg-[#0866C6] hover:bg-[#062B50] text-white font-bold text-base sm:text-lg transition-all duration-150 flex items-center justify-center gap-2.5 shadow-lg shadow-[#0866C6]/25 hover:shadow-xl hover:shadow-[#0866C6]/30 active:scale-[0.98] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0866C6]"
                >
                  <span>Explore what's on your mind</span>
                  <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/login')}
                  className="text-xs sm:text-sm font-medium text-[#64778C] hover:text-[#0866C6] transition-colors py-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0866C6] rounded-md text-left"
                >
                  Already have an account?{' '}
                  <span className="font-bold text-[#0866C6] underline underline-offset-2 hover:text-[#062B50]">
                    Sign in
                  </span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Single Principal Student Illustration */}
            <div className="lg:col-span-7 xl:col-span-7 flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-lg sm:max-w-xl lg:max-w-none">
                <img
                  src={heroIllustration}
                  alt="A thoughtful student sitting in reflection at her desk with books and laptop, thinking about her future"
                  className="w-full h-auto object-contain select-none transition-transform duration-300"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Organic Wave Transition into Section B */}
        <div className="w-full overflow-hidden leading-none z-10 -mb-[1px]">
          <svg
            viewBox="0 0 1440 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-10 sm:h-14 lg:h-18 block text-white"
            preserveAspectRatio="none"
          >
            <path
              d="M0,35 C280,80 500,10 740,45 C980,80 1220,15 1440,45 L1440,90 L0,90 Z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      </section>

      {/* =========================================================================
          SECTION B: STUDENT CONCERN CARDS
          Purpose: Help students recognise specific situations & concerns they relate to.
          - Heading: "Ever feel like nobody gets it?" with blue accent ticks
          - Short supporting sentence: "Sometimes, it's difficult to explain what's going on in your head."
          - SIX INDIVIDUAL CARDS in a 3-column, 2-row grid on desktop
          - Each card has its own illustration, title, description, and circular arrow button
          ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 sm:pb-24 bg-white border-b border-[#E8F3FF]">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-10 sm:mb-14 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center gap-2 mb-2.5">
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#062B50] tracking-tight">
                Ever feel like nobody gets it?
              </h2>
              {/* Playful blue accent marks right after question mark */}
              <span className="inline-flex items-center gap-1 text-[#0866C6] -mt-2.5" aria-hidden="true">
                <span className="w-1.5 h-3.5 bg-[#0866C6] rounded-full rotate-[25deg]" />
                <span className="w-1.5 h-2 bg-[#0866C6] rounded-full rotate-[25deg]" />
              </span>
            </div>
            <p className="text-base sm:text-lg text-[#5A6E85] leading-relaxed font-normal">
              Sometimes, it's difficult to explain what's going on in your head.
            </p>
          </div>

          {/* Six Independent Concern Cards Grid (3 Columns x 2 Rows on Desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
            {STUDENT_CONCERNS.map((concern) => (
              <div
                key={concern.id}
                onClick={() => onNavigate('/questionnaire')}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2EDF8] shadow-xs hover:shadow-lg hover:border-[#0866C6]/30 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNavigate('/questionnaire');
                  }
                }}
              >
                <div>
                  {/* Card Illustration Banner */}
                  <div className="w-full h-36 sm:h-40 lg:h-44 rounded-2xl overflow-hidden bg-[#F0F6FD] mb-4 sm:mb-5 border border-[#EAF2FC]">
                    <img
                      src={concern.image}
                      alt={concern.alt}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Heading & Description on Left, Circular Action Arrow on Right */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-[19px] font-bold text-[#062B50] tracking-tight mb-1 group-hover:text-[#0866C6] transition-colors truncate">
                        {concern.heading}
                      </h3>
                      <p className="text-xs sm:text-[13.5px] text-[#5A6E85] leading-snug font-normal line-clamp-2">
                        {concern.description}
                      </p>
                    </div>

                    <div
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#EBF4FE] text-[#0866C6] group-hover:bg-[#0866C6] group-hover:text-white transition-all flex items-center justify-center shrink-0 shadow-xs group-hover:translate-x-0.5"
                      aria-hidden="true"
                    >
                      <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section Bottom CTA Callout */}
          <div className="mt-14 sm:mt-18 text-center bg-[#F4F8FD] rounded-3xl p-8 sm:p-10 border border-[#E8F3FF] max-w-3xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-[#062B50] mb-2.5 tracking-tight">
              Ready to explore what matters to you?
            </h3>
            <p className="text-sm sm:text-base text-[#5A6E85] mb-6 max-w-xl mx-auto leading-relaxed">
              No grades, no expectations—just a quiet, structured space to discover your genuine strengths and interests.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/signup')}
              className="w-full sm:w-auto min-h-[50px] px-8 py-3.5 rounded-2xl bg-[#0866C6] text-white font-bold text-base hover:bg-[#062B50] active:scale-[0.98] transition-all shadow-md shadow-[#0866C6]/25 focus-visible:outline-2 focus-visible:outline-[#0866C6] cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <span>Explore what's on your mind</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          REASSURANCE SECTION
          Transparent, reassuring guidance for students and parents
          ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-10 sm:py-12 bg-[#F4F8FD] border-b border-[#E8F3FF]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F3FF] text-[#0866C6] flex items-center justify-center shrink-0 shadow-xs border border-[#168FE5]/20">
            <Compass className="w-6 h-6 text-[#0866C6]" aria-hidden="true" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg sm:text-xl font-bold text-[#062B50] tracking-tight">
              Not an exam. No perfect answers. Just a chance to reflect.
            </h2>
            <p className="text-sm sm:text-[15px] leading-relaxed text-[#64778C]">
              Your responses are not graded and do not determine your future or define who you are.
              Authorized school staff may review responses to provide thoughtful guidance, and full details
              will be explained before you begin any questionnaire.
            </p>
          </div>
        </div>
      </section>

      {/* Global DeRote Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

