"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, CheckCircle, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "@feedbacl/backend/convex/_generated/api";
import type { Id } from "@feedbacl/backend/convex/_generated/dataModel";

interface FormData {
    foodRating: number;
    serviceRating: number;
    ambianceRating: number;
    cleanlinessRating: number;
    description: string;
    phoneNumber: string;
}

const StarRating = ({
    rating,
    onRatingChange,
}: {
    rating: number;
    onRatingChange: (rating: number) => void;
}) => {
    return (
        <div className="flex items-center justify-center gap-2 my-8">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onRatingChange(star)}
                    className="transition-colors hover:scale-110 transform transition-transform"
                >
                    <Star
                        className={`w-12 h-12 ${
                            star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-300 text-gray-300"
                        }`}
                    />
                </button>
            ))}
        </div>
    );
};

export default function RestaurantFeedbackForm() {
    const params = useParams<{ id: Id<"restaurants"> }>();
    const id = params.id;

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        foodRating: 0,
        serviceRating: 0,
        ambianceRating: 0,
        cleanlinessRating: 0,
        description: "",
        phoneNumber: "",
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const questions = [
        {
            type: "rating",
            question: "How was our food quality?",
            rating: formData.foodRating,
            onRatingChange: (rating: number) => {
                setFormData((prev) => ({ ...prev, foodRating: rating }));
                handleNext();
            },
        },
        {
            type: "rating",
            question: "How was our service quality?",
            rating: formData.serviceRating,
            onRatingChange: (rating: number) => {
                setFormData((prev) => ({ ...prev, serviceRating: rating }));
                handleNext();
            },
        },
        {
            type: "rating",
            question: "How was our ambience?",
            rating: formData.ambianceRating,
            onRatingChange: (rating: number) => {
                setFormData((prev) => ({ ...prev, ambianceRating: rating }));
                handleNext();
            },
        },
        {
            type: "rating",
            question: "How was our cleanliness?",
            rating: formData.cleanlinessRating,
            onRatingChange: (rating: number) => {
                setFormData((prev) => ({
                    ...prev,
                    cleanlinessRating: rating,
                }));
                handleNext();
            },
        },
        {
            type: "textarea",
            question: "Tell us about your experience",
            value: formData.description,
            onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData((prev) => ({ ...prev, description: e.target.value })),
        },
        {
            type: "input",
            question: "Your phone number",
            value: formData.phoneNumber,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({ ...prev, phoneNumber: e.target.value })),
        },
    ];

    const totalSteps = questions.length;

    const handleNext = () => {
        setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    };

    const handlePrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const createResponse = useMutation(api.functions.responses.createResponse);
    const handleSubmit = () => {
        createResponse({ ...formData, restrurantId: id });
        setIsSubmitted(true);
    };



    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-white shadow-sm">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                            <h2 className="text-2xl font-bold text-gray-900">Thank You!</h2>
                            <p className="text-gray-600">
                                Your feedback has been submitted successfully.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <Card className="py-0 bg-white shadow-sm border-0 rounded-lg">
                    <CardContent className="p-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                    {questions[currentStep - 1].question}
                                </h2>
                                {(() => {
                                    const question = questions[currentStep - 1];
                                    switch (question.type) {
                                        case "rating":
                                            return (
                                                <StarRating
                                                    rating={question.rating as number}
                                                    onRatingChange={question.onRatingChange as (rating: number) => void}
                                                />
                                            );
                                        case "textarea":
                                            return (
                                                <Textarea
                                                    placeholder="Please share your thoughts about your visit..."
                                                    value={question.value as string}
                                                    onChange={question.onChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void}
                                                    className="min-h-32 resize-none border-gray-200 focus:border-gray-400"
                                                />
                                            );
                                        case "input":
                                            return (
                                                <Input
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    placeholder="98765 43210"
                                                    value={question.value}
                                                    onChange={question.onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                                                    className="border-gray-200 focus:border-gray-400"
                                                />
                                            );
                                        default:
                                            return null;
                                    }
                                })()}
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex justify-between mt-8">
                            {currentStep > 1 ? (
                                <Button
                                    variant="ghost"
                                    onClick={handlePrevious}
                                    className="border text-gray-600"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                            ) : (
                                <div></div>
                            )}
                            {currentStep === 5 && (
                                <Button
                                    onClick={handleNext}
                                    className="bg-gray-900 hover:bg-gray-800"
                                >
                                    Next
                                </Button>
                            )}
                            {currentStep === totalSteps && (
                                <Button
                                    onClick={handleSubmit}
                                    className="bg-gray-900 hover:bg-gray-800"
                                >
                                    Submit
                                </Button>
                            )}
                        </div>
                    </CardContent>
                    <div className="px-0 rounded-full pb-0">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
