import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const getSitters = async () => {
  try {
    const response = await axios.get(`${API_BASE}sitters/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sitters', error);
    throw error;
  }
};
