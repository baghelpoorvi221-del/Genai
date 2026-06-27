const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const  interviewController = require("../controllers/interview.controller")
const  upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router()
/**
 * @route POST /api/interview
 * @description  generate new  interview report on the basis  of user self description
 * ,resume pdf and job description.
 * @access private
 * 
 */

interviewRouter.post("/" , authMiddleware, upload.single("resume") ,interviewController.generateInterViewReportController)

/**
 * @route GET /api/interview
 * @description Get recent reports for the logged-in user
 * @access private
 */
interviewRouter.get("/", authMiddleware, interviewController.getRecentReportsController)

/**
 * @route GET /api/interview/:id
 * @description Get a specific report by ID
 * @access private
 */
interviewRouter.get("/:id", authMiddleware, interviewController.getReportByIdController)

/**
 * @route GET /api/interview/download/:id
 * @description Generate and download PDF for a report
 * @access private
 */
interviewRouter.get("/download/:id", authMiddleware, interviewController.generatePdfController)

module.exports = interviewRouter