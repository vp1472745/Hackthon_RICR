import React from "react";
import RajSir from "../../assets/rajSir.png";
import Vadhana from "../../assets/Vadhana.jpeg";
import Shekhar from "../../assets/Shekar.jpeg";
import Shivam from '../../assets/Shivam.jpeg';

const juryMembers = [

  {
    name: "Raj Vardhan",
    role: "Full Stack Trainer",
    image: RajSir,
  },
  {
    name: "Dr.Vandana Khare",
    role: "Dean Academics",
    image: Vadhana,
  },
  {
    name: "Dr.Shekhar Nigam",
    role: "Head, MCA and IT",
    image: Shekhar,
  },
  {
    name: "Mr. Shivam Varshi",
    role: "Head, AIML and CSIT",
    image: Shivam,
  },
];

export default function JuryPanel() {
  return (
    <section className="py-16 px-2 md:px-2 lg:px-16 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            <span className="text-[#0B2A4A]">Jury Panel</span>
          </h2>
        </div>

        {/* Jury Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 ">
          {juryMembers.map((jury, idx) => (
            <div key={`${jury.name}-${idx}`} className="bg-white rounded-lg cursor-default shadow-md p-8 flex flex-col items-center text-center border border-slate-200">
              {/* Image Container */}
              <div className="mb-1 h-[170px] mt-2 flex items-center justify-center">
                <img
                  src={jury.image}
                  alt={jury.name}
                  className="w-40 h-40 rounded-full object-cover object-top border-4 border-[#e0e7ff]"
                  style={{ objectPosition: "center top" }}
                />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                {jury.name}
              </h3>

              <div className="mb-2">
                <p className="text-slate-700 font-medium text-lg mb-1">
                  {jury.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
