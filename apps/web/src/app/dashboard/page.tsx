"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@feedbacl/backend/convex/_generated/api";
import { Authenticated } from "convex/react";
import { useModalStore } from "@/store/onboarding";

import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogContentWithClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    return (
        <Authenticated>
            <RedirectPage />
        </Authenticated>
    );
}

function RedirectPage() {
    const showOnboardingModal = useModalStore(
        (state) => state.showOnboardingModal,
    );
    const setShowOnboardingModal = useModalStore(
        (state) => state.setShowOnboardingModal,
    );
    const router = useRouter();
    const checkRestaurantExists = useQuery(
        api.functions.resturants.checkRestaurantExists,
    );

    useEffect(() => {
        if (checkRestaurantExists === undefined) return; // Still loading
        if (checkRestaurantExists) {
            router.push("/dashboard/analytics");
        } else {
            setShowOnboardingModal(true);
        }
    }, [checkRestaurantExists]);

    if (showOnboardingModal)
        return (
            <OnboardingModal
                showOnboardingModal={showOnboardingModal}
                setIsModalOpen={setShowOnboardingModal}
            />
        );

    return null;
}

interface OnboardingModalProps {
    showOnboardingModal: boolean;
    setIsModalOpen: (val: boolean) => void;
}

function OnboardingModal({
    showOnboardingModal,
    setIsModalOpen,
}: OnboardingModalProps) {
    const [step, setStep] = useState(1);
    const [name, setName] = useState("");
    const [reviewUrl, setReviewUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const imageInput = useRef<HTMLInputElement>(null);

    const createRestaurant = useMutation(
        api.functions.resturants.createResturant,
    );
    const generateUploadUrl = useMutation(
        api.functions.imageUpload.generateUploadUrl,
    );

    useEffect(() => {
        if (selectedImage) {
            const url = URL.createObjectURL(selectedImage);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
        setPreviewUrl(null);
    }, [selectedImage]);

    const handleSubmit = async () => {
        if (!selectedImage) return;

        setIsUploading(true);
        try {
            const postUrl = await generateUploadUrl();
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": selectedImage.type },
                body: selectedImage,
            });
            const { storageId } = await result.json();
            await createRestaurant({
                name,
                imageUrl: storageId,
                googleReviewURL: reviewUrl,
            });
            setIsModalOpen(false);
            window.location.reload();
        } catch (error) {
            console.error("Failed to create restaurant:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const nextStep = () => setStep((s) => s + 1);
    const prevStep = () => setStep((s) => s - 1);

    return (
        <Dialog open={showOnboardingModal} onOpenChange={setIsModalOpen}>
            <DialogContentWithClose className="sm:max-w-md rounded-2xl shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Add Your Restaurant
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4 space-y-4 ">
                    {step === 1 && (
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="name">Restaurant Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter restaurant name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    )}
                    {step === 2 && (
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="reviewUrl">Google Review URL</Label>
                            <Input
                                id="reviewUrl"
                                placeholder="https://g.page/r/..."
                                value={reviewUrl}
                                onChange={(e) => setReviewUrl(e.target.value)}
                            />
                        </div>
                    )}
                    {step === 3 && (
                        <div className="flex flex-col space-y-2">
                            <Label className="mb-2"> Logo</Label>
                            {previewUrl && selectedImage ? (
                                <div className="relative w-fit mx-auto">
                                    <img
                                        src={previewUrl}
                                        alt={selectedImage.name}
                                        className="h-32 w-32 object-cover rounded-md border"
                                    />
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                        onClick={() => setSelectedImage(null)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </Button>
                                </div>
                            ) : (
                                <div
                                    className="flex items-center justify-center w-full"
                                    onClick={() => imageInput.current?.click()}
                                >
                                    <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg
                                                className="w-8 h-8 mb-4 text-muted-foreground"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 20 16"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                />
                                            </svg>
                                            <p className="mb-2 text-sm text-muted-foreground">
                                                <span className="font-semibold">Click to upload</span>
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                PNG or JPG
                                            </p>
                                        </div>
                                        <Input
                                            id="imageUrl"
                                            type="file"
                                            accept="image/png,image/jpeg"
                                            ref={imageInput}
                                            onChange={(event) =>
                                                event.target.files &&
                                                setSelectedImage(event.target.files[0])
                                            }
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter className="mt-6 flex justify-between">
                    <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={step === 1 || isUploading}
                    >
                        Back
                    </Button>

                    {step < 3 ? (
                        <Button
                            onClick={nextStep}
                            disabled={
                                (step === 1 && !name.trim()) ||
                                (step === 2 && !reviewUrl.trim())
                            }
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={!selectedImage || isUploading}
                        >
                            {isUploading ? "Saving..." : "Save & Finish"}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContentWithClose>
        </Dialog>
    );
}
