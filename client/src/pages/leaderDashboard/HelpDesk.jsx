import React, { useState } from 'react';
import { 
  HelpCircle, 
  Mail, 
  Phone, 
  MessageCircle, 
  Search,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  Send,
  X
} from 'lucide-react';

const HelpDesk = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    category: 'general',
    subject: '',
    message: ''
  });

  const helpCategories = [
    { id: 'all', name: 'All Categories', icon: HelpCircle },
    { id: 'registration', name: 'Registration', icon: FileText },
    { id: 'team', name: 'Team Management', icon: FileText },
    { id: 'technical', name: 'Technical Issues', icon: FileText },
    { id: 'submission', name: 'Project Submission', icon: FileText },
    { id: 'general', name: 'General', icon: FileText }
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
      answer: 'Yes, you can modify your team composition until November 6, 2025, 11:59 PM IST. After this deadline, no changes to team membership will be allowed.'
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
    }
  ];

  const contactMethods = [
    {
      type: 'Email Support',
      icon: Mail,
      value: 'support@hackathon2025.com',
      description: 'General inquiries and detailed questions',
      response: '24-48 hours'
    },
    {
      type: 'Phone Support',
      icon: Phone,
      value: '+91 98765 43210',
      description: 'Urgent technical issues only',
      response: 'Mon-Fri, 9 AM - 6 PM IST'
    },
    {
      type: 'WhatsApp Chat',
      icon: MessageCircle,
      value: '+91 98765 43210',
      description: 'Quick questions and real-time help',
      response: 'Real-time during business hours'
    }
  ];

  const filteredFaqs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmitContact = () => {
    alert('Your message has been sent successfully! We will get back to you within 24-48 hours.');
    setContactForm({ category: 'general', subject: '', message: '' });
    setShowContactForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <HelpCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Help Desk</h1>
              <p className="text-gray-600 text-lg">
                Find answers to common questions or get in touch with our support team.
              </p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
              </div>
            </div>
            <button
              onClick={() => setShowContactForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold whitespace-nowrap"
            >
              <MessageCircle className="w-5 h-5" />
              Contact Support
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mt-4">
            {helpCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
            <p className="text-gray-600 mt-1">
              {filteredFaqs.length} of {faqData.length} questions
            </p>
          </div>
          
          <div className="divide-y divide-gray-100">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="p-6">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <h3 className="text-lg font-medium text-gray-900 pr-4 group-hover:text-blue-600 transition-colors">
                    {faq.question}
                  </h3>
                  {expandedFaq === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                
                {expandedFaq === faq.id && (
                  <div className="mt-4">
                    <div className="text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {filteredFaqs.length === 0 && (
              <div className="p-12 text-center">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No results found</h3>
                <p className="text-gray-500">Try adjusting your search or category filter</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Methods */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Support</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">{method.type}</h4>
                  </div>
                  
                  <p className="font-medium text-blue-600 mb-2">{method.value}</p>
                  <p className="text-gray-600 mb-3">{method.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {method.response}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Contact Support</h3>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={contactForm.category}
                    onChange={(e) => setContactForm({...contactForm, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Issue</option>
                    <option value="registration">Registration Help</option>
                    <option value="team">Team Management</option>
                    <option value="submission">Submission Question</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    placeholder="Brief description of your issue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    placeholder="Describe your question or issue in detail..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSubmitContact}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpDesk;