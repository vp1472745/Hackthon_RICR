import React, { useState } from 'react';
import { 
  HelpCircle, 
  Mail, 
  Phone, 
  MessageCircle, 
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  Send,
  X,
  Users,
  Code,
  Trophy,
  BookOpen
} from 'lucide-react';

const HelpDesk = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    category: 'general',
    subject: '',
    message: ''
  });

  const helpCategories = [
    { id: 'all', name: 'All Categories', icon: HelpCircle, color: 'from-blue-500 to-blue-600' },
    { id: 'registration', name: 'Registration', icon: BookOpen, color: 'from-green-500 to-green-600' },
    { id: 'team', name: 'Team Management', icon: Users, color: 'from-purple-500 to-purple-600' },
    { id: 'technical', name: 'Technical Issues', icon: Code, color: 'from-red-500 to-red-600' },
    { id: 'submission', name: 'Project Submission', icon: Trophy, color: 'from-orange-500 to-orange-600' },
    { id: 'general', name: 'General', icon: HelpCircle, color: 'from-gray-500 to-gray-600' }
  ];

  const faqData = [
    {
      id: 1,
      category: 'registration',
      question: 'How do I complete my registration for the hackathon?',
      answer: 'To complete registration: 1) Fill out the registration form with accurate details, 2) Pay the registration fee, 3) Verify your email and phone number, 4) Complete your profile setup. You will receive confirmation emails at each step.'
    },
    {
      id: 2,
      category: 'team',
      question: 'What is the maximum team size allowed?',
      answer: 'The maximum team size is 4 members including the team leader. You can form teams with students from any participating institution. All team members must be registered individually before joining a team.'
    },
    {
      id: 3,
      category: 'team',
      question: 'Can I change team members after registration?',
      answer: 'Yes, you can modify your team composition until Feb 25, 2026, 11:59 PM IST. After this deadline, no changes to team membership will be allowed.'
    },
    {
      id: 4,
      category: 'technical',
      question: 'What technologies can we use for the project?',
      answer: 'You can use any programming language, framework, or technology stack for your project. Popular choices include React, Angular, Vue.js for frontend; Node.js, Python, Java for backend; and MySQL, MongoDB for databases.'
    },
    {
      id: 5,
      category: 'submission',
      question: 'What should be included in the final project submission?',
      answer: 'Your submission should include: 1) Complete source code with documentation, 2) A working demo/prototype, 3) Project presentation, 4) Video demonstration (3-5 minutes), 5) README file with setup instructions.'
    },
    {
      id: 6,
      category: 'general',
      question: 'What are the evaluation criteria for projects?',
      answer: 'Projects will be evaluated on: 1) Innovation and Creativity (25%), 2) Technical Implementation (25%), 3) User Experience and Design (20%), 4) Business Viability (15%), 5) Presentation and Communication (15%).'
    },
    {
      id: 7,
      category: 'registration',
      question: 'Is there a registration fee?',
      answer: 'Yes, there is a nominal registration fee of ₹500 per participant. This fee helps cover event costs, resources, and infrastructure. Fee waivers are available for exceptional cases - contact our support team for details.'
    },
    {
      id: 8,
      category: 'technical',
      question: 'What support will be provided during the hackathon?',
      answer: 'We provide: 24/7 technical support, mentorship sessions, access to cloud resources, API credits, and workshops. Each team will be assigned a mentor for guidance throughout the event.'
    }
  ];

  // Helper to open user's mailbox (best-effort):
  // 1) Try to open Gmail web compose (if the user is logged into Gmail in Chrome this opens their mailbox & compose window).
  // 2) If user prefers another provider or Gmail is not available, mailto: will act as a fallback (it opens the system-default mail client).
  const openMailCompose = ({ to, subject = '', body = '' } = {}) => {
    const encodedTo = encodeURIComponent(to || '');
    const encodedSubject = encodeURIComponent(subject || '');
    const encodedBody = encodeURIComponent(body || '');

    // Gmail compose URL (will open in the logged-in Google account in the browser)
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;

    // Outlook Web compose URL (for users who use outlook.live.com / office365)
    // NOTE: outlook supports prefilled subject & body via "path=/mail/action/compose&to=...&subject=...&body=..."
    const outlookUrl = `https://outlook.office.com/mail/deeplink/compose?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`;

    // Fallback mailto:
    const mailtoUrl = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;

    // Try opening Gmail first (best chance to open the mailbox in the browser)
    // Open in a new tab so user's current app is preserved.
    try {
      const newWin = window.open(gmailUrl, '_blank');

      // If popup blocked or newWin is null, try Outlook; if that fails, use mailto
      if (!newWin) {
        // try outlook
        const outWin = window.open(outlookUrl, '_blank');
        if (!outWin) {
          // fallback to mailto (this will open system email client)
          window.location.href = mailtoUrl;
        }
      }
    } catch (err) {
      // final fallback
      window.location.href = mailtoUrl;
    }
  };

  const contactMethods = [
    {
      type: 'Email Support',
      icon: Mail,
      value: 'ashish@ricr.in',
      description: 'General inquiries and detailed questions',
      response: '24-48 hours',
      buttonText: 'Send Email',
      action: () => {
        // We can include a short prefilled subject/body. If you want to use the user's values from the modal,
        // consider changing this to open the modal first and then call openMailCompose with contactForm contents.
        const subject = 'Support Request';
        const body = `Hello team,%0D%0A%0D%0AI have a question regarding...%0D%0A%0D%0ARegards,`;
        openMailCompose({ to: 'ashish@ricr.in', subject, body });
      }
    },
    {
      type: 'Phone Support',
      icon: Phone,
      value: '+91 8889991736',
      description: 'Urgent technical issues only',
      response: 'Mon-Fri, 9 AM - 6 PM IST',
      buttonText: 'Call Now',
      action: () => window.open('tel:+918889991736')
    }

  ];

  const filteredFaqs = faqData.filter(faq => 
    selectedCategory === 'all' || faq.category === selectedCategory
  );

  const handleSubmitContact = () => {
    // If you want the contact form modal to open the user's mailbox with form contents,
    // replace the alert and setShowContactForm(false) with a call to openMailCompose using contactForm.
    // Example:
    // openMailCompose({ to: 'ashish@ricr.in', subject: contactForm.subject, body: contactForm.message });
    alert('Your message has been sent successfully! We will get back to you within 24-48 hours.');
    setContactForm({ category: 'general', subject: '', message: '' });
    setShowContactForm(false);
  };

  const getCategoryColor = (categoryId) => {
    const category = helpCategories.find(cat => cat.id === categoryId);
    return category ? category.color : 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20 p-4 sm:p-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="">
          <div className="flex flex-row sm:flex-row items-start sm:items-center gap-2 mb-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <HelpCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-1xl font-bold text-gray-900 ">Help & Support Center</h1>
              <p className="text-sm  text-gray-600 ">
                Get instant help with our comprehensive knowledge base or connect with our support team.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Get in Touch</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">Our support team is here to help you succeed</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:border-blue-300 transition-all duration-200 hover:shadow-lg bg-gradient-to-b from-white to-gray-50/50"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-gray-900">{method.type}</h4>
                      <p className="text-xs sm:text-sm text-gray-500">{method.response}</p>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base font-medium text-blue-600 mb-2">{method.value}</p>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4">{method.description}</p>

                  <button
                    onClick={method.action}
                    className="w-full py-2 sm:py-2.5 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
                  >
                    {method.buttonText}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {helpCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl transition-all duration-200 border-2 ${
                    selectedCategory === category.id
                      ? `border-transparent bg-gradient-to-br ${category.color} text-white shadow-lg transform scale-105`
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <Icon className="w-5 sm:w-6 h-5 sm:h-6" />
                  <span className="text-xs sm:text-sm font-medium text-center">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  {filteredFaqs.length} questions in {selectedCategory === 'all' ? 'all categories' : helpCategories.find(cat => cat.id === selectedCategory)?.name.toLowerCase()}
                </p>
              </div>

            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="p-4 sm:p-6 hover:bg-gray-50/50 transition-colors duration-200">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full flex items-start justify-between text-left group"
                >
                  <div className="flex items-start gap-3 sm:gap-4 flex-1">
                    <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-br ${getCategoryColor(faq.category)} mt-1`}>
                      <HelpCircle className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-sm sm:text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors pr-4">
                        {faq.question}
                      </h3>
                      {expandedFaq === faq.id && (
                        <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  </div>
                  {expandedFaq === faq.id ? (
                    <ChevronUp className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500 flex-shrink-0 mt-1" />
                  ) : (
                    <ChevronDown className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500 flex-shrink-0 mt-1" />
                  )}
                </button>
              </div>
            ))}
            
            {filteredFaqs.length === 0 && (
              <div className="p-8 sm:p-12 text-center">
                <HelpCircle className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-sm sm:text-lg font-semibold text-gray-600 mb-2">No questions found</h3>
                <p className="text-xs sm:text-sm text-gray-500">Try selecting a different category</p>
              </div>
            )}
          </div>
        </div>

      </div>


    </div>
  );
};

export default HelpDesk;
