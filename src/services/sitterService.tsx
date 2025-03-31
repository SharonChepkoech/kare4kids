import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';  // Change this to your backend URL

export const getSitters = async () => {
  try {
    const response = await axios.get(`${API_URL}sitters/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sitters', error);
    throw error;
  }
};
