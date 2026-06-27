import { useEffect } from "react";
import { useParams } from "react-router";
import { useInterview } from "../hooks/useInterview";
import Sidebar from "../components/Sidebar";
import ReportContent from "../components/ReportContent";
import GenerateForm from "../components/GenerateForm";

export default function InterviewPage() {
    const { id } = useParams();
    const { fetchReportById, activeReport, loading, setActiveReport } = useInterview();

    // Rehydration Logic: If URL has an ID, fetch that report
    useEffect(() => {
        if (id) {
            fetchReportById(id);
        } else {
            setActiveReport(null);
        }
    }, [id, fetchReportById, setActiveReport]);

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--bg-primary)', overflow: 'hidden' }}>
            <Sidebar />
            
            <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                {loading ? (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '20px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>
                            </div>
                            Loading Report Data...
                        </div>
                    </div>
                ) : activeReport ? (
                    <ReportContent />
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                        <GenerateForm />
                    </div>
                )}
            </main>
        </div>
    );
}

