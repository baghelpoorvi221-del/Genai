import { useState } from "react";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router";

export default function GenerateForm() {
    const { createNewReport, loading, error } = useInterview();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        selfDescription: "",
        jobDescription: ""
    });
    const [resumeFile, setResumeFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!resumeFile) {
            alert("Please upload your resume PDF");
            return;
        }

        const data = new FormData();
        data.append("selfDescription", formData.selfDescription);
        data.append("jobDescription", formData.jobDescription);
        data.append("resume", resumeFile);

        try {
            const report = await createNewReport(data);
            navigate(`/interview/${report._id}`);
        } catch (err) {
            console.error("Failed to submit form:", err);
        }
    };

    return (
        <div className="glass" style={{ maxWidth: '700px', width: '90%', padding: '40px', background: 'var(--bg-secondary)', color: 'white' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Create New Interview Analysis</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Upload your resume and the job details to generate an AI-powered preparation strategy.</p>
            </div>

            {error && <div style={{ background: 'rgba(255, 45, 85, 0.1)', border: '1px solid rgba(255, 45, 85, 0.2)', color: 'var(--accent-primary)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontSize: '14px' }}>{error}</div>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Resume Upload */}
                <div className="input-group">
                    <label>Resume (PDF format)</label>
                    <div style={{ position: 'relative', height: '100px', border: '2px dashed var(--glass-border)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', transition: 'all 0.2s' }}>
                        <input 
                            type="file" 
                            accept=".pdf" 
                            onChange={(e) => setResumeFile(e.target.files[0])} 
                            required
                            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }}
                        />
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: resumeFile ? 'var(--accent-secondary)' : 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
                                {resumeFile ? `✓ ${resumeFile.name}` : "Click or drag to upload your PDF resume"}
                            </div>
                            {!resumeFile && <small style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block', marginTop: '4px' }}>Max file size: 3MB</small>}
                        </div>
                    </div>
                </div>
                
                {/* Self Description */}
                <div className="input-group">
                    <label>Self Description (Optional)</label>
                    <textarea 
                        rows={3}
                        value={formData.selfDescription}
                        onChange={(e) => setFormData({ ...formData, selfDescription: e.target.value })}
                        placeholder="Highlight specific experience or strengths you want the AI to focus on..."
                        style={{ resize: 'none' }}
                    />
                </div>

                {/* Job Description */}
                <div className="input-group">
                    <label>Job Description</label>
                    <textarea 
                        rows={5}
                        value={formData.jobDescription}
                        onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                        placeholder="Paste the full job description or the core responsibilities here..."
                        required
                        style={{ resize: 'none' }}
                    />
                </div>

                <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ width: '100%', height: '54px', fontSize: '17px', marginTop: '8px' }}
                >
                    {loading ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>
                            AI is generating your report...
                        </span>
                    ) : "Generate Interview Strategy"}
                </button>
            </form>
        </div>
    );
}
