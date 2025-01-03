"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, UserPlus, UserCog, AlertCircle } from "lucide-react";
import { useFamilyMembers } from "../hooks/useFamilyMembers";
import { useGuests } from "../hooks/useGuests";
import FamilyMemberCard from "@/components/FamilyMemberCard";
import GuestListDialog from "@/components/GuestListDialog";

export default function Page() {
  const {
    familyMembers,
    loading: familyLoading,
    fetchFamilyMembers,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    toggleMemberActive,
  } = useFamilyMembers();

  const {
    guests,
    loading: guestLoading,
    fetchGuests,
    addGuest,
    deleteGuest,
  } = useGuests();

  const [editingMember, setEditingMember] = useState(null);
  const [newMember, setNewMember] = useState({
    name: "",
    age: "",
    sex: "",
  });
  const [newGuest, setNewGuest] = useState({
    age: 0,
    sex: "",
  });
  const [dialogOpen, setDialogOpen] = useState({
    addMember: false,
    editMember: false,
    guestList: false,
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    age: "",
    sex: "",
  });

  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Update time and date only on the client-side
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }));
      setCurrentDate(now.toLocaleDateString([], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }));
    };

    // Initial update
    updateDateTime();

    // Update every minute
    const intervalId = setInterval(updateDateTime, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fetchFamilyMembers();
    fetchGuests();
  }, [fetchFamilyMembers, fetchGuests]);

  const validateForm = () => {
    const errors = {
      name: !newMember.name ? "Name is required" : "",
      age: !newMember.age
        ? "Age is required"
        : parseInt(newMember.age) < 0 || parseInt(newMember.age) > 120
        ? "Age must be between 0 and 120"
        : "",
      sex: !newMember.sex ? "Sex is required" : "",
    };

    setFormErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleAddMember = async () => {
    if (!validateForm()) return;

    try {
      await addFamilyMember({
        ...newMember,
        age: parseInt(newMember.age),
      });
      setNewMember({ name: "", age: "", sex: "" });
      setDialogOpen((prev) => ({ ...prev, addMember: false }));
    } catch (error) {
      alert(error.response?.data?.error || "Failed to add member");
    }
  };

  const handleUpdateMember = async () => {
    if (!validateForm()) return;
    if (!editingMember) return;

    try {
      await updateFamilyMember(editingMember.id, {
        ...newMember,
        age: parseInt(newMember.age),
      });
      setNewMember({ name: "", age: "", sex: "" });
      setEditingMember(null);
      setDialogOpen((prev) => ({ ...prev, editMember: false }));
    } catch (error) {
      alert(error.response?.data?.error || "Failed to update member");
    }
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();
    try {
      await addGuest(newGuest);
      setNewGuest({ age: 0, sex: "" });
    } catch (error) {
      alert(error.response?.data?.error || "Failed to add guest");
    }
  };

  const renderFamilyMemberCards = () => {
    if (familyLoading.fetch) {
      return (
        <Card className="col-span-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </Card>
      );
    }

    const membersWithEmptySlots = [
      ...familyMembers,
      ...Array(7 - familyMembers.length).fill(null),
    ];

    return membersWithEmptySlots.map((member, index) => (
      <FamilyMemberCard
        key={member ? `member-${member.id}` : `empty-${index}`}
        member={member || {}}
        onToggleActive={toggleMemberActive}
        onEdit={(member) => {
          setEditingMember(member);
          setNewMember({
            name: member.name,
            age: member.age.toString(),
            sex: member.sex,
          });
          setDialogOpen((prev) => ({ ...prev, editMember: true }));
        }}
        onDelete={deleteFamilyMember}
        onAdd={() => setDialogOpen((prev) => ({ ...prev, addMember: true }))}
        loading={familyLoading}
      />
    ));
  };

  const renderMemberDialog = (isEditing) => {
    const isLoading = isEditing ? familyLoading.update : familyLoading.add;
    const dialogTitle = isEditing ? "Edit Family Member" : "Add Family Member";
    const dialogDescription = isEditing
      ? "Update details for existing family member"
      : "Add a new member to your family";

    return (
      <Dialog
        open={isEditing ? dialogOpen.editMember : dialogOpen.addMember}
        onOpenChange={(open) =>
          setDialogOpen((prev) => ({
            ...prev,
            [isEditing ? "editMember" : "addMember"]: open,
          }))
        }
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {isEditing ? (
                <UserCog className="h-6 w-6 mr-2 text-primary" />
              ) : (
                <UserPlus className="h-6 w-6 mr-2 text-primary" />
              )}
              {dialogTitle}
            </DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter name"
                value={newMember.name}
                onChange={(e) =>
                  setNewMember((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className={formErrors.name ? "border-destructive" : ""}
              />
              {formErrors.name && (
                <div className="text-destructive text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {formErrors.name}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter age"
                value={newMember.age}
                onChange={(e) =>
                  setNewMember((prev) => ({
                    ...prev,
                    age: e.target.value,
                  }))
                }
                min={0}
                max={120}
                className={formErrors.age ? "border-destructive" : ""}
              />
              {formErrors.age && (
                <div className="text-destructive text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {formErrors.age}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sex">Sex</Label>
              <Select
                value={newMember.sex}
                onValueChange={(value) =>
                  setNewMember((prev) => ({ ...prev, sex: value }))
                }
              >
                <SelectTrigger
                  className={formErrors.sex ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.sex && (
                <div className="text-destructive text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {formErrors.sex}
                </div>
              )}
            </div>

            <Button
              onClick={isEditing ? handleUpdateMember : handleAddMember}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Adding..."}
                </>
              ) : isEditing ? (
                "Update Member"
              ) : (
                "Add Member"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="grid grid-cols-5 auto-rows-fr h-full w-full">
      {/* Clock Card - Always Static */}
      <Card className="col-span-2 flex flex-col justify-center items-center p-4 shadow-inner bg-transparent border-none">
      <h1 className="text-[12vh] font-extrabold font-mono mb-2 text-primary">
        {currentTime}
      </h1>
      <p className="font-bold text-[3.5vh]">
        {currentDate}
      </p>
    </Card>

      {/* Family Member Cards */}
      {renderFamilyMemberCards()}

      {/* Guest List Card */}
      <GuestListDialog
        guests={guests}
        loading={guestLoading}
        onAddGuest={handleAddGuest}
        onDeleteGuest={deleteGuest}
        newGuest={newGuest}
        setNewGuest={setNewGuest}
        dialogOpen={dialogOpen.guestList}
        setDialogOpen={(open) =>
          setDialogOpen((prev) => ({ ...prev, guestList: open }))
        }
      />

      {/* Add Member Dialog */}
      {renderMemberDialog(false)}

      {/* Edit Member Dialog */}
      {renderMemberDialog(true)}
    </div>
  );
}
