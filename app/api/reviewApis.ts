import api from '../axiosConfig';

// Submit a review (product, merchant, or rider)
export const submitReview = async (payload: {
    targetId: string;
    targetType: 'product' | 'merchant' | 'rider';
    orderId: string;
    rating: number;
    title?: string;
    comment?: string;
    images?: string[];
}) => {
    try {
        const res = await api.post('/user/review', payload);
        return res.data;
    } catch (error: any) {
        console.error('submitReview error:', error.response?.data || error.message);
        throw error;
    }
};

// Get items user can review (completed orders without reviews)
export const getReviewableItems = async () => {
    try {
        const res = await api.get('/user/reviews/reviewable');
        return res.data.reviewable;
    } catch (error: any) {
        console.error('getReviewableItems error:', error.response?.data || error.message);
        throw error;
    }
};

// Get user's own reviews
export const getMyReviews = async () => {
    try {
        const res = await api.get('/user/reviews/my');
        return res.data.reviews;
    } catch (error: any) {
        console.error('getMyReviews error:', error.response?.data || error.message);
        throw error;
    }
};

// Get reviews for a target (public)
export const getReviews = async (targetType: string, targetId: string, page = 1) => {
    try {
        const res = await api.get(`/user/reviews/${targetType}/${targetId}?page=${page}&limit=10`);
        return res.data;
    } catch (error: any) {
        console.error('getReviews error:', error.response?.data || error.message);
        throw error;
    }
};

// Delete a review
export const deleteReview = async (reviewId: string) => {
    try {
        const res = await api.delete(`/user/review/${reviewId}`);
        return res.data;
    } catch (error: any) {
        console.error('deleteReview error:', error.response?.data || error.message);
        throw error;
    }
};
