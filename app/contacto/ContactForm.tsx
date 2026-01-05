'use client';

import { useState, FormEvent } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Opción 1: Intentar usar la API route si está disponible (desarrollo)
      // Opción 2: Usar Formspree para producción estática
      const formspreeEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
      
      if (formspreeEndpoint) {
        // Usar Formspree para sitios estáticos
        const response = await fetch(formspreeEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            _to: 'contact@tractorscompare.com',
          }),
        });

        if (response.ok) {
          setSubmitStatus({
            type: 'success',
            message: 'Mensaje enviado exitosamente. Te responderemos pronto.',
          });
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
          });
        } else {
          throw new Error('Error al enviar el mensaje');
        }
      } else {
        // Fallback: Intentar API route (solo funciona en desarrollo con servidor)
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          setSubmitStatus({
            type: 'success',
            message: data.message || 'Mensaje enviado exitosamente. Te responderemos pronto.',
          });
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
          });
        } else {
          throw new Error(data.error || 'Error al enviar el mensaje');
        }
      }
    } catch (error) {
      // Si falla todo, mostrar opción de mailto
      setSubmitStatus({
        type: 'error',
        message: 'Error al enviar el mensaje. Por favor, envía un correo directamente a contact@tractorscompare.com o intenta de nuevo más tarde.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-4">Contact Form</h2>
      <p className="text-gray-600 mb-6">
        Fill out the form below and we'll get back to you as soon as possible.
      </p>

      {submitStatus.type && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            submitStatus.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <p className="font-medium">{submitStatus.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
            disabled={isSubmitting}
          ></textarea>
        </div>

        <button
          type="submit"
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Send Message'}
        </button>
      </form>

      <div className="mt-4 text-sm text-gray-500">
        <p>
          O envía un correo directamente a:{' '}
          <a
            href="mailto:contact@tractorscompare.com"
            className="text-primary-600 hover:underline"
          >
            contact@tractorscompare.com
          </a>
        </p>
      </div>
    </div>
  );
}

