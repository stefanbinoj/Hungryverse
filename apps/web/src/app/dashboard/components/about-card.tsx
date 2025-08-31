"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { FileUp } from "lucide-react";

export function AboutCard() {
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
                  src="https://png.pngtree.com/png-vector/20210121/ourmid/pngtree-restaurant-icon-design-template-illustration-png-image_2774777.jpg"
                  alt="Current brand logo"
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="rounded bg-black/70 px-2 py-1 text-xs font-medium text-white">
                    Edit
                  </span>
                </div>
              </button>
            </DialogTrigger>

            {/* Modal with upload prompt (UI-only) */}
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Update logo</DialogTitle>
                <DialogDescription>
                  Open a file or drag and drop to replace your logo.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-2">
                <label
                  htmlFor="logo-upload"
                  className={cn(
                    "flex cursor-pointer items-center justify-center rounded-md border border-dashed p-6 text-center",
                    "hover:bg-muted/50 transition-colors",
                  )}
                >
                  <div className="flex flex-col items-center">
                    <FileUp
                      className="h-6 w-6 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <div className="mt-2 text-sm">
                      <span className="font-medium text-primary underline">
                        Open file
                      </span>
                      <span className="text-muted-foreground">
                        {" "}
                        or drag and drop
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      PNG or JPG, up to 2MB
                    </p>
                  </div>
                </label>
                <input id="logo-upload" type="file" className="sr-only" />
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button>Save</Button>
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
              placeholder="you@example.com"
              defaultValue=""
            />
          </div>

          {/* Preferred name */}
          <div className="space-y-2">
            <Label htmlFor="name">Preferred name (visible to others)</Label>
            <Input
              className="border-1 border-black"
              id="name"
              type="text"
              placeholder="Your name"
              defaultValue=""
            />
          </div>
        </CardContent>
      </div>
      <CardFooter>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  );
}
