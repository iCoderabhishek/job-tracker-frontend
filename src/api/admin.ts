import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export interface InviteCode {
  id: number;
  code: string;
  tier: string;
  max_uses: number;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
}

export const adminApi = {
  getInviteCodes: async (): Promise<InviteCode[]> => {
    const res = await axiosInstance.get("/admin/invite-codes");
    return res.data;
  },

  createInviteCode: async (data: { code: string; tier: string; max_uses?: number }): Promise<InviteCode> => {
    const res = await axiosInstance.post("/admin/invite-codes", data);
    return res.data;
  },

  revokeInviteCode: async (code: string): Promise<InviteCode> => {
    const res = await axiosInstance.put(`/admin/invite-codes/${code}/revoke`);
    return res.data;
  },

  deleteInviteCode: async (code: string): Promise<void> => {
    await axiosInstance.delete(`/admin/invite-codes/${code}`);
  },
};
