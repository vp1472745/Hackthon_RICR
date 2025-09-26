import Team from "../models/TeamModel.js";

import Theme from "../models/projectTheme.js";



// Controller for selecting a theme for a team
export const selectThemeForTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { themeName } = req.body;
    // Find the theme by name
    const theme = await Theme.findOne({ themeName });
    if (!theme) {
      return res.status(404).json({ message: 'Theme not found' });
    }
    // Update the team with the theme's ObjectId
    const updatedTeam = await Team.findByIdAndUpdate(teamId, { teamTheme: theme._id }, { new: true });
    if (!updatedTeam) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.status(200).json({ message: 'Theme selected successfully', team: updatedTeam });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Create a new theme
export const createTheme = async (req, res) => {
	try {
		const { themeName, themeDescription } = req.body;
		if (!themeName || !themeDescription) {
			return res.status(400).json({ message: "Theme name and description are required." });
		}
		const theme = new Theme({ themeName, themeDescription });
		await theme.save();
		res.status(201).json({ message: "Theme created successfully", theme });
	} catch (error) {
		res.status(500).json({ message: "Failed to create theme", error: error.message });
	}
};

// Get all themes
export const getAllThemes = async (req, res) => {
	try {
		const themes = await Theme.find().sort({ createdAt: -1 });
		res.status(200).json({ themes });
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch themes", error: error.message });
	}
};

// Get a theme by ID
export const getThemeById = async (req, res) => {
	try {
		const { id } = req.params;
		const theme = await Theme.findById(id);
		if (!theme) {
			return res.status(404).json({ message: "Theme not found" });
		}
		res.status(200).json({ theme });
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch theme", error: error.message });
	}
};

// Update a theme
export const updateTheme = async (req, res) => {
	try {
		const { id } = req.params;
		const { themeName, themeDescription } = req.body;
		const updated = await Theme.findByIdAndUpdate(
			id,
			{ themeName, themeDescription },
			{ new: true, runValidators: true }
		);
		if (!updated) {
			return res.status(404).json({ message: "Theme not found" });
		}
		res.status(200).json({ message: "Theme updated successfully", theme: updated });
	} catch (error) {
		res.status(500).json({ message: "Failed to update theme", error: error.message });
	}
};

// Delete a theme
export const deleteTheme = async (req, res) => {
	try {
		const { id } = req.params;
		const deleted = await Theme.findByIdAndDelete(id);
		if (!deleted) {
			return res.status(404).json({ message: "Theme not found" });
		}
		res.status(200).json({ message: "Theme deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Failed to delete theme", error: error.message });
	}
};
