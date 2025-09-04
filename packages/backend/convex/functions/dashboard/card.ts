import { query } from "../../_generated/server";

export const getSubmissions = query({
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

        const now = new Date(); // ✅ Use Date object for manipulation

        const today = new Date(now);
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const thisWeek = new Date(today);
        thisWeek.setDate(thisWeek.getDate() - 7);

        const lastWeek = new Date(thisWeek);
        lastWeek.setDate(lastWeek.getDate() - 7);

        const thisMonth = new Date(today);
        thisMonth.setDate(1); // start of current month

        const lastMonth = new Date(thisMonth);
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        // ✅ Convert to timestamps
        const todayTs = today.getTime();
        const yesterdayTs = yesterday.getTime();
        const thisWeekTs = thisWeek.getTime();
        const lastWeekTs = lastWeek.getTime();
        const thisMonthTs = thisMonth.getTime();
        const lastMonthTs = lastMonth.getTime();

        const [
            todaySubmissions,
            yesterdaySubmissions,
            thisWeekSubmissions,
            lastWeekSubmissions,
            thisMonthSubmissions,
            lastMonthSubmissions,
        ] = await Promise.all([
            ctx.db
                .query("responses")
                .filter((q) =>
                    q.and(
                        q.eq(q.field("restrurantId"), existingRestaurant._id),
                        q.gte(q.field("_creationTime"), todayTs),
                    ),
                )
                .collect(),

            ctx.db
                .query("responses")
                .filter((q) =>
                    q.and(
                        q.eq(q.field("restrurantId"), existingRestaurant._id),
                        q.gte(q.field("_creationTime"), yesterdayTs),
                        q.lt(q.field("_creationTime"), todayTs),
                    ),
                )
                .collect(),

            ctx.db
                .query("responses")
                .filter((q) =>
                    q.and(
                        q.eq(q.field("restrurantId"), existingRestaurant._id),
                        q.gte(q.field("_creationTime"), thisWeekTs),
                    ),
                )
                .collect(),

            ctx.db
                .query("responses")
                .filter((q) =>
                    q.and(
                        q.eq(q.field("restrurantId"), existingRestaurant._id),
                        q.gte(q.field("_creationTime"), lastWeekTs),
                        q.lt(q.field("_creationTime"), thisWeekTs),
                    ),
                )
                .collect(),

            ctx.db
                .query("responses")
                .filter((q) =>
                    q.and(
                        q.eq(q.field("restrurantId"), existingRestaurant._id),
                        q.gte(q.field("_creationTime"), thisMonthTs),
                    ),
                )
                .collect(),

            ctx.db
                .query("responses")
                .filter((q) =>
                    q.and(
                        q.eq(q.field("restrurantId"), existingRestaurant._id),
                        q.gte(q.field("_creationTime"), lastMonthTs),
                        q.lt(q.field("_creationTime"), thisMonthTs),
                    ),
                )
                .collect(),
        ]);

        return {
            today: todaySubmissions.length,
            yesterday: yesterdaySubmissions.length,
            thisWeek: thisWeekSubmissions.length,
            lastWeek: lastWeekSubmissions.length,
            thisMonth: thisMonthSubmissions.length,
            lastMonth: lastMonthSubmissions.length,
        };
    },
});

export const getTotalSubmissions = query({
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

        const totalSubmissions = await ctx.db
            .query("responses")
            .filter((q) => q.eq(q.field("restrurantId"), existingRestaurant._id))
            .collect();

        return totalSubmissions.length;
    },
});

export const getAverageRatings = query({
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

        const submissions = await ctx.db
            .query("responses")
            .filter((q) => q.eq(q.field("restrurantId"), existingRestaurant._id))
            .collect();

        if (submissions.length === 0) {
            return {
                foodRating: 0,
                serviceRating: 0,
                ambianceRating: 0,
                cleanlinessRating: 0,
            };
        }

        const totalRatings = submissions.reduce(
            (acc, curr) => {
                return {
                    foodRating: acc.foodRating + curr.foodRating,
                    serviceRating: acc.serviceRating + curr.serviceRating,
                    ambianceRating: acc.ambianceRating + curr.ambianceRating,
                    cleanlinessRating: acc.cleanlinessRating + curr.cleanlinessRating,
                };
            },
            {
                foodRating: 0,
                serviceRating: 0,
                ambianceRating: 0,
                cleanlinessRating: 0,
            },
        );

        return {
            foodRating: totalRatings.foodRating / submissions.length || 0,
            serviceRating: totalRatings.serviceRating / submissions.length || 0,
            ambianceRating: totalRatings.ambianceRating / submissions.length || 0,
            cleanlinessRating:
                totalRatings.cleanlinessRating / submissions.length || 0,
        };
    },
});
