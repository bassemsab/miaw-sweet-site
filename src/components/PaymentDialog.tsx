"use client";

import { useState } from "react";
import { CreditCard, CheckCircle, Loader2, Minus, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Photo } from "@/components/PhotoCard";

export function PaymentDialog({ photo, children }: { photo: Photo; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");
  const [cardholder, setCardholder] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  const pricePerShare = Math.max(0.01, (photo.value || 0) / 10);
  const total = pricePerShare * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("processing");
    setTimeout(() => {
      setStatus("success");
    }, 1200);
  };

  const reset = () => {
    setStatus("idle");
    setQuantity(1);
    setCardholder("");
    setCardNumber("");
  };

  return (
    <Dialog open={open} onOpenChange={(next) => { setOpen(next); if (!next) reset(); }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md rounded-2xl border-border bg-card p-0">
        <div className="p-6">
          <DialogHeader className="text-left">
            <DialogTitle className="font-display text-xl">Invest in this cat</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Concept-only checkout. No real payment is processed.
            </DialogDescription>
          </DialogHeader>

          {status === "success" ? (
            <div className="mt-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <p className="mt-4 font-display text-lg font-semibold text-card-foreground">
                Purr-chase confirmed!
              </p>
              <p className="text-sm text-muted-foreground">
                You now own {quantity} share{quantity === 1 ? "" : "s"} of {photo.caption || "this cat"}.
              </p>
              <Button onClick={() => setOpen(false)} className="mt-4 rounded-full bg-primary font-display text-primary-foreground">
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="flex gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                  <img
                    src={photo.signed_url}
                    alt={photo.caption || "Cat asset"}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-display font-semibold text-card-foreground">
                    {photo.caption || "Untitled cat asset"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ${pricePerShare.toFixed(2)} / share
                  </p>
                </div>
              </div>

              <div>
                <Label className="font-display text-sm">Quantity</Label>
                <div className="mt-1 flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="min-w-[2rem] text-center font-display text-lg font-semibold">{quantity}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardholder" className="font-display text-sm">Cardholder name</Label>
                <Input
                  id="cardholder"
                  required
                  value={cardholder}
                  onChange={(e) => setCardholder(e.target.value)}
                  placeholder="M. Meowington"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="card" className="font-display text-sm">Card number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="card"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    className="rounded-xl pl-10"
                    maxLength={19}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="expiry" className="font-display text-sm">Expiry</Label>
                  <Input id="expiry" placeholder="MM/YY" className="rounded-xl" maxLength={5} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc" className="font-display text-sm">CVC</Label>
                  <Input id="cvc" placeholder="123" className="rounded-xl" maxLength={3} />
                </div>
              </div>

              <div className="rounded-xl bg-muted p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-display font-bold text-card-foreground">${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={status === "processing"}
                className="gradient-cute w-full rounded-full font-display font-semibold text-primary-foreground"
              >
                {status === "processing" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Pay securely"
                )}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
