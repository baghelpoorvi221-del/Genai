import { useInterview } from "../hooks/useInterview";
import { downloadReportPdf } from "../services/interview.api";

export default function ReportContent() {
    const { activeReport } = useInterview();

    if (!activeReport) return null;

    const handleDownload = async () => {
        try {
            await downloadReportPdf(activeReport._id);
        } catch (err) {
            alert("Failed to download PDF");
        }
    };

    return (
        <div style={{ flex: 1, padding: '40px', background: 'var(--bg-primary)', color: 'var(--text-primary)', overflowY: 'auto', height: '100vh' }}>
            {/* Header Section */}
            <div className="glass" style={{ padding: '30px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', background: 'linear-gradient(to right, #fff, #a1a1aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Interview Analysis
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4caf50' }}></span>
                        Generated for: {activeReport.title || "Target Role"} • {new Date(activeReport.createdAt).toLocaleDateString()}
                    </p>
                </div>
                
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--accent-primary)', lineHeight: '1' }}>
                            {activeReport.matchScore}%
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600', marginTop: '4px' }}>
                            Match Score
                        </div>
                    </div>
                    <button 
                        onClick={handleDownload}
                        className="btn btn-primary"
                        style={{ height: '48px', padding: '0 24px' }}
                    >
                        Download PDF
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '30px' }}>
                <div className="left-column">
                    {/* Technical Questions */}
                    <section style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0, 122, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-secondary)' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                            </div>
                            <h2 style={{ fontSize: '20px', margin: 0 }}>Technical Assessment</h2>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {activeReport.technicalQuestions?.map((q, i) => (
                                <div key={i} className="glass" style={{ padding: '24px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)' }}>
                                    <h4 style={{ margin: '0 0 12px 0', color: 'var(--accent-secondary)', fontSize: '17px', lineHeight: '1.4' }}>
                                        <span style={{ opacity: 0.5, marginRight: '8px' }}>{String(i+1).padStart(2, '0')}</span> 
                                        {q.question}
                                    </h4>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Interviewer's Intent</span>
                                        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '14px', fontStyle: 'italic' }}>{q.intention}</p>
                                    </div>
                                    <p style={{ margin: 0, lineHeight: '1.7', color: 'var(--text-primary)', fontSize: '15px' }}>
                                        <strong style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontSize: '12px', textTransform: 'uppercase' }}>Expert Response Strategy</strong>
                                        {q.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Behavioral Questions */}
                    {activeReport.behavioralQuestions && activeReport.behavioralQuestions.length > 0 && (
                        <section>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(88, 86, 214, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-tertiary)' }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                </div>
                                <h2 style={{ fontSize: '20px', margin: 0 }}>Behavioral & Culture</h2>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {activeReport.behavioralQuestions.map((q, i) => (
                                    <div key={i} className="glass" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
                                        <h4 style={{ margin: '0 0 12px 0', color: 'var(--accent-tertiary)', fontSize: '17px' }}>{q.question}</h4>
                                        <p style={{ margin: '0 0 16px 0', color: 'var(--text-secondary)', fontSize: '14px' }}><strong>Strategy:</strong> {q.intention}</p>
                                        <p style={{ margin: 0, lineHeight: '1.7', fontSize: '15px' }}>{q.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="right-column">
                    {/* Skill Gaps */}
                    <section style={{ marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ color: '#ff9f0a' }}>●</span> Potential Skill Gaps
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {activeReport.skillGaps?.length > 0 ? activeReport.skillGaps.map((gap, i) => (
                                <div key={i} className="glass" style={{ padding: '16px', background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: gap.severity === 'high' ? '#ff2d55' : gap.severity === 'medium' ? '#ff9f0a' : '#30d158' }}></div>
                                    <div style={{ fontWeight: '600', marginBottom: '4px', fontSize: '15px' }}>{gap.skill}</div>
                                    <span className={`badge badge-${gap.severity.toLowerCase()}`}>
                                        {gap.severity} Priority
                                    </span>
                                </div>
                            )) : (
                                <div className="glass" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    All core skills identified in resume.
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Preparation Road Map */}
                    <section>
                        <h2 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ color: '#30d158' }}>●</span> 7-Day Road Map
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {activeReport.preparationPlan?.length > 0 ? activeReport.preparationPlan.map((plan, i) => (
                                <div key={i} style={{ position: 'relative', paddingLeft: '30px' }}>
                                    {/* Timeline connector */}
                                    {i < activeReport.preparationPlan.length - 1 && (
                                        <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: '-16px', width: '2px', background: 'var(--glass-border)' }}></div>
                                    )}
                                    <div style={{ position: 'absolute', left: 0, top: '4px', width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-tertiary)', border: '2px solid var(--accent-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                                        {plan.day}
                                    </div>
                                    <div className="glass" style={{ padding: '16px', background: 'var(--bg-secondary)' }}>
                                        <h4 style={{ margin: '0 0 10px 0', fontSize: '15px', color: 'var(--text-primary)' }}>{plan.focus}</h4>
                                        <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6' }}>
                                            {plan.tasks.map((t, idx) => (
                                                <li key={idx} style={{ marginBottom: '4px' }}>{t}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )) : (
                                <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No roadmap available.</p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
