import React from 'react';

const Step3 = ({ data, onChange }) => (
  <div>
    <h2 className="text-xl font-bold mb-4">Step 3: Preferences</h2>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Favorite Color</label>
      <input
        type="text"
        name="color"
        value={data.color || ''}
        onChange={onChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
        placeholder="Enter favorite color"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Hobby</label>
      <input
        type="text"
        name="hobby"
        value={data.hobby || ''}
        onChange={onChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
        placeholder="Enter your hobby"
      />
    </div>
  </div>
);

export default Step3;
