"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function SettingsForm() {
  const [minValue, setMinValue] = React.useState<number>(10);
  const [redirectEnabled, setRedirectEnabled] = React.useState<boolean>(false);
  const [couponEnabled, setCouponEnabled] = React.useState<boolean>(false);

  return (
    <Card className="">
      <CardContent className="pt-6">
        {/* Min Value */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="min-value" className="text-sm font-medium">
              Min value
            </Label>
            <span aria-live="polite" className="text-sm text-muted-foreground">
              {minValue}
            </span>
          </div>
          <Slider
            id="min-value"
            value={[minValue]}
            min={0}
            max={10}
            step={1}
            onValueChange={(v) => setMinValue(v[0] ?? 0)}
            aria-label="Minimum value"
          />
        </div>

        {/* Divider */}
        <div className="my-6 h-px w-full bg-border" />

        {/* Redirection switch */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Label htmlFor="redirect" className="text-sm font-medium">
              Redirection
            </Label>
            <p className="text-sm text-muted-foreground">
              Toggle to enable redirect behavior.
            </p>
          </div>
          <Switch
            id="redirect"
            checked={redirectEnabled}
            onCheckedChange={setRedirectEnabled}
            aria-label="Enable redirection"
            className="border border-border"
          />
        </div>

        <div className="my-6 h-px w-full bg-border" />
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Label htmlFor="coupon" className="text-sm font-medium">
              Coupon code generation
            </Label>
            <p className="text-sm text-muted-foreground">
              Turn on to auto-generate coupon codes.
            </p>
          </div>
          <Switch
            id="coupon"
            checked={couponEnabled}
            onCheckedChange={setCouponEnabled}
            aria-label="Enable coupon code generation"
            className="border border-border"
          />
        </div>

        {/* Actions */}
        <div className="mt-6">
          <Button type="button">Save</Button>
        </div>
      </CardContent>
    </Card>
  );
}
