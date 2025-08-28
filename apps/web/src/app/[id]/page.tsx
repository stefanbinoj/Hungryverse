
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Star, CheckCircle } from "lucide-react"

interface FormData {
  cleanliness: number
  service: number
  experience: string
  phone: string
}

export default function RestaurantFeedbackForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    cleanliness: 0,
    service: 0,
    experience: "",
    phone: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const totalSteps = 4

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
    console.log("Form submitted:", formData)
  }

  const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void }) => {
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
                star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-900">Thank You!</h2>
              <p className="text-gray-600">Your feedback has been submitted successfully.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="py-0 bg-white shadow-sm border-0 rounded-lg">
          <CardContent className="p-8">
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">How clean was our restaurant?</h2>
                <StarRating
                  rating={formData.cleanliness}
                  onRatingChange={(rating) => setFormData((prev) => ({ ...prev, cleanliness: rating }))}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-4">
                  <span>Not good</span>
                  <span>Very satisfied</span>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">How was our service quality?</h2>
                <StarRating
                  rating={formData.service}
                  onRatingChange={(rating) => setFormData((prev) => ({ ...prev, service: rating }))}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-4">
                  <span>Not good</span>
                  <span>Very satisfied</span>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Tell us about your experience</h2>
                <Textarea
                  placeholder="Please share your thoughts about your visit..."
                  value={formData.experience}
                  onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value }))}
                  className="min-h-32 resize-none border-gray-200 focus:border-gray-400"
                />
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Your phone number</h2>
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="border-gray-200 focus:border-gray-400"
                />
              </div>
            )}

            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <Button variant="ghost" onClick={handlePrevious} className="text-gray-600">
                  Back
                </Button>
              ) : (
                <div></div>
              )}

              {currentStep < totalSteps ? (
                <Button onClick={handleNext} className="bg-gray-900 hover:bg-gray-800">
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-gray-900 hover:bg-gray-800">
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
  )
}
