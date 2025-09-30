import React from 'react'
import { AiOutlineClose } from "react-icons/ai";

const HackathonThemeModal = ({ isOpen, onClose, themeData }) => {
  if (!isOpen || !themeData) return null;

return (
    <div className="fixed inset-0 h-screen z-50 flex items-center justify-center bg-black/70">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
            <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
                onClick={onClose}
                aria-label="Close"
            >
                <AiOutlineClose size={24} />
            </button>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{themeData.title}</h2>
                <div className="h-1 w-full bg-blue-500 rounded mb-4"></div>
                <p className="text-gray-600 leading-relaxed">{themeData.description}</p>
            </div>
            <div className="flex justify-end">
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    </div>
)
}

export default HackathonThemeModal