import type { LucideIcon } from 'lucide-react';
import {
  BadgeCheckIcon,
  Building2Icon,
  CalendarCheckIcon,
  ComponentIcon,
  FactoryIcon,
  FaceGrinningIcon,
  GraduationCapIcon,
  HandshakeIcon,
  HeartPulseIcon,
  HotelIcon,
  HousePlusIcon,
  MapPinnedIcon,
  MapPinHouseIcon,
  PackageCheckIcon,
  SettingsIcon,
  ShieldPlusIcon,
  ShoppingBagIcon,
  SirenIcon,
  StethoscopeIcon,
  StoreIcon,
  ToolCaseIcon,
  TruckIcon,
  UtensilsCrossedIcon,
  WrenchIcon,
} from 'lucide-react';

export type StatItem = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export const stats: StatItem[] = [
  { value: '3+', label: 'Years Experience', icon: ShieldPlusIcon },
  { value: '50+', label: 'Happy Clients', icon: FaceGrinningIcon },
  { value: '100+', label: 'Machines Serviced', icon: WrenchIcon },
  { value: 'Tamil Nadu & Kerala', label: 'Service Network', icon: MapPinnedIcon },
];

export type ServiceItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const services: ServiceItem[] = [
  {
    title: 'Installation',
    description: 'Expert installation with complete setup support.',
    icon: HousePlusIcon,
  },
  {
    title: 'Preventive Maintenance',
    description: 'Regular maintenance to reduce downtime and increase life.',
    icon: ToolCaseIcon,
  },
  {
    title: 'Breakdown Support',
    description: 'Quick response for breakdowns across India.',
    icon: SirenIcon,
  },
  {
    title: 'AMC',
    description: 'Annual Maintenance Contracts tailored to your needs.',
    icon: CalendarCheckIcon,
  },
  {
    title: 'Spare Parts',
    description: 'Genuine spare parts for all major brands.',
    icon: ComponentIcon,
  },
  {
    title: 'Machine Relocation',
    description: 'Safe dismantling and relocation services anywhere in India.',
    icon: MapPinHouseIcon,
  },
];

export type IndustryItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const industries: IndustryItem[] = [
  {
    title: 'Hotels & Resorts',
    description:
      'Heavy-duty washers, dryers and ironing equipment built to run long shifts without downtime.',
    icon: HotelIcon,
  },
  {
    title: 'Hospitals & Clinics',
    description:
      'Hygiene-critical linen systems requiring sterilisation-capable cycles and dependable sanitisation.',
    icon: StethoscopeIcon,
  },
  {
    title: 'Laundromats & Dry Cleaners',
    description:
      'High-throughput machines sized to clear daily commercial volumes without queue backlogs.',
    icon: StoreIcon,
  },
  {
    title: 'Restaurants & Cafes',
    description:
      'Table linen, kitchen cloths and uniforms kept clean and presentable through peak service hours.',
    icon: UtensilsCrossedIcon,
  },
  {
    title: 'Hostels & Educational Institutions',
    description:
      'Uniform and bedding management for large student populations on tight daily schedules.',
    icon: GraduationCapIcon,
  },
  {
    title: 'Retail & Apparel Stores',
    description:
      'Garment care and stock cleaning using equipment that protects delicate fabrics.',
    icon: ShoppingBagIcon,
  },
  {
    title: 'Fitness Centres & Spas',
    description:
      'Towel, linen and uniform servicing with washers built for frequent heavy cycles.',
    icon: HeartPulseIcon,
  },
  {
    title: 'Industrial & Manufacturing',
    description:
      'Specialised cleaning systems for workwear, wiping cloths and production-line laundry.',
    icon: FactoryIcon,
  },
  {
    title: 'Apartments & Gated Communities',
    description:
      'Shared laundry room systems serviced on contract for builders and facility managers.',
    icon: Building2Icon,
  },
];

