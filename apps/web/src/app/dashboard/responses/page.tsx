"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Star, Phone } from "lucide-react";
import { Authenticated, useMutation, useQuery } from "convex/react";
import { api } from "@feedbacl/backend/convex/_generated/api";
import type { Id } from "@feedbacl/backend/convex/_generated/dataModel";
import { EmptyState } from "@/components/empty-state";
import { CardSkeleton } from "@/components/card-skeleton";
import { StarRating } from "@/components/star-rating";

type ResponseType = {
    _id: Id<"responses">; // or Id<"responses">
    _creationTime: number;
    description?: string;
    couponCode?: string;
    restrurantId: string; // or Id<"restaurants">
    foodRating: number;
    serviceRating: number;
    ambianceRating: number;
    cleanlinessRating: number;
    deleted: boolean;
    phoneNumber: string;
};

export default function ResponsePage() {
    return (
        <Authenticated>
            <ResponsePageComponent />
        </Authenticated>
    );
}

function ResponsePageComponent() {
    const [selectedResponse, setSelectedResponse] = useState<ResponseType | null>(
        null,
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    const responses = useQuery(api.functions.responses.getResponsesByRestaurant);
    const handleCardClick = (response: ResponseType) => {
        setSelectedResponse(response);
        setIsModalOpen(true);
    };

    const deleteResponse = useMutation(api.functions.responses.deleteResponse);
    const handleDelete = () => {
        if (!selectedResponse) return;
        deleteResponse({ responseId: selectedResponse._id });
        setIsModalOpen(false);
        setSelectedResponse(null);
    };
    if (responses === undefined) {
        return (
            <div>
                <h1 className="text-3xl font-bold mb-6">Responses</h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    if (responses.length === 0) {
        return (
            <EmptyState
                title="No Responses Yet"
                message="You haven't received any feedback yet. Check back later!"
            />
        );
    }
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Responses</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {responses &&
                    responses.map((response) => (
                        <Card key={response._id} className="cursor-pointer">
                            <div onClick={() => handleCardClick(response)}>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle>
                                            Rating:
                                            {(response.foodRating +
                                                response.serviceRating +
                                                response.ambianceRating +
                                                response.cleanlinessRating) /
                                                20}
                                        </CardTitle>
                                        <AlertDialog>
                                            <AlertDialogTrigger
                                                asChild
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="cursor-pointer w-8 h-8 rounded-full"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-card text-card-foreground">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently
                                                        delete the response.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="cursor-pointer">
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        variant="destructive"
                                                        onClick={() => handleDelete()}
                                                        className="bg-red-700 text-white cursor-pointer"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p>{response.description}</p>
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
                                <StarRating
                                    rating={
                                        (selectedResponse.ambianceRating +
                                            selectedResponse.cleanlinessRating +
                                            selectedResponse.foodRating +
                                            selectedResponse.serviceRating) /
                                        20
                                    }
                                />
                            </div>
                            <div>
                                <p className="font-semibold">Food</p>
                                <StarRating rating={selectedResponse.foodRating} />
                            </div>
                            <div>
                                <p className="font-semibold">Services</p>
                                <StarRating rating={selectedResponse.serviceRating} />
                            </div>
                            <div>
                                <p className="font-semibold">Cleanliness</p>
                                <StarRating rating={selectedResponse.cleanlinessRating} />
                            </div>
                            <div>
                                <p className="font-semibold">Ambience</p>
                                <StarRating rating={selectedResponse.ambianceRating} />
                            </div>
                            <div>
                                <p className="font-semibold">Description</p>
                                <p>{selectedResponse.description}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Phone number</p>
                                <a
                                    href={`tel:${selectedResponse.phoneNumber}`}
                                    className="flex items-center gap-2 text-blue-500 hover:underline"
                                >
                                    <Phone className="h-4 w-4" />
                                    {selectedResponse.phoneNumber}
                                </a>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
