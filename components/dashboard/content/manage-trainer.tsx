'use client';
import { useState } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Users,
  BookOpen,
  Tag,
  Award,
  AlertTriangle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ManageTrainersDash() {
  const [trainers, setTrainers] = useState<{ id: number; name: string; subject: string; batches: string[] }[]>([
    { id: 1, name: "John Doe", subject: "Computer Science", batches: ["SOC1", "SOC2", "SOC3"] },
    { id: 2, name: "Jane Smith", subject: "Data Science", batches: ["SOC2", "SOC4"] },
    { id: 3, name: "Robert Johnson", subject: "Web Development", batches: ["SOC1", "SOC5"] },
    { id: 4, name: "Emily Davis", subject: "UI/UX Design", batches: ["SOC3"] },
    { id: 5, name: "Michael Brown", subject: "Mobile Development", batches: ["SOC2", "SOC4", "SOC6"] },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [trainerToDelete, setTrainerToDelete] = useState<number | null>(null);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [currentTrainer, setCurrentTrainer] = useState<{ id: number | null; name: string; subject: string; batches: string[] }>({
    id: null,
    name: '',
    subject: '',
    batches: [],
  });
  const [batchInput, setBatchInput] = useState('');
  const [editableBatches, setEditableBatches] = useState<string[]>([]);
  const [batchRemovalNotice, setBatchRemovalNotice] = useState<string | null>(null);

  const openAddDialog = () => {
    setDialogMode('add');
    setCurrentTrainer({ id: Date.now(), name: '', subject: '', batches: [] });
    setEditableBatches([]);
    setIsDialogOpen(true);
  };

  const openEditDialog = (trainer: { id: number; name: string; subject: string; batches: string[] }) => {
    setDialogMode('edit');
    setCurrentTrainer({ ...trainer });
    setEditableBatches([...trainer.batches]);
    setIsDialogOpen(true);
  };

  const addBatch = () => {
    if (batchInput.trim() && !editableBatches.includes(batchInput.trim())) {
      setEditableBatches([...editableBatches, batchInput.trim()]);
      setBatchInput('');
    }
  };

  const removeBatch = (batch: string) => {
    setEditableBatches(editableBatches.filter((b) => b !== batch));
    setBatchRemovalNotice(`Batch ${batch} removed successfully`);
    setTimeout(() => setBatchRemovalNotice(null), 3000);
  };

  const saveTrainer = () => {
    const updatedTrainer = {
      ...currentTrainer,
      batches: editableBatches,
      id: currentTrainer.id || Date.now()
    } as { id: number; name: string; subject: string; batches: string[] };

    if (dialogMode === 'add') {
      setTrainers([...trainers, updatedTrainer]);
    } else {
      setTrainers(trainers.map((t) => (t.id === currentTrainer.id ? updatedTrainer : t)));
    }
    setIsDialogOpen(false);
  };

  const confirmDeleteTrainer = (id: number) => {
    setTrainerToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const deleteTrainer = () => {
    if (trainerToDelete) {
      setTrainers(trainers.filter((trainer) => trainer.id !== trainerToDelete));
      setIsDeleteDialogOpen(false);
      setTrainerToDelete(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleBatchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBatchInput(e.target.value);
  };

  const handleTrainerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTrainer({ ...currentTrainer, name: e.target.value });
  };

  const handleTrainerSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTrainer({ ...currentTrainer, subject: e.target.value });
  };

  const filteredTrainers = trainers.filter(trainer =>
    trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trainer.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trainer.batches.some(batch => batch.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Trainers</h1>
        <Button onClick={openAddDialog} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600">
          <Plus size={16} />
          Add Trainer
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          className="pl-10 w-full border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
          placeholder="Search trainers by name, subject, or batch"
          value={searchQuery}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrainers.map(trainer => (
          <Card key={trainer.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-gray-200 rounded-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center">
                <Award className="text-orange-500 mr-3" size={24} />
                <CardTitle className="text-xl font-bold text-gray-800">{trainer.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-2 pb-4">
              <div className="space-y-4">
                <div className="flex items-center">
                  <BookOpen className="text-orange-400 mr-2" size={16} />
                  <span className="text-sm font-medium text-gray-500 mr-2">Subject:</span>
                  <span className="text-gray-800 font-medium">{trainer.subject}</span>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <Tag className="text-orange-400 mr-2" size={16} />
                    <span className="text-sm font-medium text-gray-500">Batches:</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1 pl-6">
                    {trainer.batches.length > 0 ? (
                      trainer.batches.map(batch => (
                        <Badge key={batch} variant="secondary" className="px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors border border-orange-100">
                          {batch}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400 italic">No batches assigned</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-4 pb-4 border-t">
              <Button variant="outline" size="sm" className="border-gray-300 hover:bg-orange-50 hover:border-orange-200 transition-colors" onClick={() => openEditDialog(trainer)}>
                <Edit size={14} className="mr-1.5 text-orange-500" /> Edit
              </Button>
              <Button variant="outline" size="sm" className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors" onClick={() => confirmDeleteTrainer(trainer.id)}>
                <Trash2 size={14} className="mr-1.5" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}

        {filteredTrainers.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200 shadow-sm">
            <Users size={56} className="mb-4 opacity-40 text-gray-400" />
            <p className="text-lg mb-2">No trainers found</p>
            <p className="text-sm text-gray-400">Try different search criteria or add a new trainer.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Trainer Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'add' ? 'Add New Trainer' : 'Edit Trainer'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <Label htmlFor="name">Trainer Name</Label>
              <Input
                id="name"
                value={currentTrainer.name}
                onChange={handleTrainerNameChange}
                placeholder="Enter trainer name"
                className="border-gray-300 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={currentTrainer.subject}
                onChange={handleTrainerSubjectChange}
                placeholder="Enter trainer's subject"
                className="border-gray-300 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label>Batches</Label>
              <div className="flex gap-2">
                <Input
                  value={batchInput}
                  onChange={handleBatchInputChange}
                  placeholder="Enter batch (e.g. SOC1)"
                  onKeyPress={(e) => e.key === 'Enter' && addBatch()}
                  className="border-gray-300 focus:border-orange-500"
                />
                <Button
                  type="button"
                  onClick={addBatch}
                  variant="outline"
                  className="border-gray-300 hover:bg-orange-50 hover:border-orange-200"
                >
                  Add
                </Button>
              </div>

              {/* Batch removal notification */}
              {batchRemovalNotice && (
                <Alert className="mt-2 bg-green-50 text-green-700 border-green-200">
                  <AlertDescription>{batchRemovalNotice}</AlertDescription>
                </Alert>
              )}

              <div className="mt-4">
                <Label className="mb-2 block">Selected Batches: </Label>
                <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-16">
                  {editableBatches.length > 0 ? (
                    editableBatches.map(batch => (
                      <Badge
                        key={batch}
                        variant="secondary"
                        className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-600 border border-orange-100"
                      >
                        {batch}
                        <span title={`Remove ${batch}`}>
                          <X
                            size={14}
                            className="cursor-pointer ml-1 hover:text-red-500"
                            onClick={() => removeBatch(batch)}
                            aria-label={`Remove batch ${batch}`}
                          />
                        </span>
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400 italic">No batches selected</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-300">Cancel</Button>
            <Button
              onClick={saveTrainer}
              disabled={!currentTrainer.name || !currentTrainer.subject}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Save size={16} className="mr-2" />
              {dialogMode === 'add' ? 'Add Trainer' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle size={18} />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to delete this trainer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="border-gray-300">
              Cancel
            </Button>
            <Button onClick={deleteTrainer} className="bg-red-500 hover:bg-red-600 text-white">
              <Trash2 size={16} className="mr-2" />
              Delete Trainer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}