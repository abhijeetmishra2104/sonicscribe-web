'use client';

import ContactForm from './ui/contact-form'; // Adjust this path if needed
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

export default function Contact() {
  return (
    <section className="min-h-screen w-full font-inter bg-black text-white flex items-center justify-center px-4 py-4">
      <div className="px-4 md:px-16 lg:px-32 py-10 w-full">
        <div className="flex flex-col md:flex-row gap-10 justify-between items-stretch">
          
          {/* Contact Form */}
          <div className="flex-1 glow-box p-8 rounded-2xl">
            <ContactForm />
          </div>

          {/* FAQ Section */}
          <div className="flex-1 faq-box p-8 rounded-2xl transition-all duration-300">
            <h2 className="text-2xl font-semibold text-[#64ffda] mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left text-white">
                  How can I contact you?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-300">
                  You can use the contact form on the left or email me directly at support@sonicscript.ai.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left text-white">
                  Do you offer support?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-300">
                  Yes, we're available Monday–Friday for any questions you have.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left text-white">
                  Can I schedule a demo?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-300">
                  Absolutely. Reach out via the form and we’ll get back to you with available slots.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left text-white">
                  How can I contact you?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-300">
                  You can use the contact form on the left or email me directly at support@sonicscript.ai.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left text-white">
                  Do you offer support?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-300">
                  Yes, we're available Monday–Friday for any questions you have.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left text-white">
                  Can I schedule a demo?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-300">
                  Absolutely. Reach out via the form and we’ll get back to you with available slots.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
