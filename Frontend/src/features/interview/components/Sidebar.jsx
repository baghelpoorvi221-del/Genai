import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router";

export default function Sidebar() {
    const { recentReports, activeReport } = useInterview();
    const navigate = useNavigate();

    return (
        <aside className="glass" style={{ 
            width: '280px', 
            background: 'var(--bg-secondary)', 
            padding: '24px', 
            borderRight: '1px solid var(--glass-border)', 
            height: '100vh', 
            color: 'white', 
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <h2 style={{ fontSize: '18px', margin: 0, fontWeight: '700' }}>YT-GenAI</h2>
            </div>

            <button 
                onClick={() => navigate('/interview')} 
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px' }}
            >
                + New Interview
            </button>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', marginBottom: '16px' }}>
                    Recent Analysis
                </p>
                <div className="report-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {recentReports && recentReports.map((report) => (
                        <div 
                            key={report._id} 
                            onClick={() => navigate(`/interview/${report._id}`)}
                            className={activeReport?._id === report._id ? 'glass' : ''}
                            style={{
                                padding: '12px',
                                background: activeReport?._id === report._id ? 'rgba(255, 45, 85, 0.05)' : 'transparent',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                border: activeReport?._id === report._id ? '1px solid rgba(255, 45, 85, 0.2)' : '1px solid transparent'
                            }}
                        >
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: activeReport?._id === report._id ? 'var(--text-primary)' : 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {report.title || (report.jobDescription ? report.jobDescription.substring(0, 20) + '...' : 'Interview Report')}
                            </h4>
                            <small style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                                {new Date(report.createdAt).toLocaleDateString()}
                            </small>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}

