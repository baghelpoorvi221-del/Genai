const { PDFParse } = require("pdf-parse"); 
const { generateInterviewReport } = require("../services/ai.service"); 
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Controller to generate interview report
 */
async function generateInterViewReportController(req, res) {
    let pdfInstance = null;
    try {
        // 1. File Check
        if (!req.file) {
            return res.status(400).json({ 
                message: "Resume file is required. Make sure you are using form-data and the key is 'resume'." 
            });
        }

        // 2. PDF Parsing (Updated for version 2.x)
        pdfInstance = new PDFParse({ data: req.file.buffer }); 
        const pdfData = await pdfInstance.getText();
        const resumeContentText = pdfData.text || "";
        
        // Clean up memory
        await pdfInstance.destroy();
        pdfInstance = null;

        // 3. Body Data
        const { selfDescription, jobDescription } = req.body;

        // 4. AI Service Call
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContentText,
            selfDescription,
            jobDescription
        });

        // 5. Database Save
        console.log("Saving report to database...");
        const newReport = new interviewReportModel({
            user: req.user.id,
            resume: resumeContentText,
            selfDescription: selfDescription || "",
            jobDescription: jobDescription || "",
            ...interViewReportByAi
        });

        const interviewReport = await newReport.save();

        // 6. Success Response
        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });

    } catch (error) {
        console.error("Backend Error:", error);
        
        // Clean up PDF parser if still exists
        if (pdfInstance && typeof pdfInstance.destroy === 'function') {
            try { await pdfInstance.destroy(); } catch (e) {}
        }
        
        // Check if it's an AI Service error (e.g., from @google/genai)
        if (error.status || error.statusCode) {
            const status = error.status || error.statusCode;
            return res.status(status).json({
                message: "AI Service Error",
                details: error.message,
                suggestion: status === 503 || status === 429 ? "The AI model is busy. Please try again in 30 seconds." : "Check your API key and model availability."
            });
        }

        res.status(500).json({ 
            message: "Internal Server Error", 
            error: error.message 
        });
    }
}

/**
 * @description Controller to get recent reports for logged in user
 */
async function getRecentReportsController(req, res) {
    try {
        const reports = await interviewReportModel.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(10);
        res.status(200).json({ reports });
    } catch (error) {
        console.error("Error fetching recent reports:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

/**
 * @description Controller to get a specific report by ID
 */
async function getReportByIdController(req, res) {
    try {
        const report = await interviewReportModel.findOne({ 
            _id: req.params.id, 
            user: req.user.id 
        });
        
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }
        res.status(200).json({ report });
    } catch (error) {
        console.error("Error fetching report:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

/**
 * @description Controller to generate PDF from report using Puppeteer
 */
async function generatePdfController(req, res) {
    try {
        const report = await interviewReportModel.findOne({ 
            _id: req.params.id, 
            user: req.user.id 
        });

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        // Initialize Puppeteer
        const puppeteer = require('puppeteer');
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // Enhanced HTML string for a premium PDF
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <style>
                    :root {
                        --primary: #2c3e50;
                        --accent: #3498db;
                        --success: #27ae60;
                        --warning: #f39c12;
                        --danger: #e74c3c;
                        --text: #333;
                        --muted: #7f8c8d;
                    }
                    body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 40px; color: var(--text); line-height: 1.6; }
                    .header { border-bottom: 2px solid var(--accent); padding-bottom: 20px; margin-bottom: 30px; }
                    .header h1 { margin: 0; color: var(--primary); font-size: 28px; }
                    .header p { margin: 5px 0 0 0; color: var(--muted); }
                    .score-card { background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #eee; display: flex; align-items: center; margin-bottom: 30px; }
                    .score-value { font-size: 36px; font-weight: bold; color: var(--success); margin-right: 15px; }
                    .score-label { font-size: 14px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }
                    h2 { color: var(--primary); border-left: 4px solid var(--accent); padding-left: 12px; margin-top: 40px; font-size: 20px; }
                    .q-box { margin-bottom: 25px; page-break-inside: avoid; }
                    .q-text { font-weight: bold; font-size: 16px; margin-bottom: 5px; }
                    .q-intent { font-style: italic; color: var(--muted); font-size: 14px; margin-bottom: 8px; }
                    .q-answer { background: #fff; border: 1px solid #eef; padding: 12px; border-radius: 4px; }
                    .gap-item { padding: 10px; margin-bottom: 10px; background: #fff; border-radius: 4px; border-left: 4px solid #ddd; }
                    .severity-high { border-left-color: var(--danger); color: var(--danger); }
                    .severity-medium { border-left-color: var(--warning); color: var(--warning); }
                    .severity-low { border-left-color: var(--success); color: var(--success); }
                    .plan-day { margin-bottom: 20px; }
                    .plan-day h3 { font-size: 16px; margin-bottom: 10px; color: var(--accent); }
                    .plan-tasks { margin: 0; padding-left: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Interview Preparation Report</h1>
                    <p>Target Role: ${report.title || "Target Role"} | Date: ${new Date(report.createdAt).toLocaleDateString()}</p>
                </div>

                <div class="score-card">
                    <span class="score-value">${report.matchScore || 0}%</span>
                    <span class="score-label">Overall Profile Match Score</span>
                </div>

                <h2>Technical Assessment</h2>
                ${(report.technicalQuestions || []).map((q, i) => `
                    <div class="q-box">
                        <div class="q-text">Q${i+1}: ${q.question}</div>
                        <div class="q-intent">Intent: ${q.intention}</div>
                        <div class="q-answer"><strong>Best Approach:</strong> ${q.answer}</div>
                    </div>
                `).join('')}

                <h2>Behavioral & Culture Fit</h2>
                ${(report.behavioralQuestions || []).length > 0 ? (report.behavioralQuestions || []).map((q, i) => `
                    <div class="q-box">
                        <div class="q-text">${q.question}</div>
                        <div class="q-answer">${q.answer}</div>
                    </div>
                `).join('') : '<p>No behavioral questions generated.</p>'}

                <h2>Skill Gap Analysis</h2>
                ${(report.skillGaps || []).length > 0 ? (report.skillGaps || []).map(g => `
                    <div class="gap-item severity-${(g.severity || 'low').toLowerCase()}">
                        <strong>${g.skill}</strong> — Priority: ${g.severity}
                    </div>
                `).join('') : '<p>No major gaps identified.</p>'}
                
                <div style="page-break-before: always;"></div>
                <h2>7-Day Preparation Plan</h2>
                ${(report.preparationPlan || []).map(p => `
                    <div class="plan-day">
                        <h3>Day ${p.day}: ${p.focus}</h3>
                        <ul class="plan-tasks">
                            ${(p.tasks || []).map(t => `<li>${t}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </body>
            </html>
        `;

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '40px', right: '40px', bottom: '40px', left: '40px' }
        });

        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=InterviewReport_${report._id}.pdf`);
        res.status(200).send(pdfBuffer);

    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}


module.exports = { 
    generateInterViewReportController,
    getRecentReportsController,
    getReportByIdController,
    generatePdfController
};
