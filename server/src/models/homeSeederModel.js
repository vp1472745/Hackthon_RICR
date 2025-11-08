import mongoose from "mongoose";

const homeSeederSchema = new mongoose.Schema({
  title: { type: String, required: true },
  navbarName: { type: String, required: true },
  heroSection: {
    heading: { type: String, required: true },
    subheading: { type: String, required: true },
    description: { type: String, required: true },
    stats: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    cta: { type: String, required: true },
  },
  roadMap: [
    {
      title: { type: String, required: true },
      date: { type: String, required: true },
      time: { type: String, required: true },
      color: { type: String, required: true },
    },
  ],
  eventDetails: {
    teamStructure: [String],
    accommodation: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        contact: { type: String, required: true },
        mapLink: { type: String, required: true },
      },
    ],
    prizes: [String],
    venue: {
      name: { type: String, required: true },
      mapLink: { type: String, required: true },
    },
    registration: {
      fee: { type: String, required: true },
      paymentMethod: { type: String, required: true },
    },
  },
  juryPanel: [
    {
      name: { type: String, required: true },
      role: { type: String, required: true },
      image: { type: String, required: true },
    },
  ],
  contactSection: [
    {
      name: { type: String, required: true },
      role: { type: String, required: true },
      contact: { type: String, required: true },
      image: { type: String, required: true },
    },
  ],
  registrationCTA: {
    heading: { type: String, required: true },
    description: { type: String, required: true },
    buttonText: { type: String, required: true },
    feeDetails: { type: String, required: true },
  },
  faqSection: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
      category: { type: String, required: true },
    },
  ],
});

const HomeSeeder = mongoose.model("HomeSeeder", homeSeederSchema);

export default HomeSeeder;