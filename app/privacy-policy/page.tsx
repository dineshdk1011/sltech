import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for SL Laundry Tech services and customer information handling.',
  alternates: {
    canonical: 'https://sllaundrytech.com/privacy-policy',
  },
};

const PrivacyPolicyPage = () => {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 text-slate-700">
      <h1 className="text-gradient-brand text-3xl font-extrabold md:text-4xl">Privacy Policy</h1>
      <div className="mt-6 space-y-4 text-base leading-8">
        <p>
          SL Laundry Tech values the privacy of our customers and business contacts. We
          collect information only to respond to service enquiries, provide support, and
          maintain communication about laundry equipment solutions.
        </p>
        <p>
          The information we may collect includes your name, contact details, company name,
          service requirements, and relevant location information required for local support.
        </p>
        <p>
          We use this information to process enquiries, schedule service requests, provide
          maintenance support, and improve the experience we offer to commercial customers.
        </p>
        <p>
          We do not sell or rent personal information to third parties. Information may be
          shared only with trusted service partners when required to deliver support or fulfil
          a requested service request.
        </p>
        <p>
          By using our website or contacting us, you agree to the terms described here. We may
          update this page as our business practices evolve.
        </p>
      </div>
    </main>
  );
};

export default PrivacyPolicyPage;
