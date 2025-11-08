import mongoose from "mongoose";

const WebsiteSeeder = [
  {
    title: "Nav Kalpana",
    navbarName: "NavbarName",
    heroSection: {
      heading: "NavKalpana",
      subheading: "Conducted by NIIST and Powered by RICR",
      description: "Join us for an exciting hackathon where innovation meets opportunity. Build groundbreaking solutions, compete for ₹40,000 in prizes, and shape the future of technology!",
      stats: [
        { label: "Prize Pool", value: "₹40,000" },
        { label: "Registration Fee", value: "₹1,500" },
        { label: "Team Size", value: "1-4" },
        { label: "Event Dates", value: "Feb 25th - 26th, 2026" }
      ],
      cta: "Register Now"
    },
    roadMap: [
      { title: "Registration Open", date: "1 Feb 2026", time: "09:00 AM", color: "blue" },
      { title: "Registration Close", date: "24 Feb 2026", time: "09:15 AM", color: "green" },
      { title: "Hackathon Begins", date: "25 Feb 2026", time: "09:30 AM", color: "purple" },
      { title: "Hackathon Finales", date: "26 Feb 2026", time: "09:00 AM", color: "orange" },
      { title: "Results Announcement", date: "26 Feb 2026", time: "12:00 PM", color: "pink" },
      { title: "Prizes Distribution", date: "26 Feb 2026", time: "02:00 PM", color: "indigo" }
    ],
    eventDetails: {
      teamStructure: [
        "Minimum: 1 member (Team Leader only)",
        "Maximum: 4 members (Team Leader + 3 members)",
        "Team alterations allowed until Feb 25, 2026"
      ],
      accommodation: [
        {
          name: "RICR Hostel",
          description: "Hostel facility available at RICR",
          contact: "+91 62689 23703",
          mapLink: "https://www.google.com/maps/place/RICR+-+Raj+Institute+of+Coding+%26+Robotics+%7C+Best+Java+Coding+Classes+In+Bhopal/@23.2689676,77.4524774,17z/data=!3m2!4b1!5s0x397c69f43f4807e5:0x6396b47e29fb2ed7!4m6!3m5!1s0x397c6967f58e0dbf:0x65d0724cf8368e2d!8m2!3d23.2689627!4d77.4573483!16s%2Fg%2F11vzch1wzj?entry=ttu"
        },
        {
          name: "NIIST Hostel",
          description: "Hostel facility available at NIIST",
          contact: "+91 62689 23703",
          mapLink: "https://www.google.com/maps/place/NRI+Institute+of+Research+and+Technology+(NIRT),+Bhopal,+M.P/@23.2458624,77.5000911,762m/data=!3m2!1e3!4b1!4m6!3m5!1s0x397c412491bc4217:0x992321e57fea48dc!8m2!3d23.2458575!4d77.502666!16s%2Fg%2F11gj0tht90?entry=ttu&g_ep=EgoyMDI1MTAwNy4wIKXMDSoASAFQAw%3D%3D"
        }
      ],
      prizes: [
        "₹40,000 Total Prize Pool",
        "Industry Mentorship",
        "Networking Opportunities",
        "Certificate of Participation"
      ],
      venue: {
        name: "NRI Institute of Information Science and Technology (NIIST), Bhopal, Madhya Pradesh",
        mapLink: "https://www.google.com/maps/place/NRI+Institute+of+Research+and+Technology+(NIRT),+Bhopal,+M.P/@23.2458624,77.5000911,762m/data=!3m2!1e3!4b1!4m6!3m5!1s0x397c412491bc4217:0x992321e57fea48dc!8m2!3d23.2458575!4d77.502666!16s%2Fg%2F11gj0tht90?entry=ttu&g_ep=EgoyMDI1MTAwNy4wIKXMDSoASAFQAw%3D%3D"
      },
      registration: {
        fee: "₹1,500 (Non-refundable)",
        paymentMethod: "Payment via UPI QR Code"
      }
    },
    juryPanel: [
      {
        name: "Pranay K Das",
        role: "Senior Java Instructor",
        image: "../../assets/pranaySir.png"
      },
      {
        name: "Raj Vardhan",
        role: "Full Stack Trainer",
        image: "../../assets/rajSir.png"
      },
      {
        name: "Dr.Vandana Khare",
        role: "Dean Academics",
        image: "../../assets/Vadhana.jpeg"
      },
      {
        name: "Dr.Shekhar Nigam",
        role: "Head, MCA and IT",
        image: "../../assets/Shekar.jpeg"
      },
      {
        name: "Mr. Shivam Varshi",
        role: "Head, AIML and CSIT",
        image: "../../assets/Shivam.jpeg"
      }
    ],
    contactSection: [
      {
        name: " Ashish Singh Thaku",
        role: "Hackathon Manager",
        contact: "+91 9907096014",
        image: "../../assets/ashishSir.jpg  "
      },
      {
        name: "Aman Verma",
        role: "Hackathon Coordinator",
        contact: "+91 79747 16422",
        image: "../../assets/nriStudent.jpg"
      }
    ],
    registrationCTA: {
      heading: "Ready to Join Nav Kalpana?",
      description: "Don't miss this incredible opportunity to showcase your skills, compete for ₹40,000 in prizes, and build the future of technology!",
      buttonText: "Register Now",
      feeDetails: "Registration fee: ₹1,500 (Non-refundable) | Team alterations allowed until Nov 6, 2025"
    }
  }
];

module.exports = WebsiteSeeder;