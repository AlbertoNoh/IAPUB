import axios from 'axios';

const API_BASE_URL = 'http://localhost:3010'; // Ajusta según la URL base de tu API

export const getCandidates = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/candidates`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


interface CandidateData {
  name: string;
  surname: string;
  email: string;
  phone: string;
}

export const addCandidate = async (candidateData: CandidateData, file: File | null) => {
  const formData = new FormData();
  formData.append('name', candidateData.name);
  formData.append('surname', candidateData.surname);
  formData.append('email', candidateData.email);
  formData.append('phone', candidateData.phone);

  if (file) {
    formData.append('document', file);
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/candidates`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCandidateById = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/candidates/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCandidate = async (id: number, candidateData: CandidateData, file: File | null) => {
  const formData = new FormData();
  formData.append('name', candidateData.name);
  formData.append('surname', candidateData.surname);
  formData.append('email', candidateData.email);
  formData.append('phone', candidateData.phone);

  if (file) {
    formData.append('document', file);
  }

  try {
    const response = await axios.put(`${API_BASE_URL}/candidates/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCandidate = async (id: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/candidates/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};