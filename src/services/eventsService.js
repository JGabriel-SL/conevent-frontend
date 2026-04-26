import api from './api';

export const eventsService = {
  // GET /health
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  // GET /events
  getAllEvents: async () => {
    const response = await api.get('/events');
    return response.data;
  },

  // GET /events/{id}
  getEventById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // POST /events
  createEvent: async (eventData) => {
    // eventData deve seguir o schema 'EventCreate' do seu YAML
    const response = await api.post('/events', eventData);
    return response.data;
  },

  // PUT /events/{id}
  updateEvent: async (id, eventData) => {
    // eventData deve seguir o schema 'EventUpdate'
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  // DELETE /events/{id}
  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data; // Status 204 não retorna corpo, mas é bom manter o padrão
  }
};