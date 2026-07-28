"use client";

import { motion } from "framer-motion";
import type { AboutPromisePayload } from "@/lib/about-types";

/**
 * 区块 5 · 解决方案承诺
 *  - 不写空泛愿景，换成一句话具体的服务承诺
 */
export function AboutPromise({ data }: { data: AboutPromisePayload }) {
  return (
    <section className="bg-ink-700 py-24 text-bone-100">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="en-mono mb-4 text-[10px] uppercase tracking-[0.32em] text-gold-300">
            The Promise · 解决方案承诺
          </div>
          <h3 className="cn-display text-3xl leading-tight md:text-4xl">
            不是愿景，是一句话承诺
          </h3>

          <blockquote className="mt-10 border-l-2 border-gold-500/40 pl-6">
            <p className="cn-display text-xl leading-relaxed text-bone-100 md:text-2xl">
              “{data.statement}”
            </p>
          </blockquote>

          {data.bullets && data.bullets.length > 0 && (
            <ul className="mt-8 grid gap-px overflow-hidden border border-bone-300/10 bg-bone-300/10 sm:grid-cols-3">
              {data.bullets.map((b, i) => (
                <li
                  key={b}
                  className="flex items-center gap-3 bg-ink-700 px-5 py-4"
                >
                  <span className="en-mono shrink-0 text-[10px] uppercase tracking-[0.24em] text-gold-300">
                    0{i + 1}
                  </span>
                  <span className="text-[13px] text-bone-300/80">{b}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </section>
  );
}