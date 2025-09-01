"use client";

import { AboutCard } from "../components/about-card";
import { Authenticated } from "convex/react";

export default function AboutPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">About</h1>
            <section>
                <Authenticated>
                    <AboutCard />
                </Authenticated>
            </section>
        </div>
    );
}
