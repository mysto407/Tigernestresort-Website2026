import type { Metadata } from "next";
import Image from "next/image";
import { DINING, CONTACT } from "@/lib/data";

export const metadata: Metadata = {
  title: "Dining — Tiger's Nest Resort",
  description:
    "Savour the flavours of Bhutan at Tiger's Nest Resort. From traditional Bhutanese cuisine to bonfire terrace evenings under the Himalayan stars.",
};

export default function DiningPage() {
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
            Culinary Experience
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-light text-cream leading-tight mb-6">
            A Taste of Bhutan
          </h1>
          <p className="font-sans text-base text-forest-100 leading-relaxed">
            Every meal at Tiger&apos;s Nest is a journey through Bhutanese
            flavours — warm, spiced, and deeply rooted in centuries of
            tradition. From hearty local dishes to international favourites,
            we nourish every guest.
          </p>
        </div>
      </section>

      {/* Dining Options */}
      <section className="py-24 px-6 bg-cream">
        <div className="max-w-7xl mx-auto flex flex-col gap-20">
          {DINING.map((option, index) => (
            <div
              key={option.id}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              {/* Image */}
              <div
                className={`relative aspect-4/3 overflow-hidden bg-forest-100 ${
                  index % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                {option.image && (
                  <Image
                    src={option.image}
                    alt={option.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                )}
              </div>

              {/* Content */}
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold-500 mb-4">
                  {option.type}
                </p>
                <h2 className="font-serif text-4xl text-forest-900 mb-5">{option.name}</h2>
                <p className="font-sans text-base text-stone leading-relaxed">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bhutanese Food Note */}
      <section className="py-20 px-6 bg-forest-800">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-gold-400 mb-6">
            Local Flavours
          </p>
          <h3 className="font-serif text-3xl md:text-4xl font-light text-cream mb-6">
            The Taste of the Kingdom
          </h3>
          <p className="font-sans text-base text-forest-100 leading-relaxed mb-10">
            Bhutanese cuisine is bold and unique — chillies are not merely a
            spice but a vegetable here. Ema Datshi, the national dish of chillies
            and cheese, is a must-try. Our chefs use locally sourced red rice,
            organic produce, and traditional cooking methods to bring authentic
            flavours to your table.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Ema Datshi", "Phaksha Paa", "Jasha Maru", "Red Rice"].map((dish) => (
              <div key={dish} className="border border-forest-600 py-4 px-2 text-center">
                <p className="font-serif text-lg text-gold-300">{dish}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reservation */}
      <section className="py-20 px-6 bg-parchment text-center border-t border-forest-100">
        <div className="max-w-xl mx-auto">
          <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-gold-500 mb-4">
            Reservations
          </p>
          <h3 className="font-serif text-3xl text-forest-900 mb-4">
            Dining enquiries & special requests
          </h3>
          <p className="font-sans text-sm text-stone mb-8">
            Planning a special occasion or have dietary requirements? Reach out
            to us directly and we will take care of every detail.
          </p>
          <a
            href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}?text=Hello%2C%20I%20have%20a%20dining%20enquiry`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center font-sans text-xs tracking-widest uppercase px-10 py-4 bg-forest-800 text-cream hover:bg-forest-700 transition-all duration-300"
          >
            Contact Us on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
