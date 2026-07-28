"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { TestimonialsPayload } from "@/lib/home-types";

export function Testimonials({ data }: { data: TestimonialsPayload }) {
  return (
    <section className="bg-bone-100 py-20 paper-grain">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle eyebrow={data.eyebrow} title={data.title} />
        <div className="grid gap-px overflow-hidden border border-ink-700/10 bg-ink-700/10 md:grid-cols-3">
          {data.items.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="bg-bone-100 p-8"
            >
              <Quote size={20} className="mb-4 text-forest-500" strokeWidth={1.2} />
              <blockquote className="cn-display text-[16px] leading-relaxed text-ink-700">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 border-t border-ink-700/10 pt-4">
                <div className="cn-display text-sm text-ink-700">{t.name}</div>
                <div className="mt-1 text-[11px] tracking-wide text-charcoal/60">
                  {t.tag}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}