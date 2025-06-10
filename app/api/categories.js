// services/categoryService.js
import api from '../../axiosConfig';

export const fetchCategories = async () => {
  try {
    const res = await api.get('admin/getCategories');
    return res.data.categories; // Adjust based on your backend response
  } catch (error) {
    console.error('Axios error:', error);
    throw error;
  }
};
