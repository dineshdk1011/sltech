import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for SL Laundry Tech service support and website usage.',
  alternates: {
    canonical: 'https://sllaundrytech.com/terms-conditions',
  },
};

const TermsConditionsPage = () => {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 text-slate-700">
      <h1 className="text-gradient-brand text-3xl font-extrabold md:text-4xl">Terms &amp; Conditions</h1>
      <div className="mt-6 space-y-4 text-base leading-8">
        <p>
          These terms govern the use of SL Laundry Tech services and the information provided
          through our website. By contacting us or requesting a service, you agree to the
          conditions described below.
        </p>
        <p>
          We provide support for commercial laundry equipment services, installation, maintenance,
          repairs, spare parts, and AMC-related solutions based on the scope agreed with the customer.
        </p>
        <p>
          Service availability, response times, pricing, and scope may vary depending on the exact
          requirement, machine condition, site conditions, and service location.
        </p>
        <p>
          SL Laundry Tech is committed to professional support and qualified service execution but
          cannot be held responsible for delays caused by unforeseen site conditions, customer
          equipment issues, or external factors beyond our reasonable control.
        </p>
        <p>
          We reserve the right to update these terms from time to time to reflect business practices
          and service requirements.
        </p>
      </div>
    </main>
  );
};

export default TermsConditionsPage;
