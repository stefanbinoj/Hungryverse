'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';

export default function Page({ params }: { params: { id: string } }) {
  const [step, setStep] = useState(1);
  const [serviceRating, setServiceRating] = useState(0);
  const [cleanlinessRating, setCleanlinessRating] = useState(0);
  const [numberInput, setNumberInput] = useState('');
  const [response, setResponse] = useState('');

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const renderStars = (rating: number, setRating: (rating: number) => void) => {
    return (
      <div className="flex justify-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`cursor-pointer ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            onClick={() => setRating(i + 1)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center py-24 bg-white">
      <div className="w-full">
        {step === 1 && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Rate our Service</h2>
            {renderStars(serviceRating, setServiceRating)}
            <Button onClick={handleNext} className="mt-4">
              Next
            </Button>
          </div>
        )}
        {step === 2 && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Rate our Cleanliness</h2>
            {renderStars(cleanlinessRating, setCleanlinessRating)}
            <div className="flex justify-center space-x-4 mt-4">
              <Button onClick={handlePrev}>Back</Button>
              <Button onClick={handleNext}>Next</Button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Additional Details</h2>
            <Input
              type="number"
              value={numberInput}
              onChange={(e) => setNumberInput(e.target.value)}
              placeholder="Enter a number"
              className="mb-4"
            />
            <div className="flex justify-center space-x-4 mt-4">
              <Button onClick={handlePrev}>Back</Button>
              <Button onClick={handleNext}>Next</Button>
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Final Response</h2>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Describe your experience..."
            />
            <div className="flex justify-center space-x-4 mt-4">
              <Button onClick={handlePrev}>Back</Button>
              <Button onClick={() => alert('Feedback Submitted!')}>Submit</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
