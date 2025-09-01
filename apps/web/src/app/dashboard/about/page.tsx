"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useQuery } from "convex/react";
import { api } from "@feedbacl/backend/convex/_generated/api";
import { AboutCard } from "../components/about-card";
import { Authenticated } from "convex/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Check, Copy, Download, Eye } from "lucide-react";
import { toast } from "sonner";

export default function AboutPage() {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">About</h1>
                <Authenticated>
                    <QRCode />
                </Authenticated>
            </div>

            <section>
                <Authenticated>
                    <AboutCard />
                </Authenticated>
            </section>
        </div>
    );
}

function QRCode() {
    const qrRef = useRef<HTMLDivElement>(null);
    const [url, setUrl] = useState("");
    const [copied, setCopied] = useState(false);

    const getRestaurantId = useQuery(api.functions.resturants.getRestaurantId);

    useEffect(() => {
        if (getRestaurantId === undefined) return; // Still loading

        const hostname = window.location.origin;
        setUrl(`${hostname}/${getRestaurantId}`);
    }, [getRestaurantId]);

    const downloadQR = () => {
        const canvas = qrRef.current?.querySelector("canvas");
        if (!canvas) return;

        const dataUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "qr-code.png";
        a.click();
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            toast.success("Link copied to clipboard");
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        });
    };

    if (!getRestaurantId) return null; // Don't render until ID is ready

    return (
        <div className="flex items-center gap-2">
            {/* Hidden QR code for download */}
            <div ref={qrRef} style={{ display: "none" }}>
                <QRCodeCanvas value={url} size={256} />
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-fit rounded-2xl shadow-xl">
                    <div className="flex flex-col items-center gap-4 p-4">
                        <div className="rounded-lg border p-4">
                            <QRCodeCanvas value={url} size={220} />
                        </div>
                        <div className="flex w-full items-center gap-2">
                            <input
                                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                value={url}
                                readOnly
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={copyToClipboard}
                                className=" border-black hover:border-black/20"
                            >
                                {copied ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <Button variant="outline" size="icon" onClick={downloadQR}>
                <Download className="h-4 w-4" />
            </Button>
        </div>
    );
}
