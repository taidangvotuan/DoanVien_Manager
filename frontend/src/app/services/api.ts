import { Member } from "../components/MemberDialog";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/doanvien";

export const apiService = {
    async getAllMembers(): Promise<Member[]> {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error("Không thể tải danh sách đoàn viên");
        }
        return response.json();
    },

    async getMemberById(id: string): Promise<Member> {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error("Không thể tìm thấy đoàn viên");
        }
        return response.json();
    },

    async createMember(member: Member): Promise<Member> {
        const response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(member),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Không thể tạo mới đoàn viên");
        }
        return response.json();
    },

    async updateMember(id: string, member: Partial<Member>): Promise<Member> {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(member),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Không thể cập nhật thông tin đoàn viên");
        }
        return response.json();
    },

    async deleteMember(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Không thể xóa đoàn viên");
        }
    },
};
