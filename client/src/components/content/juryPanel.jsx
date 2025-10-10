import React, { useState, useEffect, useRef } from "react";
import RajSir from "../../assets/rajSir.png";
import PranaySir from "../../assets/pranaySir.png";

const juryMembers = [
    {
        name: "Pranay K Das",
        role: "Senior Java Instructor",
        // org: "Applogic Networks",
        image: PranaySir,
    },
    {
        name: "Raj Vardhan",
        role: "Full Stack Trainer",
        // org: "Applogic Networks",
        image: RajSir,
    },

];

export default function JuryPanel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const sliderRef = useRef(null);
    const shouldAutoSlide = juryMembers.length > 3;

    useEffect(() => {
        if (!shouldAutoSlide || isPaused) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => 
                prevIndex === juryMembers.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [shouldAutoSlide, isPaused, juryMembers.length]);

    const nextSlide = () => {
        setCurrentIndex(currentIndex === juryMembers.length - 1 ? 0 : currentIndex + 1);
    };

    const prevSlide = () => {
        setCurrentIndex(currentIndex === 0 ? juryMembers.length - 1 : currentIndex - 1);
    };

    return (
        <section className="py-16 px-2 md:px-2 lg:px-16 bg-gradient-to-br from-slate-50 to-gray-100">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                     <span className="text-[#0B2A4A]">Jury Panel</span>
                    </h2>
         
                </div>

                {/* Slider Container */}
                <div className="relative">
                    {/* Navigation Arrows */}
                    {shouldAutoSlide && (
                        <>
                            <button
                                onClick={prevSlide}
                                onMouseEnter={() => setIsPaused(true)}
                                onMouseLeave={() => setIsPaused(false)}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white  text-slate-600 hover:text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300  border-slate-200"
                                aria-label="Previous slide"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={nextSlide}
                                onMouseEnter={() => setIsPaused(true)}
                                onMouseLeave={() => setIsPaused(false)}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-indigo-600 text-slate-600 hover:text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border border-slate-200"
                                aria-label="Next slide"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}

                    {/* Slider */}
                    <div 
                        ref={sliderRef}
                        className="overflow-hidden"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <div 
                            className={`transition-transform duration-500 ease-in-out ${
                                shouldAutoSlide ? 'flex' : 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8'
                            }`}
                            style={{
                                transform: shouldAutoSlide ? `translateX(-${currentIndex * (100 / 3)}%)` : 'none'
                            }}
                        >
                            {juryMembers.map((jury, idx) => (
                                <div
                                    key={`${jury.name}-${idx}`}
                                    className={`${
                                        shouldAutoSlide 
                                            ? 'flex-shrink-0 w-1/3 px-4'
                                            : ''
                                    }`}
                                >
                                    <div
                                        className="group bg-white rounded-lg shadow-md  transition-all duration-300 p-8 flex flex-col items-center text-center border border-slate-200"
                                    >
                                        {/* Image Container */}
                                        <div className="mb-1 h-[170px] mt-2 flex items-center justify-center">
                                            <img
                                                src={jury.image}
                                                alt={jury.name}
                                                className="w-40 h-40 rounded-full object-cover object-top border-4 border-[#e0e7ff]  transition-all duration-300"
                                                style={{ objectPosition: 'center top' }}
                                            />
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-2xl font-bold text-slate-800 mb-3">
                                            {jury.name}
                                        </h3>

                                        <div className="mb-2">
                                            <p className="text-slate-700 font-medium text-lg mb-1">{jury.role}</p>
                                            <p className="text-slate-500 text-md">{jury.org}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}