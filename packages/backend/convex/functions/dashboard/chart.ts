import { Doc } from "../../_generated/dataModel";
import { query } from "../../_generated/server";

function groupByHour(responses: Doc<"responses">[]) {
    const result = Array.from({ length: 24 }, (_, hour) => ({
        label: hour.toString().padStart(2, "0"),
        count: 0,
    }));

    for (const response of responses) {
        const date = new Date(response._creationTime);
        const hour = date.getHours(); // 0 - 23
        result[hour].count += 1;
    }

    return result;
}

function groupByWeekday(responses: Doc<"responses">[]) {
    const weekdayOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts = Object.fromEntries(weekdayOrder.map((day) => [day, 0]));

    for (const response of responses) {
        const date = new Date(response._creationTime);
        const day = weekdayOrder[date.getDay()];
        counts[day]++;
    }

    // Return in Mon to Sun order
    const desiredOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return desiredOrder.map((day) => ({ label: day, count: counts[day] }));
}

function groupByDayOfMonth(responses: Doc<"responses">[]) {
    // Assume up to 31 days in a month
    const result = Array.from({ length: 31 }, (_, i) => ({
        label: (i + 1).toString(),
        count: 0,
    }));

    for (const response of responses) {
        const date = new Date(response._creationTime);
        const day = date.getDate(); // 1 - 31
        result[day - 1].count += 1;
    }

    // Trim any unused days at the end if month was < 31
    const lastDay = Math.max(
        ...responses.map((r) => new Date(r._creationTime).getDate()),
    );
    return result.slice(0, lastDay);
}


export const getChartData = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }

        const existingRestaurant = await ctx.db
            .query("restaurants")
            .filter((q) => q.eq(q.field("userId"), identity.subject))
            .first();

        if (!existingRestaurant) {
            throw new Error("Restaurant not found");
        }

        const now = new Date();
        const yesterday = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() ,
        );
        const last7Days = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 7,
        );
        const past30Days = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 30,
        );

        const yesterdayTs = yesterday.getTime();
        const last7DaysTs = last7Days.getTime();
        const past30DaysTs = past30Days.getTime();

        const [dailyResponses, weeklyResponses, monthlyResponses] =
            await Promise.all([
                ctx.db
                    .query("responses")
                    .filter((q) =>
                        q.and(
                            q.eq(q.field("restrurantId"), existingRestaurant._id),
                            q.gte(q.field("_creationTime"), yesterdayTs),
                        ),
                    )
                    .order("asc")
                    .collect(),

                ctx.db
                    .query("responses")
                    .filter((q) =>
                        q.and(
                            q.eq(q.field("restrurantId"), existingRestaurant._id),
                            q.gte(q.field("_creationTime"), last7DaysTs),
                        ),
                    )
                    .order("asc")
                    .collect(),

                ctx.db
                    .query("responses")
                    .filter((q) =>
                        q.and(
                            q.eq(q.field("restrurantId"), existingRestaurant._id),
                            q.gte(q.field("_creationTime"), past30DaysTs),
                        ),
                    )
                    .order("asc")
                    .collect(),
            ]);

        const dailySummary = groupByHour(dailyResponses);
        const weeklySummary = groupByWeekday(weeklyResponses);
        const monthlySummary = groupByDayOfMonth(monthlyResponses);

        return {
            daily: dailySummary,
            weekly: weeklySummary,
            monthly: monthlySummary,
        };
    },
});
