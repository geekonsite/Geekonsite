import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Loader2, CheckCircle, AlertCircle, User, Mail, FileText, MessageSquare } from 'lucide-react';
import { useContactForm } from '../hooks/useContactForm';

interface ContactForm3DProps {
  className?: string;
}

export const ContactForm3D: React.FC<ContactForm3DProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const { isSubmitting, isSuccess, error, submitForm, resetForm } = useContactForm();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (isSuccess) {
    return (
      <div className={`form-3d ${className}`}>
        <div className="form-success-3d bg-white rounded-2xl shadow-depth border border-gray-100 p-10 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {t('contact.successTitle', 'Message Sent!')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('contact.successMessage', 'We\'ll get back to you within 24 hours.')}
          </p>
          <button
            onClick={resetForm}
            className="inline-flex items-center px-5 py-2 text-blue-600 font-medium hover:text-blue-800 transition-colors"
          >
            {t('contact.sendAnother', 'Send another message')}
          </button>
        </div>
      </div>
    );
  }

  const fields = [
    { name: 'name', icon: User, placeholder: t('contact.form.name', 'Your Name'), type: 'text' },
    { name: 'email', icon: Mail, placeholder: t('contact.form.email', 'Your Email'), type: 'email' },
    { name: 'subject', icon: FileText, placeholder: t('contact.form.subject', 'Subject'), type: 'text' },
  ];

  return (
    <div className={`form-3d ${className}`}>
      <div className="form-3d-inner bg-white rounded-2xl shadow-depth border border-gray-100 p-8 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Input fields with 3D depth on focus */}
          <div className="grid md:grid-cols-2 gap-6">
            {fields.slice(0, 2).map(({ name, icon: Icon, placeholder, type }) => (
              <div
                key={name}
                className={`form-field-3d relative bg-gray-50 rounded-xl border-2 transition-all duration-300 ${
                  focusedField === name ? 'border-blue-500 bg-white' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {!formData[name as keyof typeof formData] && (
                  <label
                    htmlFor={name}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex items-center gap-2"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{placeholder}</span>
                  </label>
                )}
                <div className="flex items-center">
                  {formData[name as keyof typeof formData] && (
                    <Icon className="h-5 w-5 text-gray-400 ml-4 flex-shrink-0" />
                  )}
                  <input
                    type={type}
                    id={name}
                    name={name}
                    value={formData[name as keyof typeof formData]}
                    onChange={handleChange}
                    onFocus={() => setFocusedField(name)}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="w-full bg-transparent py-4 px-4 text-gray-900 focus:outline-none rounded-xl"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Subject field */}
          <div
            className={`form-field-3d relative bg-gray-50 rounded-xl border-2 transition-all duration-300 ${
              focusedField === 'subject' ? 'border-blue-500 bg-white' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {!formData.subject && (
              <label
                htmlFor="subject"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex items-center gap-2"
              >
                <FileText className="h-5 w-5" />
                <span>{fields[2].placeholder}</span>
              </label>
            )}
            <div className="flex items-center">
              {formData.subject && (
                <FileText className="h-5 w-5 text-gray-400 ml-4 flex-shrink-0" />
              )}
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onFocus={() => setFocusedField('subject')}
                onBlur={() => setFocusedField(null)}
                required
                className="w-full bg-transparent py-4 px-4 text-gray-900 focus:outline-none rounded-xl"
              />
            </div>
          </div>

          {/* Message textarea */}
          <div
            className={`form-field-3d relative bg-gray-50 rounded-xl border-2 transition-all duration-300 ${
              focusedField === 'message' ? 'border-blue-500 bg-white' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {!formData.message && (
              <label
                htmlFor="message"
                className="absolute left-4 top-4 text-gray-400 pointer-events-none flex items-center gap-2"
              >
                <MessageSquare className="h-5 w-5" />
                <span>{t('contact.form.message', 'Your Message')}</span>
              </label>
            )}
            <div>
              {formData.message && (
                <div className="pt-4 pl-4">
                  <MessageSquare className="h-5 w-5 text-gray-400 inline-block" />
                </div>
              )}
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                required
                rows={5}
                className="w-full bg-transparent py-3 px-4 text-gray-900 focus:outline-none rounded-xl resize-none"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`magnetic-btn w-full bg-blue-600 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{t('contact.sending', 'Sending...')}</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>{t('contact.send', 'Send Message')}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
