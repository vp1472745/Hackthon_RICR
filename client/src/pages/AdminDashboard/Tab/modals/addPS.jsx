import React, { useState, useEffect } from 'react';
import { subAdminAPI } from '../../../../configs/api';

const AddPS = ({ onClose, onPSCreated }) => {
	const [PStitle, setPStitle] = useState('');
	const [PSdescription, setPSdescription] = useState('');
	const [PSTheme, setPSTheme] = useState('');
	const [themes, setThemes] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);

	useEffect(() => {
		// Fetch all themes for dropdown
		const fetchThemes = async () => {
			try {
				const res = await subAdminAPI.getAllThemes();
				setThemes(res.data.themes || []);
			} catch (err) {
				setError('Failed to load themes');
			}
		};
		fetchThemes();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setSuccess(null);
		if (!PStitle || !PSdescription || !PSTheme) {
			setError('All fields are required.');
			return;
		}
		setLoading(true);
		try {
			const res = await subAdminAPI.createProblemStatement({ PStitle, PSdescription, PSTheme });
			setSuccess('Problem statement created successfully!');
			setPStitle('');
			setPSdescription('');
			setPSTheme('');
			if (onPSCreated) onPSCreated();
			onClose();
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to create problem statement');
		}
		setLoading(false);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div>
				<label className="block text-gray-700 font-semibold mb-2">Title</label>
				<input
					type="text"
					value={PStitle}
					onChange={e => setPStitle(e.target.value)}
					className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-400"
					placeholder="Enter problem statement title"
				/>
			</div>
			<div>
				<label className="block text-gray-700 font-semibold mb-2">Description</label>
				<textarea
					value={PSdescription}
					onChange={e => setPSdescription(e.target.value)}
					className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-400"
					placeholder="Enter problem statement description"
					rows={4}
				/>
			</div>
			<div>
				<label className="block text-gray-700 font-semibold mb-2">Theme</label>
				<select
					value={PSTheme}
					onChange={e => setPSTheme(e.target.value)}
					className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-400"
				>
					<option value="">Select a theme</option>
					{themes.map(theme => (
						<option key={theme._id} value={theme._id}>{theme.themeName}</option>
					))}
				</select>
			</div>
			{error && <div className="text-red-600">{error}</div>}
			{success && <div className="text-green-600">{success}</div>}
			<div className="flex gap-4 justify-end">
				<button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
				<button type="submit" disabled={loading} className="px-6 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700">
					{loading ? 'Creating...' : 'Create'}
				</button>
			</div>
		</form>
	);
};

export default AddPS;
