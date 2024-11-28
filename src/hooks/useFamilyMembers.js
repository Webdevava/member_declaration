import { useState, useCallback } from "react";
import { api } from "../lib/api";

export function useFamilyMembers() {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState({
    fetch: false,
    add: false,
    update: false,
    delete: {},
    toggle: {},
  });

  const fetchFamilyMembers = useCallback(async () => {
    setLoading((prev) => ({ ...prev, fetch: true }));
    try {
      const response = await api.getFamilyMembers();
      setFamilyMembers(response.data);
    } catch (error) {
      console.error("Error fetching family members", error);
    } finally {
      setLoading((prev) => ({ ...prev, fetch: false }));
    }
  }, []);

  const addFamilyMember = useCallback(async (member) => {
    setLoading((prev) => ({ ...prev, add: true }));
    try {
      const response = await api.addFamilyMember(member);
      setFamilyMembers((prev) => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error("Error adding family member", error);
      throw error;
    } finally {
      setLoading((prev) => ({ ...prev, add: false }));
    }
  }, []);

  const updateFamilyMember = useCallback(async (id, member) => {
    setLoading((prev) => ({ ...prev, update: true }));
    try {
      const response = await api.updateFamilyMember(id, member);
      setFamilyMembers((prev) =>
        prev.map((m) => (m.id === id ? response.data : m))
      );
      return response.data;
    } catch (error) {
      console.error("Error updating family member", error);
      throw error;
    } finally {
      setLoading((prev) => ({ ...prev, update: false }));
    }
  }, []);

  const deleteFamilyMember = useCallback(async (id) => {
    setLoading((prev) => ({ ...prev, delete: { ...prev.delete, [id]: true } }));
    try {
      await api.deleteFamilyMember(id);
      setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Error deleting family member", error);
      throw error;
    } finally {
      setLoading((prev) => ({
        ...prev,
        delete: { ...prev.delete, [id]: false },
      }));
    }
  }, []);

  const toggleMemberActive = useCallback(
    async (member) => {
      setLoading((prev) => ({
        ...prev,
        toggle: { ...prev.toggle, [member.id]: true },
      }));
      try {
        const updatedMember = await updateFamilyMember(member.id, {
          is_active: !member.is_active,
        });
        return updatedMember;
      } finally {
        setLoading((prev) => ({
          ...prev,
          toggle: { ...prev.toggle, [member.id]: false },
        }));
      }
    },
    [updateFamilyMember]
  );

  return {
    familyMembers,
    loading,
    fetchFamilyMembers,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    toggleMemberActive,
  };
}
