import React, { Component } from 'react';
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';

class HackathonTimer extends Component {
  render() {
    return (
      <div className="flex justify-center items-center h-full min-w-[50vh]">
        <FlipClockCountdown
          to={new Date('2025-11-06T12:00:00+05:30').getTime()}
          className="flip-clock"
          labels={['Days', 'Hours', 'Minutes', 'Seconds']}
          labelStyle={{ color: '#0B2A4A', fontSize: '16px' }}
          digitBlockStyle={{ backgroundColor: '#f0f0f0', color: '#0B2A4A' }}
        />
      </div>
    );
  }
}

export default HackathonTimer;