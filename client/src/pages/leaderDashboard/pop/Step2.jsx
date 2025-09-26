import React from 'react';

const Step2 = ({ data, onChange }) => (
  <div>
    <h2 className="text-xl font-bold mb-4">Step 2: Details</h2>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Age</label>
      <input
        type="number"
        name="age"
        value={data.age || ''}
        onChange={onChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
        placeholder="Enter your age"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">City</label>
      <input
        type="text"
        name="city"
        value={data.city || ''}
        onChange={onChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
        placeholder="Enter your city"
      />
    </div>
  </div>
);

export default Step2;
