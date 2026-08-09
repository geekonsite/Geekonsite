import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Monitor,
  Smartphone,
  Laptop,
  HardDrive,
  Shield,
  Zap,
  Menu,
  X,
  Clock,
  Users,
  Award,
  ShieldCheck,
  DollarSign,
  Smile,
  MapPin,
  Lock,
  Globe,
  ArrowUp,
  Clock as ClockIcon,
  Mail,
  GraduationCap,
  FileText,
  Heart,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { FAQSection } from './components/FAQSection';
import { Carousel3D } from './components/Carousel3D';
import { FlipCard } from './components/FlipCard';
import { MagneticButton } from './components/MagneticButton';
import { useScrollReveal } from './hooks/useScrollReveal';
import { useParallax } from './hooks/useParallax';

const getServices = (t: any) => [
  {
    icon: <Monitor className="h-10 w-10" />,
    title: t('services.items.0.title'),
    description: t('services.items.0.description'),
    backContent: t('services.items.0.description') + ' Same-day service available for most desktop issues.',
  },
  {
    icon: <Laptop className="h-10 w-10" />,
    title: t('services.items.1.title'),
    description: t('services.items.1.description'),
    backContent: 'Screen replacements, keyboard fixes, and battery swaps completed within 24-48 hours.',
  },
  {
    icon: <Smartphone className="h-10 w-10" />,
    title: t('services.items.2.title'),
    description: t('services.items.2.description'),
    backContent: 'Quick repairs for iPhones, Androids, and tablets with quality parts.',
  },
  {
    icon: <HardDrive className="h-10 w-10" />,
    title: t('services.items.3.title'),
    description: t('services.items.3.description'),
    backContent: 'Professional recovery from HDDs, SSDs, USB drives, and memory cards.',
  },
  {
    icon: <Shield className="h-10 w-10" />,
    title: t('services.items.4.title'),
    description: t('services.items.4.description'),
    backContent: 'Complete virus, malware, and ransomware removal with security setup.',
  },
  {
    icon: <Zap className="h-10 w-10" />,
    title: t('services.items.5.title'),
    description: t('services.items.5.description'),
    backContent: 'SSD upgrades, RAM expansion, and system tune-ups for maximum speed.',
  },
];

