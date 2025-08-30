"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@feedbacl/backend/convex/_generated/api";
import { Authenticated } from "convex/react";
import { useModalStore } from "@/store/onboarding";

import {
    Dialog,
    DialogContent,
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
        if (checkRestaurantExists) {
            router.push("/dashboard/analytics");
        } else {
            setShowOnboardingModal(true);
        }
    }, [checkRestaurantExists, router]);

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
    const [name, setName] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const handleSubmit = () => {
        // TODO: call convex mutation to save restaurant
        setIsModalOpen(false);
    };

    return (
        <Dialog open={showOnboardingModal} onOpenChange={setIsModalOpen}>
            <DialogContentWithClose className="sm:max-w-md rounded-2xl shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Add Restaurant
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                    {/* Name input */}
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="Enter restaurant name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Image URL input */}
                    {/*
          <div className="flex flex-col space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
                */}
                </div>

                <DialogFooter className="mt-6 flex justify-end gap-3">
                    <Button onClick={handleSubmit} disabled={!name}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContentWithClose>
        </Dialog>
    );
}
