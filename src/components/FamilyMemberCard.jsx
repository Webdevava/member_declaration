import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Edit, Trash2, UserPlus } from "lucide-react";
import { useEditModeStore } from "@/store/editModeStore";

const getBackgroundImage = (age, sex) => {
  if (!age || !sex) return "/images/add_member.svg";

  if (age < 13) {
    return sex === "male"
      ? "/images/child_male.svg"
      : "/images/child_female.svg";
  } else if (age < 20) {
    return sex === "male" ? "/images/teen_male.svg" : "/images/teen_female.svg";
  } else if (age < 60) {
    return sex === "male"
      ? "/images/adult_male.svg"
      : "/images/adult_female.svg";
  } else {
    return sex === "male"
      ? "/images/senior_male.svg"
      : "/images/senior_female.svg";
  }
};

const FamilyMemberCard = ({
  member,
  onToggleActive,
  onEdit,
  onDelete,
  onAdd,
  loading,
}) => {
  const { isEditModeEnabled } = useEditModeStore();
  const isEmpty = !member.id;

  if (isEmpty && !isEditModeEnabled) {
    return null;
  }

  if (isEmpty) {
    return (
      <Card
        className="flex flex-col justify-center items-center cursor-pointer transition-all duration-300 h-full"
        onClick={onAdd}
      >
        <CardContent className="flex-grow w-full flex items-center justify-center">
          <div className="flex items-center justify-center flex-col font-bold">
            <UserPlus className="h-8 w-8 mb-2" />
            Add Member
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`flex flex-col justify-between items-center overflow-hidden relative transition-all duration-300 shadow-inner h-full ${
        member.is_active ? "bg-primary/50" : "grayscale"
      }`}
      style={{
        backgroundImage: `url(${getBackgroundImage(member.age, member.sex)})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      onClick={() => onToggleActive(member)}
    >
      <CardContent className="relative z-10 p-4 w-full">
        <h2 className="text-xl font-bold mb-2">{member.name}</h2>
      </CardContent>
      {isEditModeEnabled && (
        <CardFooter className="relative z-10 w-full justify-end space-x-2 p-2">
          <div className="flex space-x-2">
            <Button
              size="icon"
              variant="secondary"
              className="bg-secondary shadow-inner hover:bg-white/30"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(member);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="bg-destructive shadow-inner hover:bg-red-500/30"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(member.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default FamilyMemberCard;
