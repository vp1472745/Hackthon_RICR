import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import AshishSir from "../../assets/ashishSir.jpg";
import NRIStudent from "../../assets/nriStudent.jpg";

const contacts = [
  {
    name: "Ashish Singh Thakur",
    role: "Hackathon Manager",
    phone: "+91 9907096014",
    image: AshishSir,
  },
  {
    name: "Aman Verma",
    role: "Hackathon Coordinator",
    phone: "+91 7974716422",
    image: NRIStudent,
  },
];

export default function ContactSection() {
  return (
    <section className="py-12 px-4 sm:py-16 md:px-8 lg:px-16 bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            <span className="text-[#0B2A4A]">Contact Information</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2 sm:px-4">
            Get in touch with our team for any questions or support
          </p>
        </div>

        {/* Contacts Grid */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-8">
          {contacts.map((contact, idx) => (
            <div
              key={`${contact.name}-${idx}`}
              className="bg-white rounded-lg cursor-default shadow-md transition-all duration-300 p-4 sm:p-6   flex flex-col items-center text-center border border-slate-200 w-full xs:w-[280px] sm:w-[300px] h-[300px] sm:h-[300px] "
            >
              {/* Image */}
              <div className="mt-[-28px] h-[180px] sm:h-[220px] w-full flex items-center justify-center overflow-hidden rounded-xl">
                <img
                  src={contact.image}
                  alt={contact.name}
                  className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] object-cover object-center rounded-full border-[#e0e7ff] border-4"
                />
              </div>

              {/* Content */}
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mt-[-20px]">
                {contact.name}
              </h3>
              <p className="text-slate-700 font-medium text-sm sm:text-sm mb-2">
                {contact.role}
              </p>

              <div className="flex items-center gap-3 bg-[#eef2ff] rounded-full px-3 sm:px-4 py-2">
                <FaPhoneAlt className="text-slate-700 text-sm sm:text-base" />
                <a
                  href={`tel:${contact.phone}`}
                  className="text-slate-800 font-medium hover:text-indigo-600 transition-colors text-sm sm:text-base"
                >
                  {contact.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}