"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useForm } from "react-hook-form";
import MagneticButton from "./MagneticButton";
import { useI18n } from "@/lib/i18n";

interface FormData { name: string; email: string; message: string; }

export default function Contact() {
  const { lang, t } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => { console.log("Form data:", data); setSubmitted(true); };

  return (
    <section id="contact" ref={ref} className="relative bg-bg-secondary py-28 md:py-40 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[200px] pointer-events-none" />
      <div className="relative mx-auto max-w-[900px] px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-text-secondary/30 mb-4 block">{t.contact.label[lang]}</span>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-text-secondary">
            {t.contact.heading1[lang]}<br /><span className="text-accent">{t.contact.heading2[lang]}</span>?
          </h2>
        </motion.div>

        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-accent flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-accent"><path d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="font-display text-2xl font-bold text-text-secondary mb-2">{t.contact.sent[lang]}</h3>
            <p className="text-text-secondary/50 font-mono text-sm">{t.contact.sentSub[lang]}</p>
          </motion.div>
        ) : (
          <motion.form initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.8 }}
            onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative">
                <input {...register("name", { required: true })} type="text" placeholder=" "
                  className="w-full bg-transparent border-b border-white/10 focus:border-accent py-4 px-0 text-text-secondary outline-none transition-colors duration-300 font-body peer" />
                <label className="absolute left-0 top-4 text-text-secondary/30 font-mono text-sm transition-all duration-300 pointer-events-none peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-accent peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-75 origin-left">
                  {t.contact.name[lang]}
                </label>
                {errors.name && <span className="text-accent text-xs mt-1 font-mono">{t.contact.required[lang]}</span>}
              </div>
              <div className="relative">
                <input {...register("email", { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} type="email" placeholder=" "
                  className="w-full bg-transparent border-b border-white/10 focus:border-accent py-4 px-0 text-text-secondary outline-none transition-colors duration-300 font-body peer" />
                <label className="absolute left-0 top-4 text-text-secondary/30 font-mono text-sm transition-all duration-300 pointer-events-none peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-accent peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-75 origin-left">
                  {t.contact.email[lang]}
                </label>
                {errors.email && <span className="text-accent text-xs mt-1 font-mono">{t.contact.emailError[lang]}</span>}
              </div>
            </div>
            <div className="relative">
              <textarea {...register("message", { required: true })} rows={4} placeholder=" "
                className="w-full bg-transparent border-b border-white/10 focus:border-accent py-4 px-0 text-text-secondary outline-none transition-colors duration-300 font-body resize-none peer" />
              <label className="absolute left-0 top-4 text-text-secondary/30 font-mono text-sm transition-all duration-300 pointer-events-none peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-accent peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-75 origin-left">
                {t.contact.message[lang]}
              </label>
              {errors.message && <span className="text-accent text-xs mt-1 font-mono">{t.contact.required[lang]}</span>}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
              <MagneticButton type="submit" className="group relative px-10 py-4 bg-accent text-text-secondary font-display font-bold text-sm uppercase tracking-wider hover:bg-accent/90 transition-colors w-full sm:w-auto text-center">
                {t.contact.submit[lang]}
                <span className="absolute inset-0 border border-accent scale-105 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </MagneticButton>
              <span className="text-text-secondary/20 font-mono text-xs">{t.contact.or[lang]}</span>
              <MagneticButton as="a" href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 border border-white/10 text-text-secondary/50 hover:text-accent hover:border-accent/30 transition-all duration-300 font-mono text-xs uppercase tracking-wider">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.65-1.322A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.339 0-4.508-.756-6.266-2.038l-.438-.327-3.266.928.865-3.156-.36-.572A9.946 9.946 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" /></svg>
                WhatsApp
              </MagneticButton>
            </div>
          </motion.form>
        )}

        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.6, duration: 0.8 }} className="mt-16 text-center">
          <a href="mailto:hello@adriano.dev" className="font-mono text-sm text-text-secondary/30 hover:text-accent transition-colors duration-300">hello@adriano.dev</a>
        </motion.div>
      </div>
    </section>
  );
}
