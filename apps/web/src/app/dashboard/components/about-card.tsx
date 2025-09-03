"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUp, Pencil } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@feedbacl/backend/convex/_generated/api";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Id } from "@feedbacl/backend/convex/_generated/dataModel";

export function AboutCard() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [googleReviewURL, setGoogleReviewURL] = useState("");
  const [imageUrl, setImageUrl] = useState(
    "https://png.pngtree.com/png-vector/20210121/ourmid/pngtree-restaurant-icon-design-template-illustration-png-image_2774777.jpg",
  );

  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [storageId, setStorageId] = useState<Id<"_storage"> | null>(null);
  const imageInput = useRef<HTMLInputElement>(null);

  const getMyResturant = useQuery(api.functions.resturants.getMyRestaurant);
  const updateResturant = useMutation(
    api.functions.resturants.updateRestaurant,
  );
  const generateUploadUrl = useMutation(
    api.functions.imageUpload.generateUploadUrl,
  );

  useEffect(() => {
    if (getMyResturant) {
      setEmail(getMyResturant.email || "");
      setName(getMyResturant.name || "");
      setGoogleReviewURL(getMyResturant.googleReviewURL || "");
      setImageUrl(
        getMyResturant.imageUrl ||
          "https://png.pngtree.com/png-vector/20210121/ourmid/pngtree-restaurant-icon-design-template-illustration-png-image_2774777.jpg",
      );
    }
  }, [getMyResturant]);

  useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [selectedImage]);

  useEffect(() => {
    const uploadImage = async () => {
      if (!selectedImage) return;
      setUploading(true);
      try {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": selectedImage.type },
          body: selectedImage,
        });
        const { storageId } = await result.json();
        setStorageId(storageId);
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Image upload failed.");
      } finally {
        setUploading(false);
      }
    };
    uploadImage();
  }, [selectedImage, generateUploadUrl]);

  const handleSubmit = async () => {
    const parameters: {
      name?: string;
      imageUrl?: Id<"_storage">;
      googleReviewURL?: string;
    } = {};

    if (storageId) {
      parameters.imageUrl = storageId;
    }
    // Only include name if it has changed
    if (name !== getMyResturant?.name) {
      parameters.name = name;
    }
    // Only include googleReviewURL if it has changed
    if (googleReviewURL !== getMyResturant?.googleReviewURL) {
      parameters.googleReviewURL = googleReviewURL;
    }

    if (Object.keys(parameters).length > 0) {
      updateResturant(parameters)
        .then(() => {
          toast.success("Restaurant updated successfully");
          setStorageId(null);
          setSelectedImage(null);
        })
        .catch(() => {
          toast.error("Failed to update restaurant");
        });
    } else {
      toast.info("No changes to save.");
    }
  };

  return (
    <Card>
      <div className="flex items-start justify-start gap-9">
        <CardHeader className="pb-4">
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                aria-label="Edit logo"
                className={cn(
                  "group relative h-16 w-16 overflow-hidden rounded-md border",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                <img
                  src={imageUrl}
                  alt="Current brand logo"
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Pencil className="h-4 w-4 text-white" />
                </div>
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Update logo</DialogTitle>
                <DialogDescription>
                  Select a new image to replace your current logo.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4">
                {uploading ? (
                  <div className="flex flex-col items-center justify-center h-32">
                    <svg
                      className="animate-spin h-8 w-8 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Uploading...
                    </p>
                  </div>
                ) : previewUrl && selectedImage ? (
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
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="logo-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FileUp
                          className="h-8 w-8 mb-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG or JPG
                        </p>
                      </div>
                    </label>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/png,image/jpeg"
                      ref={imageInput}
                      onChange={(e) =>
                        e.target.files && setSelectedImage(e.target.files[0])
                      }
                      className="sr-only"
                    />
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant={selectedImage ? "default" : "outline"}>
                    {selectedImage ? "Done" : "Cancel"}
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent className="space-y-4 flex-1">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              className="border-1 border-black"
              id="email"
              type="email"
              value={email}
              disabled
            />
          </div>

          {/* Preferred name */}
          <div className="space-y-2">
            <Label htmlFor="name">Resturant name (visible to others)</Label>
            <Input
              className="border-1 border-black"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="googleReviewURL">Google Review Link</Label>
            <Input
              className="border-1 border-black"
              id="googleReviewURL"
              type="text"
              value={googleReviewURL}
              onChange={(e) => setGoogleReviewURL(e.target.value)}
            />
          </div>
        </CardContent>
      </div>
      <CardFooter>
        <Button onClick={handleSubmit}>Save Changes</Button>
      </CardFooter>
    </Card>
  );
}
