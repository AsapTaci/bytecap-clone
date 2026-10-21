import Image from "next/image";

const logos = [
  { src: "/sites/bytecap/trust-canva.svg", alt: "Canva", w: 90 },
  { src: "/sites/bytecap/trust-doordash.svg", alt: "DoorDash", w: 110 },
  { src: "/sites/bytecap/trust-shopify.svg", alt: "Shopify", w: 90 },
  { src: "/sites/bytecap/trust-stripe.svg", alt: "Stripe", w: 70 },
  { src: "/sites/bytecap/trust-telus.svg", alt: "Telus", w: 80 },
  { src: "/sites/bytecap/trust-volvo.svg", alt: "Volvo", w: 70 },
  { src: "/sites/bytecap/trust-zapier.svg", alt: "Zapier", w: 90 },
];

export default function TrustedBy() {
  return (
    <section className="border-b border-white/[0.06] py-16">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <p className="text-center text-[12px] font-medium uppercase tracking-[0.1em] text-white/35">
          Trusted by creators and industry leaders worldwide
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-70 grayscale">
          {logos.map((logo) => (
            <Image
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              width={logo.w}
              height={28}
              className="h-6 w-auto object-contain brightness-0 invert sm:h-7"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
