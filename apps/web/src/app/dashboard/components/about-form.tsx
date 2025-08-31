
"use client"

import Image from "next/image"
import { useId, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { UploadCloud } from "lucide-react"

export default function LogoUploader() {
  const inputId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Brand logo</CardTitle>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="secondary">
              Edit logo
            </Button>
          </DialogTrigger>

          <DialogContent aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>Update logo</DialogTitle>
              <DialogDescription>Open file or drag and drop</DialogDescription>
            </DialogHeader>

            <div
              className="rounded-lg border border-dashed bg-muted/30 p-6"
              role="group"
              aria-label="File upload dropzone"
            >
              <label
                htmlFor={inputId}
                className="flex cursor-pointer flex-col items-center justify-center gap-3 text-center"
              >
                <UploadCloud className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                <div className="text-sm">
                  <span className="font-medium underline underline-offset-2">Open file</span> or drag and drop
                </div>
                <p className="text-xs text-muted-foreground">PNG or JPG, up to 2MB</p>
              </label>

              {/* Hidden input for selecting a file (UI only; no functionality wired) */}
              <input
                id={inputId}
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={() => {
                  /* no-op: functionality left to you */
                }}
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button disabled>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <Separator />
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-md border bg-background">
            <Image
              src={"/placeholder.svg?height=96&width=96&query=brand%20logo%20placeholder"}
              alt="Current logo"
              fill
              sizes="96px"
              className="object-contain p-2"
            />
          </div>
          <div className="text-sm text-muted-foreground">Recommended: square image, at least 256×256px.</div>
        </div>
      </CardContent>
    </Card>
  )
}
