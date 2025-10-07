import React from 'react'
import { AiOutlineClose } from "react-icons/ai";

const HackathonThemeModal = ({ isOpen, onClose, themeData }) => {
  if (!isOpen || !themeData) return null;

return (
    <div className="fixed inset-0 h-screen z-50 flex items-center justify-center bg-black/70 p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] p-6 md:p-8 overflow-hidden">
            <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
                onClick={onClose}
                aria-label="Close"
            >
                <AiOutlineClose size={24} />
            </button>
            <div className="mb-6 max-h-96 overflow-y-auto">
                <div className="flex items-center gap-3 mb-4">
                    {themeData.icon && (
                        <div className="text-2xl text-[#0B2A4A]">
                            {themeData.icon}
                        </div>
                    )}
                    <h2 className="text-2xl font-bold text-gray-800">{themeData.title || themeData.themeName}</h2>
                </div>
                <div className="h-1 w-full bg-blue-500 rounded mb-6"></div>
                
                {/* Short Description Section */}
                {(themeData.themeShortDescription || themeData.shortDescription) && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            Quick Overview
                        </h3>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                            <p className="text-gray-700 leading-relaxed">
                                {themeData.themeShortDescription || themeData.shortDescription}
                            </p>
                        </div>
                    </div>
                )}

                {/* Full Description Section */}
                {(themeData.themeDescription || themeData.description) && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Detailed Description
                        </h3>
                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                            <p className="text-gray-700 leading-relaxed">
                                {themeData.themeDescription || themeData.description}
                            </p>
                        </div>
                    </div>
                )}

          
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