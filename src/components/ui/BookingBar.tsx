"use client";

import { useState } from "react";
import { CONTACT } from "@/lib/data";
import DateField from "@/components/ui/DateField";
import GuestsField from "@/components/ui/GuestsField";

interface BookingBarProps {
  className?: string;
}

export default function BookingBar({ className = "" }: BookingBarProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const handleCheckIn = (value: string) => {
    setCheckIn(value);
    // Clear an earlier check-out so the stay never ends before it begins.
    if (checkOut && value && checkOut < value) setCheckOut("");
  };

  const waNumber = CONTACT.whatsapp.replace(/\D/g, "");
  const stayDetails = `Check-in: ${checkIn || "TBD"}, Check-out: ${checkOut || "TBD"}, Guests: ${guests}`;
  const bookHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Hello, I would like to book Tiger's Nest Resort (50% off direct rate). ${stayDetails}`
  )}`;
  const enquireHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Hello, I have an enquiry about Tiger's Nest Resort. ${stayDetails}`
  )}`;

  return (
    <div
      className={`inline-flex items-center whitespace-nowrap rounded-full border border-white/15 bg-black/50 backdrop-blur-md ${className}`}
    >
      <DateField
        label="Check-in"
        value={checkIn}
        onChange={handleCheckIn}
        className="pl-7 pr-5 py-3"
      />

      <span className="h-9 w-px shrink-0 bg-white/15" />

      <DateField
        label="Check-out"
        value={checkOut}
        onChange={setCheckOut}
        min={checkIn || undefined}
        className="px-5 py-3"
      />

      <span className="h-9 w-px shrink-0 bg-white/15" />

      <GuestsField value={guests} onChange={setGuests} className="px-5 py-3" />

      <span className="h-9 w-px shrink-0 bg-white/15" />

      <a
        href={enquireHref}
        target="_blank"
        rel="noopener noreferrer"
        className="self-stretch flex items-center px-6 font-mono text-[10px] tracking-[0.25em] uppercase text-white/60 hover:text-white transition-colors"
      >
        Enquire
      </a>

      <a
        href={bookHref}
        target="_blank"
        rel="noopener noreferrer"
        className="my-1.5 mr-1.5 flex items-center rounded-full bg-white px-7 py-3 font-mono text-[10px] tracking-[0.25em] uppercase text-black hover:bg-cream transition-colors"
      >
        Book
      </a>
    </div>
  );
}
