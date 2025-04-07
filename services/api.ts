// app/services/api.ts
import { auth } from './auth';

const API_BASE_URL = 'https://dubai-td-ie-win.trycloudflare.com/api';

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  completada: boolean;
}

const getAuthHeaders = async () => {
  const token = await auth.getToken();
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  getTareas: async (): Promise<Tarea[]> => {
    const response = await fetch(`${API_BASE_URL}/tareas`, {
      headers: await getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error fetching tareas');
    return await response.json();
  },

  createTarea: async (tarea: Omit<Tarea, 'id'>): Promise<Tarea> => {
    const response = await fetch(`${API_BASE_URL}/tareas`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(tarea)
    });
    if (!response.ok) throw new Error('Error creating tarea');
    return await response.json();
  },

  updateTarea: async (id: number, tarea: Partial<Tarea>): Promise<Tarea> => {
    const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(tarea)
    });
    if (!response.ok) throw new Error(`Error updating tarea ${id}`);
    return await response.json();
  },

  deleteTarea: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeaders()
    });
    if (!response.ok) throw new Error(`Error deleting tarea ${id}`);
  }
};
