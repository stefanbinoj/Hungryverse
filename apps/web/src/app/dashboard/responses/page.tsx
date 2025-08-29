"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2, Star, Phone } from 'lucide-react';

const dummyResponses = [
  {
    id: 1,
    rating: 5,
    comment: "Great service! Everything was clean and the staff was very friendly.",
    services: 5,
    cleanliness: 5,
    note: "The background music was a bit too loud.",
    phone: "123-456-7890",
  },
  {
    id: 2,
    rating: 4,
    comment: "Good experience, but the waiting time was a bit long.",
    services: 4,
    cleanliness: 4,
    note: "",
    phone: "234-567-8901",
  },
  {
    id: 3,
    rating: 3,
    comment: "It was okay. The cleanliness could be improved.",
    services: 3,
    cleanliness: 2,
    note: "The floor was a bit sticky.",
    phone: "345-678-9012",
  },
  {
    id: 4,
    rating: 5,
    comment: "Absolutely fantastic! I will definitely come back.",
    services: 5,
    cleanliness: 5,
    note: "",
    phone: "456-789-0123",
  },
  {
    id: 5,
    rating: 2,
    comment: "Not satisfied with the service. The staff was not helpful.",
    services: 1,
    cleanliness: 3,
    note: "The staff seemed uninterested in helping.",
    phone: "567-890-1234",
  },
];

export default function ResponsesPage() {
  const [responses, setResponses] = useState(dummyResponses);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (response) => {
    setSelectedResponse(response);
    setIsModalOpen(true);
  };

  const handleDelete = (responseId) => {
    setResponses(responses.filter(response => response.id !== responseId));
  };

  const StarRating = ({ rating }) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Responses</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {responses.map((response) => (
          <Card key={response.id} className="cursor-pointer">
            <div onClick={() => handleCardClick(response)}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Rating: {response.rating} / 5</CardTitle>
                  <AlertDialog>
                    <AlertDialogTrigger onClick={(e) => e.stopPropagation()}>
                      <Button variant="destructive" size="icon" className="cursor-pointer w-8 h-8 rounded-full">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card text-card-foreground">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the response.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={() => handleDelete(response.id)} className="bg-red-700 text-white cursor-pointer">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent>
                <p>{response.comment}</p>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {selectedResponse && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Response Details</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div>
                <p className="font-semibold">Overall Rating</p>
                <StarRating rating={selectedResponse.rating} />
              </div>
              <div>
                <p className="font-semibold">Comment</p>
                <p>{selectedResponse.comment}</p>
              </div>
              <div>
                <p className="font-semibold">Services</p>
                <StarRating rating={selectedResponse.services} />
              </div>
              <div>
                <p className="font-semibold">Cleanliness</p>
                <StarRating rating={selectedResponse.cleanliness} />
              </div>
              <div>
                <p className="font-semibold">Note from user</p>
                <p>{selectedResponse.note || 'N/A'}</p>
              </div>
              <div>
                <p className="font-semibold">Phone number</p>
                <a href={`tel:${selectedResponse.phone}`} className="flex items-center gap-2 text-blue-500 hover:underline">
                  <Phone className="h-4 w-4" />
                  {selectedResponse.phone}
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
