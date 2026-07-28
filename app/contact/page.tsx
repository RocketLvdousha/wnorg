"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Mail, ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { cta, contactPage, pageHero } from "@/lib/content";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <PageHero
        eyebrow={pageHero.contact.eyebrow}
        title={pageHero.contact.title}
        sub={pageHero.contact.sub}
      />

      {/* 一句话 + 表单 */}
      <section className="bg-bone-50 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <p className="en-serif text-xl leading-relaxed text-ink-700 md:text-2xl">
            {contactPage.intro}
          </p>

          <div className="mt-16 grid gap-px overflow-hidden border border-ink-700/10 bg-ink-700/10 md:grid-cols-12">
            <div className="bg-bone-50 p-10 md:col-span-7">
              {submitted ? (
                <SubmittedState />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="cn-display text-2xl text-ink-700">
                    {cta.title}
                  </h3>
                  {cta.fields.map((f) => (
                    <ContactFormField
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
                    {cta.primary}
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                  <p className="text-center text-[11px] text-charcoal/50">
                    {cta.note}
                  </p>
                </form>
              )}
            </div>

            {/* 右侧：服务通道 */}
            <div className="bg-bone-100 p-10 md:col-span-5">
              <div className="en-mono text-[10px] uppercase tracking-[0.32em] text-forest-600">
                Direct Channels
              </div>
              <h3 className="cn-display mt-3 text-xl text-ink-700">其他通道</h3>
              <div className="mt-6 space-y-6">
                {contactPage.services.map((s) => (
                  <div key={s.title} className="border-t border-ink-700/10 pt-4">
                    <div className="cn-display text-base text-ink-700">{s.title}</div>
                    <p className="mt-2 text-[12px] leading-relaxed text-charcoal/70">
                      {s.desc}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <Mail size={12} className="text-forest-600" />
                      <span className="en-mono text-[11px] text-forest-700">
                        {s.action.replace("邮件 · ", "")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 门店列表 */}
      <section className="bg-bone-100 py-24 paper-grain">
        <div className="mx-auto max-w-5xl px-6">
          <SectionTitle
            eyebrow="STORES"
            title="体验门店"
            subtitle="中国大陆主要城市 · 预约制 · 不接受 walk-in"
          />
          <div className="grid gap-px overflow-hidden border border-ink-700/10 bg-ink-700/10 md:grid-cols-3">
            {contactPage.stores.map((s, i) => (
              <motion.div
                key={s.city}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-bone-100 p-7"
              >
                <div className="flex items-baseline justify-between border-b border-ink-700/10 pb-4">
                  <h4 className="cn-display text-xl text-ink-700">{s.city}</h4>
                  <span className="en-serif text-base italic text-forest-600/50">
                    0{i + 1}
                  </span>
                </div>
                <div className="mt-4 flex items-start gap-2 text-[13px] text-charcoal/70">
                  <MapPin size={14} className="mt-0.5 flex-shrink-0 text-forest-600" />
                  <span>{s.address}</span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[12px] text-charcoal/60">
                  <Clock size={12} className="text-forest-600" />
                  <span>{s.hours}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ContactFormField({
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
    <div>
      <label className="en-mono mb-2 block text-[10px] uppercase tracking-[0.32em] text-charcoal/50">
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
        className={`w-full border-b bg-transparent px-1 py-3 text-[15px] text-ink-700 placeholder:text-charcoal/30 focus:outline-none ${
          focused ? "border-gold-500" : "border-ink-700/20"
        }`}
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
      </p>
    </motion.div>
  );
}
