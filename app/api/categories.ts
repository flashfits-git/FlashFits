import api from '../../axiosConfig';

export interface Category {
    _id: string;
    name: string;
    parentId: string | null;
    level: number;
    image?: { url: string };
    allowedGenders?: string[];
    ancestors?: {
        parentName?: string;
    };
    title_banners?: { url: string }[];
    isTriable?: boolean;
}

export const fetchCategories = async (): Promise<Category[]> => {
    try {
        const res = await api.get('admin/getCategories');
        return res.data.categories;
    } catch (error) {
        console.error('Axios error:', error);
        throw error;
    }
};
