import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const dummyResponses = [
  {
    id: 1,
    rating: 5,
    comment: "Great service! Everything was clean and the staff was very friendly.",
  },
  {
    id: 2,
    rating: 4,
    comment: "Good experience, but the waiting time was a bit long.",
  },
  {
    id: 3,
    rating: 3,
    comment: "It was okay. The cleanliness could be improved.",
  },
  {
    id: 4,
    rating: 5,
    comment: "Absolutely fantastic! I will definitely come back.",
  },
  {
    id: 5,
    rating: 2,
    comment: "Not satisfied with the service. The staff was not helpful.",
  },
];

export default function ResponsesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Responses</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dummyResponses.map((response) => (
          <Card key={response.id}>
            <CardHeader>
              <CardTitle>Rating: {response.rating} / 5</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{response.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
