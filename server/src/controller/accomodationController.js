// controller for accomodation CRUD
import Accomodation from '../models/accomodationModel.js';
import mongoose from 'mongoose';

/**
 * POST /api/accomodations
 * Create a new accomodation booking
 */
export const createAccomodation = async (req, res) => {
	try {
		const { teamid, name, phone, book, member } = req.body;

		if (!teamid || !name || !phone || !book || !member) {
			return res.status(400).json({ success: false, message: 'All fields are required: teamid, name, phone, book, member' });
		}

		if (!mongoose.Types.ObjectId.isValid(teamid)) {
			return res.status(400).json({ success: false, message: 'Invalid teamid format' });
		}

		const accomodation = new Accomodation({ teamid, name, phone, book, member });
		await accomodation.save();

		res.status(201).json({ success: true, accomodation });
	} catch (err) {
		console.error('createAccomodation error', err);
		res.status(500).json({ success: false, message: err.message });
	}
};

/**
 * GET /api/accomodations
 * Get all accomodation bookings (optionally filter by teamid via query)
 */
export const getAllAccomodations = async (req, res) => {
	try {
		const { teamid } = req.query;
		const filter = {};
		if (teamid) {
			if (!mongoose.Types.ObjectId.isValid(teamid)) {
				return res.status(400).json({ success: false, message: 'Invalid teamid format' });
			}
			filter.teamid = teamid;
		}

		const accomodations = await Accomodation.find(filter).sort({ createdAt: -1 });
		res.status(200).json({ success: true, accomodations });
	} catch (err) {
		console.error('getAllAccomodations error', err);
		res.status(500).json({ success: false, message: err.message });
	}
};

/**
 * GET /api/accomodations/:id
 * Get a single accomodation by id
 */
export const getAccomodationById = async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ success: false, message: 'Invalid id format' });
		}

		const accomodation = await Accomodation.findById(id);
		if (!accomodation) {
			return res.status(404).json({ success: false, message: 'Accomodation not found' });
		}

		res.status(200).json({ success: true, accomodation });
	} catch (err) {
		console.error('getAccomodationById error', err);
		res.status(500).json({ success: false, message: err.message });
	}
};

/**
 * PUT /api/accomodations/:id
 * Update an existing accomodation
 */
export const updateAccomodation = async (req, res) => {
	try {
		const { id } = req.params;
		const updates = req.body;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ success: false, message: 'Invalid id format' });
		}

		const accomodation = await Accomodation.findByIdAndUpdate(id, updates, { new: true });
		if (!accomodation) {
			return res.status(404).json({ success: false, message: 'Accomodation not found' });
		}

		res.status(200).json({ success: true, accomodation });
	} catch (err) {
		console.error('updateAccomodation error', err);
		res.status(500).json({ success: false, message: err.message });
	}
};

/**
 * DELETE /api/accomodations/:id
 * Delete an accomodation booking
 */
export const deleteAccomodation = async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ success: false, message: 'Invalid id format' });
		}

		const deleted = await Accomodation.findByIdAndDelete(id);
		if (!deleted) {
			return res.status(404).json({ success: false, message: 'Accomodation not found' });
		}

		res.status(200).json({ success: true, message: 'Accomodation deleted successfully' });
	} catch (err) {
		console.error('deleteAccomodation error', err);
		res.status(500).json({ success: false, message: err.message });
	}
};


