import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { Footer } from '../components/Footer';

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
          PRIMARY MAIN CONTENT: STUDENT CONCERN CARDS
          Purpose: Immediately help students recognise situations they may be experiencing.
          - Placed at the top of the homepage body, directly beneath the header
          - Heading: "Ever feel like nobody gets it?" with playful blue accent ticks
          - Subtitle: "Sometimes, it's difficult to explain what's going on in your head."
          - SIX INDIVIDUAL CARDS in a 3-column x 2-row grid on desktop
          ========================================================================= */}
      <section
        id="student-concerns"
        className="relative px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-14 pb-16 sm:pb-24 bg-gradient-to-b from-[#F2F7FC]/80 via-white to-white border-b border-[#E8F3FF]"
      >
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-8 sm:mb-12 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center gap-2 mb-2 sm:mb-2.5">
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#062B50] tracking-tight leading-tight">
                Ever feel like nobody gets it?
              </h1>
              {/* Playful blue accent marks right after question mark */}
              <span className="inline-flex items-center gap-1 text-[#0866C6] -mt-2.5 sm:-mt-3" aria-hidden="true">
                <span className="w-1.5 h-3.5 sm:h-4 bg-[#0866C6] rounded-full rotate-[25deg]" />
                <span className="w-1.5 h-2 sm:h-2.5 bg-[#0866C6] rounded-full rotate-[25deg]" />
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
                className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2EDF8] shadow-xs hover:shadow-lg hover:border-[#0866C6]/30 transition-all duration-200 flex flex-col justify-between group cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0866C6]"
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
                        "{concern.description}"
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
          <div className="mt-12 sm:mt-16 text-center bg-[#F4F8FD] rounded-3xl p-8 sm:p-10 border border-[#E8F3FF] max-w-3xl mx-auto">
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

