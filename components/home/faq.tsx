import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const faqs = [
    {
      question: "What is this platform about?",
      answer: "It's a modern learning management system (LMS) that helps students and teachers organize assignments, notes, and submissions in one clean dashboard — without the chaos of multiple links or unstructured communication."
    },
    {
      question: "How is it different from Google Classroom?",
      answer: "Unlike Classroom, our platform focuses on simplicity, speed, and structured workflows. Everything — from uploading assignments to viewing grades — is unified and consistent across all subjects."
    },
    {
      question: "Who can use it?",
      answer: "Both students and teachers can use it. Teachers can create subjects, upload materials, and post assignments. Students can submit work, track due dates, and get reminders — all in one place."
    },
    {
      question: "Can I upload any type of document?",
      answer: "Yes! You can upload PDFs, Word files, PPTs, images, or any document type directly through the web interface."
    },
    {
      question: "Is it free to use?",
      answer: "Yes! The platform is completely free during the beta phase. We'll introduce affordable plans for institutions later."
    },
    {
      question: "Can teachers see all student submissions easily?",
      answer: "Yes. The dashboard provides a clear, organized list of all submissions with timestamps and status tracking."
    },
    {
      question: "Do I need to install an app?",
      answer: "No. It's web-based and mobile-friendly — you can access it from any browser, anytime."
    },
    {
      question: "Will I get reminders for deadlines?",
      answer: "Absolutely. Smart reminders notify students before deadlines and keep teachers updated on pending submissions."
    },
    {
      question: "Is my data safe?",
      answer: "Yes. All files and user data are securely stored using encrypted cloud storage. Privacy and security are our top priorities."
    },
    {
      question: "Can institutions or colleges onboard multiple classes?",
      answer: "Yes. Multi-class and multi-teacher support is built in — ideal for colleges and schools managing several subjects at once."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const displayedFaqs = showAll ? faqs : faqs.slice(0, 4);

  return (
    <div className="w-full bg-white py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">
              FAQ
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about Lernova and how it transforms learning
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {displayedFaqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-start justify-between p-6 text-left transition-colors duration-200 cursor-pointer"
              >
                <span className="text-base font-semibold text-gray-900 pr-4 leading-relaxed">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`flex-shrink-0 w-5 h-5 text-orange-500 transition-transform duration-300 mt-1 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6 pt-0">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-600 leading-relaxed text-[15px]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {faqs.length > 4 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-orange-500 text-white font-semibold py-3 px-8 rounded-full transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer"
            >
              {showAll ? 'Show Less' : 'Show More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}