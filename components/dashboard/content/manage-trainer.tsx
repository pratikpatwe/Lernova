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
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

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
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [currentTrainer, setCurrentTrainer] = useState<{ id: number | null; name: string; subject: string; batches: string[] }>({
    id: null,
    name: '',
    subject: '',
    batches: [],
  });
  const [batchInput, setBatchInput] = useState('');
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);

  const openAddDialog = () => {
    setDialogMode('add');
    setCurrentTrainer({ id: Date.now(), name: '', subject: '', batches: [] });
    setIsDialogOpen(true);
  };

  const openEditDialog = (trainer: { id: number; name: string; subject: string; batches: string[] }) => {
    setDialogMode('edit');
    setCurrentTrainer({ ...trainer });
    setSelectedBatches([...trainer.batches]);
    setIsDialogOpen(true);
  };

  const addBatch = () => {
    if (batchInput.trim() && !currentTrainer.batches.includes(batchInput.trim())) {
      setCurrentTrainer({
        ...currentTrainer,
        batches: [...currentTrainer.batches, batchInput.trim()],
      });
      setBatchInput('');
    }
  };

  const removeBatch = (batch: string) => {
    setCurrentTrainer({
      ...currentTrainer,
      batches: currentTrainer.batches.filter((b) => b !== batch),
    });
  };

  const toggleBatchSelection = (batch: string) => {
    if (selectedBatches.includes(batch)) {
      setSelectedBatches(selectedBatches.filter(b => b !== batch));
    } else {
      setSelectedBatches([...selectedBatches, batch]);
    }
  };

  const saveTrainer = () => {
    if (dialogMode === 'add') {
      setTrainers([...trainers, { ...currentTrainer, id: Date.now() } as { id: number; name: string; subject: string; batches: string[] }]);
    } else {
      const updatedTrainer = {
        ...currentTrainer,
        batches: selectedBatches
      } as { id: number; name: string; subject: string; batches: string[] };

      setTrainers(trainers.map((t) => (t.id === currentTrainer.id ? updatedTrainer : t)));
    }
    setIsDialogOpen(false);
    setSelectedBatches([]);
  };

  const deleteTrainer = (id: number) => {
    if (confirm('Are you sure you want to delete this trainer?')) {
      setTrainers(trainers.filter((trainer) => trainer.id !== id));
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
        <Button onClick={openAddDialog} className="flex items-center gap-2">
          <Plus size={16} />
          Add Trainer
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          className="pl-10 w-full"
          placeholder="Search trainers by name, subject, or batch"
          value={searchQuery}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrainers.map(trainer => (
          <Card key={trainer.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3 bg-gray-50 border-b">
              <CardTitle className="text-lg font-semibold">{trainer.name}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 pb-3">
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 w-20">Subject:</span>
                  <span className="text-gray-800">{trainer.subject}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 mb-2 block">Batches:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {trainer.batches.length > 0 ? (
                      trainer.batches.map(batch => (
                        <Badge key={batch} variant="secondary" className="px-3 py-1">{batch}</Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400 italic">No batches assigned</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-3 pb-3 bg-gray-50">
              <Button variant="outline" size="sm" className="hover:bg-gray-100" onClick={() => openEditDialog(trainer)}>
                <Edit size={14} className="mr-1" /> Edit
              </Button>
              <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50 hover:border-red-200" onClick={() => deleteTrainer(trainer.id)}>
                <Trash2 size={14} className="mr-1" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}

        {filteredTrainers.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
            <Users size={48} className="mb-2 opacity-40" />
            <p>No trainers found. Try different search criteria or add a new trainer.</p>
          </div>
        )}
      </div>

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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={currentTrainer.subject}
                onChange={handleTrainerSubjectChange}
                placeholder="Enter trainer's subject"
              />
            </div>

            {dialogMode === 'add' ? (
              <div className="space-y-2">
                <Label>Batches</Label>
                <div className="flex gap-2">
                  <Input
                    value={batchInput}
                    onChange={handleBatchInputChange}
                    placeholder="Enter batch (e.g. SOC1)"
                    onKeyPress={(e) => e.key === 'Enter' && addBatch()}
                  />
                  <Button type="button" onClick={addBatch} variant="outline">Add</Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {currentTrainer.batches.map(batch => (
                    <Badge key={batch} variant="secondary" className="flex items-center gap-1">
                      {batch}
                      <X
                        size={14}
                        className="cursor-pointer"
                        onClick={() => removeBatch(batch)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Select Batches</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 border rounded-md p-3">
                  {dialogMode === 'edit' && currentTrainer.batches.map(batch => (
                    <div
                      key={batch}
                      className={`flex items-center gap-2 p-2 rounded cursor-pointer border ${selectedBatches.includes(batch) ? 'bg-gray-100 border-gray-300' : 'border-gray-200'
                        }`}
                      onClick={() => toggleBatchSelection(batch)}
                    >
                      {selectedBatches.includes(batch) ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : (
                        <XCircle size={16} className="text-gray-400" />
                      )}
                      <span>{batch}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveTrainer} disabled={!currentTrainer.name || !currentTrainer.subject}>
              <Save size={16} className="mr-2" />
              {dialogMode === 'add' ? 'Add Trainer' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}