import type { Metadata } from "next";
import Image from "next/image";
import { ROOMS, CONTACT } from "@/lib/data";

export const metadata: Metadata = {
  title: "Rooms — Tiger's Nest Resort",
  description:
    "Three distinct accommodations in Paro Valley — Deluxe Rooms, Suites, and Cottage Rooms. Each designed to bring you closer to Bhutan.",
};

export default function RoomsPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="pt-32 pb-20 px-6 bg-forest-900 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c4973a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-gold-400 mb-6">
            Accommodation
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-light text-cream leading-tight mb-6">
            Your Sanctuary in the Himalayas
          </h1>
          <p className="font-sans text-base text-forest-100 leading-relaxed">
            Each room at Tiger&apos;s Nest has been thoughtfully designed to
            blend Bhutanese craftsmanship with modern comforts — a true retreat
            at the foot of the sacred Taktsang Monastery.
          </p>
        </div>
      </section>

      {/* Rooms List */}
      <section className="py-24 px-6 bg-cream">
        <div className="max-w-7xl mx-auto flex flex-col gap-20">
          {ROOMS.map((room, index) => (
            <div
              key={room.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Image */}
              <div
                className={`relative aspect-4/3 overflow-hidden bg-forest-100 ${
                  index % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                {room.image && (
                  <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                )}
              </div>

              {/* Content */}
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold-500 mb-4">
                  Up to {room.capacity} guests
                </p>
                <h2 className="font-serif text-4xl text-forest-900 mb-5">{room.name}</h2>
                <p className="font-sans text-base text-stone leading-relaxed mb-8">
                  {room.description}
                </p>

                {/* Features */}
                <div className="mb-8">
                  <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-forest-700 mb-4">
                    Room Features
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {room.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 font-sans text-sm text-stone"
                      >
                        <span className="w-4 h-px bg-gold-400 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}?text=Hello%2C%20I%20would%20like%20to%20book%20the%20${encodeURIComponent(room.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center font-sans text-xs tracking-[0.2em] uppercase px-8 py-4 bg-forest-800 text-cream hover:bg-forest-700 transition-all duration-300"
                >
                  Enquire About This Room
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-20 px-6 bg-parchment text-center border-t border-forest-100">
        <div className="max-w-xl mx-auto">
          <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-gold-500 mb-4">
            Book Direct
          </p>
          <h3 className="font-serif text-3xl text-forest-900 mb-4">
            Ready to reserve your room?
          </h3>
          <p className="font-sans text-sm text-stone mb-8">
            Contact us directly on WhatsApp or phone to secure your stay and
            receive an exclusive 50% discount.
          </p>
          <a
            href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}?text=Hello%2C%20I%20would%20like%20to%20make%20a%20reservation`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center font-sans text-xs tracking-widest uppercase px-10 py-4 bg-gold-500 text-white hover:bg-gold-600 transition-all duration-300"
          >
            Book via WhatsApp — 50% Off
          </a>
        </div>
      </section>
    </>
  );
}