const getAdvantages = (t: any) => [
  {
    icon: <ShieldCheck className="h-8 w-8" />,
    title: t('advantages.items.0.title'),
    description: t('advantages.items.0.description'),
  },
  {
    icon: <Zap className="h-8 w-8" />,
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

// Animated stat counter with 3D effect
function StatCounter({
  value,
  label,
  icon: Icon,
  delay = 0,
}: {
  value: string;
  label: string;
  icon: React.ElementType;
  delay?: number;
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const isCountable = /^\d+[^\d]*$/.test(value);
  const numericValue = isCountable ? parseInt(value.replace(/\D/g, '')) || 0 : 0;
  const suffix = isCountable ? value.replace(/[\d]/g, '') : '';

  useEffect(() => {
    if (hasAnimated) {
      const duration = 2000;
      const steps = 60;
      const stepValue = numericValue / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += stepValue;
        if (current >= numericValue) {
          setCount(numericValue);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }
  }, [hasAnimated, numericValue]);

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const displayValue = numericValue > 0 ? `${count}${suffix}` : value;

  return (
    <div className="text-center group">
      <div className="relative mb-4">
        <div
          className="flex items-center justify-center w-20 h-20 mx-auto rounded-full transition-all duration-500 ease-out group-hover:scale-110"
          style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.2)',
            transform: hasAnimated ? 'translateZ(0)' : 'translateZ(-20px)',
            opacity: hasAnimated ? 1 : 0,
          }}
        >
          <Icon className="h-12 w-12 text-blue-300 transition-transform duration-300 group-hover:rotate-12" />
        </div>
        <div className="absolute -inset-2 rounded-full bg-blue-500/0 group-hover:bg-blue-500/10 transition-all duration-500 blur-xl -z-10" />
      </div>
      <div className="text-3xl font-bold text-white drop-shadow-lg">
        {displayValue}
      </div>
      <div className="text-gray-200">{label}</div>
    </div>
  );
}

// 3D Cube component
function RotatingCube() {
  return (
    <div className="cube-container">
      <div className="cube">
        <div className="cube-face front" />
        <div className="cube-face back" />
        <div className="cube-face right" />
        <div className="cube-face left" />
        <div className="cube-face top" />
        <div className="cube-face bottom" />
      </div>
    </div>
  );
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const { t, i18n } = useTranslation();
  const revealRef = useScrollReveal(0.12);
  const { containerRef: heroRef, parallax } = useParallax(1.5);

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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('submitting');
    try {
      const response = await fetch('https://splitforms.com/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '44d8e329e3c1433ab038fccc937899d0',
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message,
        }),
      });
      if (!response.ok) throw new Error('Submission failed');
      setContactStatus('success');
      setContactForm({ name: '', email: '', message: '' });
      setTimeout(() => setContactStatus('idle'), 5000);
    } catch {
      setContactStatus('error');
      setTimeout(() => setContactStatus('idle'), 5000);
    }
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
          headerScrolled ? 'glass shadow-depth' : 'bg-white shadow-sm'
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
              {['services', 'seniors', 'faq', 'testimonials', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  {t(`nav.${section === 'testimonials' ? 'reviews' : section}`)}
                </button>
              ))}
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
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-4">
                {['services', 'seniors', 'faq', 'testimonials', 'contact'].map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className="text-left text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    {t(`nav.${section === 'testimonials' ? 'reviews' : section}`)}
                  </button>
                ))}
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

      {/* Hero Section with Parallax */}
      <section className="relative py-20 overflow-hidden" ref={heroRef}>
        {/* Background Image with Parallax */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)',
            transform: `translate(${parallax.x * 20}px, ${parallax.y * 20}px) scale(1.1)`,
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50" />

        {/* Floating Geometric Shapes with Parallax */}
        <div
          className="absolute top-[15%] left-[10%] w-32 h-32 border-2 border-blue-400 rounded opacity-10"
          style={{
            transform: `translate(${parallax.x * 40}px, ${parallax.y * 40}px)`,
          }}
        />
        <div
          className="absolute top-[60%] right-[15%] w-20 h-20 border-2 border-white rounded opacity-10"
          style={{
            transform: `translate(${parallax.x * 35}px, ${parallax.y * 35}px)`,
          }}
        />
        <div
          className="absolute bottom-[20%] left-[60%] w-24 h-24 border-2 border-blue-300 rounded opacity-10"
          style={{
            transform: `translate(${parallax.x * 30}px, ${parallax.y * 30}px)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg"
              style={{
                transform: `translate(${parallax.x * 15}px, ${parallax.y * 15}px)`,
              }}
            >
              {t('hero.mainTitle')}
              <span className="block text-blue-300">{t('hero.mainTitleHighlight')}</span>
            </h1>
            <p
              className="text-lg text-gray-200 mb-2 max-w-3xl mx-auto drop-shadow-md"
              style={{
                transform: `translate(${parallax.x * 12}px, ${parallax.y * 12}px)`,
              }}
            >
              {t('hero.serviceArea')}
            </p>
            <p
              className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto drop-shadow-md"
              style={{
                transform: `translate(${parallax.x * 10}px, ${parallax.y * 10}px)`,
              }}
            >
              {t('hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticButton
                href="mailto:info@geekonsite.ca"
                className="bg-blue-600 text-white px-10 py-5 rounded-xl font-semibold text-lg shadow-lg"
              >
                {t('hero.cta')}
              </MagneticButton>
            </div>
          </div>

          {/* Stats with Animation */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCounter
              value="24/7"
              label={t('hero.stats.emergency')}
              icon={Clock}
              delay={200}
            />
            <StatCounter
              value="500+"
              label={t('hero.stats.customers')}
              icon={Users}
              delay={400}
            />
            <StatCounter
              value="15+"
              label={t('hero.stats.experience')}
              icon={Award}
              delay={600}
            />
          </div>
        </div>
      </section>

      {/* Services Section with 3D Flip Cards */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal swing-in-3d">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('services.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal-stagger">
            {services.map((service, index) => (
              <FlipCard
                key={index}
                className="h-72"
                front={
                  <div className="h-full w-full bg-white shadow-depth border border-gray-100 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer">
                    <div className="flex items-center justify-center w-20 h-20 bg-blue-100 text-blue-600 rounded-xl mb-6 transition-all duration-300 hover:rotate-6 hover:scale-105">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-center text-sm">{service.description}</p>
                    <p className="mt-4 text-blue-600 text-xs font-medium">Hover for details</p>
                  </div>
                }
                back={
                  <div className="h-full w-full bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 flex flex-col items-center justify-center text-white cursor-pointer">
                    <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-xl mb-6">
                      {React.cloneElement(service.icon as React.ReactElement, {
                        className: 'h-8 w-8',
                      })}
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-center">{service.title}</h3>
                    <p className="text-sm text-blue-100 text-center mb-6">{service.backContent}</p>
                    <a
                      href="mailto:info@geekonsite.ca"
                      className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors"
                    >
                      Get a Quote
                    </a>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* Seniors Digital Literacy Section */}
      <section id="seniors" className="py-24 bg-gradient-to-br from-teal-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-teal-200 rounded-full filter blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-200 rounded-full filter blur-3xl opacity-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold mb-4">
              <Heart className="h-4 w-4" />
              {t('seniors.title')}
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {t('seniors.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t('seniors.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            {/* Courses Card */}
            <div className="group bg-white rounded-2xl p-8 shadow-[0_8px_30px_-12px_rgba(13,148,136,0.15)] border border-teal-100 transition-all duration-300 hover:shadow-[0_20px_40px_-12px_rgba(13,148,136,0.25)] hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-14 h-14 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{t('seniors.courses.title')}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{t('seniors.courses.description')}</p>
            </div>

            {/* Forms Card */}
            <div className="group bg-white rounded-2xl p-8 shadow-[0_8px_30px_-12px_rgba(13,148,136,0.15)] border border-teal-100 transition-all duration-300 hover:shadow-[0_20px_40px_-12px_rgba(13,148,136,0.25)] hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-14 h-14 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <FileText className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{t('seniors.forms.title')}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{t('seniors.forms.description')}</p>
            </div>
          </div>

          {/* Features */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(t('seniors.features', { returnObjects: true }) as string[]).map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600 bg-white/70 rounded-lg px-3 py-2.5 border border-gray-100">
                  <span className="flex-shrink-0 w-5 h-5 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={() => scrollToSection('contact')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-teal-600/20 hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-600/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              {t('seniors.cta')}
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        {/* Background decorations */}
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

          {/* Service Area Cube */}
          <div className="flex justify-center mb-12 reveal scale-up">
            <div className="flex items-center gap-4 bg-white px-8 py-4 rounded-2xl shadow-depth">
              <RotatingCube />
              <div>
                <p className="font-semibold text-gray-900">{t('footer.serviceArea')}</p>
                <p className="text-blue-600 text-lg">{t('footer.serviceAreaText')}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal-stagger">
            {advantages.map((advantage, index) => (
              <div
                key={index}
                className="group relative overflow-hidden bg-white p-6 shadow-depth border border-gray-100 rounded-xl transition-all duration-300 hover:shadow-[0_20px_40px_-12px_rgba(59,130,246,0.2),0_8px_20px_-8px_rgba(0,0,0,0.1)] hover:-translate-y-1"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-xl mb-4 mx-auto transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                  {advantage.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  {advantage.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {advantage.description}
                </p>
              </div>
            ))}
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

      {/* Testimonials Section with 3D Carousel */}
      <section id="testimonials" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('testimonials.title')}
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {t('testimonials.subtitle')}
            </p>
          </div>

          <Carousel3D items={testimonials} />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
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

          <div className="max-w-4xl mx-auto reveal drop-in-3d">
            <div className="bg-white rounded-2xl shadow-depth border border-gray-100 p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{t('contact.email', 'Email')}</h3>
                      <a
                        href="mailto:info@geekonsite.ca"
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        info@geekonsite.ca
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{t('contact.hours', 'Hours')}</h3>
                      <p className="text-gray-600">{t('contact.hoursText', '24/7 Emergency Support')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{t('contact.area', 'Service Area')}</h3>
                      <p className="text-gray-600">{t('footer.serviceAreaText')}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="flex flex-col justify-center">
                  <div className="text-center md:text-left mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {t('contact.readyTitle', 'Ready to Get Started?')}
                    </h3>
                    <p className="text-gray-600">
                      {t('contact.readyText', 'Fill out the form and we\'ll get back to you within 2 hours.')}
                    </p>
                  </div>

                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('contact.form.name', 'Your Name')}
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder={t('contact.form.namePlaceholder', 'John Doe')}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('contact.form.email', 'Your Email')}
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder={t('contact.form.emailPlaceholder', 'john@example.com')}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('contact.form.message', 'Message')}
                      </label>
                      <textarea
                        id="contact-message"
                        required
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder={t('contact.form.messagePlaceholder', 'Tell us how we can help you...')}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={contactStatus === 'submitting'}
                      className="w-full inline-flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {contactStatus === 'submitting' ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          {t('contact.form.submitting', 'Sending...')}
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          {t('contact.form.submit', 'Send Message')}
                        </>
                      )}
                    </button>

                    {contactStatus === 'success' && (
                      <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 animate-fade-in">
                        <CheckCircle className="h-5 w-5 flex-shrink-0" />
                        <span className="text-sm font-medium">
                          {t('contact.form.success', 'Thank you! Your message has been sent. We\'ll get back to you shortly.')}
                        </span>
                      </div>
                    )}

                    {contactStatus === 'error' && (
                      <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-fade-in">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <span className="text-sm font-medium">
                          {t('contact.form.error', 'Something went wrong. Please try again or email us directly.')}
                        </span>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
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
                  <span className="font-semibold">{t('footer.serviceArea')}</span>
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
