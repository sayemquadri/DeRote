import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { FlowingBlueRibbons } from '../components/FlowingBlueRibbons';
import { Footer } from '../components/Footer';
import step2Art from '../assets/images/22.png';
import step1Art from '../assets/images/1.png';
import step3Art from '../assets/images/3.png';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-w-0 w-full flex flex-col bg-white text-[#102C46] overflow-x-hidden">
      {/* =========================================================================
          BACKGROUND BLUE FLOWING CURVES (Inspired by Reference 1 & 2)
          Sweeping architectural curves framing the page without visual clutter
          ========================================================================= */}
      <div className="relative w-full">
        {/* Soft decorative gradient wash behind hero */}
        <div
          className="absolute top-0 right-0 w-[55vw] max-w-[750px] h-[650px] pointer-events-none opacity-40 z-0"
          style={{
            background:
              'radial-gradient(ellipse at 80% 20%, #E8F3FF 0%, #F4F8FD 50%, transparent 80%)',
          }}
          aria-hidden="true"
        />

        {/* CSS-Animated Flowing Translucent Blue Ribbons & Organic Shapes */}
        <FlowingBlueRibbons className="absolute top-0 right-0 w-full h-[620px] pointer-events-none z-0" />

        {/* =========================================================================
            HERO SECTION
            Clean, centered layout with the visual artwork section removed
            ========================================================================= */}
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 lg:pt-18 pb-12 sm:pb-20">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F3FF] border border-[#168FE5]/20 mb-3.5 sm:mb-4 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0866C6]" aria-hidden="true" />
              <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-[#0866C6]">
                A DeRote Experience
              </span>
              <span className="text-[#64778C]/40" aria-hidden="true">·</span>
              <span className="text-[11px] sm:text-xs font-semibold text-[#64778C]">
                Classes 8–10
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#062B50] leading-[1.14] mb-4 sm:mb-6 text-balance max-w-3xl">
              There's more to you than a report card.
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg lg:text-xl text-[#64778C] leading-relaxed mb-7 sm:mb-8 max-w-2xl">
              A little space to explore what matters to you, how you approach things, and the possibilities you haven't discovered yet.
            </p>

            {/* Primary CTA (-> /signup) & Secondary CTA (-> /login) */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 mb-5">
              <button
                type="button"
                onClick={() => onNavigate('/signup')}
                className="w-full sm:w-auto min-h-[50px] sm:min-h-[54px] px-8 py-3.5 rounded-2xl bg-[#0866C6] text-white font-bold text-base sm:text-lg hover:bg-[#062B50] active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2.5 shadow-md shadow-[#0866C6]/25 focus-visible:outline-2 focus-visible:outline-[#0866C6] cursor-pointer"
              >
                <span>Begin your journey</span>
                <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="w-full sm:w-auto min-h-[48px] px-6 py-2.5 rounded-2xl text-sm sm:text-base font-bold text-[#062B50] hover:text-[#0866C6] hover:bg-[#F4F8FD] active:bg-[#E8F3FF] transition-colors flex items-center justify-center text-center cursor-pointer border border-[#E8F3FF]"
              >
                Already have an account? Sign in
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* =========================================================================
          REASSURANCE SECTION
          Transparent, reassuring guidance for students and parents
          ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 bg-[#F4F8FD] border-y border-[#E8F3FF]">
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

      {/* =========================================================================
          SUPPORTING CONTENT: 3 COMPACT BLUE-AND-WHITE CONCEPTS
          Reflect · Discover · Imagine (Numbered 01, 02, 03 inspired by Reference 2)
          ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-18 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-8 sm:mb-12 text-center max-w-xl mx-auto">
            <span className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-[#0866C6] mb-2 block">
              The Experience
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#062B50] tracking-tight">
              Three gentle steps to personal clarity.
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1: REFLECT */}
            <div className="bg-[#F4F8FD] rounded-3xl p-6 sm:p-7 border border-[#E8F3FF] shadow-xs hover:shadow-md hover:border-[#168FE5]/30 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white mb-5 border border-[#E8F3FF]">
                  <img
                    src={step1Art}
                    alt="Reflect - Explore your thoughts and preferences"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#0866C6] text-white text-[11px] font-extrabold tracking-wider">
                    01
                  </span>
                  <span className="text-xs font-bold tracking-wider uppercase text-[#0866C6]">
                    REFLECT
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#062B50] mb-2 tracking-tight">
                  Explore your thoughts and preferences.
                </h3>
                <p className="text-sm sm:text-[15px] text-[#64778C] leading-relaxed">
                  Notice what naturally engages your curiosity, what kinds of tasks feel energizing, and what environments help you do your best thinking.
                </p>
              </div>
            </div>

            {/* Card 2: DISCOVER */}
            <div className="bg-[#F4F8FD] rounded-3xl p-6 sm:p-7 border border-[#E8F3FF] shadow-xs hover:shadow-md hover:border-[#168FE5]/30 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white mb-5 border border-[#E8F3FF]">
                  <img
                    src={step2Art}
                    alt="Discover - Notice different ways of approaching situations"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#168FE5] text-white text-[11px] font-extrabold tracking-wider">
                    02
                  </span>
                  <span className="text-xs font-bold tracking-wider uppercase text-[#168FE5]">
                    DISCOVER
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#062B50] mb-2 tracking-tight">
                  Notice different ways of approaching situations.
                </h3>
                <p className="text-sm sm:text-[15px] text-[#64778C] leading-relaxed">
                  See how you handle unfamiliar challenges, collaborate with peers, and make decisions when there is more than one valid path forward.
                </p>
              </div>
            </div>

            {/* Card 3: IMAGINE */}
            <div className="bg-[#F4F8FD] rounded-3xl p-6 sm:p-7 border border-[#E8F3FF] shadow-xs hover:shadow-md hover:border-[#168FE5]/30 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white mb-5 border border-[#E8F3FF]">
                  <img
                    src={step3Art}
                    alt="Imagine - Explore possibilities for your future"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#062B50] text-white text-[11px] font-extrabold tracking-wider">
                    03
                  </span>
                  <span className="text-xs font-bold tracking-wider uppercase text-[#062B50]">
                    IMAGINE
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#062B50] mb-2 tracking-tight">
                  Explore possibilities for your future.
                </h3>
                <p className="text-sm sm:text-[15px] text-[#64778C] leading-relaxed">
                  Open up ideas for subject streams, creative avenues, and emerging career directions that align with your genuine interests.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Conversion Row */}
          <div className="mt-12 sm:mt-16 text-center">
            <button
              type="button"
              onClick={() => onNavigate('/signup')}
              className="w-full sm:w-auto min-h-[50px] px-8 py-3.5 rounded-2xl bg-[#0866C6] text-white font-bold text-base hover:bg-[#062B50] active:scale-[0.98] transition-all shadow-md shadow-[#0866C6]/20 focus-visible:outline-2 focus-visible:outline-[#0866C6] cursor-pointer"
            >
              Ready to explore? Begin your journey
            </button>
          </div>
        </div>
      </section>

      {/* Unified DeRote Footer with Legal & Privacy Links */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
