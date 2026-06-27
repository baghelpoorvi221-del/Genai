import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
    withCredentials: true
});

export async function generateReport(formData) {
    try {
        const response = await api.post('/api/interview', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (err) {
        console.error("Error generating report:", err);
        throw err;
    }
}

export async function getRecentReports() {
    try {
        const response = await api.get('/api/interview');
        return response.data.reports;
    } catch (err) {
        console.error("Error fetching recent reports:", err);
        throw err;
    }
}

export async function getReportById(id) {
    try {
        const response = await api.get(`/api/interview/${id}`);
        return response.data.report;
    } catch (err) {
        console.error("Error fetching report by ID:", err);
        throw err;
    }
}

export async function downloadReportPdf(id) {
    try {
        const response = await api.get(`/api/interview/download/${id}`, {
            responseType: 'blob' // Important for file downloads
        });
        
        // Create a blob from the response
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        
        // Create a temporary link element to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `InterviewReport_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error("Error downloading PDF:", err);
        throw err;
    }
}
