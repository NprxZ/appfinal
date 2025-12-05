import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Validar asistencia con token
export const validarAsistencia = async (email, password, token) => {
  try {
    const response = await api.post('/validar-asistencia', {
      email,
      password,
      token,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Error de conexión' };
  }
};

// Consultar asistencias (sin token)
export const consultarAsistencias = async (email, password) => {
  try {
    const response = await api.post('/consultar-asistencias', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Error de conexión' };
  }
};

export default api;