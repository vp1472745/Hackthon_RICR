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
  Check,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Users,
  Settings,
  Send,
  Star
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
    { id: 'registration', name: 'Registration', icon: Users },
    { id: 'team', name: 'Team Management', icon: Users },
    { id: 'technical', name: 'Technical Issues', icon: Settings },
    { id: 'submission', name: 'Project Submission', icon: FileText },
    { id: 'general', name: 'General', icon: BookOpen }
  ];

  const faqData = [
    {
      id: 1,
      category: 'registration',
      question: 'How do I complete my registration for the hackathon?',
      answer: 'To complete registration: 1) Fill out the registration form with accurate details, 2) Pay the registration fee, 3) Verify your email and phone number, 4) Complete your profile setup. You will receive confirmation emails at each step.',
      helpful: 45,
      views: 234
    },
    {
      id: 2,
      category: 'team',
      question: 'What is the maximum team size allowed?',
      answer: 'The maximum team size is 4 members including the team leader. You can form teams with students from any participating institution. All team members must be registered individually before joining a team.',
      helpful: 67,
      views: 189
    },
    {
      id: 3,
      category: 'team',
      question: 'Can I change team members after registration?',
      answer: 'Yes, you can modify your team composition until November 6, 2025, 11:59 PM IST. After this deadline, no changes to team membership will be allowed. Use the "Manage Team" section in your dashboard to add or remove members.',
      helpful: 32,
      views: 156
    },
    {
      id: 4,
      category: 'technical',
      question: 'What technologies can we use for the project?',
      answer: 'You can use any programming language, framework, or technology stack for your project. Popular choices include React, Angular, Vue.js for frontend; Node.js, Python, Java for backend; and MySQL, MongoDB for databases. Make sure your final submission includes proper documentation.',
      helpful: 89,
      views: 267
    },
    {
      id: 5,
      category: 'submission',
      question: 'What should be included in the final project submission?',
      answer: 'Your submission should include: 1) Complete source code with proper documentation, 2) A working demo/prototype, 3) Project presentation (PPT/PDF), 4) Video demonstration (3-5 minutes), 5) README file with setup instructions, 6) Any additional resources or documentation.',
      helpful: 78,
      views: 198
    },
    {
      id: 6,
      category: 'technical',
      question: 'I\'m having trouble accessing my dashboard. What should I do?',
      answer: 'Try these steps: 1) Clear your browser cache and cookies, 2) Try logging in from an incognito/private browser window, 3) Check if you\'re using the correct email and password, 4) If the issue persists, contact our support team with your registration details.',
      helpful: 23,
      views: 87
    },
    {
      id: 7,
      category: 'general',
      question: 'What are the evaluation criteria for projects?',
      answer: 'Projects will be evaluated on: 1) Innovation and Creativity (25%), 2) Technical Implementation (25%), 3) User Experience and Design (20%), 4) Business Viability (15%), 5) Presentation and Communication (15%). Detailed rubrics will be shared closer to the submission deadline.',
      helpful: 156,
      views: 345
    },
    {
      id: 8,
      category: 'submission',
      question: 'When is the project submission deadline?',
      answer: 'The final project submission deadline is November 8, 2025, 11:59 PM IST. Late submissions will not be accepted under any circumstances. We recommend submitting at least 2 hours before the deadline to avoid any technical issues.',
      helpful: 234,
      views: 456
    }
  ];

  const contactMethods = [
    {
      type: 'Email Support',
      icon: Mail,
      value: 'support@hackathon2025.com',
      description: 'General inquiries and detailed questions',
      response: '24-48 hours',
      available: true
    },
    {
      type: 'Phone Support',
      icon: Phone,
      value: '+91 98765 43210',
      description: 'Urgent technical issues only',
      response: 'Mon-Fri, 9 AM - 6 PM IST',
      available: true
    },
    {
      type: 'WhatsApp Chat',
      icon: MessageCircle,
      value: '+91 98765 43210',
      description: 'Quick questions and real-time help',
      response: 'Real-time during business hours',
      available: true
    }
  ];

  const quickLinks = [
    { name: 'Hackathon Guidelines', url: '#', icon: FileText, description: 'Complete rules and regulations' },
    { name: 'Technical Requirements', url: '#', icon: Settings, description: 'System and software requirements' },
    { name: 'Submission Format', url: '#', icon: FileText, description: 'Project submission guidelines' },
    { name: 'Evaluation Criteria', url: '#', icon: Check, description: 'How projects will be judged' },
    { name: 'Code of Conduct', url: '#', icon: BookOpen, description: 'Expected behavior and ethics' },
    { name: 'Prizes & Recognition', url: '#', icon: Star, description: 'Awards and recognition details' }
  ];

  const filteredFaqs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmitContact = () => {
    // Here you would typically send the form data to your backend
    alert('Your message has been sent successfully! We will get back to you within 24-48 hours.');
    setContactForm({ category: 'general', subject: '', message: '' });
    setShowContactForm(false);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <HelpCircle className="w-6 h-6 text-[#0B2A4A]" />
          <h1 className="text-2xl font-bold text-gray-800">Help Desk</h1>
        </div>
        <p className="text-gray-600">
          Find answers to common questions, access resources, or get in touch with our support team.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <Search className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Search FAQs</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Find quick answers to common questions</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <MessageCircle className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-800">Contact Support</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Get personalized help from our team</p>
          <button
            onClick={() => setShowContactForm(true)}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Send Message
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-800">Resources</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Access guides and documentation</p>
          <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            View Resources
          </button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Frequently Asked Questions</h3>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {helpCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-[#0B2A4A] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
          
          {/* Results Info */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredFaqs.length} of {faqData.length} questions
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="p-6">
              <button
                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between text-left group"
              >
                <h4 className="font-medium text-gray-800 pr-4 group-hover:text-[#0B2A4A] transition-colors">
                  {faq.question}
                </h4>
                {expandedFaq === faq.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              
              {expandedFaq === faq.id && (
                <div className="mt-4">
                  <div className="text-gray-600 text-sm leading-relaxed mb-4">
                    {faq.answer}
                  </div>
                  
                  {/* FAQ Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      {faq.helpful} found this helpful
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {faq.views} views
                    </div>
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Support</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-[#0B2A4A] transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#0B2A4A] rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-800">{method.type}</h4>
                </div>
                
                <p className="font-medium text-[#0B2A4A] mb-2">{method.value}</p>
                <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {method.response}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    method.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {method.available ? 'Available' : 'Offline'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links & Resources</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <a
                key={index}
                href={link.url}
                className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#0B2A4A] transition-colors group"
              >
                <Icon className="w-5 h-5 text-gray-600 group-hover:text-[#0B2A4A] flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="font-medium text-gray-700 group-hover:text-[#0B2A4A] mb-1">
                    {link.name}
                  </div>
                  <div className="text-sm text-gray-500">{link.description}</div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#0B2A4A]" />
              </a>
            );
          })}
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Contact Support</h3>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={contactForm.category}
                    onChange={(e) => setContactForm({...contactForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
                    placeholder="Brief description of your issue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
                    placeholder="Describe your question or issue in detail..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSubmitContact}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#0B2A4A] text-white rounded-lg hover:bg-[#0d2d4f] transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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