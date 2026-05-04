import type { Metadata } from "next";
import Image from "next/image";
import { CONTACT, ATTRACTIONS } from "@/lib/data";

export const metadata: Metadata = {
  title: "About — Tiger's Nest Resort",
  description:
    "Learn about Tiger's Nest Resort — our story, our location in Paro Valley, and the experiences we offer in the Kingdom of Bhutan.",
};

export default function AboutPage() {
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
            Our Story
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-light text-cream leading-tight mb-6">
            More Than a Resort
          </h1>
          <p className="font-sans text-base text-forest-100 leading-relaxed">
            Tiger&apos;s Nest Resort was born from a desire to share the
            extraordinary spirit of Bhutan with the world — while preserving the
            land, culture, and traditions that make this kingdom so singular.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-6 bg-cream">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold-500 mb-5">
              Who We Are
            </p>
            <h2 className="font-serif text-4xl text-forest-900 mb-6 leading-tight">
              A Sanctuary at the Edge of Paro Valley
            </h2>
            <p className="font-sans text-base text-stone leading-relaxed mb-5">
              Nestled at Satsam Chorten in Paro, Bhutan, Tiger&apos;s Nest Resort
              occupies one of the most privileged positions in the Himalayas —
              looking out towards the iconic Taktsang Monastery, which clings to
              a cliff 3,120 metres above sea level.
            </p>
            <p className="font-sans text-base text-stone leading-relaxed mb-5">
              Our resort is designed as a living bridge between the ancient and
              the modern. Locally sourced materials, traditional Bhutanese
              architecture, and handcrafted textiles sit alongside contemporary
              comforts — ensuring that every guest experiences Bhutan at its most
              authentic, without sacrificing ease or luxury.
            </p>
            <p className="font-sans text-base text-stone leading-relaxed">
              We believe that travel should transform. Every programme, meal, and
              moment at Tiger&apos;s Nest is curated to leave you with a deeper
              connection to this remarkable kingdom.
            </p>
          </div>

          <div className="relative aspect-4/5 overflow-hidden bg-forest-100">
            <Image
              src="/tnrPhotos/1.jpg"
              alt="Tiger's Nest Resort exterior"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 bg-parchment">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-gold-500 mb-5">
              Our Values
            </p>
            <h2 className="font-serif text-4xl text-forest-900">
              What We Stand For
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Cultural Respect",
                body: "We are stewards of Bhutanese heritage. Every aspect of our resort honours the traditions, craftsmanship, and spiritual life of the Bhutanese people.",
              },
              {
                title: "Genuine Hospitality",
                body: "Bhutan is famed for Gross National Happiness — a philosophy we embrace fully. Our team treats every guest as a cherished member of our family.",
              },
              {
                title: "Responsible Luxury",
                body: "We source locally, minimise our footprint, and invest in the community. True luxury leaves the world better than it found it.",
              },
            ].map((value) => (
              <div key={value.title} className="bg-cream p-10 border border-forest-100">
                <div className="w-8 h-px bg-gold-400 mb-6" />
                <h3 className="font-serif text-2xl text-forest-900 mb-4">{value.title}</h3>
                <p className="font-sans text-sm text-stone leading-relaxed">{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-24 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-gold-500 mb-5">
              Explore the Region
            </p>
            <h2 className="font-serif text-4xl text-forest-900">
              Paro Valley & Beyond
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {ATTRACTIONS.map((place) => (
              <div key={place.id}>
                <div className="relative aspect-4/3 overflow-hidden bg-forest-100 mb-6">
                  {place.image && (
                    <Image
                      src={place.image}
                      alt={place.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  )}
                </div>
                <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold-500 mb-2">
                  {place.distance}
                </p>
                <h3 className="font-serif text-2xl text-forest-900 mb-3">{place.name}</h3>
                <p className="font-sans text-sm text-stone leading-relaxed">{place.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-24 px-6 bg-forest-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-gold-400 mb-6">
              Get in Touch
            </p>
            <h2 className="font-serif text-4xl text-cream mb-6">
              We&apos;d love to hear from you
            </h2>
            <p className="font-sans text-base text-forest-100 leading-relaxed mb-10">
              Whether you have questions about a stay, want to plan a special
              experience, or simply want to learn more about Bhutan — our team
              is ready to help.
            </p>
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold-400 mb-1">
                  Address
                </p>
                <p className="font-sans text-sm text-forest-100">{CONTACT.address}</p>
              </div>
              <div>
                <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold-400 mb-1">
                  Phone & WhatsApp
                </p>
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="font-sans text-sm text-forest-100 hover:text-cream transition-colors"
                >
                  {CONTACT.phone}
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <a
              href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}?text=Hello%2C%20I%20have%20an%20enquiry`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-6 border border-forest-600 hover:border-gold-500 transition-colors duration-300 group"
            >
              <div>
                <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold-400 mb-1">
                  WhatsApp
                </p>
                <p className="font-sans text-sm text-cream group-hover:text-gold-300 transition-colors">
                  Message us directly
                </p>
              </div>
            </a>
            <a
              href={`tel:${CONTACT.phone}`}
              className="flex items-center gap-4 p-6 border border-forest-600 hover:border-gold-500 transition-colors duration-300 group"
            >
              <div>
                <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold-400 mb-1">
                  Phone
                </p>
                <p className="font-sans text-sm text-cream group-hover:text-gold-300 transition-colors">
                  {CONTACT.phone}
                </p>
              </div>
            </a>
            <div className="p-6 border border-gold-500/30 bg-gold-500/5">
              <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold-400 mb-2">
                Special Offer
              </p>
              <p className="font-sans text-sm text-cream">
                {CONTACT.offer} when you book directly with us.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
