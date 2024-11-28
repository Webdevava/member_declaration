import { useState, useCallback } from "react";
import { api } from "../lib/api";

export function useGuests() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState({
    fetch: false,
    add: false,
    delete: {},
  });

  const fetchGuests = useCallback(async () => {
    setLoading((prev) => ({ ...prev, fetch: true }));
    try {
      const response = await api.getGuests();
      setGuests(response.data);
    } catch (error) {
      console.error("Error fetching guests", error);
    } finally {
      setLoading((prev) => ({ ...prev, fetch: false }));
    }
  }, []);

  const addGuest = useCallback(async (guest) => {
    setLoading((prev) => ({ ...prev, add: true }));
    try {
      const response = await api.addGuest(guest);
      setGuests((prev) => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error("Error adding guest", error);
      throw error;
    } finally {
      setLoading((prev) => ({ ...prev, add: false }));
    }
  }, []);

  const deleteGuest = useCallback(async (id) => {
    setLoading((prev) => ({ ...prev, delete: { ...prev.delete, [id]: true } }));
    try {
      await api.deleteGuest(id);
      setGuests((prev) => prev.filter((g) => g.id !== id));
    } catch (error) {
      console.error("Error deleting guest", error);
      throw error;
    } finally {
      setLoading((prev) => ({
        ...prev,
        delete: { ...prev.delete, [id]: false },
      }));
    }
  }, []);

  return {
    guests,
    loading,
    fetchGuests,
    addGuest,
    deleteGuest,
  };
}
