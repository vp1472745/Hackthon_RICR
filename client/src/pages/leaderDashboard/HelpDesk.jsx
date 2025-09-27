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

  const contactMethods = [
    {
      type: 'Email Support',
      icon: Mail,
      value: 'support@hackathon2025.com',
      description: 'General inquiries and detailed questions',
      response: '24-48 hours',
      buttonText: 'Send Email',
      action: () => window.open('mailto:support@hackathon2025.com')
    },
    {
      type: 'Phone Support',
      icon: Phone,
      value: '+91 98765 43210',
      description: 'Urgent technical issues only',
      response: 'Mon-Fri, 9 AM - 6 PM IST',
      buttonText: 'Call Now',
      action: () => window.open('tel:+919876543210')
    },
    {
      type: 'Live Chat',
      icon: MessageCircle,
      value: 'Available 24/7',
      description: 'Quick questions and real-time help',
      response: 'Real-time during business hours',
      buttonText: 'Start Chat',
      action: () => setShowContactForm(true)
    }
  ];

  const filteredFaqs = faqData.filter(faq => 
    selectedCategory === 'all' || faq.category === selectedCategory
  );

  const handleSubmitContact = () => {
    alert('Your message has been sent successfully! We will get back to you within 24-48 hours.');
    setContactForm({ category: 'general', subject: '', message: '' });
    setShowContactForm(false);
  };

  const getCategoryColor = (categoryId) => {
    const category = helpCategories.find(cat => cat.id === categoryId);
    return category ? category.color : 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support Center</h1>
              <p className="text-gray-600 text-lg">
                Get instant help with our comprehensive knowledge base or connect with our support team.
              </p>
            </div>
          </div>
        </div>


        {/* Category Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {helpCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-200 border-2 ${
                    selectedCategory === category.id
                      ? `border-transparent bg-gradient-to-br ${category.color} text-white shadow-lg transform scale-105`
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium text-center">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
                <p className="text-gray-600 mt-1">
                  {filteredFaqs.length} questions in {selectedCategory === 'all' ? 'all categories' : helpCategories.find(cat => cat.id === selectedCategory)?.name.toLowerCase()}
                </p>
              </div>
              <button
                onClick={() => setShowContactForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold whitespace-nowrap"
              >
                <MessageCircle className="w-5 h-5" />
                Contact Support
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="p-6 hover:bg-gray-50/50 transition-colors duration-200">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full flex items-start justify-between text-left group"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${getCategoryColor(faq.category)} mt-1`}>
                      <HelpCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors pr-4">
                        {faq.question}
                      </h3>
                      {expandedFaq === faq.id && (
                        <div className="mt-3 text-gray-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  </div>
                  {expandedFaq === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                  )}
                </button>
              </div>
            ))}
            
            {filteredFaqs.length === 0 && (
              <div className="p-12 text-center">
                <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No questions found</h3>
                <p className="text-gray-500">Try selecting a different category</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Methods */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Get in Touch</h2>
          <p className="text-gray-600 mb-6">Our support team is here to help you succeed</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all duration-200 hover:shadow-lg bg-gradient-to-b from-white to-gray-50/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{method.type}</h4>
                      <p className="text-sm text-gray-500">{method.response}</p>
                    </div>
                  </div>
                  
                  <p className="font-medium text-blue-600 mb-2">{method.value}</p>
                  <p className="text-gray-600 mb-4 text-sm">{method.description}</p>
                  
                  <button
                    onClick={method.action}
                    className="w-full py-2.5 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
                  >
                    {method.buttonText}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in-90 zoom-in-90">
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-colors"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-colors"
                    placeholder="Brief description of your issue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-colors"
                    placeholder="Describe your question or issue in detail..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSubmitContact}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg"
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