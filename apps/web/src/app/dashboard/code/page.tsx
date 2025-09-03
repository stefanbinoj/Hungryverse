"use client";

import { api } from "@feedbacl/backend/convex/_generated/api";
import { Authenticated, useMutation, useQuery } from "convex/react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { CardSkeleton } from "@/components/card-skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Id } from "@feedbacl/backend/convex/_generated/dataModel";

const Code = () => {
	return (
		<Authenticated>
			<CouponCodePage />
		</Authenticated>
	);
};

export default Code;

function CouponCodePage() {
	const getAllCodes = useQuery(
		api.functions.couponCode.getCouponCodeForRestaurant,
	);
	const markCouponCodeAsUsed = useMutation(
		api.functions.couponCode.toggleUsage,
	);

	const handleMarkAsUsed = (couponCodeId: Id<"couponCodes">) => {
		markCouponCodeAsUsed({ couponCodeId });
	};

	if (getAllCodes === undefined) {
		return (
			<div>
				<h1 className="text-3xl font-bold mb-6">Coupon Codes</h1>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{[...Array(3)].map((_, i) => (
						<CardSkeleton key={i} />
					))}
				</div>
			</div>
		);
	}

	if (getAllCodes.length === 0) {
		return (
			<EmptyState
				title="No Coupon Codes"
				message="You haven't generated any coupon codes yet."
			/>
		);
	}

	return (
		<div>
			<h1 className="text-3xl font-bold mb-6">Coupon Codes</h1>
			<Card>
				<CardContent>
					<div className="flex flex-col">
						<div className="hidden md:flex border-b pb-2 mb-2 font-semibold">
							<div className="w-1/3">Code</div>
							<div className="w-1/3">Phone Number</div>
							<div className="w-1/3">Time</div>
							<div className="w-1/6 text-right">Action</div>
						</div>
						<div className="space-y-4">
							{getAllCodes.map((code) => (
								<div
									key={code._id.toString()}
									className={cn(
										"flex flex-col md:flex-row py-2 border-b last:border-b-0 relative",
										code.used && "text-gray-300",
									)}
								>
									<div className="absolute top-2 right-2 md:hidden">
										<Checkbox
											checked={code.used}
											onCheckedChange={() => handleMarkAsUsed(code._id)}
                                            className="border border-border"
										/>
									</div>
									<div className="w-full md:w-1/3 mb-2 md:mb-0">
										<span className="font-semibold md:hidden">Code: </span>
										{code.couponCode}
									</div>
									<div className="w-full md:w-1/3 mb-2 md:mb-0">
										<span className="font-semibold md:hidden">
											Phone Number:{" "}
										</span>
										{code.phoneNumber}
									</div>
									<div className="w-full md:w-1/3">
										<span className="font-semibold md:hidden">Time: </span>
										{new Date(code._creationTime).toLocaleString()}
									</div>
									<div className="ml-3 hidden md:flex w-1/6 justify-end">
										<Checkbox
											checked={code.used}
											onCheckedChange={() => handleMarkAsUsed(code._id)}
                                            className="border border-border"
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
