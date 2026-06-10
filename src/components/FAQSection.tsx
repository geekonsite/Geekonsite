import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openItems.includes(index);
        return (
          <div
            key={index}
            className={`bg-white border border-gray-200 rounded-lg shadow-depth card-highlight transition-all duration-300 ${
              isOpen ? 'shadow-depth-hover' : 'hover:shadow-depth-hover'
            }`}
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 rounded-lg group"
            >
              <div className="flex items-center">
                <HelpCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
              </div>
              <div className="flex-shrink-0 ml-4">
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            <div className={`faq-content ${isOpen ? 'open' : ''}`}>
              <div className="px-6 pb-4">
                <div className="pl-8 pr-4">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
