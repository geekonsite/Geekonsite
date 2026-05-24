import React, { useState } from 'react';
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
  Globe
} from 'lucide-react';
import { FAQSection } from './components/FAQSection';

const getServices = (t: any) => [
  {
    icon: <Monitor className="h-8 w-8" />,
    title: t('services.items.0.title'),
    description: t('services.items.0.description')
  },
  {
    icon: <Laptop className="h-8 w-8" />,
    title: t('services.items.1.title'),
    description: t('services.items.1.description')
  },
  {
    icon: <Smartphone className="h-8 w-8" />,
    title: t('services.items.2.title'),
    description: t('services.items.2.description')
  },
  {
    icon: <HardDrive className="h-8 w-8" />,
    title: t('services.items.3.title'),
    description: t('services.items.3.description')
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: t('services.items.4.title'),
    description: t('services.items.4.description')
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: t('services.items.5.title'),
    description: t('services.items.5.description')
  }
];

const getAdvantages = (t: any) => [
  {
    icon: <ShieldCheck className="h-8 w-8" />,
    title: t('advantages.items.0.title'),
    description: t('advantages.items.0.description')
  },
  {
    icon: <FastForward className="h-8 w-8" />,
    title: t('advantages.items.1.title'),
    description: t('advantages.items.1.description')
  },
  {
    icon: <DollarSign className="h-8 w-8" />,
    title: t('advantages.items.2.title'),
    description: t('advantages.items.2.description')
  },
  {
    icon: <MapPin className="h-8 w-8" />,
    title: t('advantages.items.3.title'),
    description: t('advantages.items.3.description')
  },
  {
    icon: <Smile className="h-8 w-8" />,
    title: t('advantages.items.4.title'),
    description: t('advantages.items.4.description')
  },
  {
    icon: <Lock className="h-8 w-8" />,
    title: t('advantages.items.5.title'),
    description: t('advantages.items.5.description')
  }
];

const getTestimonials = (t: any) => [
  {
    name: t('testimonials.items.0.name'),
    business: t('testimonials.items.0.business'),
    rating: 5,
    text: t('testimonials.items.0.text')
  },
  {
    name: t('testimonials.items.1.name'),
    business: t('testimonials.items.1.business'),
    rating: 5,
    text: t('testimonials.items.1.text')
  },
  {
    name: t('testimonials.items.2.name'),
    business: t('testimonials.items.2.business'),
    rating: 5,
    text: t('testimonials.items.2.text')
  }
];

const getFAQs = (t: any) =>
  t('faq.items', { returnObjects: true }) as Array<{question: string; answer: string}>;

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

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

  const services = getServices(t);
  const advantages = getAdvantages(t);
  const testimonials = getTestimonials(t);
  const faqs = getFAQs(t);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
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
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)'
          }}
        />
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        
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
              <button
                onClick={() => scrollToSection('contact')}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg"
              >
                {t('hero.cta')}
              </button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="relative z-10 mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-full w-20 h-20 mx-auto">
                <Clock className="h-12 w-12 text-blue-300" />
              </div>
              <div className="text-3xl font-bold text-white drop-shadow-lg">{t('hero.statValues.emergency')}</div>
              <div className="text-gray-200">{t('hero.stats.emergency')}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-full w-20 h-20 mx-auto">
                <Users className="h-12 w-12 text-blue-300" />
              </div>
              <div className="text-3xl font-bold text-white drop-shadow-lg">{t('hero.statValues.customers')}</div>
              <div className="text-gray-200">{t('hero.stats.customers')}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-full w-20 h-20 mx-auto">
                <Award className="h-12 w-12 text-blue-300" />
              </div>
              <div className="text-3xl font-bold text-white drop-shadow-lg">{t('hero.statValues.experience')}</div>
              <div className="text-gray-200">{t('hero.stats.experience')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('services.title')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-lg mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('advantages.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('advantages.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-lg mb-4 mx-auto">
                  {advantage.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{advantage.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed">{advantage.description}</p>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="bg-blue-600 text-white px-8 py-6 rounded-xl shadow-lg inline-block">
              <h3 className="text-2xl font-bold mb-2">{t('cta.ready')}</h3>
              <p className="text-blue-100 mb-4">{t('cta.contact')}</p>
              <button
                onClick={() => scrollToSection('contact')}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                {t('cta.button')}
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('faq.title')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('faq.subtitle')}
            </p>
          </div>

          <FAQSection faqs={faqs} />

          {/* Still Have Questions CTA */}
          <div className="text-center mt-12">
            <div className="bg-blue-50 rounded-xl p-8 inline-block">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('faq.stillHave')}</h3>
              <p className="text-gray-600 mb-4">
                {t('faq.stillHaveText')}
              </p>
              <button
                onClick={() => scrollToSection('contact')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                {t('faq.contactButton')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('testimonials.title')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('testimonials.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.business}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('contact.title')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center space-x-3 bg-white px-8 py-6 rounded-xl shadow-lg">
              <Mail className="h-8 w-8 text-blue-600" />
              <div className="text-left">
                <a
                  href="mailto:info@geekonsite.ca"
                  className="text-2xl font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
                >
                  info@geekonsite.ca
                </a>
                <div className="text-gray-600">{t('contact.response')}</div>
              </div>
            </div>
            <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">
              {t('contact.emailDescription')}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
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
              <h4 className="text-lg font-semibold mb-4">{t('footer.services')}</h4>
              <ul className="space-y-2 text-gray-400">
                {t('footer.serviceLinks', { returnObjects: true }).map((link: string, idx: number) => (
                  <li key={idx}>{link}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t('footer.contact')}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>info@geekonsite.ca</li>
                {t('footer.contactItems', { returnObjects: true }).map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
                <li className="pt-2 border-t border-gray-700 mt-2">
                  <span className="font-semibold">{t('footer.serviceArea')}</span><br />
                  {t('footer.serviceAreaText')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;