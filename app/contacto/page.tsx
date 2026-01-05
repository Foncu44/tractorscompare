import type { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with TractorsCompare. Contact us for questions, suggestions, or feedback about our tractor database and comparison tools.',
};

export const dynamic = 'force-static';

export default function ContactoPage() {
  return (
    <div className="container-custom py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <p className="text-lg text-gray-600 mb-8">
          We'd love to hear from you! Whether you have questions, suggestions, or feedback about our tractor database and comparison tools, we're here to help.
        </p>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
          <p className="text-gray-700 mb-6">
            If you have any questions about our tractor database, need assistance finding specific information, or want to report an issue, please don't hesitate to reach out to us.
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">General Inquiries</h3>
              <p className="text-gray-600">
                For general questions about TractorsCompare, our database, or how to use our comparison tools, please contact us through the form below or send us an email.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Data Corrections</h3>
              <p className="text-gray-600">
                If you notice any incorrect information in our tractor database, please let us know. We strive to maintain accurate and up-to-date specifications and appreciate your help in keeping our data reliable.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Partnership Opportunities</h3>
              <p className="text-gray-600">
                Interested in partnering with TractorsCompare? We're always open to collaborations that can help improve our platform and provide better value to our users.
              </p>
            </div>
          </div>
        </div>

        <ContactForm />

        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2">Response Time</h3>
          <p className="text-gray-600">
            We typically respond to inquiries within 2-3 business days. For urgent matters, please indicate this in your message subject line.
          </p>
        </div>
      </div>
    </div>
  );
}

