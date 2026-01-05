import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for TractorsCompare. Learn how we collect, use, and protect your personal information when you use our tractor database and comparison tools.',
};

export const dynamic = 'force-static';

export default function PrivacidadPage() {
  return (
    <div className="container-custom py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Introduction</h2>
          <p className="text-gray-700 mb-4">
            TractorsCompare ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
            explains how we collect, use, disclose, and safeguard your information when you visit our website and 
            use our services.
          </p>
          <p className="text-gray-700">
            By using TractorsCompare, you consent to the data practices described in this policy. If you do not 
            agree with the practices described in this policy, please do not use our services.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-4">Information You Provide</h3>
          <p className="text-gray-700 mb-4">
            We may collect information that you voluntarily provide to us when you:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Contact us through our contact form</li>
            <li>Subscribe to our newsletter or updates</li>
            <li>Participate in surveys or feedback forms</li>
            <li>Interact with our customer support</li>
          </ul>
          <p className="text-gray-700">
            This information may include your name, email address, and any other information you choose to provide.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">Automatically Collected Information</h3>
          <p className="text-gray-700 mb-4">
            When you visit our website, we automatically collect certain information about your device and browsing 
            behavior, including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Pages visited and time spent on pages</li>
            <li>Referring website addresses</li>
            <li>Date and time of visits</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">We use the information we collect to:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Provide, maintain, and improve our services</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Send you updates, newsletters, and promotional materials (with your consent)</li>
            <li>Analyze usage patterns and trends to improve user experience</li>
            <li>Detect, prevent, and address technical issues and security threats</li>
            <li>Comply with legal obligations</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Cookies and Tracking Technologies</h2>
          <p className="text-gray-700 mb-4">
            We use cookies and similar tracking technologies to track activity on our website and store certain 
            information. Cookies are files with a small amount of data that are sent to your browser from a website 
            and stored on your device.
          </p>
          <p className="text-gray-700 mb-4">
            We use cookies for:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Essential website functionality</li>
            <li>Analytics and performance monitoring</li>
            <li>Advertising and personalization (via third-party services like Google AdSense)</li>
          </ul>
          <p className="text-gray-700 mt-4">
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, 
            if you do not accept cookies, you may not be able to use some portions of our website.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
          <p className="text-gray-700 mb-4">
            We may use third-party services that collect, monitor, and analyze information to help us improve our 
            services. These services may include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Google Analytics:</strong> To analyze website traffic and user behavior</li>
            <li><strong>Google AdSense:</strong> To display relevant advertisements</li>
            <li><strong>Other analytics and advertising services:</strong> As needed to support our operations</li>
          </ul>
          <p className="text-gray-700 mt-4">
            These third-party services have their own privacy policies addressing how they use such information. 
            We encourage you to review their privacy policies.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Data Security</h2>
          <p className="text-gray-700">
            We implement appropriate technical and organizational security measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over 
            the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
          <p className="text-gray-700 mb-4">Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>The right to access your personal information</li>
            <li>The right to correct inaccurate information</li>
            <li>The right to request deletion of your information</li>
            <li>The right to object to processing of your information</li>
            <li>The right to data portability</li>
            <li>The right to withdraw consent</li>
          </ul>
          <p className="text-gray-700 mt-4">
            To exercise these rights, please contact us using the information provided in our Contact Us page.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
          <p className="text-gray-700">
            Our services are not intended for children under the age of 13. We do not knowingly collect personal 
            information from children under 13. If you are a parent or guardian and believe your child has provided 
            us with personal information, please contact us immediately.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Changes to This Privacy Policy</h2>
          <p className="text-gray-700">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the 
            new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this 
            Privacy Policy periodically for any changes.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about this Privacy Policy, please contact us through our 
            <a href="/contacto" className="text-primary-600 hover:underline ml-1">Contact Us</a> page.
          </p>
        </div>
      </div>
    </div>
  );
}

