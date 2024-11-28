import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const api = {
  getFamilyMembers: () => axios.get(`${API_URL}/family-members`),
  addFamilyMember: (member) => axios.post(`${API_URL}/family-members`, member),
  updateFamilyMember: (id, member) => axios.put(`${API_URL}/family-members/${id}`, member),
  deleteFamilyMember: (id) => axios.delete(`${API_URL}/family-members/${id}`),
  getGuests: () => axios.get(`${API_URL}/guests`),
  addGuest: (guest) => axios.post(`${API_URL}/guests`, guest),
  deleteGuest: (id) => axios.delete(`${API_URL}/guests/${id}`),
};

