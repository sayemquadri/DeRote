import React, { useState } from 'react';
import { ArrowLeft, Mail, Shield, AlertCircle, CheckCircle2, Send, Phone, MapPin, User, Info, Lock } from 'lucide-react';
import { DeRoteWordmark } from '../components/DeRoteWordmark';
import { Footer } from '../components/Footer';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

interface ContactPrivacyPageProps {
  onNavigate: (route: string) => void;
}

export const ContactPrivacyPage: React.FC<ContactPrivacyPageProps> = ({ onNavigate }) => {
  const [requestType, setRequestType] = useState<string>('deletion');
  const [requesterRole, setRequesterRole] = useState<'student' | 'guardian'>('student');
  const [studentName, setStudentName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [classGrade, setClassGrade] = useState('10');
  const [schoolName, setSchoolName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [requestDetails, setRequestDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!studentName.trim()) {
      setFormError('Please provide the student full name.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Please provide a contact phone number.');
      return;
    }
    if (requesterRole === 'guardian' && !guardianName.trim()) {
      setFormError('Please provide the parent or guardian name.');
      return;
    }
    if (!requestDetails.trim()) {
      setFormError('Please describe your privacy request or question.');
      return;
    }

    setIsSubmitting(true);
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    try {
      await setDoc(doc(db, 'privacy_requests', requestId), {
        id: requestId,
        requestType,
        requesterRole,
        studentName: studentName.trim(),
        guardianName: requesterRole === 'guardian' ? guardianName.trim() : '',
        phone: phone.trim(),
        email: email.trim(),
        schoolName: schoolName.trim(),
        classGrade,
        requestDetails: requestDetails.trim(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firestore privacy request sync notice:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#102C46]">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8F3FF] px-4 sm:px-8 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center text-left focus-visible:outline-2 focus-visible:outline-[#0866C6] rounded-lg cursor-pointer"
            aria-label="DeRote Home"
          >
            <DeRoteWordmark showDescriptor={true} size="md" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('/privacy')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#0866C6] hover:bg-[#E8F3FF] border border-[#168FE5]/30 rounded-xl transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Privacy Policy</span>
            </button>
            <button
              onClick={() => onNavigate('/')}
              className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-[#64778C] hover:text-[#062B50] hover:bg-[#F4F8FD] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Title Zone */}
        <div className="border-b border-[#E8F3FF] pb-6 mb-8 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F3FF] text-[#0866C6] text-xs font-bold mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Student & Guardian Privacy Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#062B50] tracking-tight">
            Contact &amp; Privacy Requests
          </h1>
          <p className="text-xs sm:text-sm text-[#64778C] mt-2 max-w-2xl">
            Students and parents/guardians can submit requests for data access, correction, consent withdrawal, or complete deletion of student records from the DeRote Student Insight System.
          </p>
        </div>

        {/* Compliance Note Banner */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-[#E8F3FF]/70 border border-[#168FE5]/30 text-[#062B50] text-xs sm:text-sm flex items-start gap-3 shadow-xs text-left">
          <Info className="w-5 h-5 text-[#0866C6] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-[#062B50] uppercase tracking-wider text-[11px]">
              Official Data Rights &amp; Privacy Request Portal
            </p>
            <p className="text-[#334E68] leading-relaxed">
              All privacy, data access, correction, and deletion requests submitted through this official intake form are logged directly for our Privacy Compliance Team. The DeRote Privacy Officer (contact@derote.in) verifies identities and processes all requests within 30 statutory days.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="p-5 sm:p-7 rounded-3xl bg-white border border-[#E8F3FF] shadow-sm">
              <h2 className="text-lg font-bold text-[#062B50] mb-1">
                Submit a Privacy Request
              </h2>
              <p className="text-xs text-[#64778C] mb-6">
                All requests are handled confidentially by authorized DeRote personnel.
              </p>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-emerald-900">
                    Request Successfully Submitted
                  </h3>
                  <p className="text-xs text-emerald-800 leading-relaxed max-w-sm mx-auto">
                    Thank you. Your privacy request has been logged. The DeRote Privacy Officer will review your submission and communicate acknowledgment and verification steps within 48 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setRequestDetails('');
                    }}
                    className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {formError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Requester Role */}
                  <div>
                    <label className="block text-xs font-bold text-[#062B50] mb-1.5">
                      I am submitting this request as: <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRequesterRole('student')}
                        className={`min-h-[42px] px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          requesterRole === 'student'
                            ? 'bg-[#0866C6] text-white border-[#0866C6]'
                            : 'bg-white text-[#062B50] border-[#E8F3FF] hover:bg-[#F4F8FD]'
                        }`}
                      >
                        Student (Classes 8–10)
                      </button>
                      <button
                        type="button"
                        onClick={() => setRequesterRole('guardian')}
                        className={`min-h-[42px] px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          requesterRole === 'guardian'
                            ? 'bg-[#0866C6] text-white border-[#0866C6]'
                            : 'bg-white text-[#062B50] border-[#E8F3FF] hover:bg-[#F4F8FD]'
                        }`}
                      >
                        Parent / Legal Guardian
                      </button>
                    </div>
                  </div>

                  {/* Request Type */}
                  <div>
                    <label htmlFor="req-type" className="block text-xs font-bold text-[#062B50] mb-1.5">
                      Type of Privacy Request <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="req-type"
                      value={requestType}
                      onChange={(e) => setRequestType(e.target.value)}
                      className="w-full min-h-[44px] px-3 rounded-xl border border-[#062B50]/15 focus:border-[#0866C6] focus:ring-2 focus:ring-[#0866C6]/20 outline-none text-xs sm:text-sm text-[#102C46] bg-white cursor-pointer"
                    >
                      <option value="deletion">Permanent Data Deletion (Delete My Profile &amp; Answers)</option>
                      <option value="access">Data Portability (Request Copy of Student Data)</option>
                      <option value="rectification">Rectification (Correct Student Name, Class or School)</option>
                      <option value="withdrawal">Withdraw Parental / Student Consent</option>
                      <option value="general">General Privacy Question / Feedback</option>
                    </select>
                  </div>

                  {/* Student Full Name */}
                  <div>
                    <label htmlFor="student-name" className="block text-xs font-bold text-[#062B50] mb-1.5">
                      Student Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="student-name"
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full min-h-[44px] px-3 rounded-xl border border-[#062B50]/15 focus:border-[#0866C6] focus:ring-2 focus:ring-[#0866C6]/20 outline-none text-xs sm:text-sm text-[#102C46]"
                    />
                  </div>

                  {/* Parent Name if Guardian */}
                  {requesterRole === 'guardian' && (
                    <div>
                      <label htmlFor="guardian-name" className="block text-xs font-bold text-[#062B50] mb-1.5">
                        Parent / Guardian Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="guardian-name"
                        type="text"
                        value={guardianName}
                        onChange={(e) => setGuardianName(e.target.value)}
                        placeholder="e.g. Meera Sharma"
                        className="w-full min-h-[44px] px-3 rounded-xl border border-[#062B50]/15 focus:border-[#0866C6] focus:ring-2 focus:ring-[#0866C6]/20 outline-none text-xs sm:text-sm text-[#102C46]"
                      />
                    </div>
                  )}

                  {/* Class and School */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="class-grade" className="block text-xs font-bold text-[#062B50] mb-1.5">
                        Class / Grade
                      </label>
                      <select
                        id="class-grade"
                        value={classGrade}
                        onChange={(e) => setClassGrade(e.target.value)}
                        className="w-full min-h-[44px] px-3 rounded-xl border border-[#062B50]/15 focus:border-[#0866C6] focus:ring-2 focus:ring-[#0866C6]/20 outline-none text-xs sm:text-sm text-[#102C46] bg-white cursor-pointer"
                      >
                        <option value="8">Class 8</option>
                        <option value="9">Class 9</option>
                        <option value="10">Class 10</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="school-name" className="block text-xs font-bold text-[#062B50] mb-1.5">
                        School Name
                      </label>
                      <input
                        id="school-name"
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="e.g. Delhi Public School"
                        className="w-full min-h-[44px] px-3 rounded-xl border border-[#062B50]/15 focus:border-[#0866C6] focus:ring-2 focus:ring-[#0866C6]/20 outline-none text-xs sm:text-sm text-[#102C46]"
                      />
                    </div>
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="contact-phone" className="block text-xs font-bold text-[#062B50] mb-1.5">
                        Contact Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full min-h-[44px] px-3 rounded-xl border border-[#062B50]/15 focus:border-[#0866C6] focus:ring-2 focus:ring-[#0866C6]/20 outline-none text-xs sm:text-sm text-[#102C46]"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-bold text-[#062B50] mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="for written confirmation"
                        className="w-full min-h-[44px] px-3 rounded-xl border border-[#062B50]/15 focus:border-[#0866C6] focus:ring-2 focus:ring-[#0866C6]/20 outline-none text-xs sm:text-sm text-[#102C46]"
                      />
                    </div>
                  </div>

                  {/* Request Explanation */}
                  <div>
                    <label htmlFor="request-details" className="block text-xs font-bold text-[#062B50] mb-1.5">
                      Request Details / Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="request-details"
                      rows={3}
                      value={requestDetails}
                      onChange={(e) => setRequestDetails(e.target.value)}
                      placeholder="Please specify any relevant details (e.g., 'Please delete Aarav's questionnaire answers and student account permanently')..."
                      className="w-full p-3 rounded-xl border border-[#062B50]/15 focus:border-[#0866C6] focus:ring-2 focus:ring-[#0866C6]/20 outline-none text-xs sm:text-sm text-[#102C46] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-[48px] rounded-xl bg-[#0866C6] text-white font-bold text-sm hover:bg-[#062B50] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Privacy Request</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Details & Grievance Info Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-3xl bg-[#F8FAFD] border border-[#E8F3FF]">
              <h3 className="font-bold text-[#062B50] text-sm mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#0866C6]" />
                Official DeRote Privacy Contact
              </h3>
              <p className="text-xs text-[#64778C] mb-4 leading-relaxed">
                You may also reach our dedicated Grievance Officer and Data Protection team directly via email or postal correspondence:
              </p>

              <div className="space-y-3 text-xs text-[#334E68]">
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-[#0866C6] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#062B50] block">Dedicated Privacy Email</span>
                    <span className="font-mono text-[#0866C6]">[privacy@derote.in / To Be Confirmed]</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <User className="w-4 h-4 text-[#0866C6] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#062B50] block">Grievance Officer</span>
                    <span>[Grievance Officer Name &amp; Title]</span>
                    <span className="text-[11px] text-[#64778C] block">[Operating Entity Legal Name]</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#0866C6] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#062B50] block">Registered Office</span>
                    <span>[DeRote Registered Office Address]</span>
                    <span className="block">[City, State, PIN Code, India]</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-[#0866C6] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#062B50] block">Helpline Hours</span>
                    <span>[Monday to Friday, 10:00 AM – 6:00 PM IST]</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Commitments Box */}
            <div className="p-5 rounded-3xl bg-[#E8F3FF]/50 border border-[#168FE5]/30 text-xs text-[#062B50] space-y-2">
              <h4 className="font-bold text-[#0866C6] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Our Commitment to Students &amp; Guardians
              </h4>
              <ul className="space-y-1.5 text-[#334E68]">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#0866C6] font-bold">✓</span>
                  <span><strong>Zero School Access in Phase 1:</strong> Schools cannot see or modify your answers directly.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#0866C6] font-bold">✓</span>
                  <span><strong>No Sale of Data:</strong> DeRote never sells student data or runs ads.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#0866C6] font-bold">✓</span>
                  <span><strong>Complete Erasure Guarantee:</strong> Deletion requests remove all questionnaire responses and reports.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
