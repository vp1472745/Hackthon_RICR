import React from 'react';
import { CheckCircle } from 'lucide-react';

const Step4 = ({ data, onChange }) => (
  <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl shadow-lg p-6">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-600 rounded-full flex items-center justify-center">
        <CheckCircle className="w-7 h-7 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Confirmation & Review</h2>
    </div>
    <div className="mb-6">
      <label className="block text-base font-semibold mb-2 text-gray-700">Summary</label>
      <textarea
        name="summary"
        value={data.summary || ''}
        onChange={onChange}
        className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-800 text-base resize-none transition-all duration-200 shadow-sm"
        placeholder="Write a short summary of your information..."
        rows={4}
      />
    </div>
    <div className="bg-white rounded-lg p-4 shadow flex items-center gap-3 mb-4">
      <CheckCircle className="w-5 h-5 text-green-500" />
      <span className="text-green-700 font-medium">All steps completed! Please review and save your information.</span>
    </div>
    <div className="text-gray-500 text-sm text-center mt-2">
      <span className="font-semibold text-blue-700">Tip:</span> Double-check your summary before saving. You can edit later if needed.
    </div>
  </div>
);

export default Step4;
