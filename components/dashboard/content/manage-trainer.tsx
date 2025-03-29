'use client';
import { useState, useEffect } from 'react';
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
  AlertTriangle,
  Loader2,
  Mail,
  History // Add History icon import
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth, useUser } from "@clerk/nextjs"; // Import both useAuth and useUser hooks

// Firebase imports
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  set,
  update,
  remove,
  push
} from "firebase/database";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: "lernova-3898e.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_DB_URL,
  projectId: "lernova-3898e",
  storageBucket: "lernova-3898e.firebasestorage.app",
  messagingSenderId: "367508505388",
  appId: "1:367508505388:web:7d64e3fecadf466a8ba289",
  measurementId: "G-9LVG2JL1D2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Trainer type definition with creatorEmail field and editHistory
type Trainer = {
  id: string;
  name: string;
  subject: string;
  batches: string[];
  creatorEmail: string;
  createdAt?: string;
  editHistory?: EditHistory[]; // Add edit history array
};

// Define EditHistory type
type EditHistory = {
  editorEmail: string;
  timestamp: string;
  changedFields?: string[]; // Optional field to track what was changed
};

// Define FirebaseTrainerData type
type FirebaseTrainerData = {
  name: string;
  subject: string;
  batches?: Record<string, string>;
  creatorEmail: string;
  createdAt?: string;
  editHistory?: Record<string, EditHistory>; // Add history to Firebase data
};

