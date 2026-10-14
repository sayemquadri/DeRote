import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { Footer } from '../components/Footer';

// Hero Illustration: One principal student illustration communicating reflection & curiosity
import heroIllustration from '../assets/images/hero_student_thoughtful_1791984220624.jpg';

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
  tag: string;
}

const STUDENT_CONCERNS: StudentConcern[] = [
  {
    id: 'family-expectations',
    heading: 'Family expectations',
    description: "I don't want to disappoint my parents.",
    image: cardFamilyExpectations,
    alt: 'Student experiencing pressure from family expectations',
    tag: 'Expectations',
  },
  {
    id: 'career-confusion',
    heading: 'Career confusion',
    description: "Everyone asks what I want to become. I'm not sure yet.",
    image: cardCareerConfusion,
    alt: 'Student unsure about career direction',
    tag: 'Direction',
  },
  {
    id: 'lost-motivation',
    heading: 'Lost motivation',
    description: "I'm studying because I have to, not because I know what I want.",
    image: cardLostMotivation,
    alt: 'Student searching for personal meaning and motivation in studies',
    tag: 'Motivation',
  },
  {
    id: 'finding-strengths',
    heading: 'Finding my strengths',
    description: "I know my marks, but not always what I'm good at.",
    image: cardFindingStrengths,
    alt: 'Student exploring innate strengths and interests beyond marks',
    tag: 'Strengths',
  },
  {
    id: 'feeling-behind',
    heading: 'Feeling behind',
    description: "Everyone seems ahead. I'm still figuring things out.",
    image: cardFeelingBehind,
    alt: 'Student realizing growth is a personal journey, not a race',
    tag: 'Pacing',
  },
  {
    id: 'my-voice-choices',
    heading: 'My voice, my choices',
    description: 'I wish people would ask what matters to me.',
    image: cardMyVoiceChoices,
    alt: 'Student voicing authentic interests and personal agency',
    tag: 'Agency',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-w-0 w-full flex flex-col bg-white text-[#102C46] overflow-x-hidden">
      {/* =========================================================================
          SECTION A: HERO
          Purpose: Introduce DeRote's central idea & establish an emotional connection.
          - Exact typography with "going on" highlighted in DeRote Blue (#0866C6)
          - ONE principal student illustration on the right communicating quiet curiosity & reflection
          - Prominent primary CTA button & simple secondary text link
          ========================================================================= */}
      <section className="relative w-full bg-[#F7FAFD] border-b border-[#E8F3FF] overflow-hidden">
        {/* Soft pale-blue atmospheric ambient washes */}
        <div
          className="absolute -top-24 -left-16 w-[480px] h-[480px] bg-[#E8F3FF] rounded-full blur-3xl opacity-60 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/4 -right-20 w-[540px] h-[540px] bg-[#EBF4FE] rounded-full blur-3xl opacity-70 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-20 left-1/3 w-[360px] h-[360px] bg-[#F0F6FF] rounded-full blur-2xl opacity-50 pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 xl:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* LEFT COLUMN: Editorial Typography & Actions */}
            <div className="lg:col-span-5 xl:col-span-5 text-left flex flex-col items-start z-10">
              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] xl:text-[58px] font-extrabold tracking-tight text-[#062B50] leading-[1.12] mb-5 sm:mb-6">
                There's more <br />
                <span className="text-[#0866C6]">going on</span> <br />
                than just school.
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg lg:text-xl text-[#5A6E85] leading-relaxed mb-8 max-w-xl font-normal">
                Your future. Your expectations. Your interests. <br className="hidden sm:inline" />
                It can be a lot to figure out.
              </p>

              {/* Primary CTA & Secondary Sign-In Link */}
              <div className="w-full sm:w-auto flex flex-col items-start gap-3.5">
                <button
                  type="button"
                  onClick={() => onNavigate('/signup')}
                  className="w-full sm:w-auto min-h-[52px] sm:min-h-[56px] px-8 py-4 rounded-2xl bg-[#0866C6] hover:bg-[#062B50] text-white font-bold text-base sm:text-lg transition-all duration-150 flex items-center justify-center gap-2.5 shadow-lg shadow-[#0866C6]/25 hover:shadow-xl hover:shadow-[#0866C6]/30 active:scale-[0.98] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0866C6]"
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
                {/* Subtle soft backdrop accent glow */}
                <div
                  className="absolute -inset-4 bg-gradient-to-tr from-[#D5E9FF]/40 via-[#E8F3FF]/60 to-transparent rounded-full -z-10 blur-2xl opacity-70"
                  aria-hidden="true"
                />

                {/* Integrated Editorial Artwork */}
                <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md shadow-[#062B50]/5 bg-transparent transition-all">
                  <img
                    src={heroIllustration}
                    alt="A thoughtful student sitting in gentle reflection with a journal, looking upward with curiosity about their future"
                    className="w-full h-auto object-contain select-none"
                    loading="eager"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION B: STUDENT CONCERN CARDS
          Purpose: Help students recognise specific situations & concerns they relate to.
          - Heading: "Ever feel like nobody gets it?"
          - Short supporting sentence
          - SIX INDIVIDUAL CARDS in a 3-column, 2-row grid on desktop
          ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-white border-b border-[#E8F3FF]">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-12 sm:mb-16 text-center max-w-2xl mx-auto">
            <span className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-[#0866C6] mb-2.5 block">
              Student Perspectives
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#062B50] tracking-tight mb-3.5">
              Ever feel like nobody gets it?
            </h2>
            <p className="text-base sm:text-lg text-[#5A6E85] leading-relaxed font-normal">
              You're not the only one navigating these questions. Here's what we hear most often from students figuring out what's next.
            </p>
          </div>

          {/* Six Independent Concern Cards Grid (3 Columns x 2 Rows on Desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {STUDENT_CONCERNS.map((concern) => (
              <div
                key={concern.id}
                className="bg-[#F8FAFD] rounded-3xl p-6 sm:p-7 border border-[#E8F3FF] shadow-xs hover:shadow-lg hover:border-[#0866C6]/30 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Illustration */}
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white mb-5 border border-[#E8F3FF] shadow-inner">
                    <img
                      src={concern.image}
                      alt={concern.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Heading */}
                  <h3 className="text-xl font-bold text-[#062B50] mb-2 tracking-tight group-hover:text-[#0866C6] transition-colors">
                    {concern.heading}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-[15px] text-[#5A6E85] leading-relaxed font-normal">
                    "{concern.description}"
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#E8F3FF] flex items-center justify-between text-xs font-medium text-[#64778C]">
                  <span className="text-[#0866C6] font-semibold">{concern.tag}</span>
                  <button
                    type="button"
                    onClick={() => onNavigate('/questionnaire')}
                    className="inline-flex items-center gap-1 text-[#0866C6] hover:text-[#062B50] font-bold group-hover:translate-x-0.5 transition-transform cursor-pointer"
                  >
                    <span>Reflect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
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
