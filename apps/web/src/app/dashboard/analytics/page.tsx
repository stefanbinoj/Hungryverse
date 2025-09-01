import FeedbackChart from "../components/feedback-chart";
import FeedbackMetrics from "../components/feedback-metrics";

export default function AnalyticsPage() {
  return (
    <div className="w-full  px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>
      <FeedbackMetrics />
      <section
        aria-labelledby="feedback-chart-title"
        className="mt-10 flex flex-col gap-4 w-full "
      >
        <h2 id="feedback-chart-title" className="sr-only">
          Feedback volume over time
        </h2>
        <FeedbackChart />
      </section>
    </div>
  );
}
