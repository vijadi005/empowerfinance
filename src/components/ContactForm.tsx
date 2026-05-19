'use client';

import { FormEvent, useState } from 'react';
import { contactFormContent as defaultContactFormContent } from '@/lib/site-data';

type FormState = {
  name: string;
  email: string;
  phone: string;
  purpose: string;
  message: string;
};

const initialFormState: FormState = {
  name: '',
  email: '',
  phone: '',
  purpose: '',
  message: '',
};

function normalizeOptions(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string' && Boolean(item.trim()));
  }

  if (typeof value === 'string') {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

async function readResponseMessage(response: Response, fallback: string) {
  const text = await response.text();

  if (!text) {
    return fallback;
  }

  try {
    const data = JSON.parse(text) as { error?: string };
    return data.error || fallback;
  } catch {
    return fallback;
  }
}

export function ContactForm({ content = defaultContactFormContent }: { content?: typeof defaultContactFormContent }) {
  const [form, setForm] = useState(initialFormState);
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const financeNeeds = normalizeOptions(content.financeNeeds);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(await readResponseMessage(response, content.error));
      }

      setForm(initialFormState);
      setStatus(content.success);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : content.error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="custom-contact-form" onSubmit={handleSubmit}>
      <div className="contact-form-header">
        <span>{content.eyebrow}</span>
        <h2>{content.title}</h2>
      </div>
      <label>
        {content.labels.name}
        <input
          name="name"
          value={form.name}
          onChange={(event) => updateField('name', event.target.value)}
          placeholder={content.placeholders.name}
          required
        />
      </label>
      <label>
        {content.labels.email}
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
          placeholder={content.placeholders.email}
          required
        />
      </label>
      <label>
        {content.labels.phone}
        <input
          name="phone"
          type="tel"
          value={form.phone}
          onChange={(event) => updateField('phone', event.target.value)}
          placeholder={content.placeholders.phone}
          required
        />
      </label>
      <label>
        {content.labels.purpose}
        <select
          name="purpose"
          value={form.purpose}
          onChange={(event) => updateField('purpose', event.target.value)}
          required
        >
          <option value="" disabled>
            {content.placeholders.purpose}
          </option>
          {financeNeeds.map((need) => (
            <option key={need}>{need}</option>
          ))}
        </select>
      </label>
      <label className="full-span">
        {content.labels.message}
        <textarea
          name="message"
          value={form.message}
          onChange={(event) => updateField('message', event.target.value)}
          placeholder={content.placeholders.message}
          rows={5}
          required
        />
      </label>
      <div className="contact-form-actions">
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? content.sending : content.submit}
        </button>
        {status ? (
          <p className="contact-form-status" role="status">
            {status}
          </p>
        ) : null}
      </div>
    </form>
  );
}
