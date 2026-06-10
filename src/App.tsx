import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Monitor,
  Smartphone,
  Laptop,
  HardDrive,
  Shield,
  Zap,
  Mail,
  Menu,
  X,
  Star,
  Clock,
  Users,
  Award,
  ShieldCheck,
  Zap as FastForward,
  DollarSign,
  Smile,
  MapPin,
  Lock,
  Globe,
  ArrowUp,
  ChevronUp,
} from 'lucide-react';
import { FAQSection } from './components/FAQSection';
import { useScrollReveal } from './hooks/useScrollReveal';
import { useTilt } from './hooks/useTilt';

const getServices = (t: any) => [
  {
    icon: <Monitor className="h-8 w-8" />,
    title: t('services.items.0.title'),
    description: t('services.items.0.description'),
  },
  {
    icon: <Laptop className="h-8 w-8" />,
    title: t('services.items.1.title'),
    description: t('services.items.1.description'),
  },
  {
    icon: <Smartphone className="h-8 w-8" />,
    title: t('services.items.2.title'),
    description: t('services.items.2.description'),
  },
  {
    icon: <HardDrive className="h-8 w-8" />,
    title: t('services.items.3.title'),
    description: t('services.items.3.description'),
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: t('services.items.4.title'),
    description: t('services.items.4.description'),
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: t('services.items.5.title'),
    description: t('services.items.5.description'),
  },
];

const getAdvantages = (t: any) => [
  {
    icon: <ShieldCheck className="h-8 w-8" />,
    title: t('advantages.items.0.title'),
    description: t('advantages.items.0.description'),
  },
  {
    icon: <FastForward className="h-8 w-8" />,
    title: t('advantages.items.1.title'),
    description: t('advantages.items.1.description'),
  },
  {
    icon: <DollarSign className="h-8 w-8" />,
    title: t('advantages.items.2.title'),
    description: t('advantages.items.2.description'),
  },
  {
    icon: <MapPin className="h-8 w-8" />,
    title: t('advantages.items.3.title'),
    description: t('advantages.items.3.description'),
  },
  {
    icon: <Smile className="h-8 w-8" />,
    title: t('advantages.items.4.title'),
    description: t('advantages.items.4.description'),
  },
  {
    icon: <Lock className="h-8 w-8" />,
    title: t('advantages.items.5.title'),
    description: t('advantages.items.5.description'),
  },
];

const getTestimonials = (t: any) => [
  {
    name: t('testimonials.items.0.name'),
    business: t('testimonials.items.0.business'),
    rating: 5,
    text: t('testimonials.items.0.text'),
  },
  {
    name: t('testimonials.items.1.name'),
    business: t('testimonials.items.1.business'),
    rating: 5,
    text: t('testimonials.items.1.text'),
  },
  {
    name: t('testimonials.items.2.name'),
    business: t('testimonials.items.2.business'),
    rating: 5,
    text: t('testimonials.items.2.text'),
  },
];

const getFAQs = (t: any) =>
  t('faq.items', { returnObjects: true }) as Array<{
    question: string;
    answer: string;
  }>;

function TiltCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { cardRef, handleMouseMove, handleMouseLeave } = useTilt(6);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`tilt-card relative overflow-hidden rounded-xl ${className}`}
    >
      <div className="tilt-highlight" />
      <div className="card-content relative z-10">{children}</div>
    </div>
  );
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const { t, i18n } = useTranslation();

  const revealRef = useScrollReveal(0.12);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const handleScroll = useCallback(() => {
    setShowBackToTop(window.scrollY > 600);
    setHeaderScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const services = getServices(t);
  const advantages = getAdvantages(t);
  const testimonials = getTestimonials(t);
  const faqs = getFAQs(t);

  return (
    <div className="min-h-screen bg-white" ref={revealRef}>
      {/* Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          headerScrolled
            ? 'glass shadow-depth'
            : 'bg-white shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img
                src="/Geekonsite1.jpg"
                alt="GeekOnSite Solutions"
                className="h-12 w-auto"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              <button
                onClick={() => scrollToSection('services')}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                {t('nav.services')}
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                {t('nav.faq')}
              </button>
              <button
                onClick={() => scrollToSection('testimonials')}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                {t('nav.reviews')}
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                {t('nav.contact')}
              </button>
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-gray-600 font-medium"
              >
                <Globe className="h-5 w-5" />
                <span>{i18n.language === 'en' ? 'FR' : 'EN'}</span>
              </button>
            </nav>

            {/* Mobile menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-4">
                <button
                  onClick={() => scrollToSection('services')}
                  className="text-left text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  {t('nav.services')}
                </button>
                <button
                  onClick={() => scrollToSection('faq')}
                  className="text-left text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  {t('nav.faq')}
                </button>
                <button
                  onClick={() => scrollToSection('testimonials')}
                  className="text-left text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  {t('nav.reviews')}
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-left text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  {t('nav.contact')}
                </button>
                <button
                  onClick={toggleLanguage}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-gray-600 font-medium"
                >
                  <Globe className="h-5 w-5" />
                  <span>{i18n.language === 'en' ? 'Français' : 'English'}</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image with Pan/Zoom */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat hero-bg-pan"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)',
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50" />

        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-shape w-32 h-32 border-2 border-blue-400 top-[15%] left-[10%]" />
          <div className="floating-shape w-20 h-20 border-2 border-white top-[60%] right-[15%]" />
          <div className="floating-shape w-24 h-24 border-2 border-blue-300 bottom-[20%] left-[60%]" />
          <div className="floating-shape w-16 h-16 border-2 border-blue-500 top-[30%] right-[40%]" />
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              {t('hero.mainTitle')}
              <span className="block text-blue-300">{t('hero.mainTitleHighlight')}</span>
            </h1>
            <p className="text-lg text-gray-200 mb-2 max-w-3xl mx-auto drop-shadow-md">
              {t('hero.serviceArea')}
            </p>
            <p className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto drop-shadow-md">
              {t('hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:info@geekonsite.ca"
                className="shimmer-btn glow-btn bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg inline-block"
              >
                {t('hero.cta')}
              </a>
            </div>
          </div>

          {/* Stats with Floating Animation */}
          <div className="relative z-10 mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-float">
              <div className="flex items-center justify-center mb-4 bg-white bg-opacity-15 backdrop-blur-md rounded-full w-20 h-20 mx-auto border border-white border-opacity-20">
                <Clock className="h-12 w-12 text-blue-300" />
              </div>
              <div className="text-3xl font-bold text-white drop-shadow-lg">
                {t('hero.statValues.emergency')}
              </div>
              <div className="text-gray-200">{t('hero.stats.emergency')}</div>
            </div>
            <div className="text-center animate-float-delay-1">
              <div className="flex items-center justify-center mb-4 bg-white bg-opacity-15 backdrop-blur-md rounded-full w-20 h-20 mx-auto border border-white border-opacity-20">
                <Users className="h-12 w-12 text-blue-300" />
              </div>
              <div className="text-3xl font-bold text-white drop-shadow-lg">
                {t('hero.statValues.customers')}
              </div>
              <div className="text-gray-200">{t('hero.stats.customers')}</div>
            </div>
            <div className="text-center animate-float-delay-2">
              <div className="flex items-center justify-center mb-4 bg-white bg-opacity-15 backdrop-blur-md rounded-full w-20 h-20 mx-auto border border-white border-opacity-20">
                <Award className="h-12 w-12 text-blue-300" />
              </div>
              <div className="text-3xl font-bold text-white drop-shadow-lg">
                {t('hero.statValues.experience')}
              </div>
              <div className="text-gray-200">{t('hero.stats.experience')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('services.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal-stagger">
            {services.map((service, index) => (
              <TiltCard
                key={index}
                className="bg-white p-6 shadow-depth card-highlight border border-gray-100 group"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-lg mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-20 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-200 rounded-full opacity-15 translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 reveal fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('advantages.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('advantages.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal-stagger">
            {advantages.map((advantage, index) => (
              <TiltCard
                key={index}
                className="bg-white p-6 shadow-depth card-highlight border border-gray-100 group"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-lg mb-4 mx-auto transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                  {advantage.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  {advantage.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {advantage.description}
                </p>
              </TiltCard>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12 reveal scale-up">
            <div className="glass-dark text-white px-8 py-6 rounded-xl shadow-depth inline-block">
              <h3 className="text-2xl font-bold mb-2">{t('cta.ready')}</h3>
              <p className="text-blue-200 mb-4">{t('cta.contact')}</p>
              <a
                href="mailto:info@geekonsite.ca"
                className="shimmer-btn inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                {t('cta.button')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('faq.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('faq.subtitle')}
            </p>
          </div>

          <FAQSection faqs={faqs} />
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('testimonials.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('testimonials.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal-stagger">
            {testimonials.map((testimonial, index) => (
              <TiltCard
                key={index}
                className="bg-white p-6 shadow-depth card-highlight border border-gray-100 group"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 relative">
                  <span className="absolute -top-2 -left-2 text-5xl text-blue-100 font-serif leading-none select-none">
                    &ldquo;
                  </span>
                  <span className="relative z-10 pl-4">{testimonial.text}</span>
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.business}
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-50 rounded-full opacity-40" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-100 rounded-full opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 reveal fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('contact.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="text-center reveal scale-up">
            <a
              href="mailto:info@geekonsite.ca"
              className="shimmer-btn glow-btn inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg text-lg"
            >
              {t('contact.button')}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 footer-gradient-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="mb-4">
                <img
                  src="/Geekonsite1.jpg"
                  alt="GeekOnSite Solutions"
                  className="h-12 w-auto"
                />
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                {t('footer.description')}
              </p>
              <div className="text-sm text-gray-500">
                {t('footer.copyright')}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {t('footer.services')}
              </h4>
              <ul className="space-y-2 text-gray-400">
                {t('footer.serviceLinks', { returnObjects: true }).map(
                  (link: string, idx: number) => (
                    <li key={idx}>{link}</li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {t('footer.contact')}
              </h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>info@geekonsite.ca</li>
                {t('footer.contactItems', { returnObjects: true }).map(
                  (item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  )
                )}
                <li className="pt-2 border-t border-gray-700 mt-2">
                  <span className="font-semibold">
                    {t('footer.serviceArea')}
                  </span>
                  <br />
                  {t('footer.serviceAreaText')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`back-to-top fixed bottom-8 right-8 z-50 bg-blue-600 text-white w-12 h-12 rounded-full shadow-depth flex items-center justify-center hover:bg-blue-700 transition-colors duration-200 ${
          showBackToTop ? 'visible' : ''
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
}

export default App;
