"use client";

import { I18nProvider } from "@/lib/i18n";
import CustomCursor from "@/components/CustomCursor";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Cases from "@/components/Cases";
import TechStack from "@/components/TechStack";
import Quote from "@/components/Quote";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <I18nProvider>
      <CustomCursor />
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Cases />
        <TechStack />
        <Quote />
        <Contact />
      </main>
      <Footer />
    </I18nProvider>
  );
}
