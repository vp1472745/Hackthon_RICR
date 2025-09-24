import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  User,
  Calendar,
  Globe,
  HeadphonesIcon,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  FileText,
  Users,
  Building
} from 'lucide-react';

const Contact = () => {

  const contactInfo = [
    {
      icon: Phone,
      title: 'Hackathon Manager',
      primary: '+91 9876543210',
      secondary: 'Available 9 AM - 9 PM',
      description: 'Primary contact for FutureMaze by RICR',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      icon: Mail,
      title: 'Official Email',
      primary: 'hackathon@ricr.edu.in',
      secondary: 'support@futuremaze.com',
      description: 'Registration & verification queries',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      icon: MapPin,
      title: 'Venue Location',
      primary: 'NRI Institute of Information Science and Technology (NIIST)',
      secondary: 'Bhopal, Madhya Pradesh - 462022',
      description: 'Main hackathon venue & competition area',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    {
      icon: Building,
      title: 'Hostel Accommodation',
      primary: 'RICR Campus Hostel',
      secondary: '₹300/night/person',
      description: 'Contact organizer for booking',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200'
    },
    {
      icon: Clock,
      title: 'Registration Deadline',
      primary: 'Team Changes: Nov 6, 2025',
      secondary: '11:59 PM IST',
      description: 'Final deadline for team alterations',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      borderColor: 'border-red-200'
    },
    {
      icon: Users,
      title: 'Team Requirements',
      primary: 'Min: 1 member (Leader only)',
      secondary: 'Max: 4 members total',
      description: 'Team size constraints for registration',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      borderColor: 'border-indigo-200'
    }
  ];



  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            FutureMaze <span className="bg-gradient-to-r from-[#0B2A4A] to-[#1D5B9B] bg-clip-text text-transparent">Support</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Need help with registration, payments, or team management? Contact our dedicated FutureMaze support team.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base text-gray-600">
            <div className="flex items-center">
              <Building className="w-4 h-4 mr-2 text-[#0B2A4A]" />
              <span>RICR × NRI Institute of Information Science and Technology</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-[#0B2A4A]" />
              <span>Registration Fee: ₹1000</span>
            </div>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12  ">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div key={index} className={`${info.bgColor} ${info.borderColor} border rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 group text-center `}>
                <span
                  className={`w-12 h-12 ${info.iconColor} bg-white rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-gray-200 mx-auto`}
                >
                  <Icon size={24} />
                </span>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{info.title}</h3>
                <p className="text-gray-700 font-medium text-xs sm:text-sm mb-1">{info.primary}</p>
                <p className="text-gray-600 text-xs sm:text-sm mb-2">{info.secondary}</p>
                <p className="text-gray-500 text-xs">{info.description}</p>
              </div>
            );
          })}
        </div>



        {/* Venue Location Map */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <MapPin size={20} className="text-[#0B2A4A] mr-2" />
            Venue Location
          </h3>
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900 mb-2">NRI Institute of Information Science and Technology (NIIST)</p>
              <p>Sajjan Singh Nagar, 1, Raisen Rd, opposite Patel Nagar</p>
              <p>Gopal Nagar, Bhopal, Madhya Pradesh 462022</p>
            </div>

            {/* Google Maps Embed */}
            <div className="aspect-video rounded-lg overflow-hidden border border-gray-200">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src="https://maps.google.com/maps?width=100%25&height=400&hl=en&q=NRI%20Institute%20of%20Information%20Science%20and%20Technology%20Sajjan%20Singh%20Nagar%20Raisen%20Road%20Bhopal%20Madhya%20Pradesh%20462022+(FutureMaze%20Venue)&t=&z=14&ie=UTF8&iwloc=&output=embed"
                title="NRI Institute of Information Science and Technology (NIIST) Location"
                className="w-full h-full"
              />
            </div>


          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