export type ProcessStep = {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const processSteps: ProcessStep[] = [
  {
    step: '01',
    title: 'Enquiry & Site Visit',
    description:
      'Share your machine details or book a visit. We assess the location, load volume and existing setup to recommend the right capacity.',
    icon: HandshakeIcon,
  },
  {
    step: '02',
    title: 'Quotation & Planning',
    description:
      'You receive a transparent, itemised quotation covering machines, installation, accessories and AMC options, with no hidden costs.',
    icon: BadgeCheckIcon,
  },
  {
    step: '03',
    title: 'Delivery & Installation',
    description:
      'Our team delivers, positions, levels and connects your equipment, then runs a full test cycle before handover.',
    icon: TruckIcon,
  },
  {
    step: '04',
    title: 'Testing & Training',
    description:
      'We verify water, power and drainage, then train your operators on correct loading, dosing and daily care to protect machine life.',
    icon: SettingsIcon,
  },
  {
    step: '05',
    title: 'Ongoing Service & Support',
    description:
      'From breakdown response to scheduled preventive maintenance and genuine spare parts, we keep your laundry running all year round.',
    icon: WrenchIcon,
  },
];

export type WhyItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const whyChooseUs: WhyItem[] = [
  {
    title: 'Trained Service Engineers',
    description:
      'Our technicians are trained on commercial-grade equipment and follow manufacturer-recommended service procedures.',
    icon: BadgeCheckIcon,
  },
  {
    title: 'Genuine Spare Parts',
    description:
      'We source authentic, specification-correct parts so your machines perform as designed and last longer.',
    icon: PackageCheckIcon,
  },
  {
    title: 'Fast Breakdown Response',
    description:
      'When equipment stops, every hour costs you. We prioritise urgent calls and work to restore your operation quickly.',
    icon: SirenIcon,
  },
  {
    title: 'Flexible AMC Plans',
    description:
      'Annual maintenance contracts scaled to your machine count and usage, from single units to multi-site operations.',
    icon: CalendarCheckIcon,
  },
  {
    title: 'All Major Brands Served',
    description:
      'From authorised dealer units to connected and converted machines, we service the leading commercial laundry brands.',
    icon: ShieldPlusIcon,
  },
  {
    title: 'Pan-India Reach',
    description:
      'Based in Tamil Nadu and serving Kerala and beyond, with relocation support anywhere across India.',
    icon: MapPinnedIcon,
  },
];

export type ServiceArea = {
  state: string;
  cities: string[];
};

export const serviceAreas: ServiceArea[] = [
  {
    state: 'Tamil Nadu',
    cities: [
      'Chennai',
      'Coimbatore',
      'Madurai',
      'Trichy',
      'Salem',
      'Tiruppur',
      'Erode',
      'Vellore',
      'Thanjavur',
      'Tirunelveli',
      'Dindigul',
      'Thoothukudi',
      'Hosur',
      'Kumbakonam',
      'Pudukkottai',
      'Karur',
      'Namakkal',
    ],
  },
  {
    state: 'Kerala',
    cities: [
      'Kochi',
      'Ernakulam',
      'Thrissur',
      'Kozhikode',
      'Malappuram',
      'Kannur',
      'Kasaragod',
      'Alappuzha',
      'Palakkad',
      'Kollam',
      'Idukki',
      'Pathanamthitta',
    ],
  },
];

export type FaqItem = {
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    question: 'Do you sell commercial laundry machines as well as service them?',
    answer:
      'Yes. We handle new machine sales, installation, commissioning and ongoing service for commercial laundry equipment, along with Annual Maintenance Contracts, spare parts and breakdown support.',
  },
  {
    question: 'Which brands of laundry machines do you work with?',
    answer:
      'We service all leading commercial laundry brands, including authorised dealer machines, connected machines and older converted units. If you have the brand or model number, send it to us and we will confirm support.',
  },
  {
    question: 'Do you offer Annual Maintenance Contracts (AMC)?',
    answer:
      'Yes. AMC plans are tailored to your machine count, usage and risk profile. They typically include scheduled preventive visits, priority breakdown response, labour and genuine spare parts, and we can quote custom plans for multi-site operations.',
  },
  {
    question: 'Which cities do you provide service in?',
    answer:
      'Our primary service network covers Tamil Nadu and Kerala, including Chennai, Coimbatore, Madurai, Tiruppur, Kochi and Thrissur along with surrounding districts. We also take on relocation and installation work across India.',
  },
  {
    question: 'How quickly can you attend a breakdown?',
    answer:
      'Response time depends on your location and the severity of the fault, but breakdown calls are always prioritised. Contact us on WhatsApp or by phone with the machine model and error code so we can dispatch an engineer carrying the right parts.',
  },
  {
    question: 'Do you supply genuine spare parts?',
    answer:
      'Yes. We supply specification-correct, genuine parts for major brands rather than unbranded alternatives, which protects your machine warranty and extends equipment life.',
  },
  {
    question: 'Do you handle machine relocation?',
    answer:
      'Yes. We safely dismantle, transport and recommission commercial laundry machines anywhere in India, including reinstalling and reconnecting them at the new site.',
  },
  {
    question: 'What should I look for when buying a commercial laundry machine?',
    answer:
      'Match capacity to your daily load, compare cycle time and energy consumption, and confirm the machine suits your floor space, power supply and drainage. Our team can assess your site and recommend the right configuration.',
  },
];