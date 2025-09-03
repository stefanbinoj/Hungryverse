"use client";

import { api } from "@feedbacl/backend/convex/_generated/api";
import { Authenticated, useMutation, useQuery } from "convex/react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { CardSkeleton } from "@/components/card-skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Id } from "@feedbacl/backend/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

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

	const downloadAsExcel = () => {
		if (!getAllCodes) return;

		const data = getAllCodes.map((code) => ({
			"Coupon Code": code.couponCode,
			"Phone Number": code.phoneNumber,
			Time: new Date(code._creationTime).toLocaleString(),
			Used: code.used ? "Yes" : "No",
		}));

		const worksheet = XLSX.utils.json_to_sheet(data);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "CouponCodes");
		XLSX.writeFile(workbook, "coupon-codes.xlsx");
	};

	if (getAllCodes === undefined) {
		return (
			<div>
				<h1 className="mb-6 text-3xl font-bold">Coupon Codes</h1>
				<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
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
			<div className="mb-4 flex items-center justify-between">
				<h1 className="text-3xl font-bold">Coupon Codes</h1>
				<Button className="border border-border" variant="outline" size="icon" onClick={downloadAsExcel}>
					<Download className="h-4 w-4" />
				</Button>
			</div>
			<Card>
				<CardContent>
					<div className="flex flex-col">
						<div className="mb-2 hidden border-b pb-2 font-semibold md:flex">
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
										"relative flex flex-col border-b py-2 last:border-b-0 md:flex-row",
										code.used && "text-gray-300",
									)}
								>
									<div className="absolute right-2 top-2 md:hidden">
										<Checkbox
											checked={code.used}
											onCheckedChange={() => handleMarkAsUsed(code._id)}
											className="border border-border"
										/>
									</div>
									<div className="mb-2 w-full md:mb-0 md:w-1/3">
										<span className="font-semibold md:hidden">Code: </span>
										{code.couponCode}
									</div>
									<div className="mb-2 w-full md:mb-0 md:w-1/3">
										<span className="font-semibold md:hidden">
											Phone Number:{" "}
										</span>
										{code.phoneNumber}
									</div>
									<div className="w-full md:w-1/3">
										<span className="font-semibold md:hidden">Time: </span>
										{new Date(code._creationTime).toLocaleString()}
									</div>
									<div className="ml-3 hidden w-1/6 justify-end md:flex">
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
