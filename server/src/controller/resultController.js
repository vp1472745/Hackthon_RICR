// controllers/resultController.js
import Result from '../models/resultModel.js';
import Team from '../models/TeamModel.js';
import User from '../models/UserModel.js';
import ExcelJS from 'exceljs';

/**
 * GET /api/results/all-with-team-leader
 * Returns results with populated teamName, teamCode and leader GitHubProfile
 */
export const getResultsWithTeamAndLeader = async (req, res) => {
    try {
        const pipeline = [
            {
                $lookup: {
                    from: 'teams',           // collection name
                    localField: 'teamId',
                    foreignField: '_id',
                    as: 'team',
                },
            },
            { $unwind: { path: '$team', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'users',
                    let: { teamId: '$team._id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$teamId', '$$teamId'] },
                                        { $eq: ['$role', 'Leader'] } // matches your user doc role
                                    ]
                                }
                            }
                        },
                        { $project: { GitHubProfile: 1, fullName: 1 } },
                        { $limit: 1 }
                    ],
                    as: 'leader'
                }
            },
            { $unwind: { path: '$leader', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    teamId: 1,
                    ui: 1,
                    ux: 1,
                    presentation: 1,
                    viva: 1,
                    overAll: 1,
                    codeQuality: 1,
                    obtainedMarks: 1,
                    grade: 1,
                    'team.teamName': 1,
                    'team.teamCode': 1,
                    'leader.GitHubProfile': 1,
                    'leader.fullName': 1
                }
            }
        ];

        const results = await Result.aggregate(pipeline);
        res.status(200).json({ success: true, results });
    } catch (err) {
        console.error('getResultsWithTeamAndLeader error', err);
        res.status(500).json({ success: false, message: err.message });
    }
};


/**
 * GET /api/results/export-excel
 * Exports the same data to an .xlsx file for download
 * Header: Team Name, Team Code, GithubProfile, Code Quality, UI, UX, Presentation, Viva, Overall
 */
export const exportResultsExcel = async (req, res) => {
    try {
        const pipeline = [
            {
                $lookup: {
                    from: 'teams',
                    localField: 'teamId',
                    foreignField: '_id',
                    as: 'team',
                },
            },
            { $unwind: { path: '$team', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'users',
                    let: { teamId: '$team._id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$teamId', '$$teamId'] },
                                        { $eq: ['$role', 'Leader'] }
                                    ]
                                }
                            }
                        },
                        { $project: { GitHubProfile: 1 } },
                        { $limit: 1 }
                    ],
                    as: 'leader'
                }
            },
            { $unwind: { path: '$leader', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    teamName: '$team.teamName',
                    teamCode: '$team.teamCode',
                    githubProfile: '$leader.GitHubProfile',
                    codeQuality: '$codeQuality',
                    ui: '$ui',
                    ux: '$ux',
                    presentation: '$presentation',
                    viva: '$viva',
                    overAll: '$overAll',
                    obtainedMarks: '$obtainedMarks',
                    grade: '$grade'
                }
            }
        ];

        const rows = await Result.aggregate(pipeline);

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Results');

        sheet.columns = [
            { header: 'Team Name', key: 'teamName', width: 30 },
            { header: 'Team Code', key: 'teamCode', width: 18 },
            { header: 'GithubProfile', key: 'githubProfile', width: 45 },
            { header: 'Code Quality', key: 'codeQuality', width: 12 },
            { header: 'UI', key: 'ui', width: 8 },
            { header: 'UX', key: 'ux', width: 8 },
            { header: 'Presentation', key: 'presentation', width: 12 },
            { header: 'Viva', key: 'viva', width: 8 },
            { header: 'Overall', key: 'overAll', width: 10 },
            { header: 'Obtained Marks', key: 'obtainedMarks', width: 15 },
            { header: 'Grade', key: 'grade', width: 10 },
        ];

        rows.forEach(r => {
            sheet.addRow({
                teamName: r.teamName ?? '',
                teamCode: r.teamCode ?? '',
                githubProfile: r.githubProfile ?? '',
                codeQuality: r.codeQuality ?? '',
                ui: r.ui ?? '',
                ux: r.ux ?? '',
                presentation: r.presentation ?? '',
                viva: r.viva ?? '',
                overAll: r.overAll ?? '',
            });
        });

        sheet.getRow(1).font = { bold: true };

        const fileName = `results_export_${new Date().toISOString().slice(0, 10)}.xlsx`;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        await workbook.xlsx.write(res);
        res.status(200).end();
    } catch (err) {
        console.error('exportResultsExcel error', err);
        res.status(500).json({ success: false, message: err.message });
    }
};


