import { type FormEvent, useState } from 'react';
import { createRoute, Link } from '@tanstack/react-router';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/shared/FormField';
import { Input } from '@/components/ui/input';
import { StaticContentPage } from '@/components/shared/StaticContentPage';
import { Textarea } from '@/components/ui/textarea';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Route as RootRoute } from './__root';

// Placeholder inbox (.example.com is the IANA-reserved placeholder TLD).
const SUPPORT_EMAIL = 'support@servicehub.example.com';

interface FaqEntry {
  question: string;
  answer: string;
}

const FAQ_CATEGORIES: { title: string; entries: FaqEntry[] }[] = [
  {
    title: 'Booking & Scheduling',
    entries: [
      {
        question: 'How do I book a service?',
        answer:
          "Browse a category or search for what you need, add it to your cart, then choose your address and a preferred date and time slot at checkout. You'll get a confirmation as soon as payment goes through.",
      },
      {
        question: 'Can I reschedule a booking after confirming it?',
        answer:
          "Rescheduling isn't self-serve in the app yet. Contact support with your order number and we'll help you find a new slot, subject to the professional's availability.",
      },
      {
        question: "What if none of the available time slots work for me?",
        answer: 'Pick the closest available slot at checkout — professionals will reach out directly if the timing needs to shift slightly.',
      },
    ],
  },
  {
    title: 'Payments & Refunds',
    entries: [
      {
        question: 'What payment methods are accepted?',
        answer: 'All bookings are paid securely through Razorpay at checkout, which supports UPI, cards, net banking, and wallets.',
      },
      {
        question: 'When am I charged for a booking?',
        answer: "Payment is collected when you place the booking, not after the service is completed.",
      },
      {
        question: 'How do refunds work if I cancel a booking?',
        answer: 'It depends on how far along the booking is when you cancel — see our Cancellation & Refunds policy for the full breakdown.',
      },
    ],
  },
  {
    title: 'Account & Profile',
    entries: [
      {
        question: 'How do I update my profile details?',
        answer:
          "Go to My Account > Profile to update your name and email. Your phone number can't be changed from the app yet — contact support if it needs to change.",
      },
      {
        question: 'I forgot my password. How do I reset it?',
        answer: 'Use "Forgot password" on the login page — we\'ll email you a reset link.',
      },
      {
        question: 'Can I save multiple addresses?',
        answer: 'Yes. Add and manage as many addresses as you like from My Account > Addresses, and mark one as your default for faster checkout.',
      },
    ],
  },
  {
    title: 'Service Quality',
    entries: [
      {
        question: 'How are professionals vetted?',
        answer: 'Every professional completes identity verification before their first booking, with additional checks depending on the service category.',
      },
      {
        question: "What if I'm not happy with a service?",
        answer:
          "Rate your booking once it's completed — consistently low ratings are reviewed on our end. For anything urgent, contact support directly with your order number.",
      },
      {
        question: 'Are professionals insured?',
        answer: 'Coverage varies by category and professional — check the service listing or ask your assigned professional for specifics.',
      },
    ],
  },
];

function ContactSupportForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const subject = `Support request from ${name || 'a ServiceHub customer'}`;
    const body = `${message}\n\n— ${name}${email ? ` (${email})` : ''}`;
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Name" htmlFor="support-name">
          <Input id="support-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </FormField>
        <FormField label="Email" htmlFor="support-email">
          <Input id="support-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </FormField>
      </div>
      <FormField label="How can we help?" htmlFor="support-message">
        <Textarea id="support-message" value={message} onChange={(e) => setMessage(e.target.value)} required rows={4} />
      </FormField>
      <p className="text-xs text-ink-muted">
        {/* No support-ticket backend exists yet — this opens your email client with the message pre-filled. */}
        Submitting opens your email app with this message ready to send to our support team.
      </p>
      <Button type="submit" className="self-start">
        Send message
      </Button>
    </form>
  );
}

function HelpPage() {
  useDocumentTitle('Help & Support', 'Answers to common questions about booking, payments, your account, and service quality on ServiceHub.');

  return (
    <StaticContentPage
      eyebrow="Support"
      title="Help & Support"
      description="Answers to the questions we hear most. Can't find what you're looking for? Reach out below."
    >
      <div className="flex flex-col gap-10">
        {FAQ_CATEGORIES.map((category) => (
          <section key={category.title}>
            <h2 className="text-lg font-semibold text-ink-primary">{category.title}</h2>
            <Accordion type="single" collapsible className="mt-2">
              {category.entries.map((entry) => (
                <AccordionItem key={entry.question} value={entry.question}>
                  <AccordionTrigger className="text-sm text-ink-primary">{entry.question}</AccordionTrigger>
                  <AccordionContent className="text-sm text-ink-secondary">{entry.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-card border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-ink-primary">Still need help?</h2>
        <p className="mt-1 text-sm text-ink-secondary">
          Send us a message and we'll get back to you, or email us directly at{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-ink-link hover:underline">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
        <div className="mt-4">
          <ContactSupportForm />
        </div>
      </div>

      <p className="mt-6 text-sm text-ink-secondary">
        Questions about cancelling a booking? See our{' '}
        <Link to="/cancellation-refunds" className="font-medium text-ink-link hover:underline">
          Cancellation & Refunds policy
        </Link>
        .
      </p>
    </StaticContentPage>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/help',
  component: HelpPage,
});
