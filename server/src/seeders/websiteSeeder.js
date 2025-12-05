import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";
import HomeSeeder from "../models/homeSeederModel.js";
import dotenv from "dotenv";

dotenv.config();

const WebsiteSeeder = [
  {
    title: "Nav Kalpana",
    navbarName: "NavbarName",
    heroSection: {
      heading: "NavKalpana",
      subheading: "Conducted by NIIST and Powered by RICR",
      description:
        "Join us for an exciting hackathon where innovation meets opportunity. Build groundbreaking solutions, compete for ₹40,000 in prizes, and shape the future of technology!",
      stats: [
        { label: "Prize Pool", value: "₹40,000" },
        { label: "Registration Fee", value: "₹1,500" },
        { label: "Team Size", value: "1-4" },
        { label: "Event Dates", value: "Feb 25th - 26th, 2026" },
      ],
      cta: "Register Now",
    },
    roadMap: [
      {
        title: "Registration Open",
        date: "10 Dec 2025",
        time: "09:00 AM",
        color: "blue",
      },
      {
        title: "Registration Close",
        date: "24 Feb 2026",
        time: "09:15 AM",
        color: "green",
      },
      {
        title: "Hackathon Begins",
        date: "25 Feb 2026",
        time: "09:30 AM",
        color: "purple",
      },
      {
        title: "Hackathon Finales",
        date: "26 Feb 2026",
        time: "09:00 AM",
        color: "orange",
      },
      {
        title: "Results Announcement",
        date: "26 Feb 2026",
        time: "12:00 PM",
        color: "pink",
      },
      {
        title: "Prizes Distribution",
        date: "26 Feb 2026",
        time: "02:00 PM",
        color: "indigo",
      },
    ],
    eventDetails: {
      teamStructure: [
        "Minimum: 1 member (Team Leader only)",
        "Maximum: 4 members (Team Leader + 3 members)",
        "Team alterations allowed until Feb 25, 2026",
      ],
      accommodation: [
        {
          name: "RICR Hostel",
          description: "Hostel facility available at RICR",
          contact: "+91 62689 23703",
          mapLink:
            "https://www.google.com/maps/place/RICR+-+Raj+Institute+of+Coding+%26+Robotics+%7C+Best+Java+Coding+Classes+In+Bhopal/@23.2689676,77.4524774,17z/data=!3m2!4b1!5s0x397c69f43f4807e5:0x6396b47e29fb2ed7!4m6!3m5!1s0x397c6967f58e0dbf:0x65d0724cf8368e2d!8m2!3d23.2689627!4d77.4573483!16s%2Fg%2F11vzch1wzj?entry=ttu",
        },
        {
          name: "NIIST Hostel",
          description: "Hostel facility available at NIIST",
          contact: "+91 62689 23703",
          mapLink:
            "https://www.google.com/maps/place/NRI+Institute+of+Research+and+Technology+(NIRT),+Bhopal,+M.P/@23.2458624,77.5000911,762m/data=!3m2!1e3!4b1!4m6!3m5!1s0x397c412491bc4217:0x992321e57fea48dc!8m2!3d23.2458575!4d77.502666!16s%2Fg%2F11gj0tht90?entry=ttu&g_ep=EgoyMDI1MTAwNy4wIKXMDSoASAFQAw%3D%3D",
        },
      ],
      prizes: [
        "₹40,000 Total Prize Pool",
        "Industry Mentorship",
        "Networking Opportunities",
        "Certificate of Participation",
      ],
      venue: {
        name: "NRI Institute of Information Science and Technology (NIIST), Bhopal, Madhya Pradesh",
        mapLink:
          "https://www.google.com/maps/place/NRI+Institute+of+Research+and+Technology+(NIRT),+Bhopal,+M.P/@23.2458624,77.5000911,762m/data=!3m2!1e3!4b1!4m6!3m5!1s0x397c412491bc4217:0x992321e57fea48dc!8m2!3d23.2458575!4d77.502666!16s%2Fg%2F11gj0tht90?entry=ttu&g_ep=EgoyMDI1MTAwNy4wIKXMDSoASAFQAw%3D%3D",
      },
      registration: {
        fee: "₹1,500 (Non-refundable)",
        paymentMethod: "Payment via UPI QR Code",
      },
    },
    juryPanel: [
      {
        name: "Pranay K Das",
        role: "Senior Java Instructor",
        image: "../../assets/pranaySir.png",
      },
      {
        name: "Raj Vardhan",
        role: "Full Stack Trainer",
        image: "../../assets/rajSir.png",
      },
      {
        name: "Dr.Vandana Khare",
        role: "Dean Academics",
        image: "../../assets/Vadhana.jpeg",
      },
      {
        name: "Dr.Shekhar Nigam",
        role: "Head, MCA and IT",
        image: "../../assets/Shekar.jpeg",
      },
      {
        name: "Mr. Shivam Varshi",
        role: "Head, AIML and CSIT",
        image: "../../assets/Shivam.jpeg",
      },
    ],
    contactSection: [
      {
        name: " Ashish Singh Thaku",
        role: "Hackathon Manager",
        contact: "+91 9907096014",
        image: "../../assets/ashishSir.jpg",
      },
      {
        name: "Aman Verma",
        role: "Hackathon Coordinator",
        contact: "+91 79747 16422",
        image: "../../assets/nriStudent.jpg",
      },
    ],
    registrationCTA: {
      heading: "Ready to Join Nav Kalpana?",
      description:
        "Don't miss this incredible opportunity to showcase your skills, compete for ₹40,000 in prizes, and build the future of technology!",
      buttonText: "Register Now",
      feeDetails:
        "Registration fee: ₹1,500 (Non-refundable) | Team alterations allowed until Feb 25, 2026, 11:59 PM IST",
    },
    faqSection: [
      {
        question: "Who can register?",
        answer:
          "Any student or professional team leader can register for the hackathon. Each team must have a minimum of 1 member (Team Leader) and can have up to 4 members in total.",
        category: "Registration",
      },
      {
        question: "How many members are allowed per team?",
        answer: "Minimum: 1 , Maximum: 4 (Team Leader + up to 3 members)",
        category: "Team",
      },
      {
        question: "Until when can teams be updated or altered?",
        answer:
          "Team alterations are allowed until Feb 25, 2026, 11:59 PM IST. After this deadline, no changes will be permitted.",
        category: "Team",
      },
      {
        question: "Can one person be part of multiple teams?",
        answer: "No",
        category: "Team",
      },
      {
        question: "Should each team member's email be unique?",
        answer:
          "Yes. Each email must be unique in the registration system. If an email already exists in the database, registration will be blocked.",
        category: "Registration",
      },
      {
        question: "What is the registration fee?",
        answer:
          "The registration fee is ₹1,500 (non-refundable). Payment must be made via the provided QR code.",
        category: "Payment",
      },
      {
        question: "How should the payment receipt be submitted?",
        answer:
          "After completing the QR payment, upload a transaction screenshot (JPEG/PNG) where the UTR/transaction reference number is clearly visible.",
        category: "Payment",
      },
      {
        question: "How long does payment verification take?",
        answer:
          "Verification will take place within 24 hours (manual review by the admin). The initial payment status will remain 'Pending' until verification. Once confirmed, the status will be updated to 'Confirmed.'",
        category: "Payment",
      },
      {
        question: "What happens if the payment is rejected?",
        answer:
          "You will receive a rejection email with the reason (e.g., invalid UTR). If allowed, you may re-submit the payment receipt.",
        category: "Payment",
      },
      {
        question: "Where can teams log in?",
        answer:
          "Teams can log in at /hackathon-login using their Team ID and password. A CAPTCHA will also be required for security.",
        category: "Login",
      },
      {
        question: "When will the Team ID and password be provided?",
        answer:
          "After payment verification, the admin will confirm registration, update the database, and send an email containing: Team ID (HACK-XXXX format) and auto-generated password (8–12 alphanumeric characters).",
        category: "Login",
      },
      {
        question: "Until when can teams edit their dashboard details?",
        answer:
          "Teams can edit their details only during the alteration window until Feb 25, 2026, 11:59 PM IST. After this, edits will be disabled.",
        category: "Team",
      },
    ],
  },
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log("MONGO_URL:", process.env.MONGO_URL);

    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Clear existing data
    await HomeSeeder.deleteMany({});
    console.log("Existing data cleared");

    // Insert new data
    await HomeSeeder.insertMany(WebsiteSeeder);
    console.log("WebsiteSeeder data inserted successfully");

    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// If the module is executed directly with `node websiteSeeder.js`, run seedDatabase()
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  seedDatabase();
}

// Export the array and the function if you want to import them elsewhere
export { WebsiteSeeder, seedDatabase };
export default WebsiteSeeder;