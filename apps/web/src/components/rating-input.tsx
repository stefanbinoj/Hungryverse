import { Star } from "lucide-react"

interface RatingInputProps {
  rating: number
  onRatingChange: (rating: number) => void
  label: string
  description?: string
}

export function RatingInput({ rating, onRatingChange, label, description }: RatingInputProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-lg font-semibold text-foreground">{label}</label>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="p-1 rounded-md hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <Star
              className={`w-8 h-8 ${
                star <= rating ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            />
          </button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        {rating > 0 ? `${rating} out of 5 stars` : "Please select a rating"}
      </p>
    </div>
  )
}
