import { createContext, useState, useEffect, useCallback } from "react";
import { getRecentReports, getReportById, generateReport } from "./services/interview.api";

export const InterviewContext = createContext();

export function InterviewProvider({ children }) {
    const [recentReports, setRecentReports] = useState([]);
    const [activeReport, setActiveReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRecentReports = useCallback(async () => {
        try {
            const reports = await getRecentReports();
            setRecentReports(reports);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const fetchReportById = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const report = await getReportById(id);
            setActiveReport(report);
        } catch (err) {
            setError("Failed to load report");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createNewReport = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await generateReport(formData);
            setActiveReport(data.interviewReport);
            // Refresh sidebar list
            await fetchRecentReports();
            return data.interviewReport;
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to generate report");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Load recent reports on mount
    useEffect(() => {
        fetchRecentReports();
    }, [fetchRecentReports]);

    return (
        <InterviewContext.Provider value={{
            recentReports,
            activeReport,
            loading,
            error,
            setActiveReport,
            fetchRecentReports,
            fetchReportById,
            createNewReport
        }}>
            {children}
        </InterviewContext.Provider>
    );
}