export default function ManageTrainersDash() {
  // Get the current user from Clerk using both hooks
  const { isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();

  // Get email only when user data is loaded
  const userEmail = userLoaded ? user?.primaryEmailAddress?.emailAddress || '' : '';

  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false); // Add History dialog state
  const [trainerToDelete, setTrainerToDelete] = useState<string | null>(null);
  const [selectedTrainerHistory, setSelectedTrainerHistory] = useState<EditHistory[]>([]); // Add selected trainer history
  const [selectedTrainerName, setSelectedTrainerName] = useState<string>(''); // Add selected trainer name
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [currentTrainer, setCurrentTrainer] = useState<Trainer>({
    id: '',
    name: '',
    subject: '',
    batches: [],
    creatorEmail: '',
  });
  const [batchInput, setBatchInput] = useState('');
  const [editableBatches, setEditableBatches] = useState<string[]>([]);
  const [batchRemovalNotice, setBatchRemovalNotice] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Fetch trainers from Firebase
  useEffect(() => {
    const trainersRef = ref(database, 'trainers');

    setLoading(true);
    const unsubscribe = onValue(trainersRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          const trainersData = snapshot.val();
          // Fixed: Type assertion to handle the mapping correctly
          const trainersArray: Trainer[] = Object.entries(trainersData).map(([id, data]) => {
            // Type assertion for the unknown data
            const trainerData = data as FirebaseTrainerData;

            // Convert editHistory object to array if it exists
            let editHistoryArray: EditHistory[] = [];
            if (trainerData.editHistory) {
              editHistoryArray = Object.values(trainerData.editHistory);
              // Sort by timestamp descending (newest first)
              editHistoryArray.sort((a, b) =>
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
              );
            }

            return {
              id,
              name: trainerData.name,
              subject: trainerData.subject,
              batches: trainerData.batches ? Object.values(trainerData.batches) : [],
              creatorEmail: trainerData.creatorEmail || 'Unknown',
              createdAt: trainerData.createdAt || '',
              editHistory: editHistoryArray,
            };
          });
          setTrainers(trainersArray);
        } else {
          setTrainers([]);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching trainers:", err);
        setError("Failed to load trainers. Please try again later.");
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error("Database error:", error);
      setError("Failed to connect to the database. Please check your connection.");
      setLoading(false);
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  const openAddDialog = () => {
    setDialogMode('add');
    setCurrentTrainer({
      id: '',
      name: '',
      subject: '',
      batches: [],
      creatorEmail: userEmail || 'Unknown'
    });
    setEditableBatches([]);
    setIsDialogOpen(true);
  };

  const openEditDialog = (trainer: Trainer) => {
    setDialogMode('edit');
    setCurrentTrainer({ ...trainer });
    setEditableBatches(trainer.batches ? [...trainer.batches] : []);
    setIsDialogOpen(true);
  };

  // New function to open history dialog
  const openHistoryDialog = (trainer: Trainer) => {
    setSelectedTrainerHistory(trainer.editHistory || []);
    setSelectedTrainerName(trainer.name);
    setIsHistoryDialogOpen(true);
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

  const saveTrainer = async () => {
    try {
      setSaveLoading(true);

      // Ensure we have the user email before saving
      if (!authLoaded || !userLoaded) {
        throw new Error("User authentication data not loaded yet");
      }

      // Get current timestamp
      const timestamp = new Date().toISOString();

      // Prepare creator email - use the current email for new trainers,
      // preserve the existing one for edits
      const creatorEmail = dialogMode === 'add'
        ? userEmail || 'Unknown'
        : currentTrainer.creatorEmail;

      // Track changed fields for edit history (for existing trainers only)
      const changedFields: string[] = [];
      if (dialogMode === 'edit') {
        if (currentTrainer.name !== trainers.find(t => t.id === currentTrainer.id)?.name) {
          changedFields.push('name');
        }
        if (currentTrainer.subject !== trainers.find(t => t.id === currentTrainer.id)?.subject) {
          changedFields.push('subject');
        }
        if (JSON.stringify(editableBatches) !==
          JSON.stringify(trainers.find(t => t.id === currentTrainer.id)?.batches)) {
          changedFields.push('batches');
        }
      }

      // Create edit history entry if this is an edit
      const historyEntry = dialogMode === 'edit' ? {
        editorEmail: userEmail || 'Unknown',
        timestamp: timestamp,
        changedFields: changedFields
      } : null;

      // Prepare trainer data
      const trainerData: FirebaseTrainerData = {
        name: currentTrainer.name,
        subject: currentTrainer.subject,
        batches: editableBatches.reduce((acc, batch, index) => {
          acc[index] = batch;
          return acc;
        }, {} as Record<number, string>),
        creatorEmail: creatorEmail,
        createdAt: dialogMode === 'add' ? timestamp : currentTrainer.createdAt || timestamp
      };

      if (dialogMode === 'add') {
        // Create new trainer
        const newTrainerRef = push(ref(database, 'trainers'));
        await set(newTrainerRef, trainerData);
        setNotification({ type: 'success', message: 'Trainer added successfully!' });
      } else {
        // Get the existing trainer to access its history
        const existingTrainer = trainers.find(t => t.id === currentTrainer.id);

        // Only add to history if there were actual changes
        if (historyEntry && changedFields.length > 0) {
          // Convert existing history array back to object for Firebase
          const existingHistory = existingTrainer?.editHistory || [];
          const historyObject = existingHistory.reduce((acc, entry, index) => {
            acc[index] = entry;
            return acc;
          }, {} as Record<number, EditHistory>);

          // Add new history entry
          historyObject[Object.keys(historyObject).length] = historyEntry;
          trainerData.editHistory = historyObject;
        } else if (existingTrainer?.editHistory) {
          // Preserve existing history if no changes
          const historyObject = existingTrainer.editHistory.reduce((acc, entry, index) => {
            acc[index] = entry;
            return acc;
          }, {} as Record<number, EditHistory>);
          trainerData.editHistory = historyObject;
        }

        // Update existing trainer
        await update(ref(database, `trainers/${currentTrainer.id}`), trainerData);
        setNotification({ type: 'success', message: 'Trainer updated successfully!' });
      }
    } catch (err) {
      console.error("Error saving trainer:", err);
      setNotification({ type: 'error', message: 'Failed to save trainer. Please try again.' });
    } finally {
      setSaveLoading(false);
      setIsDialogOpen(false);

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const confirmDeleteTrainer = (id: string) => {
    setTrainerToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const deleteTrainer = async () => {
    if (!trainerToDelete) return;

    try {
      setDeleteLoading(true);
      await remove(ref(database, `trainers/${trainerToDelete}`));
      setNotification({ type: 'success', message: 'Trainer deleted successfully!' });
    } catch (err) {
      console.error("Error deleting trainer:", err);
      setNotification({ type: 'error', message: 'Failed to delete trainer. Please try again.' });
    } finally {
      setDeleteLoading(false);
      setIsDeleteDialogOpen(false);
      setTrainerToDelete(null);

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
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

  // Format date from ISO string
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format date and time from ISO string for history display
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredTrainers = trainers.filter(trainer =>
    trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trainer.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (trainer.creatorEmail && trainer.creatorEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
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

      {/* Global notification */}
      {notification && (
        <Alert className={`mb-4 ${notification.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          className="pl-10 w-full border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
          placeholder="Search trainers by name, subject, batch, or creator email"
          value={searchQuery}
          onChange={handleInputChange}
        />
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mb-4" />
          <p className="text-lg text-gray-600">Loading trainers...</p>
        </div>
      ) : error ? (
        <Alert className="bg-red-50 text-red-700 border-red-200">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
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
                      {trainer.batches && trainer.batches.length > 0 ? (
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
                  {/* Creator Email Section - Improved display */}
                  <div className="flex items-center pt-2 border-t border-gray-100">
                    <Mail className="text-gray-400 mr-2" size={15} />
                    <span className="text-sm font-medium text-gray-500 mr-2">Created by:</span>
                    <span className="text-sm text-gray-600">
                      {trainer.creatorEmail === 'Unknown' ? 'Unknown' : trainer.creatorEmail}
                    </span>
                  </div>
                  {trainer.createdAt && (
                    <div className="text-xs text-gray-400 mt-1 pl-6">
                      Added on {formatDate(trainer.createdAt)}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-4 pb-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                  onClick={() => openHistoryDialog(trainer)}
                >
                  <History size={14} className="mr-1.5 text-blue-500" /> History
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 hover:bg-orange-50 hover:border-orange-200 transition-colors"
                  onClick={() => openEditDialog(trainer)}
                >
                  <Edit size={14} className="mr-1.5 text-orange-500" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                  onClick={() => confirmDeleteTrainer(trainer.id)}
                >
                  <Trash2 size={14} className="mr-1.5" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}

          {filteredTrainers.length === 0 && !loading && !error && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200 shadow-sm">
              <Users size={56} className="mb-4 opacity-40 text-gray-400" />
              <p className="text-lg mb-2">No trainers found</p>
              <p className="text-sm text-gray-400">Try different search criteria or add a new trainer.</p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Trainer Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'add' ? 'Add New Trainer' : 'Edit Trainer'}</DialogTitle>
            {dialogMode === 'add' && userEmail && (
              <DialogDescription className="mt-2">
                You will be recorded as the creator ({userEmail})
              </DialogDescription>
            )}
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-300">
              Cancel
            </Button>
            <Button
              onClick={saveTrainer}
              disabled={!currentTrainer.name || !currentTrainer.subject || saveLoading}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {saveLoading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  {dialogMode === 'add' ? 'Add Trainer' : 'Save Changes'}
                </>
              )}
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
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gray-300"
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={deleteTrainer}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} className="mr-2" />
                  Delete Trainer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History size={18} className="text-blue-500" />
              Edit History for {selectedTrainerName}
            </DialogTitle>
            <DialogDescription className="pt-2">
              View the complete edit history for this trainer profile.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 max-h-96 overflow-y-auto pr-2">
            {selectedTrainerHistory.length > 0 ? (
              <div className="space-y-4">
                {selectedTrainerHistory.map((historyItem, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-blue-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <Mail className="text-blue-500 mr-2" size={16} />
                        <span className="font-medium">{historyItem.editorEmail}</span>
                      </div>
                      <Badge variant="outline" className="bg-white text-gray-600 text-xs">
                        {formatDateTime(historyItem.timestamp)}
                      </Badge>
                    </div>

                    {historyItem.changedFields && historyItem.changedFields.length > 0 ? (
                      <div className="mt-2 pl-6">
                        <span className="text-sm text-gray-600">Changed:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {historyItem.changedFields.map(field => (
                            <Badge key={field} className="bg-blue-100 text-blue-700 border-blue-200">
                              {field.charAt(0).toUpperCase() + field.slice(1)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 pl-6 text-sm text-gray-500 italic">
                        No field changes recorded
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-gray-500 bg-gray-50 rounded-lg">
                <History size={40} className="mb-4 opacity-40 text-gray-400" />
                <p className="text-lg mb-1">No edit history found</p>
                <p className="text-sm text-gray-400 text-center">
                  This trainer hasn&#39;t been modified since creation.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsHistoryDialogOpen(false)}
              className="border-gray-300"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}