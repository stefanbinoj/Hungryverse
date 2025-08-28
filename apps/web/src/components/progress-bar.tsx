interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  steps: string[]
}

export function ProgressBar({ currentStep, totalSteps, steps }: ProgressBarProps) {
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`text-sm font-medium ${
              index < currentStep ? "text-primary" : index === currentStep ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {step}
          </div>
        ))}
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  )
}
