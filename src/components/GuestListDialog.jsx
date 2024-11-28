import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Loader2, Trash2, UserPlus, AlertCircle } from "lucide-react";

const GuestListDialog = ({
  guests,
  loading,
  onAddGuest,
  onDeleteGuest,
  newGuest,
  setNewGuest,
  dialogOpen,
  setDialogOpen,
}) => {
  const handleAgeChange = (e) => {
    const age = parseInt(e.target.value);

    // Validate age to be between 0 and 100
    if (isNaN(age) || age < 0 || age > 100) {
      setNewGuest((prev) => ({
        ...prev,
        age: "", // Reset to empty string if invalid
      }));
      return;
    }

    setNewGuest((prev) => ({
      ...prev,
      age: age,
    }));
  };

  const isAddButtonDisabled =
    loading.add ||
    !newGuest.age ||
    !newGuest.sex ||
    guests.length >= 5 ||
    newGuest.age < 0 ||
    newGuest.age > 100;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Card className="col-span-1 hover:bg-accent/50 transition-colors duration-300 cursor-pointer">
          <CardContent className="flex items-center justify-center h-full py-6">
            <div className="text-center">
              <Users className="h-10 w-10 mx-auto mb-2 text-primary" />
              <div className="font-semibold flex items-center justify-center">
                {loading.fetch ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  `Guests (${guests.length}/5)`
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="h-6 w-6 mr-2 text-primary" />
            Guest List Management
          </DialogTitle>
          <DialogDescription>
            Add and manage guests for your event (Maximum 5 guests)
          </DialogDescription>
        </DialogHeader>

        {guests.length >= 5 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Maximum guest limit reached. Remove a guest to add a new one.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={onAddGuest} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guestAge">Age</Label>
              <Input
                id="guestAge"
                type="number"
                placeholder="Enter age"
                value={newGuest.age.toString()}
                onChange={handleAgeChange}
                min={0}
                max={100}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guestSex">Sex</Label>
              <Select
                value={newGuest.sex}
                onValueChange={(value) =>
                  setNewGuest((prev) => ({ ...prev, sex: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isAddButtonDisabled}
            className="w-full"
          >
            {loading.add ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Guest...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Guest
              </>
            )}
          </Button>

          {guests.length > 0 && (
            <div className="border rounded-lg">
              <ScrollArea className="h-[250px] w-full">
                <Table>
                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      <TableHead className="w-[100px]">Age</TableHead>
                      <TableHead>Sex</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guests.map((guest) => (
                      <TableRow key={guest.id}>
                        <TableCell>{guest.age}</TableCell>
                        <TableCell>{guest.sex}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onDeleteGuest(guest.id)}
                            disabled={loading.delete[guest.id]}
                          >
                            {loading.delete[guest.id] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GuestListDialog;