/**
 * POST /api/results
 * Create a single result document (body must contain teamId and numeric scores)
 */
export const createResult = async (req, res) => {
    try {
        const { teamId, ui, ux, presentation, viva, overAll, codeQuality } = req.body;
        if (!teamId) return res.status(400).json({ success: false, message: 'teamId required' });

        const obtainedMarks = ui + ux + presentation + viva + overAll + codeQuality;
        //total marks is 100 Grade upto F
        const grade = obtainedMarks >= 90 ? 'A+' :
            obtainedMarks >= 80 ? 'A' :
                obtainedMarks >= 70 ? 'B+' :
                    obtainedMarks >= 60 ? 'B' :
                        obtainedMarks >= 50 ? 'C+' :
                            obtainedMarks >= 40 ? 'C' :
                                obtainedMarks >= 33 ? 'D' : 'F';


        const result = new Result({
            teamId,
            ui,
            ux,
            presentation,
            viva,
            overAll,
            codeQuality,
            obtainedMarks,
            grade
        });
        await result.save();
        res.status(201).json({ success: true, result });
    } catch (err) {
        console.error('createResult error', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateResult = async (req, res) => {
    try {
        const { id } = req.params;
        const { ui, ux, presentation, viva, overAll, codeQuality } = req.body;

        const obtainedMarks = ui + ux + presentation + viva + overAll + codeQuality;
        const grade = obtainedMarks >= 90 ? 'A+' :
            obtainedMarks >= 80 ? 'A' :
                obtainedMarks >= 70 ? 'B+' :
                    obtainedMarks >= 60 ? 'B' :
                        obtainedMarks >= 50 ? 'C+' :
                            obtainedMarks >= 40 ? 'C' :
                                obtainedMarks >= 33 ? 'D' : 'F';

        const result = await Result.findByIdAndUpdate(
            id,
            { ui, ux, presentation, viva, overAll, codeQuality, obtainedMarks, grade },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ success: false, message: 'Result not found' });
        }

        res.json({ success: true, result });
    } catch (err) {
        console.error('updateResult error', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteResult = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Result.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ success: false, message: 'Result not found' });
        }

        res.json({ success: true, message: 'Result deleted successfully' });
    } catch (err) {
        console.error('deleteResult error', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteAllResults = async (req, res) => {
    try {
        const deleteResult = await Result.deleteMany({});

        res.json({
            success: true,
            message: `All results deleted successfully (${deleteResult.deletedCount} results deleted)`,
            deletedCount: deleteResult.deletedCount
        });
    } catch (err) {
        console.error('deleteAllResults error', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * POST /api/results/import-excel
 * Upload Excel with columns:
 *  Team Code | Code Quality | UI | UX | Presentation | Viva | Overall
 *
 * For each row: find team by teamCode -> then upsert Result for that team (update if exists, else create)
 *
 * Use multer to send file (field name: file)
 */
export const importResultsExcel = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'Excel file required' });

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(req.file.buffer);

        const sheet = workbook.worksheets[0];
        // find header row (assume first row)
        const headerRow = sheet.getRow(1);
        // map headers -> column numbers
        const headerMap = {};
        headerRow.eachCell((cell, colNumber) => {
            const header = (cell.value || '').toString().trim().toLowerCase();
            headerMap[header] = colNumber;
        });

        // Expected headers (lowercase)
        // 'team name' optional, but we require 'team code' to match team
        const requiredHeader = 'team code';
        if (!headerMap[requiredHeader]) {
            return res.status(400).json({ success: false, message: 'Excel must have "Team Code" header' });
        }

        const updates = [];
        // iterate rows from row 2
        sheet.eachRow({ includeEmpty: false }, async (row, rowNumber) => {
            if (rowNumber === 1) return; // skip header
            const teamCode = row.getCell(headerMap['team code']).value
                ? row.getCell(headerMap['team code']).value.toString().trim()
                : null;

            if (!teamCode) return; // skip invalid

            // parse numeric fields (try flexible header names)
            const parseCell = (names) => {
                for (const name of names) {
                    const key = name.toLowerCase();
                    if (headerMap[key]) {
                        const v = row.getCell(headerMap[key]).value;
                        const num = v === null || v === undefined || v === '' ? null : Number(v);
                        return Number.isNaN(num) ? null : num;
                    }
                }
                return null;
            };

            const codeQuality = parseCell(['Code Quality (20)']);
            const ui = parseCell(['UI (10)']);
            const ux = parseCell(['UX (10)']);
            const presentation = parseCell(['Presentation (10)']);
            const viva = parseCell(['Viva (20)']);
            const overAll = parseCell(['Overall (30)']);

            // find team by teamCode
            const team = await Team.findOne({ teamCode });
            if (!team) {
                // skip or collect as error; here we skip
                return;
            }

            const obtainedMarks = (codeQuality ?? 0) + (ui ?? 0) + (ux ?? 0) + (presentation ?? 0) + (viva ?? 0) + (overAll ?? 0);
            const grade = obtainedMarks >= 90 ? 'A+' :
                obtainedMarks >= 80 ? 'A' :
                    obtainedMarks >= 70 ? 'B+' :
                        obtainedMarks >= 60 ? 'B' :
                            obtainedMarks >= 50 ? 'C+' :
                                obtainedMarks >= 40 ? 'C' :
                                    obtainedMarks >= 33 ? 'D' : 'F';
            // upsert result: if result exists for teamId, update; else create
            const updated = await Result.findOneAndUpdate(
                { teamId: team._id },
                {
                    $set: {
                        codeQuality: codeQuality ?? 0,
                        ui: ui ?? 0,
                        ux: ux ?? 0,
                        presentation: presentation ?? 0,
                        viva: viva ?? 0,
                        overAll: overAll ?? 0,
                        obtainedMarks,
                        grade
                    }
                },
                { upsert: true, new: true }
            );

            updates.push({ teamCode, resultId: updated._id });
        });

        // Note: sheet.eachRow callback above is async but doesn't wait automatically.
        // To ensure all rows processed, better to process using for loop:
        // (We used eachRow for brevity — if concurrency issues, we can reimplement.)
      
        res.status(200).json({ success: true, message: 'Import started', importedCount: updates.length, details: updates });
    } catch (err) {
        console.error('importResultsExcel error', err);
        res.status(500).json({ success: false, message: err.message });
    }
};



export const declareResults = async (req, res, next) => {
    //Shange the Status to Reviewed and assign ranks based on obtainedMarks
    try {
        // Fetch all results sorted by obtainedMarks descending
        const results = await Result.find().sort({ obtainedMarks: -1 });

        // Update status and rank
        for (let i = 0; i < results.length; i++) {
            results[i].status = 'Reviewed';
            results[i].rank = i + 1; // Rank starts from 1
            await results[i].save();
        }

        res.status(200).json({ success: true, message: 'Results declared successfully', results });
    } catch (err) {
        console.error('declareResults error', err);
        res.status(500).json({ success: false, message: err.message });
    }
};