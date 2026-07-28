"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Phone, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CtaPayload } from "@/lib/home-types";

export function Cta({ data }: { data: CtaPayload }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section
      id="cta"
      className="relative overflow-hidden bg-bone-50 py-24 md:py-32 paper-grain"
    >
      <div className="absolute right-0 top-0 h-96 w-96 translate-x-1/2 rounded-full bg-gold-100/30 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-6">
        <div className="text-center">
          <div className="en-mono mb-4 text-[10px] uppercase tracking-[0.32em] text-forest-600">
            {data.eyebrow}
          </div>
          <h2 className="cn-display text-3xl leading-tight text-ink-700 md:text-5xl">
            {data.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[14px] leading-relaxed text-charcoal/60 md:text-[15px]">
            {data.sub}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mx-auto mt-14 max-w-2xl"
        >
          {submitted ? (
            <SubmittedState />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {data.fields.map((f) => (
                <FormField
                  key={f.name}
                  name={f.name}
                  label={f.label}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.name] || ""}
                  onChange={(v) => setForm({ ...form, [f.name]: v })}
                />
              ))}

              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 border border-ink-700 bg-ink-700 px-8 py-4 text-[13px] tracking-wider text-bone-100 transition-all hover:bg-ink-800"
              >
                {data.primary}
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <div className="flex items-center justify-center gap-3 text-[12px] text-charcoal/60">
                <span className="h-px w-8 bg-gold-500" />
                <Phone size={12} className="text-forest-600" />
                <span>{data.secondary}</span>
                <span className="h-px w-8 bg-gold-500" />
              </div>

              <p className="text-center text-[11px] leading-relaxed text-charcoal/40">
                {data.note}
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function FormField({
  name,
  label,
  type,
  placeholder,
  value,
  onChange,
}: {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="group">
      <label
        className={cn(
          "en-mono mb-2 block text-[10px] uppercase tracking-[0.32em] transition-colors",
          focused ? "text-forest-600" : "text-charcoal/40"
        )}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        required
        className="w-full border-b border-ink-700/20 bg-transparent px-1 py-3 text-[15px] text-ink-700 placeholder:text-charcoal/30 focus:border-gold-500 focus:outline-none"
      />
    </div>
  );
}

function SubmittedState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="border border-gold-500/30 bg-bone-100 px-8 py-16 text-center"
    >
      <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center border border-gold-500/50">
        <Check size={20} className="text-forest-600" strokeWidth={1.5} />
      </div>
      <h3 className="cn-display text-2xl text-ink-700">已收到您的预约</h3>
      <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-charcoal/60">
        专属顾问将在 24 小时内通过短信与您确认时间与场景。
        我们不通过公开内容主动触达您，所有沟通均在您主动预约后启动。
      </p>
    </motion.div>
  );
}