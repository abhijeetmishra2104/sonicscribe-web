import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { LampContainer } from './ui/Lamp';

const plans = [
  {
    title: 'Symptom Checker',
    price: '$19',
    frequency: '/mo',
    features: [
      'AI-powered symptom analysis',
      '24/7 virtual assistant',
      'Patient routing optimization',
    ],
    highlight: false,
  },
  {
    title: 'Risk Insights',
    price: '$29',
    frequency: '/mo',
    features: [
      'Predictive analytics dashboard',
      'Readmission risk forecasts',
      'Custom risk score modeling',
    ],
    highlight: false,
  },
  {
    title: 'Clinical Notes AI',
    price: '$39',
    frequency: '/mo',
    features: [
      'Real-time voice-to-note',
      'NLP-driven accuracy',
      'EHR integration support',
    ],
    highlight: false,
  },
  {
    title: 'All-in-One Pro Suite',
    price: '$79',
    frequency: '/mo',
    features: [
      'All SonicScript features in one plan',
      'Priority support & onboarding',
      'Team collaboration tools',
    ],
    highlight: true,
  },
];

export default function PricingSection() {
  return (
    <section className="bg-black text-white px-6 py-16 w-full">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold font-inter text-center text-[#64ffda] mb-6">Simple Pricing, Powerful AI</h2>
        <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12 text-lg">
          Subscribe to the tools that fit your workflow—individually or get everything in one powerful suite.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`rounded-2xl border border-gray-700 bg-[#171717] text-white font-inter shadow-xl flex flex-col justify-between ${plan.highlight ? 'ring-2 ring-[#64ffda]' : ''}`}
            >
              <CardHeader>
                <CardTitle className="text-center text-2xl text-[#64ffda]">{plan.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-6">
                <div className="text-4xl font-bold">
                  {plan.price}
                  <span className="text-base font-normal text-gray-400">{plan.frequency}</span>
                </div>
                <ul className="space-y-3 text-sm text-gray-300 w-full">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#64ffda]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-transparent border border-[#64ffda] text-[#64ffda] hover:bg-[#64ffda] hover:text-black transition-all">
                  {plan.price === 'Contact Us' ? 'Get in Touch' : 'Choose Plan'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
