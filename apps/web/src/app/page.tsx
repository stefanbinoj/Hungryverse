import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <Button className="m-4">
        <Link href="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  );
}
