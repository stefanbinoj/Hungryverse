"use client";

import { Authenticated, useMutation, useQuery } from "convex/react";
import * as React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { api } from "@feedbacl/backend/convex/_generated/api";
import { toast } from "sonner";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Authenticated>
        <SettingsForm />
      </Authenticated>
    </div>
  );
}

function SettingsForm() {
  const [minValue, setMinValue] = React.useState<number>(10);
  const [redirectEnabled, setRedirectEnabled] = React.useState<boolean>(false);
  const [couponEnabled, setCouponEnabled] = React.useState<boolean>(false);
  const [showImage, setShowImage] = React.useState<boolean>(true);
  const [showDialog, setShowDialog] = React.useState<boolean>(false);
  const [intendedRedirectState, setIntendedRedirectState] =
    React.useState<boolean>(false);

  const getRestaurantSettings = useQuery(
    api.functions.settings.getRestaurantSettings,
  );
  React.useEffect(() => {
    if (getRestaurantSettings === undefined) return;
    setMinValue(getRestaurantSettings.minValue);
    setRedirectEnabled(getRestaurantSettings.allowRedirection);
    setCouponEnabled(getRestaurantSettings.allowCouponCodeGeneration);
    setShowImage(getRestaurantSettings.showImage);
  }, [getRestaurantSettings]);

  const updateRestaurantSettings = useMutation(
    api.functions.settings.updateRestaurantSettings,
  );
  const handleSubmit = () => {
    updateRestaurantSettings({
      minValue,
      allowRedirection: redirectEnabled,
      allowCouponCodeGeneration: couponEnabled,
      showImage,
    })
      .then(() => {
        toast.success("Settings updated successfully");
      })
      .catch(() => {
        console.error("Failed to update settings");
      });
  };
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
            max={5}
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
          <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
            <div className="dark">
              <AlertDialogTrigger
                asChild
                className="z-10 bg-transparent text-foreground"
              >
                <Switch
                  id="redirect"
                  checked={redirectEnabled}
                  onCheckedChange={(checked) => {
                    setIntendedRedirectState(checked);
                    setShowDialog(true);
                  }}
                  aria-label="Enable redirection"
                  className="border border-border data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground"
                />
              </AlertDialogTrigger>
            </div>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will {intendedRedirectState ? "enable" : "disable"} the
                  redirect behavior.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => setRedirectEnabled(intendedRedirectState)}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
        <div className="my-6 h-px w-full bg-border" />
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Label htmlFor="image" className="text-sm font-medium">
              Show logo
            </Label>
            <p className="text-sm text-muted-foreground">
              Turn on to show your restaurant logo on the feedback form.
            </p>
          </div>
          <Switch
            id="showImage"
            checked={showImage}
            onCheckedChange={setShowImage}
            aria-label="Enable show image"
            className="border border-border"
          />
        </div>

        {/* Actions */}
        <div className="mt-6">
          <Button type="button" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
