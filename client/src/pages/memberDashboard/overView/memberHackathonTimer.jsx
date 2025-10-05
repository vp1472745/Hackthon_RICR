import React, { useState, useEffect } from 'react';
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';

const HackathonTimer = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Track window resize for responsive adjustments
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Adjust font size and digit block size based on screen width
  const getDigitBlockStyle = () => {
    if (windowWidth >= 1024) {
      // Large screens (lg+)
      return { backgroundColor: '#f0f0f0', color: '#0B2A4A', width: '55px', height: '80px', fontSize: '32px' };
    } else if (windowWidth >= 640) {
      // Medium screens (sm to md)
      return { backgroundColor: '#f0f0f0', color: '#0B2A4A', width: '50px', height: '70px', fontSize: '26px' };
    } else {
      // Small screens (mobile)
      return { backgroundColor: '#f0f0f0', color: '#0B2A4A', width: '22px', height: '40px', fontSize: '20px' };
    }
  };

  const getLabelStyle = () => {
    if (windowWidth >= 1024) return { color: '#0B2A4A', fontSize: '18px' };
    if (windowWidth >= 640) return { color: '#0B2A4A', fontSize: '16px' };
    return { color: '#0B2A4A', fontSize: '14px' };
  };

  return (
    <div className="flex justify-center items-center py-4 px-5 sm:px-8">
      <FlipClockCountdown
        to={new Date('2025-11-06T12:00:00+05:30').getTime()}
        className="flip-clock w-full max-w-lg text-2xl sm:text-4xl font-semibold"
        labels={['Days', 'Hours', 'Minutes', 'Seconds']}
        labelStyle={getLabelStyle()}
        digitBlockStyle={getDigitBlockStyle()}
      />
    </div>
  );
};

export default HackathonTimer;
