import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle specific error status codes
            switch (error.response.status) {
                case 401:
                    // Handle unauthorized access
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    break;
                case 403:
                    // Handle forbidden access
                    console.error('Access forbidden');
                    break;
                case 404:
                    // Handle not found
                    console.error('Resource not found');
                    break;
                case 500:
                    // Handle server error
                    console.error('Server error');
                    break;
                default:
                    console.error('An error occurred');
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received from server');
        } else {
            // Something happened in setting up the request
            console.error('Error setting up request');
        }
        return Promise.reject(error);
    }
);

export const userService = {
    login: (credentials) => api.post('/users/login', credentials),
    register: (userData) => api.post('/users/register', userData),
    getProfile: () => api.get('/users/profile'),
    updateProfile: (userData) => api.put('/users/profile', userData),
};

export const recipeService = {
    getAllRecipes: () => api.get('/recipes'),
    getRecipe: (id) => api.get(`/recipes/${id}`),
    createRecipe: (recipeData) => api.post('/recipes', recipeData),
    updateRecipe: (id, recipeData) => api.put(`/recipes/${id}`, recipeData),
    deleteRecipe: (id) => api.delete(`/recipes/${id}`),
    searchRecipes: (params) => api.get('/recipes/search', { params }),
};

export const savedRecipeService = {
    getSavedRecipes: () => api.get('/savedRecipe'),
    saveRecipe: async (recipeId, name) => {
        try {
            const response = await api.post('/savedRecipe', { recipeId, name });
            return {
                success: true,
                message: response.data.message || 'Recipe saved successfully',
                data: response.data.item
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to save recipe',
                error: error.response?.data?.error
            };
        }
    },
    removeSavedRecipe: async (recipeId) => {
        try {
            const response = await api.delete(`/savedRecipe/${recipeId}`);
            return {
                success: true,
                message: response.data.message || 'Recipe removed successfully',
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to remove recipe',
                error: error.response?.data?.error
            };
        }
    },
};

export const shoppingListService = {
    getShoppingList: () => api.get('/shoppingList'),
    updateShoppingList: (items) => api.put('/shoppingList', items),
    addItem: (item) => api.post('/shoppingList', item),
    removeItem: (id) => api.delete(`/shoppingList/${id}`),
};

export const myKitchenService = {
    getMyKitchen: () => api.get('/myKitchen'),
    updateMyKitchen: (items) => api.put('/myKitchen', items),
    addItem: (item) => api.post('/myKitchen', item),
    removeItem: (id) => api.delete(`/myKitchen/${id}`),
};

export default api; 