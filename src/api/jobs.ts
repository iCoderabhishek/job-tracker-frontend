import axios from 'axios';

export interface CompanyStatusUpdate {
    comp_name?: string;
    roles?: string;
    ctc?: string;
    comp_type?: string;
    comp_site?: string;
    comp_url?: string;
    job_url: string; // Required for the backend query
    keywords?: string;
    existing_resume?: string;
    new_resume_changes?: string;
    missing_keywords?: string;
    added_keywords?: string;
    status: string;
    updated_resume?: string;
    user_id: number;
}
export interface ScrapedJob {
    id: number;
    title: string;
    company: string;
    location: string | null;
    apply_url: string;
    source: string;
    posted_date?: string;
    scraped_at?: string;
}

export interface JobMatch {
    id: number;
    match_score: number;
    matching_skills: string | null;
    missing_skills: string | null;
    status: string;
    created_at?: string;
    job: ScrapedJob;
}

export interface MetricsResponse {
    total_applied: number;
    total_ghosted: number;
    total_shortlisted: number;
    total_interviewing: number;
    total_rejected: number;
    average_jobs_per_day: number;
    trending_skills: string[];
}

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we receive a 403 Forbidden globally and we're not hitting a sync endpoint,
    // redirect the user to the invite screen.
    if (error.response?.status === 403 && typeof window !== 'undefined') {
        const url = error.config?.url || '';
        if (!url.includes('/sync-and-fetch')) {
            window.location.href = '/invite';
        }
    }
    return Promise.reject(error);
  }
);

export const jobsApi = {
    getMatches: async (userId: number, limit?: number | "all", region?: string): Promise<JobMatch[]> => {
        const params: any = { user_id: userId };
        if (limit && limit !== "all") {
            params.limit = limit;
        }
        if (region) {
            params.region = region;
        }
        const response = await api.get('/matches', { params });
        return response.data;
    },
    
    getMetrics: async (userId: number, timeframe: string = 'today'): Promise<MetricsResponse> => {
        const response = await api.get('/metrics', {
            params: { user_id: userId, timeframe }
        });
        return response.data;
    },
    
    syncJobs: async (userId: number, limit: number | "all" = 5, region?: string): Promise<JobMatch[]> => {
        const params: any = { user_id: userId };
        if (limit && limit !== "all") {
            params.limit = limit;
        }
        if (region) {
            params.region = region;
        }
        const response = await api.post('/sync-and-fetch', null, { params });
        return response.data;
    },
    
    updateCompanyStatus: async (companyData: CompanyStatusUpdate): Promise<any> => {
        const response = await api.post('/company', companyData);
        return response.data;
    }
};
