"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useQuery } from "convex/react";
import { api } from "@feedbacl/backend/convex/_generated/api";
import { AboutCard } from "../components/about-card";
import { Authenticated } from "convex/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Download, Eye } from "lucide-react";

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
                <DialogContent className="w-[320px] sm:w-[400px] rounded-2xl shadow-xl">
                    <div className="flex flex-col items-center gap-4">
                        <div>
                            <QRCodeCanvas value={url} size={256} />
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
