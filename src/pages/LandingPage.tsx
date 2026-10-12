import React from 'react';
import { ArrowRight, Compass, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';
import { DeRoteWordmark } from '../components/DeRoteWordmark';
import { HeroVisual } from '../components/HeroVisual';
import { FlowingBlueRibbons } from '../components/FlowingBlueRibbons';
import { loginAsDemoStudent } from '../services/localAuth';
import blueWaveArt from '../assets/images/derote_blue_wave_art_1791725706302.jpg';
import bluePrismArt from '../assets/images/derote_blue_prism_art_1791725743880.jpg';

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
            Deliberate two-column composition on desktop, vertical mobile-first at 390px
            ========================================================================= */}
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 lg:pt-16 pb-12 sm:pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Hero Copy & Actions */}
              <div className="lg:col-span-7 flex flex-col items-start text-left">
                {/* Eyebrow Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F3FF] border border-[#168FE5]/20 mb-3.5 sm:mb-4 select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0866C6]" aria-hidden="true" />
                  <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-[#0866C6]">
                    A DeRote Experience
                  </span>
                  <span className="text-[#64778C]/40" aria-hidden="true">·</span>
                  <span className="text-[11px] sm:text-xs font-semibold text-[#64778C]">
                    Classes 5–12
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-[32px] sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#062B50] leading-[1.12] mb-4 sm:mb-6 text-balance">
                  There's more to you than a report card.
                </h1>

                {/* Supporting Text */}
                <p className="text-base sm:text-lg lg:text-xl text-[#64778C] leading-relaxed mb-7 sm:mb-8 max-w-xl">
                  A little space to explore what matters to you, how you approach things, and the possibilities you haven't discovered yet.
                </p>

                {/* Primary CTA (-> /signup) & Secondary CTA (-> /login) */}
                <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 mb-5">
                  <button
                    type="button"
                    onClick={() => onNavigate('/signup')}
                    className="w-full sm:w-auto min-h-[50px] sm:min-h-[54px] px-7 py-3 rounded-2xl bg-[#0866C6] text-white font-bold text-base sm:text-lg hover:bg-[#062B50] active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2.5 shadow-md shadow-[#0866C6]/25 focus-visible:outline-2 focus-visible:outline-[#0866C6] cursor-pointer"
                  >
                    <span>Begin your journey</span>
                    <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('/login')}
                    className="w-full sm:w-auto min-h-[48px] px-5 py-2.5 rounded-2xl text-sm sm:text-base font-bold text-[#062B50] hover:text-[#0866C6] hover:bg-[#F4F8FD] active:bg-[#E8F3FF] transition-colors flex items-center justify-center text-center cursor-pointer border border-[#E8F3FF]"
                  >
                    Already have an account? Sign in
                  </button>
                </div>

                {/* 1-Click Demo Quick Access Pill */}
                <div className="mb-5">
                  <button
                    type="button"
                    onClick={() => {
                      loginAsDemoStudent('demo_aarav_10');
                      onNavigate('/questionnaire');
                    }}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0866C6] hover:text-[#062B50] bg-[#E8F3FF] hover:bg-[#168FE5]/20 border border-[#168FE5]/30 rounded-xl px-3.5 py-2 transition-all cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-[#0866C6]"
                  >
                    <Sparkles className="w-4 h-4 text-[#0866C6]" />
                    <span>Try 1-Click Demo Student (Aarav • Class 10)</span>
                  </button>
                </div>

                {/* Reassurance Trust Signal */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#64778C]">
                  <ShieldCheck className="w-4 h-4 text-[#0866C6] shrink-0" />
                  <span>Reflective & non-evaluative · Designed for mobile access</span>
                </div>
              </div>

              {/* Right Column: Sophisticated Blue & White Abstract Sculpture with Floating Shapes */}
              <div className="lg:col-span-5 w-full mt-4 lg:mt-0">
                <HeroVisual className="w-full" />
              </div>
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
                    src={blueWaveArt}
                    alt="Glossy blue fluid sculpted wave representing reflection"
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
                    src={bluePrismArt}
                    alt="Architectural translucent glass arches and blue ribbon representing discovery"
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
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[#062B50] to-[#0866C6] mb-5 border border-[#E8F3FF] flex items-center justify-center p-6 relative">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                  <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Sparkles className="w-10 h-10 text-white" aria-hidden="true" />
                  </div>
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

      {/* =========================================================================
          SIMPLE, ELEGANT FOOTER
          Clean white and navy branding, official website link, privacy readiness
          ========================================================================= */}
      <footer className="mt-auto border-t border-[#E8F3FF] bg-[#F4F8FD] px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-6 text-center md:text-left">
          {/* Brand & mission statement */}
          <div className="space-y-2 max-w-sm">
            <DeRoteWordmark showDescriptor={false} size="sm" />
            <p className="text-xs text-[#64778C] leading-relaxed">
              DeRote Student Insight System empowers school students to explore preferences, motivations, and choices.
            </p>
          </div>

          {/* Links & Institutional readiness */}
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-7 text-xs font-medium text-[#64778C]">
            <a
              href="https://derote.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#062B50] hover:text-[#0866C6] transition-colors focus-visible:outline-2 focus-visible:outline-[#0866C6] rounded font-bold"
            >
              <span>About DeRote</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>

            <span className="text-[#64778C]/40 hidden sm:inline" aria-hidden="true">·</span>

            <span className="text-[#64778C]">
              Institutional Privacy & Student Support (Contact your school administrator)
            </span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-[#E8F3FF] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#64778C]">
          <span>© {new Date().getFullYear()} DeRote. All rights reserved.</span>
          <span className="mt-2 sm:mt-0 text-[#64778C]">
            Designed for students in Classes 5–12 · Blue & White Edition
          </span>
        </div>
      </footer>
    </div>
  );
};
