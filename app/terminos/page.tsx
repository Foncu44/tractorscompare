import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of Use for TractorsCompare. Read our terms and conditions for using our tractor database and comparison tools.',
};

export const dynamic = 'force-static';

export default function TerminosPage() {
  return (
    <div className="container-custom py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Terms of Use</h1>
        <p className="text-gray-600 mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
          <p className="text-gray-700 mb-4">
            By accessing and using TractorsCompare ("the Website" or "the Service"), you accept and agree to be bound 
            by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use 
            this service.
          </p>
          <p className="text-gray-700">
            These Terms of Use ("Terms") govern your access to and use of TractorsCompare's website, services, and 
            content. Please read these Terms carefully before using our services.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Use License</h2>
          <p className="text-gray-700 mb-4">
            Permission is granted to temporarily access and use TractorsCompare for personal, non-commercial transitory 
            viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
            <li>Attempt to decompile or reverse engineer any software contained on TractorsCompare</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
          <p className="text-gray-700 mt-4">
            This license shall automatically terminate if you violate any of these restrictions and may be terminated 
            by TractorsCompare at any time.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Disclaimer</h2>
          <p className="text-gray-700 mb-4">
            The materials on TractorsCompare are provided on an 'as is' basis. TractorsCompare makes no warranties, 
            expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, 
            implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement 
            of intellectual property or other violation of rights.
          </p>
          <p className="text-gray-700">
            Further, TractorsCompare does not warrant or make any representations concerning the accuracy, likely results, 
            or reliability of the use of the materials on its website or otherwise relating to such materials or on any 
            sites linked to this site.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Limitations</h2>
          <p className="text-gray-700 mb-4">
            In no event shall TractorsCompare or its suppliers be liable for any damages (including, without limitation, 
            damages for loss of data or profit, or due to business interruption) arising out of the use or inability to 
            use the materials on TractorsCompare, even if TractorsCompare or a TractorsCompare authorized representative 
            has been notified orally or in writing of the possibility of such damage.
          </p>
          <p className="text-gray-700">
            Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for 
            consequential or incidental damages, these limitations may not apply to you.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Accuracy of Materials</h2>
          <p className="text-gray-700 mb-4">
            The materials appearing on TractorsCompare could include technical, typographical, or photographic errors. 
            TractorsCompare does not warrant that any of the materials on its website are accurate, complete, or current. 
            TractorsCompare may make changes to the materials contained on its website at any time without notice.
          </p>
          <p className="text-gray-700">
            All information provided on TractorsCompare is for reference purposes only. Specifications may vary by region, 
            model year, and configuration. Always consult the manufacturer's official specifications and documentation 
            before making purchasing decisions. TractorsCompare is not responsible for any decisions made based on the 
            information provided on this platform.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Links</h2>
          <p className="text-gray-700 mb-4">
            TractorsCompare has not reviewed all of the sites linked to its website and is not responsible for the 
            contents of any such linked site. The inclusion of any link does not imply endorsement by TractorsCompare 
            of the site. Use of any such linked website is at the user's own risk.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Modifications</h2>
          <p className="text-gray-700 mb-4">
            TractorsCompare may revise these Terms of Use for its website at any time without notice. By using this 
            website you are agreeing to be bound by the then current version of these Terms of Use.
          </p>
          <p className="text-gray-700">
            We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time, with or 
            without notice. We may also impose limits on certain features or restrict your access to parts or all of 
            the Service without notice or liability.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">User Conduct</h2>
          <p className="text-gray-700 mb-4">You agree not to:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Use the Service for any unlawful purpose or in violation of any applicable laws</li>
            <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
            <li>Attempt to gain unauthorized access to any portion of the Service</li>
            <li>Transmit any viruses, worms, defects, Trojan horses, or other items of a destructive nature</li>
            <li>Use automated systems (such as robots, spiders, or scrapers) to access the Service without permission</li>
            <li>Reproduce, duplicate, copy, sell, or exploit any portion of the Service without express written permission</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
          <p className="text-gray-700 mb-4">
            The Service and its original content, features, and functionality are and will remain the exclusive property 
            of TractorsCompare and its licensors. The Service is protected by copyright, trademark, and other laws. 
            Our trademarks and trade dress may not be used in connection with any product or service without our prior 
            written consent.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
          <p className="text-gray-700">
            These Terms shall be governed and construed in accordance with applicable laws, without regard to its conflict 
            of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver 
            of those rights.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
          <p className="text-gray-700">
            If you have any questions about these Terms of Use, please contact us through our 
            <a href="/contacto" className="text-primary-600 hover:underline ml-1">Contact Us</a> page.
          </p>
        </div>
      </div>
    </div>
  );
}

