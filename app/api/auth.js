import api from '../../axiosConfig';

export const googleLogin = async (userData) => {
    try {
        const response = await api.post('user/googleLogin',userData);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const signup=async({email,password})=>{
    try{
        const response =await api.post('user/signup',{email,password})
        return response.data
    }
    catch (error) {
        console.error('Signup error:', error);
        throw error;
    }
}
    
export const phoneLogin=async({phoneNumber})=>{
    try{
        const response =await api.post('user/phoneLogin',{phoneNumber})
        return response.data
    }
    catch (error) {
        console.error('Phone Login error:', error);
        throw error;
    }
}