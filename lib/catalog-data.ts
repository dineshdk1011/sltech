export interface MachineCategory {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  badge: string;
  image: string;
  images: [string, string, string, string];
  description: string;
  features: string[];
  capacityRange: string;
  partCount: number;
}

export interface Machine {
  id: string;
  categoryId: string;
  name: string;
  modelCode: string;
  brand: string;
  isAuthorizedDealer: boolean;
  capacityKg: number;
  capacityLabel: string;
  capacityTier: 'compact' | 'medium' | 'heavy' | 'industrial' | 'extra-heavy';
  heatingType: 'Electric' | 'Steam' | 'Gas' | 'Dual Heating' | 'Direct Heat';
  spinSpeed?: string;
  gFactor?: string;
  drumVolume?: string;
  dimensions: string;
  electricalSupply: string;
  availableBranches: string[];
  keyFeatures: string[];
  bestFor: string[];
  warrantyYears: number;
  image: string;
  images: [string, string, string, string];
  inStock: boolean;
  leadTime: string;
  compatiblePartIds: string[];
}

export interface SparePart {
  id: string;
  partNumber: string;
  name: string;
  category: 'Electrical & Inverter' | 'Valves & Piping' | 'Mechanical & Drive' | 'Seals & Gaskets' | 'Heating & Steam' | 'Controls & PCB';
  applicableCategoryIds: string[];
  compatibleBrands: string[];
  compatibleModelsText: string;
  compatibleMachineIds: string[];
  stockStatus: 'In Stock' | 'Fast Dispatch (24h)' | 'Special Order';
  genuineOem: boolean;
  warranty: string;
  priceIndicator: string;
  specifications: Record<string, string>;
  description: string;
  image: string;
  images: [string, string, string, string];
}

export interface Branch {
  id: string;
  name: string;
  shortCity: string;
  state: string;
  address: string;
  phone: string;
  hotline: string;
  isHeadquarters?: boolean;
}

export const BRANCHES: Branch[] = [
  {
    id: 'tiruppur',
    name: 'Tiruppur Headquarters & Technical Center',
    shortCity: 'Tiruppur',
    state: 'Tamil Nadu',
    address: 'Palladam Road, Tiruppur, Tamil Nadu 641652',
    phone: '+91 93616 24107',
    hotline: '+91 81100 12041',
    isHeadquarters: true,
  },
  {
    id: 'coimbatore',
    name: 'Coimbatore Regional Service Hub',
    shortCity: 'Coimbatore',
    state: 'Tamil Nadu',
    address: 'Avinashi Road / Peelamedu, Coimbatore, Tamil Nadu',
    phone: '+91 93616 24107',
    hotline: '+91 81100 12041',
  },
  {
    id: 'chennai',
    name: 'Chennai Metro Support Branch',
    shortCity: 'Chennai',
    state: 'Tamil Nadu',
    address: 'Guindy Industrial Area, Chennai, Tamil Nadu',
    phone: '+91 93616 24107',
    hotline: '+91 81100 12041',
  },
  {
    id: 'madurai',
    name: 'Madurai Southern Service Base',
    shortCity: 'Madurai',
    state: 'Tamil Nadu',
    address: 'Bypass Road, Madurai, Tamil Nadu',
    phone: '+91 93616 24107',
    hotline: '+91 81100 12041',
  },
  {
    id: 'kochi',
    name: 'Kochi & Kerala Operations Hub',
    shortCity: 'Kochi',
    state: 'Kerala',
    address: 'Kalamassery, Ernakulam / Kochi, Kerala',
    phone: '+91 93616 24107',
    hotline: '+91 81100 12041',
  },
  {
    id: 'pan-india',
    name: 'Pan-India Project & Relocation Wing',
    shortCity: 'Pan-India',
    state: 'All India',
    address: 'Nationwide Commissioning & Freight Dispatch',
    phone: '+91 93616 24107',
    hotline: '+91 81100 12041',
  },
];


export const DEFAULT_CATEGORY_IMAGES: Record<string, [string, string, string, string]> = {
  'washer-extractor': [
    '/catalog/washer-extractor.jpg',
    '/catalog/washer-angle.jpg',
    '/catalog/washer-drum.jpg',
    '/catalog/washer-panel.jpg',
  ],
  'tumble-dryer': [
    '/catalog/tumble-dryer.jpg',
    '/catalog/dryer-angle.jpg',
    '/catalog/dryer-drum.jpg',
    '/catalog/dryer-panel.jpg',
  ],
  'flatwork-ironer': [
    '/catalog/flatwork-ironer.jpg',
    '/catalog/ironer-angle.jpg',
    '/catalog/ironer-roller.jpg',
    '/catalog/ironer-controls.jpg',
  ],
  'hydro-extractor': [
    '/catalog/hydro-extractor.jpg',
    '/catalog/hydro-angle.jpg',
    '/catalog/hydro-basket.jpg',
    '/catalog/hydro-controls.jpg',
  ],
  'barrier-washer': [
    '/catalog/barrier-washer.jpg',
    '/catalog/barrier-angle.jpg',
    '/catalog/barrier-clean.jpg',
    '/catalog/barrier-controls.jpg',
  ],
  'steam-press': [
    '/catalog/steam-press.jpg',
    '/catalog/press-angle.jpg',
    '/catalog/press-head.jpg',
    '/catalog/press-controls.jpg',
  ],
};

export const CATEGORY_VIEW_LABELS: Record<string, [string, string, string, string]> = {
  'washer-extractor': ['Front View', '3/4 Perspective', 'Drum & Door', 'Digital Controls'],
  'tumble-dryer': ['Front View', '3/4 Perspective', 'Reversing Drum', 'Airflow & Controls'],
  'flatwork-ironer': ['Front View', '3/4 Perspective', 'Heated Roller', 'Safety & Inverter'],
  'hydro-extractor': ['Front View', '3/4 Perspective', 'Spin Basket', 'Suspension & Brake'],
  'barrier-washer': ['Soiled Side', '3/4 Perspective', 'Cleanroom Door', 'Interlock Controls'],
  'steam-press': ['Front View', '3/4 Perspective', 'Pressing Head', 'Pedals & Boiler'],
};

export const DEFAULT_PART_IMAGES: [string, string, string, string] = [
  '/catalog/spare-parts-kit.jpg',
  '/catalog/part-valve.jpg',
  '/catalog/part-electrical.jpg',
  '/catalog/part-mechanical.jpg',
];

export const PART_VIEW_LABELS: [string, string, string, string] = [
  'Kit Assembly',
  'Valves & Piping',
  'Inverter & Controls',
  'Bearings & Seals',
];

export function getMachineImages(machine: { image: string; images?: string[]; categoryId: string }): [string, string, string, string] {
  if (machine.images && machine.images.length >= 4) {
    return [machine.images[0], machine.images[1], machine.images[2], machine.images[3]];
  }
  const categoryImages = DEFAULT_CATEGORY_IMAGES[machine.categoryId] || DEFAULT_CATEGORY_IMAGES['washer-extractor'];
  return [
    machine.image || categoryImages[0],
    categoryImages[1],
    categoryImages[2],
    categoryImages[3],
  ];
}

export function getMachineViewLabels(categoryId: string): [string, string, string, string] {
  return CATEGORY_VIEW_LABELS[categoryId] || ['Front View', 'Angle View', 'Interior Detail', 'Control Panel'];
}

export function getPartImages(part: { image: string; images?: string[]; category?: string }): [string, string, string, string] {
  if (part.images && part.images.length >= 4) {
    return [part.images[0], part.images[1], part.images[2], part.images[3]];
  }
  if (part.category === 'Electrical & Inverter' || part.category === 'Controls & PCB') {
    return [
      '/catalog/part-electrical.jpg',
      '/catalog/spare-parts-kit.jpg',
      '/catalog/part-valve.jpg',
      '/catalog/part-mechanical.jpg',
    ];
  }
  if (part.category === 'Valves & Piping' || part.category === 'Heating & Steam') {
    return [
      '/catalog/part-valve.jpg',
      '/catalog/spare-parts-kit.jpg',
      '/catalog/part-mechanical.jpg',
      '/catalog/part-electrical.jpg',
    ];
  }
  if (part.category === 'Mechanical & Drive' || part.category === 'Seals & Gaskets') {
    return [
      '/catalog/part-mechanical.jpg',
      '/catalog/spare-parts-kit.jpg',
      '/catalog/part-valve.jpg',
      '/catalog/part-electrical.jpg',
    ];
  }
  return DEFAULT_PART_IMAGES;
}

export const MACHINE_CATEGORIES: MachineCategory[] = [
  {
    id: 'washer-extractor',
    name: 'Commercial Washer Extractors',
    shortName: 'Washer Extractors',
    tagline: 'High-spin, energy-efficient commercial & industrial wash systems',
    badge: 'Most Popular',
    image: '/catalog/washer-extractor.jpg',
    images: [
      "/catalog/washer-extractor.jpg",
      "/catalog/washer-angle.jpg",
      "/catalog/washer-drum.jpg",
      "/catalog/washer-panel.jpg"
    ],
    description: 'Front-loading commercial soft-mount & hard-mount washer extractors engineered for 24/7 continuous laundry operations in hotels, hospitals, and laundromats with up to 450 G-force spin speed.',
    features: ['High spin 350-450 G-Factor reduces drying time by 40%', 'Microprocessor Touchscreen controls with 30+ wash cycles', 'Stainless Steel AISI 304 heavy-duty drum and tub', 'Inverter frequency drive motor for whisper-quiet performance'],
    capacityRange: '11 kg - 120 kg',
    partCount: 14,
  },
  {
    id: 'tumble-dryer',
    name: 'Commercial Tumble Dryers',
    shortName: 'Tumble Dryers',
    tagline: 'Rapid radial-axial airflow industrial drying systems',
    badge: 'Fast Turnaround',
    image: '/catalog/tumble-dryer.jpg',
    images: [
      "/catalog/tumble-dryer.jpg",
      "/catalog/dryer-angle.jpg",
      "/catalog/dryer-drum.jpg",
      "/catalog/dryer-panel.jpg"
    ],
    description: 'Energy-saving commercial tumble dryers featuring reversing drums, intelligent humidity moisture sensors, and heavy lint filtration for uniform, wrinkle-free drying.',
    features: ['Reversing drum rotation prevents fabric tangling', 'Dual airflow system (Radial + Axial) for 25% faster drying', 'Precise digital moisture sensors prevent overdrying', 'Available in Electric, High-efficiency Gas & Steam'],
    capacityRange: '11 kg - 77 kg',
    partCount: 10,
  },
  {
    id: 'flatwork-ironer',
    name: 'Flatwork & Roller Ironers',
    shortName: 'Flatwork Ironers',
    tagline: 'High-speed cylinder & chest ironers for bedsheets and linens',
    badge: 'Hotel Grade',
    image: '/catalog/flatwork-ironer.jpg',
    images: [
      "/catalog/flatwork-ironer.jpg",
      "/catalog/ironer-angle.jpg",
      "/catalog/ironer-roller.jpg",
      "/catalog/ironer-controls.jpg"
    ],
    description: 'Engineered for premium hospitality linen finishing. Delivers mirror-smooth, wrinkle-free bedsheets, duvets, tablecloths, and pillowcases with Nomex ironing belts.',
    features: ['Polished steel cylinder with uniform thermal distribution', 'Nomex heat-resistant feeding and ironing belts', 'Automatic finger-guard emergency brake protection', 'Adjustable speed inverter (1.5 m/min to 9 m/min)'],
    capacityRange: '1.4m - 3.3m Roll Width',
    partCount: 8,
  },
  {
    id: 'hydro-extractor',
    name: 'Centrifugal Hydro Extractors',
    shortName: 'Hydro Extractors',
    tagline: 'Ultra high-speed water spin extraction for bulk textiles',
    badge: 'Heavy Industrial',
    image: '/catalog/hydro-extractor.jpg',
    images: [
      "/catalog/hydro-extractor.jpg",
      "/catalog/hydro-angle.jpg",
      "/catalog/hydro-basket.jpg",
      "/catalog/hydro-controls.jpg"
    ],
    description: 'Vertical top-loading centrifugal extractors built for rapid moisture reduction in heavy cotton linens, terry towels, workwear, denim, and raw fabrics before drying.',
    features: ['Direct drive motor with dynamic self-balancing 3-point suspension', 'Cast stainless steel inner cage and perforated basket', 'Automatic pneumatic / mechanical friction brake', 'Safety lid interlock prevents opening while spinning'],
    capacityRange: '15 kg - 100 kg',
    partCount: 6,
  },
  {
    id: 'barrier-washer',
    name: 'Hygienic Cleanroom Barrier Washers',
    shortName: 'Barrier Washers',
    tagline: 'Pass-through dual door partition to eliminate cross-contamination',
    badge: 'Hospital / Cleanroom',
    image: '/catalog/barrier-washer.jpg',
    images: [
      "/catalog/barrier-washer.jpg",
      "/catalog/barrier-angle.jpg",
      "/catalog/barrier-clean.jpg",
      "/catalog/barrier-controls.jpg"
    ],
    description: 'Sanitary barrier washer extractors built inside physical partition walls (dirty room loading / clean room unloading) to guarantee sterile laundry for hospitals and pharmaceuticals.',
    features: ['Hermetic wall seal separates soiled dirty zone from sterile clean zone', 'Dual-door pneumatic interlock ensures only one door opens at a time', 'High-temperature thermal disinfection cycles complying with RABC standards', 'Air-spring vibration dampening with soft-mount suspension'],
    capacityRange: '27 kg - 100 kg',
    partCount: 8,
  },
  {
    id: 'steam-press',
    name: 'Finishing Equipment & Steam Press',
    shortName: 'Finishing & Steam Press',
    tagline: 'Utility garment press, form finishers & vacuum spotting tables',
    badge: 'Garment Finishing',
    image: '/catalog/steam-press.jpg',
    images: [
      "/catalog/steam-press.jpg",
      "/catalog/press-angle.jpg",
      "/catalog/press-head.jpg",
      "/catalog/press-controls.jpg"
    ],
    description: 'Professional commercial garment finishing systems including pneumatic utility presses, steam form finishers, spotting stations, and standalone steam boilers for razor-sharp creases.',
    features: ['Pneumatic rapid head closing with two-hand safety pushbuttons', 'Built-in vacuum exhaust and steam blow pedal controls', 'Nomex padding and silicone foam for long-lasting crisp crease quality', 'Heavy-duty integrated steam boiler generators with auto-refill'],
    capacityRange: 'Utility / Shirt / Form Press',
    partCount: 6,
  },
];

export const MACHINES: Machine[] = [
  // --- WASHER EXTRACTORS ---
  {
    id: 'danube-wed-25',
    categoryId: 'washer-extractor',
    name: 'Danube WED-25 High Spin Washer Extractor',
    modelCode: 'DAN-WED-025',
    brand: 'Danube',
    isAuthorizedDealer: true,
    capacityKg: 25,
    capacityLabel: '25 kg (55 lbs)',
    capacityTier: 'medium',
    heatingType: 'Electric',
    spinSpeed: '1,020 RPM',
    gFactor: '450 G',
    drumVolume: '250 Liters',
    dimensions: '1150 x 950 x 1620 mm',
    electricalSupply: '400V 3N 50Hz (18 kW)',
    availableBranches: ['tiruppur', 'coimbatore', 'chennai', 'madurai', 'kochi', 'pan-india'],
    keyFeatures: [
      'Easy Touch 2 microprocessor with 4.3" high-contrast screen',
      'High spin 450 G-Factor drastically reduces tumble dryer cycle time',
      'Automatic chemical dosing manifold with 8 programmable signals',
      'AISI 304 stainless steel basket and outer casing',
    ],
    bestFor: ['Star Category Hotels (80-150 rooms)', 'Hospital linen care', 'Commercial on-premise laundry'],
    warrantyYears: 2,
    image: '/catalog/washer-extractor.jpg',
    images: [
      '/catalog/washer-extractor.jpg',
      '/catalog/washer-angle.jpg',
      '/catalog/washer-drum.jpg',
      '/catalog/washer-panel.jpg',
    ],
    inStock: true,
    leadTime: 'Immediate Dispatch (In Stock)',
    compatiblePartIds: ['part-dan-vfd-01', 'part-drain-valve-3', 'part-inlet-solenoid-24v', 'part-door-seal-wed', 'part-bearing-seal-kit-450', 'part-heating-elem-9kw'],
  },
  {
    id: 'danube-wed-14',
    categoryId: 'washer-extractor',
    name: 'Danube WED-14 High Spin Compact Washer',
    modelCode: 'DAN-WED-014',
    brand: 'Danube',
    isAuthorizedDealer: true,
    capacityKg: 14,
    capacityLabel: '14 kg (31 lbs)',
    capacityTier: 'compact',
    heatingType: 'Electric',
    spinSpeed: '1,150 RPM',
    gFactor: '450 G',
    drumVolume: '130 Liters',
    dimensions: '792 x 852 x 1320 mm',
    electricalSupply: '400V 3N 50Hz (9 kW)',
    availableBranches: ['tiruppur', 'coimbatore', 'chennai', 'kochi'],
    keyFeatures: [
      'Soft-mount high extraction without concrete anchoring requirement',
      'Compact footprint perfect for small boutique hotels & guest houses',
      'Auto-balance sensor prevents off-balance vibration errors',
    ],
    bestFor: ['Boutique Hotels', 'Hostel Laundries', 'Fitness Clubs & Spas'],
    warrantyYears: 2,
    image: '/catalog/washer-extractor.jpg',
    images: [
      "/catalog/washer-extractor.jpg",
      "/catalog/washer-angle.jpg",
      "/catalog/washer-drum.jpg",
      "/catalog/washer-panel.jpg"
    ],
    inStock: true,
    leadTime: 'Immediate Dispatch',
    compatiblePartIds: ['part-dan-vfd-01', 'part-drain-valve-3', 'part-inlet-solenoid-24v', 'part-door-seal-wed'],
  },
  {
    id: 'danube-wed-60',
    categoryId: 'washer-extractor',
    name: 'Danube WED-60 Heavy Industrial Washer',
    modelCode: 'DAN-WED-060',
    brand: 'Danube',
    isAuthorizedDealer: true,
    capacityKg: 60,
    capacityLabel: '60 kg (132 lbs)',
    capacityTier: 'industrial',
    heatingType: 'Steam',
    spinSpeed: '850 RPM',
    gFactor: '350 G',
    drumVolume: '600 Liters',
    dimensions: '1420 x 1480 x 1950 mm',
    electricalSupply: '400V 3N 50Hz (Steam 4-6 bar)',
    availableBranches: ['tiruppur', 'coimbatore', 'chennai', 'pan-india'],
    keyFeatures: [
      'Heavy-duty pneumatic tilting option for effortless unloading',
      'Dual large drain valves for rapid evacuation',
      'Heavy industrial cast bearing block with dual oil seals',
    ],
    bestFor: ['Large Commercial Laundry Plants', '5-Star Hotel Laundries', 'Central Linen Facilities'],
    warrantyYears: 2,
    image: '/catalog/washer-extractor.jpg',
    images: [
      "/catalog/washer-extractor.jpg",
      "/catalog/washer-angle.jpg",
      "/catalog/washer-drum.jpg",
      "/catalog/washer-panel.jpg"
    ],
    inStock: true,
    leadTime: '7-10 Days Delivery',
    compatiblePartIds: ['part-dan-vfd-01', 'part-drain-valve-3', 'part-bearing-seal-kit-450'],
  },
  {
    id: 'speed-queen-sc-040',
    categoryId: 'washer-extractor',
    name: 'Speed Queen SC-040 Commercial Softmount Washer',
    modelCode: 'SQ-SC-040',
    brand: 'Speed Queen',
    isAuthorizedDealer: true,
    capacityKg: 18,
    capacityLabel: '18 kg (40 lbs)',
    capacityTier: 'medium',
    heatingType: 'Electric',
    spinSpeed: '1,075 RPM',
    gFactor: '400 G',
    drumVolume: '185 Liters',
    dimensions: '880 x 920 x 1460 mm',
    electricalSupply: '415V 3-Phase (12 kW)',
    availableBranches: ['tiruppur', 'coimbatore', 'chennai', 'madurai', 'kochi', 'pan-india'],
    keyFeatures: [
      'Heavy-duty American engineering with proven 25,000 cycle lifespan',
      'Quantum Gold multi-level programming & audit diagnostics',
      'Suspension spring & shock absorber package for silent vibration control',
    ],
    bestFor: ['High-throughput Laundromats', 'Hotels & Motels', 'Industrial Workwear Laundries'],
    warrantyYears: 3,
    image: '/Speed Queen.png',
    images: [
      "/Speed Queen.png",
      "/catalog/washer-angle.jpg",
      "/catalog/washer-drum.jpg",
      "/catalog/washer-panel.jpg"
    ],
    inStock: true,
    leadTime: 'In Stock',
    compatiblePartIds: ['part-sq-vfd-board', 'part-drain-valve-3', 'part-inlet-solenoid-24v', 'part-bearing-seal-kit-450'],
  },
  {
    id: 'lg-titan-c-max-15',
    categoryId: 'washer-extractor',
    name: 'LG Commercial Titan-C Max Smart Washer',
    modelCode: 'LG-TITAN-15',
    brand: 'LG Commercial',
    isAuthorizedDealer: true,
    capacityKg: 15,
    capacityLabel: '15 kg (33 lbs)',
    capacityTier: 'compact',
    heatingType: 'Electric',
    spinSpeed: '1,000 RPM',
    gFactor: '300 G',
    drumVolume: '147 Liters',
    dimensions: '737 x 814 x 1035 mm',
    electricalSupply: '230V 1-Phase / 400V 3-Phase (3.6 kW)',
    availableBranches: ['tiruppur', 'coimbatore', 'chennai', 'madurai', 'kochi', 'pan-india'],
    keyFeatures: [
      'Inverter Direct Drive motor with zero belts and pulleys',
      'Atomizing spray rinse cuts water consumption by 32%',
      'Gyro sensor dynamic balancing technology',
    ],
    bestFor: ['Commercial Laundromats', 'Apartment Buildings', 'Hostels & Gyms'],
    warrantyYears: 2,
    image: '/LG-WS.png',
    images: [
      "/LG-WS.png",
      "/catalog/washer-angle.jpg",
      "/catalog/washer-drum.jpg",
      "/catalog/washer-panel.jpg"
    ],
    inStock: true,
    leadTime: 'Immediate Dispatch',
    compatiblePartIds: ['part-lg-dd-motor', 'part-inlet-solenoid-24v'],
  },
  {
    id: 'girbau-hs-6028',
    categoryId: 'washer-extractor',
    name: 'Girbau HS-6028 High Speed Washer Extractor',
    modelCode: 'GIR-HS-6028',
    brand: 'Girbau',
    isAuthorizedDealer: false,
    capacityKg: 28,
    capacityLabel: '28 kg (62 lbs)',
    capacityTier: 'heavy',
    heatingType: 'Dual Heating',
    spinSpeed: '960 RPM',
    gFactor: '400 G',
    drumVolume: '280 Liters',
    dimensions: '1090 x 1180 x 1720 mm',
    electricalSupply: '400V 3-Phase / Steam 3 bar',
    availableBranches: ['tiruppur', 'coimbatore', 'chennai', 'pan-india'],
    keyFeatures: [
      'Intensa logic water & chemical optimization system',
      'MDS Multi Directional Spring suspension',
      'Full stainless steel front, sides, and top panel',
    ],
    bestFor: ['Heavy Industrial Laundry', 'Hospital Linen sterilization', 'Textile Processing'],
    warrantyYears: 1,
    image: '/Girbau-WM.png',
    images: [
      "/Girbau-WM.png",
      "/catalog/washer-angle.jpg",
      "/catalog/washer-drum.jpg",
      "/catalog/washer-panel.jpg"
    ],
    inStock: true,
    leadTime: 'In Stock - 3 Days',
    compatiblePartIds: ['part-drain-valve-3', 'part-inlet-solenoid-24v', 'part-bearing-seal-kit-450'],
  },

  // --- TUMBLE DRYERS ---
  {
    id: 'speed-queen-st-055',
    categoryId: 'tumble-dryer',
    name: 'Speed Queen ST-055 Commercial Reversing Dryer',
    modelCode: 'SQ-ST-055',
    brand: 'Speed Queen',
    isAuthorizedDealer: true,
    capacityKg: 25,
    capacityLabel: '25 kg (55 lbs)',
    capacityTier: 'medium',
    heatingType: 'Gas',
    drumVolume: '495 Liters',
    dimensions: '980 x 1190 x 1850 mm',
    electricalSupply: '415V 3-Phase (Gas 112,000 BTU / Steam)',
    availableBranches: ['tiruppur', 'coimbatore', 'chennai', 'madurai', 'kochi', 'pan-india'],
    keyFeatures: [
      'UniLinc cycle diagnostics with anti-wrinkle tumble cycle',
      'Cylinder reversing option completely prevents rope-tangling on sheets',
      'Over-dry prevention technology stops cycle at exact moisture point',
    ],
    bestFor: ['Commercial Hotels', 'Industrial Laundry Lines', 'Healthcare Linen Processing'],
    warrantyYears: 3,
    image: '/catalog/tumble-dryer.jpg',
    images: [
      "/catalog/tumble-dryer.jpg",
      "/catalog/dryer-angle.jpg",
      "/catalog/dryer-drum.jpg",
      "/catalog/dryer-panel.jpg"
    ],
    inStock: true,
    leadTime: 'Immediate Dispatch',
    compatiblePartIds: ['part-dryer-belt-sq', 'part-blower-impeller-dry', 'part-gas-igniter-valve', 'part-lint-screen-filter'],
  },
  {
    id: 'danube-dd-silver-18',
    categoryId: 'tumble-dryer',
    name: 'Danube DD-Silver 18 Eco Tumble Dryer',
    modelCode: 'DAN-DD-018',
    brand: 'Danube',
    isAuthorizedDealer: true,
    capacityKg: 18,
    capacityLabel: '18 kg (40 lbs)',
    capacityTier: 'medium',
    heatingType: 'Electric',
    drumVolume: '330 Liters',
    dimensions: '785 x 972 x 1694 mm',
    electricalSupply: '400V 3N 50Hz (18 kW)',
    availableBranches: ['tiruppur', 'coimbatore', 'chennai', 'kochi'],
    keyFeatures: [
      'Radial & axial combined air flow for maximum heat transfer efficiency',
      'Double insulated glass front door for operator thermal safety',
      'Galvanized steel drum with rounded punches for fabric protection',
    ],
    bestFor: ['Mid-size Hotels', 'Hostels', 'Laundromats'],
    warrantyYears: 2,
    image: '/catalog/tumble-dryer.jpg',
    images: [
      "/catalog/tumble-dryer.jpg",
      "/catalog/dryer-angle.jpg",
      "/catalog/dryer-drum.jpg",
      "/catalog/dryer-panel.jpg"
    ],
    inStock: true,
    leadTime: 'In Stock',
    compatiblePartIds: ['part-dryer-belt-sq', 'part-blower-impeller-dry', 'part-lint-screen-filter'],
  },
  {
    id: 'danube-dd-gold-35',
    categoryId: 'tumble-dryer',
    name: 'Danube DD-Gold 35 Steam/Gas Heavy Dryer',
    modelCode: 'DAN-DD-035',
    brand: 'Danube',
    isAuthorizedDealer: true,
    capacityKg: 35,
    capacityLabel: '35 kg (77 lbs)',
    capacityTier: 'heavy',
    heatingType: 'Steam',
    drumVolume: '660 Liters',
    dimensions: '985 x 1210 x 1946 mm',
    electricalSupply: '400V 3N 50Hz (Steam 30 kW equiv.)',
    availableBranches: ['tiruppur', 'coimbatore', 'chennai', 'madurai', 'pan-india'],
    keyFeatures: [
      'Intelligent Air Recovery System recirculates 30% heated exhaust air',
      'Full stainless steel AISI 304 interior cylinder',
      'Electronic touch screen control with real-time temperature graph',
    ],
    bestFor: ['Industrial Laundry Facilities', 'Hospital Laundry Plants', 'Resorts & Multi-property groups'],
    warrantyYears: 2,
    image: '/catalog/tumble-dryer.jpg',
    images: [
      "/catalog/tumble-dryer.jpg",
      "/catalog/dryer-angle.jpg",
      "/catalog/dryer-drum.jpg",
      "/catalog/dryer-panel.jpg"
    ],
    inStock: true,
    leadTime: 'Immediate Dispatch',
    compatiblePartIds: ['part-dryer-belt-sq', 'part-blower-impeller-dry', 'part-lint-screen-filter'],
  },
  {
    id: 'lg-titan-pro-dryer-15',
    categoryId: 'tumble-dryer',
    name: 'LG Commercial Titan Pro Dryer',
    modelCode: 'LG-DRY-15',
    brand: 'LG Commercial',
    isAuthorizedDealer: true,
    capacityKg: 15,
    capacityLabel: '15 kg (33 lbs)',
    capacityTier: 'compact',
    heatingType: 'Electric',
    drumVolume: '207 Liters',
    dimensions: '737 x 814 x 1035 mm',
    electricalSupply: '230V / 400V (5.4 kW)',
    availableBranches: ['tiruppur', 'coimbatore', 'chennai', 'madurai', 'kochi'],
    keyFeatures: [
      'Adaptable dual orientation reversible door',
      'Ultra quiet motor mechanism under 58 dB',
      'Stackable with LG Titan-C Washer to save 50% floor area',
    ],
    bestFor: ['Commercial Laundromats', 'Gated Community Laundry Rooms', 'Gyms & Spas'],
    warrantyYears: 2,
    image: '/LG-WS.png',
    images: [
      "/LG-WS.png",
      "/catalog/dryer-angle.jpg",
      "/catalog/dryer-drum.jpg",
      "/catalog/dryer-panel.jpg"
    ],
    inStock: true,
    leadTime: 'In Stock',
    compatiblePartIds: ['part-dryer-belt-sq', 'part-lint-screen-filter'],
  },

  // --- FLATWORK IRONERS ---
  {
    id: 'danube-polis-2000',
    categoryId: 'flatwork-ironer',
    name: 'Danube POLIS 2000 Commercial Flatwork Ironer',
    modelCode: 'DAN-POL-2000',
    brand: 'Danube',
    isAuthorizedDealer: true,
    capacityKg: 65,
    capacityLabel: '2.0m Roll Width (65 kg/hr)',
    capacityTier: 'heavy',
    heatingType: 'Electric',
    drumVolume: 'Roller Dia 325 mm x 2000 mm Length',
    dimensions: '2640 x 780 x 1280 mm',
    electricalSupply: '400V 3N 50Hz (24 kW)',
    availableBranches: ['tiruppur', 'coimbatore', 'chennai', 'kochi', 'pan-india'],
    keyFeatures: [
      'Full Nomex ironing ribbons for high-gloss, wrinkle-free finishing',
      'Variable speed frequency inverter (1.5 m/min to 8 m/min)',
      'Automatic cylinder separation during sudden power disruption',
      'Touch-free electronic finger safety guard',
    ],
    bestFor: ['Boutique & Star Hotels', 'Hospitals (Sheets & Pillowcases)', 'Linen Hire Services'],
    warrantyYears: 2,
    image: '/catalog/flatwork-ironer.jpg',
    images: [
      "/catalog/flatwork-ironer.jpg",
      "/catalog/ironer-angle.jpg",
      "/catalog/ironer-roller.jpg",
      "/catalog/ironer-controls.jpg"
    ],
    inStock: true,
    leadTime: 'Ready for Commissioning',
    compatiblePartIds: ['part-nomex-belts-iron', 'part-ironer-guide-ribbon', 'part-ironer-gearbox-vfd'],
  },
  {
    id: 'danube-micra-1400',
    categoryId: 'flatwork-ironer',
    name: 'Danube MICRA 1400 Compact Chest Ironer',
    modelCode: 'DAN-MIC-1400',
    brand: 'Danube',
    isAuthorizedDealer: true,
    capacityKg: 35,
    capacityLabel: '1.4m Roll Width (35 kg/hr)',
    capacityTier: 'compact',
    heatingType: 'Electric',
    drumVolume: 'Roller Dia 200 mm x 1400 mm Length',
    dimensions: '1900 x 520 x 1050 mm',
    electricalSupply: '400V 3N 50Hz (12 kW)',
    availableBranches: ['tiruppur', 'coimbatore', 'chennai'],
    keyFeatures: [
      'Front feed and front return wall-positionable ironer saves room',
      'Electronic digital thermostat with accurate temperature management',
      'Heavy-duty padded steel wool roll core',
    ],
    bestFor: ['Banquets & Small Hotels', 'Care Homes', 'Bed & Breakfasts'],
    warrantyYears: 2,
    image: '/catalog/flatwork-ironer.jpg',
    images: [
      "/catalog/flatwork-ironer.jpg",
      "/catalog/ironer-angle.jpg",
      "/catalog/ironer-roller.jpg",
      "/catalog/ironer-controls.jpg"
    ],
    inStock: true,
    leadTime: 'In Stock',
    compatiblePartIds: ['part-nomex-belts-iron', 'part-ironer-guide-ribbon'],
  },
  {
    id: 'girbau-pb-3221',
    categoryId: 'flatwork-ironer',
    name: 'Girbau PB-3221 Industrial Flatwork Ironer',
    modelCode: 'GIR-PB-3221',
    brand: 'Girbau',
    isAuthorizedDealer: false,
    capacityKg: 140,
    capacityLabel: '3.2m Roll Width (140 kg/hr)',
    capacityTier: 'industrial',
    heatingType: 'Steam',
    drumVolume: 'Roller Dia 500 mm x 3200 mm Length',
    dimensions: '4100 x 1450 x 1650 mm',
    electricalSupply: '400V 3-Phase / Steam 8-10 bar',
    availableBranches: ['tiruppur', 'chennai', 'pan-india'],
    keyFeatures: [
      'High throughput drying and ironing of sheets straight from high-spin washers',
      'Kinetic steam circulation chamber for lightning-fast heating',
      'Exhaust vapor suction fan removes moisture automatically',
    ],
    bestFor: ['Large Commercial Laundry Plants', '5-Star Resort Chains', 'Railway / Aviation Linens'],
    warrantyYears: 1,
    image: '/catalog/flatwork-ironer.jpg',
    images: [
      "/catalog/flatwork-ironer.jpg",
      "/catalog/ironer-angle.jpg",
      "/catalog/ironer-roller.jpg",
      "/catalog/ironer-controls.jpg"
    ],
    inStock: true,
    leadTime: '10 Days Lead Time',
    compatiblePartIds: ['part-nomex-belts-iron', 'part-ironer-guide-ribbon', 'part-ironer-gearbox-vfd'],
  },

  // --- HYDRO EXTRACTORS ---
  {
    id: 'sl-tech-he-25',
    categoryId: 'hydro-extractor',
    name: 'SL-Tech HE-25 Centrifugal Hydro Extractor',
    modelCode: 'SLT-HE-025',
    brand: 'Danube',
    isAuthorizedDealer: true,
    capacityKg: 25,
    capacityLabel: '25 kg (55 lbs)',
    capacityTier: 'medium',
    heatingType: 'Direct Heat',
    spinSpeed: '1,450 RPM',
    gFactor: '500 G',
    drumVolume: 'Inner Basket Dia 650 mm x 380 mm',
    dimensions: '950 x 950 x 900 mm',
    electricalSupply: '415V 3-Phase (3.7 kW)',
    availableBranches: ['tiruppur', 'coimbatore', 'chennai', 'madurai', 'kochi', 'pan-india'],
    keyFeatures: [
      'Heavy cast-iron base with three heavy-duty self-balancing suspension springs',
      'AISI 304 stainless steel perforated inner and outer water cage',
      'Self-energizing mechanical brake with quick foot pedal release',
      'Interlocked safety microswitch automatically disconnects power when lid is lifted',
    ],
    bestFor: ['Commercial Laundries', 'Yarn & Garment Dyeing Houses', 'Terry Towel & Denim Mills'],
    warrantyYears: 2,
    image: '/catalog/hydro-extractor.jpg',
    images: [
      "/catalog/hydro-extractor.jpg",
      "/catalog/hydro-angle.jpg",
      "/catalog/hydro-basket.jpg",
      "/catalog/hydro-controls.jpg"
    ],
    inStock: true,
    leadTime: 'Immediate Dispatch',
    compatiblePartIds: ['part-hydro-brake-shoes', 'part-hydro-suspension-spring', 'part-bearing-seal-kit-450'],
  },
  {
    id: 'sl-tech-he-50',
    categoryId: 'hydro-extractor',
    name: 'SL-Tech Industrial HE-50 Spin Extractor',
    modelCode: 'SLT-HE-050',
    brand: 'Danube',
    isAuthorizedDealer: true,
    capacityKg: 50,
    capacityLabel: '50 kg (110 lbs)',
    capacityTier: 'industrial',
    heatingType: 'Direct Heat',
    spinSpeed: '1,200 RPM',
    gFactor: '480 G',
    drumVolume: 'Inner Basket Dia 900 mm x 450 mm',
    dimensions: '1350 x 1350 x 1050 mm',
    electricalSupply: '415V 3-Phase (7.5 kW)',
    availableBranches: ['tiruppur', 'coimbatore', 'chennai', 'pan-india'],
    keyFeatures: [
      'Pneumatically assisted lid lifter for easy loading of bulk heavy textiles',
      'Direct drive high-torque motor with automatic star-delta starter panel',
      'Heavy duty dynamically balanced stainless steel inner basket',
    ],
    bestFor: ['Bulk Industrial Laundries', 'Knitting & Export Garment Factories', 'Large Hotel Laundries'],
    warrantyYears: 2,
    image: '/catalog/hydro-extractor.jpg',
    images: [
      "/catalog/hydro-extractor.jpg",
      "/catalog/hydro-angle.jpg",
      "/catalog/hydro-basket.jpg",
      "/catalog/hydro-controls.jpg"
    ],
    inStock: true,
    leadTime: 'In Stock',
    compatiblePartIds: ['part-hydro-brake-shoes', 'part-hydro-suspension-spring', 'part-bearing-seal-kit-450'],
  },

  // --- BARRIER WASHERS ---
  {
    id: 'danube-asep-27',
    categoryId: 'barrier-washer',
    name: 'Danube ASEP-27 Cleanroom Barrier Washer Extractor',
    modelCode: 'DAN-ASEP-027',
    brand: 'Danube',
    isAuthorizedDealer: true,
    capacityKg: 27,
    capacityLabel: '27 kg (60 lbs)',
    capacityTier: 'heavy',
    heatingType: 'Electric',
    spinSpeed: '1,000 RPM',
    gFactor: '375 G',
    drumVolume: '270 Liters',
    dimensions: '1240 x 1150 x 1750 mm',
    electricalSupply: '400V 3N 50Hz (18 kW)',
    availableBranches: ['tiruppur', 'coimbatore', 'chennai', 'kochi', 'pan-india'],
    keyFeatures: [
      'Physical wall seal separating soiled loading room from sterile clean unloading room',
      'Dual door pneumatic interlock completely prevents simultaneous door opening',
      'Meets strict RABC and European medical hygiene cleanliness standards',
      'Easy Touch 2 dual display screens on both soiled and clean side partitions',
    ],
    bestFor: ['Multi-speciality Hospital OTs & ICUs', 'Pharmaceutical cleanrooms', 'Nuclear / High-Care Institutions'],
    warrantyYears: 2,
    image: '/catalog/barrier-washer.jpg',
    images: [
      "/catalog/barrier-washer.jpg",
      "/catalog/barrier-angle.jpg",
      "/catalog/barrier-clean.jpg",
      "/catalog/barrier-controls.jpg"
    ],
    inStock: true,
    leadTime: 'Immediate Dispatch',
    compatiblePartIds: ['part-dan-vfd-01', 'part-drain-valve-3', 'part-barrier-door-interlock', 'part-inlet-solenoid-24v'],
  },
  {
    id: 'danube-asep-50',
    categoryId: 'barrier-washer',
    name: 'Danube ASEP-50 Pass-Through Barrier Extractor',
    modelCode: 'DAN-ASEP-050',
    brand: 'Danube',
    isAuthorizedDealer: true,
    capacityKg: 50,
    capacityLabel: '50 kg (110 lbs)',
    capacityTier: 'industrial',
    heatingType: 'Steam',
    spinSpeed: '900 RPM',
    gFactor: '375 G',
    drumVolume: '500 Liters',
    dimensions: '1580 x 1320 x 1920 mm',
    electricalSupply: '400V 3N 50Hz (Steam 4-6 bar)',
    availableBranches: ['tiruppur', 'coimbatore', 'chennai', 'pan-india'],
    keyFeatures: [
      'Two-compartment Pullman inner drum for easy loading & separation of delicate sterile linen',
      'Automatic drum positioning and pneumatic brake lock for loading alignment',
      'Air cushion vibration isolation system',
    ],
    bestFor: ['Government & Medical College Hospitals', 'Surgical Linen Services', 'Bio-Pharma Facilities'],
    warrantyYears: 2,
    image: '/catalog/barrier-washer.jpg',
    images: [
      "/catalog/barrier-washer.jpg",
      "/catalog/barrier-angle.jpg",
      "/catalog/barrier-clean.jpg",
      "/catalog/barrier-controls.jpg"
    ],
    inStock: true,
    leadTime: 'In Stock',
    compatiblePartIds: ['part-dan-vfd-01', 'part-drain-valve-3', 'part-barrier-door-interlock'],
  },

  // --- FINISHING & STEAM PRESS ---
  {
    id: 'sl-tech-press-up42',
    categoryId: 'steam-press',
    name: 'SL-Tech UP-42 Pneumatic Utility Garment Press',
    modelCode: 'SLT-UP-042',
    brand: 'Danube',
    isAuthorizedDealer: true,
    capacityKg: 15,
    capacityLabel: 'Utility Garment Press',
    capacityTier: 'compact',
    heatingType: 'Steam',
    dimensions: '1250 x 1150 x 1380 mm',
    electricalSupply: '230V 1-Phase / Steam 4-6 bar',
    availableBranches: ['tiruppur', 'coimbatore', 'chennai', 'madurai', 'kochi', 'pan-india'],
    keyFeatures: [
      'Air-operated pneumatic top head with rapid pedal or push-button trigger',
      'Polished stainless steel head with built-in steam spray and vacuum exhaust',
      'Two-hand safety operator control prevents workplace hand injuries',
      'High-grade Nomex heat-resistant cover with spring silicon foam padding',
    ],
    bestFor: ['Hospitality Uniform Pressing', 'Dry Cleaners & Suit Finishing', 'Garment Export Houses'],
    warrantyYears: 2,
    image: '/catalog/steam-press.jpg',
    images: [
      "/catalog/steam-press.jpg",
      "/catalog/press-angle.jpg",
      "/catalog/press-head.jpg",
      "/catalog/press-controls.jpg"
    ],
    inStock: true,
    leadTime: 'Immediate Dispatch',
    compatiblePartIds: ['part-press-nomex-padding', 'part-steam-solenoid-valve', 'part-vacuum-motor-impeller'],
  },
  {
    id: 'fagor-ff-shirt-pro',
    categoryId: 'steam-press',
    name: 'Fagor Pro Form Finisher & Shirt Dummy',
    modelCode: 'FAG-FF-PRO',
    brand: 'Fagor',
    isAuthorizedDealer: false,
    capacityKg: 20,
    capacityLabel: 'Form Finisher (40-60 shirts/hr)',
    capacityTier: 'medium',
    heatingType: 'Steam',
    dimensions: '950 x 1200 x 1750 mm',
    electricalSupply: '400V 3-Phase / Steam 4 bar',
    availableBranches: ['tiruppur', 'coimbatore', 'chennai'],
    keyFeatures: [
      'Microprocessor timer regulates steam injection and hot air drying cycles',
      '360° rotating dummy mannequin with pneumatic cuff & front placket clamps',
      'Delivers impeccable shape restoration for coats, jackets, shirts & dresses',
    ],
    bestFor: ['Dry Cleaning Laundromats', 'Hotel Valet Departments', 'Uniform Rental Businesses'],
    warrantyYears: 1,
    image: '/catalog/steam-press.jpg',
    images: [
      "/catalog/steam-press.jpg",
      "/catalog/press-angle.jpg",
      "/catalog/press-head.jpg",
      "/catalog/press-controls.jpg"
    ],
    inStock: true,
    leadTime: 'In Stock',
    compatiblePartIds: ['part-steam-solenoid-valve', 'part-vacuum-motor-impeller'],
  },
];

export const SPARE_PARTS: SparePart[] = [
  // --- ELECTRICAL & INVERTERS ---
  {
    id: 'part-dan-vfd-01',
    partNumber: 'DAN-VFD-400',
    name: 'Danube / Delta 4.0 kW Inverter Frequency Drive (VFD)',
    category: 'Electrical & Inverter',
    applicableCategoryIds: ['washer-extractor', 'barrier-washer'],
    compatibleBrands: ['Danube', 'Domus', 'Fagor'],
    compatibleModelsText: 'Danube WED-14, WED-18, WED-25, ASEP-27',
    compatibleMachineIds: ['danube-wed-25', 'danube-wed-14', 'danube-asep-27'],
    stockStatus: 'Fast Dispatch (24h)',
    genuineOem: true,
    warranty: '1 Year Warranty',
    priceIndicator: 'OEM Certified',
    specifications: {
      Power: '4.0 kW / 5.5 HP',
      Input: '3-Phase 380-480V 50/60Hz',
      Output: '0-400Hz Controlled Ramp',
      Cooling: 'Built-in Forced Air Heatsink',
    },
    description: 'Factory pre-programmed variable frequency inverter drive engineered for smooth progressive drum acceleration from gentle wash tumble to 450 G-force high spin.',
    image: '/catalog/spare-parts-kit.jpg',
    images: [
      "/catalog/part-electrical.jpg",
      "/catalog/spare-parts-kit.jpg",
      "/catalog/part-valve.jpg",
      "/catalog/part-mechanical.jpg"
    ],
  },
  {
    id: 'part-sq-vfd-board',
    partNumber: 'SQ-INV-2200',
    name: 'Speed Queen Quantum Inverter Control Assembly',
    category: 'Electrical & Inverter',
    applicableCategoryIds: ['washer-extractor'],
    compatibleBrands: ['Speed Queen', 'Primus'],
    compatibleModelsText: 'Speed Queen SC-030, SC-040, SC-060',
    compatibleMachineIds: ['speed-queen-sc-040'],
    stockStatus: 'In Stock',
    genuineOem: true,
    warranty: '1 Year Warranty',
    priceIndicator: 'OEM Genuine',
    specifications: {
      Model: 'Quantum Gold Compatible',
      Voltage: '380-415V 3-Phase',
      Protection: 'Over-torque & Phase-loss Sensing',
    },
    description: 'Genuine OEM drive unit controlling variable drum rotation and regenerative electric braking on Speed Queen commercial softmount washer extractors.',
    image: '/catalog/spare-parts-kit.jpg',
    images: [
      "/catalog/part-electrical.jpg",
      "/catalog/spare-parts-kit.jpg",
      "/catalog/part-valve.jpg",
      "/catalog/part-mechanical.jpg"
    ],
  },

  // --- VALVES & PIPING ---
  {
    id: 'part-drain-valve-3',
    partNumber: 'VAL-DRN-300-M',
    name: 'Motorized Gravity Drain Valve Assembly (3-inch / 76mm)',
    category: 'Valves & Piping',
    applicableCategoryIds: ['washer-extractor', 'barrier-washer'],
    compatibleBrands: ['Danube', 'Speed Queen', 'Girbau', 'Domus', 'IFB', 'Electrolux'],
    compatibleModelsText: 'Universal fit for all 18kg - 60kg commercial washers',
    compatibleMachineIds: ['danube-wed-25', 'danube-wed-14', 'danube-wed-60', 'speed-queen-sc-040', 'girbau-hs-6028', 'danube-asep-27', 'danube-asep-50'],
    stockStatus: 'In Stock',
    genuineOem: true,
    warranty: '1 Year Replacement',
    priceIndicator: 'Ready Stock',
    specifications: {
      Diameter: '3.0 Inch (76 mm) OD',
      Voltage: '220V - 240V AC 50Hz Synchronous Motor',
      Body: 'High-temperature EPDM + Reinforced Polypropylene',
      Action: 'Normally Open (Spring Return on Power Loss)',
    },
    description: 'Heavy-duty industrial motorized drain valve engineered to discharge up to 300 liters/minute without clogging from lint, hair, or coins. Non-corrosive chemical resistant body.',
    image: '/catalog/spare-parts-kit.jpg',
    images: [
      "/catalog/part-valve.jpg",
      "/catalog/spare-parts-kit.jpg",
      "/catalog/part-mechanical.jpg",
      "/catalog/part-electrical.jpg"
    ],
  },
  {
    id: 'part-inlet-solenoid-24v',
    partNumber: 'SOL-24V-DUAL',
    name: 'Dual & Triple Coil Water Inlet Solenoid Valve',
    category: 'Valves & Piping',
    applicableCategoryIds: ['washer-extractor', 'barrier-washer'],
    compatibleBrands: ['Danube', 'Speed Queen', 'LG Commercial', 'Girbau'],
    compatibleModelsText: 'Hot & Cold water intake for commercial washers 11kg to 60kg',
    compatibleMachineIds: ['danube-wed-25', 'danube-wed-14', 'speed-queen-sc-040', 'lg-titan-c-max-15', 'girbau-hs-6028', 'danube-asep-27'],
    stockStatus: 'In Stock',
    genuineOem: true,
    warranty: '1 Year Warranty',
    priceIndicator: 'In Stock',
    specifications: {
      Coils: 'Dual / Triple Way 3/4" BSP Inlets',
      Voltage: '24V DC / 220V AC Options Available',
      Pressure: '0.5 bar to 10 bar working pressure',
      Mesh: 'Stainless steel pre-filter screen included',
    },
    description: 'High-flow brass & thermoplastic water inlet valve with built-in dirt strainer mesh. Resists lime scale buildup and handles high-temperature water up to 90°C.',
    image: '/catalog/spare-parts-kit.jpg',
    images: [
      "/catalog/part-valve.jpg",
      "/catalog/spare-parts-kit.jpg",
      "/catalog/part-mechanical.jpg",
      "/catalog/part-electrical.jpg"
    ],
  },

  // --- MECHANICAL & DRIVE ---
  {
    id: 'part-bearing-seal-kit-450',
    partNumber: 'SEAL-BEAR-450K',
    name: 'Heavy Duty Drum Bearings & Dual Viton Oil Seal Kit',
    category: 'Mechanical & Drive',
    applicableCategoryIds: ['washer-extractor', 'hydro-extractor', 'barrier-washer'],
    compatibleBrands: ['Danube', 'Speed Queen', 'Girbau', 'Domus'],
    compatibleModelsText: 'Danube WED-25, WED-35, Girbau HS-6028, SL-Tech HE-25',
    compatibleMachineIds: ['danube-wed-25', 'danube-wed-60', 'speed-queen-sc-040', 'girbau-hs-6028', 'sl-tech-he-25', 'sl-tech-he-50'],
    stockStatus: 'Fast Dispatch (24h)',
    genuineOem: true,
    warranty: '1 Year Guarantee',
    priceIndicator: 'OEM Grade',
    specifications: {
      Bearings: 'SKF / FAG Heavy-Load Tapered Roller Bearings',
      Seals: 'High-temperature Viton Dual Lip V-Ring with Ceramic Bush',
      Grease: 'Synthetic waterproof marine grease pack included',
    },
    description: 'Precision drum shaft bearing and seal overhaul kit. Protects the main shaft against chemical corrosion and water penetration under 450 G-force spin cycles.',
    image: '/catalog/spare-parts-kit.jpg',
    images: [
      "/catalog/part-mechanical.jpg",
      "/catalog/spare-parts-kit.jpg",
      "/catalog/part-valve.jpg",
      "/catalog/part-electrical.jpg"
    ],
  },
  {
    id: 'part-lg-dd-motor',
    partNumber: 'LG-DDM-15K',
    name: 'LG Commercial Direct Drive Brushless Motor Assembly',
    category: 'Mechanical & Drive',
    applicableCategoryIds: ['washer-extractor'],
    compatibleBrands: ['LG Commercial'],
    compatibleModelsText: 'LG Titan-C Max 15kg, Giant-C 10kg',
    compatibleMachineIds: ['lg-titan-c-max-15'],
    stockStatus: 'In Stock',
    genuineOem: true,
    warranty: '3 Years Warranty',
    priceIndicator: 'Factory Original',
    specifications: {
      Type: 'Brushless Permanent Magnet Direct Drive',
      Voltage: 'Inverter Controlled Variable Speed',
      Sensors: 'Integrated Hall Sensor RPM feedback',
    },
    description: 'Ultra-reliable direct drive stator and rotor assembly without belts, pulleys, or carbon brushes, providing silent 1,000 RPM extraction.',
    image: '/catalog/spare-parts-kit.jpg',
    images: [
      "/catalog/part-mechanical.jpg",
      "/catalog/spare-parts-kit.jpg",
      "/catalog/part-valve.jpg",
      "/catalog/part-electrical.jpg"
    ],
  },
  {
    id: 'part-dryer-belt-sq',
    partNumber: 'SQ-BLT-501',
    name: 'Heavy Duty Heat-Resistant Poly-V Dryer Drum Belt',
    category: 'Mechanical & Drive',
    applicableCategoryIds: ['tumble-dryer'],
    compatibleBrands: ['Speed Queen', 'Danube', 'Domus', 'LG Commercial'],
    compatibleModelsText: 'Speed Queen ST-055, Danube DD-Silver 18, DD-Gold 35',
    compatibleMachineIds: ['speed-queen-st-055', 'danube-dd-silver-18', 'danube-dd-gold-35', 'lg-titan-pro-dryer-15'],
    stockStatus: 'In Stock',
    genuineOem: true,
    warranty: '6 Months Replacement',
    priceIndicator: 'In Stock',
    specifications: {
      Material: 'Reinforced EPDM rubber with Kevlar tensile cords',
      HeatResistance: 'Rated to 130°C continuous operation',
      Profile: 'Multi-ribbed Poly-V groove',
    },
    description: 'Kevlar-reinforced high temperature drive belt designed for commercial dryers to eliminate slipping under heavy wet linen loads.',
    image: '/catalog/spare-parts-kit.jpg',
    images: [
      "/catalog/part-mechanical.jpg",
      "/catalog/spare-parts-kit.jpg",
      "/catalog/part-valve.jpg",
      "/catalog/part-electrical.jpg"
    ],
  },
  {
    id: 'part-hydro-brake-shoes',
    partNumber: 'HYD-BRK-SET',
    name: 'Centrifugal Brake Shoe Lining & Tension Spring Set',
    category: 'Mechanical & Drive',
    applicableCategoryIds: ['hydro-extractor'],
    compatibleBrands: ['Danube', 'SL-Tech Pro'],
    compatibleModelsText: 'SL-Tech HE-15, HE-25, HE-50, HE-100',
    compatibleMachineIds: ['sl-tech-he-25', 'sl-tech-he-50'],
    stockStatus: 'In Stock',
    genuineOem: true,
    warranty: '6 Months Replacement',
    priceIndicator: 'In Stock',
    specifications: {
      Material: 'High-friction woven composite lining (non-asbestos)',
      Springs: 'Tempered steel return springs',
      Actuation: 'Mechanical foot pedal / pneumatic cylinder brake',
    },
    description: 'Heavy-duty brake shoe assembly providing rapid, smooth deceleration for 1,450 RPM hydro extractor spinning baskets in under 20 seconds.',
    image: '/catalog/spare-parts-kit.jpg',
    images: [
      "/catalog/part-mechanical.jpg",
      "/catalog/spare-parts-kit.jpg",
      "/catalog/part-valve.jpg",
      "/catalog/part-electrical.jpg"
    ],
  },
  {
    id: 'part-hydro-suspension-spring',
    partNumber: 'HYD-SPG-SET3',
    name: 'Hydro Extractor 3-Point Suspension Spring & Link Kit',
    category: 'Mechanical & Drive',
    applicableCategoryIds: ['hydro-extractor'],
    compatibleBrands: ['Danube', 'SL-Tech Pro'],
    compatibleModelsText: 'Universal fit for all 3-leg commercial hydro extractors',
    compatibleMachineIds: ['sl-tech-he-25', 'sl-tech-he-50'],
    stockStatus: 'In Stock',
    genuineOem: true,
    warranty: '1 Year Guarantee',
    priceIndicator: 'Heavy Duty',
    specifications: {
      Springs: 'High tensile alloy spring steel with rubber shock buffer',
      Quantity: 'Set of 3 matched balanced springs',
    },
    description: 'Heavy duty self-balancing 3-point hanging suspension kit that absorbs out-of-balance centrifugal vibration during spinning.',
    image: '/catalog/spare-parts-kit.jpg',
    images: [
      "/catalog/part-mechanical.jpg",
      "/catalog/spare-parts-kit.jpg",
      "/catalog/part-valve.jpg",
      "/catalog/part-electrical.jpg"
    ],
  },

  // --- SEALS & GASKETS ---
  {
    id: 'part-door-seal-wed',
    partNumber: 'GSK-SIL-420',
    name: 'High-Temperature Silicone Door Gasket (Moulded Bellow)',
    category: 'Seals & Gaskets',
    applicableCategoryIds: ['washer-extractor'],
    compatibleBrands: ['Danube', 'Domus', 'Fagor', 'Girbau'],
    compatibleModelsText: 'Danube WED-14, WED-18, WED-25, WED-35',
    compatibleMachineIds: ['danube-wed-25', 'danube-wed-14'],
    stockStatus: 'In Stock',
    genuineOem: true,
    warranty: '1 Year Guarantee',
    priceIndicator: 'In Stock',
    specifications: {
      Material: '100% Pure Virgin Silicone Rubber (Gray/Black)',
      Temperature: '-30°C to +150°C resistant',
      Resistance: 'Chlorine bleach, ozone & acid chemical resistant',
    },
    description: 'Seamless circular silicone door bellow with stainless steel tension clamp ring. Prevents front door water leakage during heavy chemical wash cycles.',
    image: '/catalog/spare-parts-kit.jpg',
    images: [
      "/catalog/part-mechanical.jpg",
      "/catalog/spare-parts-kit.jpg",
      "/catalog/part-valve.jpg",
      "/catalog/part-electrical.jpg"
    ],
  },

  // --- HEATING & STEAM ---
  {
    id: 'part-heating-elem-9kw',
    partNumber: 'HTR-INCO-09KW',
    name: 'Incoloy 800 Flanged Heating Element (9.0 kW / 400V)',
    category: 'Heating & Steam',
    applicableCategoryIds: ['washer-extractor'],
    compatibleBrands: ['Danube', 'Speed Queen', 'Girbau', 'IFB', 'Domus'],
    compatibleModelsText: 'Commercial washer extractors 14kg, 18kg, 25kg',
    compatibleMachineIds: ['danube-wed-25'],
    stockStatus: 'In Stock',
    genuineOem: true,
    warranty: '1 Year Warranty',
    priceIndicator: 'OEM Grade',
    specifications: {
      Power: '9,000 Watts (9 kW)',
      Voltage: '230V / 400V 3-Phase',
      Sheath: 'Incoloy 800 anti-corrosion alloy',
      Mounting: 'Standard oval flange with EPDM gasket',
    },
    description: 'High-grade Incoloy heating element engineered to resist scale encrustation and detergent corrosion for rapid wash water temperature rise up to 90°C.',
    image: '/catalog/spare-parts-kit.jpg',
    images: [
      "/catalog/part-valve.jpg",
      "/catalog/spare-parts-kit.jpg",
      "/catalog/part-mechanical.jpg",
      "/catalog/part-electrical.jpg"
    ],
  },
  {
    id: 'part-gas-igniter-valve',
    partNumber: 'GAS-VAL-IGN',
    name: 'Automatic Gas Ignition Module & Solenoid Valve',
    category: 'Heating & Steam',
    applicableCategoryIds: ['tumble-dryer'],
    compatibleBrands: ['Speed Queen', 'Danube'],
    compatibleModelsText: 'Speed Queen ST-035, ST-055, ST-075 Gas Dryers',
    compatibleMachineIds: ['speed-queen-st-055'],
    stockStatus: 'Fast Dispatch (24h)',
    genuineOem: true,
    warranty: '1 Year Warranty',
    priceIndicator: 'OEM Certified',
    specifications: {
      GasType: 'LPG / Natural Gas compatible',
      Spark: 'Direct spark ignition with flame rectification sensor',
      Voltage: '24V / 230V AC',
    },
    description: 'Precision electronic gas control safety unit featuring instant flame monitoring and auto shutoff if flameout is detected.',
    image: '/catalog/spare-parts-kit.jpg',
    images: [
      "/catalog/part-valve.jpg",
      "/catalog/spare-parts-kit.jpg",
      "/catalog/part-mechanical.jpg",
      "/catalog/part-electrical.jpg"
    ],
  },
  {
    id: 'part-blower-impeller-dry',
    partNumber: 'BLW-IMP-DRY',
    name: 'Dynamic Balanced Exhaust Blower Impeller Wheel',
    category: 'Heating & Steam',
    applicableCategoryIds: ['tumble-dryer'],
    compatibleBrands: ['Speed Queen', 'Danube', 'Electrolux'],
    compatibleModelsText: 'Fits commercial tumble dryers 18kg - 35kg',
    compatibleMachineIds: ['speed-queen-st-055', 'danube-dd-silver-18', 'danube-dd-gold-35'],
    stockStatus: 'In Stock',
    genuineOem: true,
    warranty: '1 Year Guarantee',
    priceIndicator: 'In Stock',
    specifications: {
      Material: 'Cast aluminium alloy, dynamically balanced to ISO G2.5',
      Bore: '19 mm shaft with keyway slot',
    },
    description: 'Curved blade high-airflow blower wheel that maintains continuous negative exhaust pressure for rapid moisture evacuation.',
    image: '/catalog/spare-parts-kit.jpg',
    images: [
      "/catalog/part-valve.jpg",
      "/catalog/spare-parts-kit.jpg",
      "/catalog/part-mechanical.jpg",
      "/catalog/part-electrical.jpg"
    ],
  },
  {
    id: 'part-lint-screen-filter',
    partNumber: 'LNT-SCR-500',
    name: 'Heavy Duty Stainless Steel Mesh Lint Filter Drawer',
    category: 'Heating & Steam',
    applicableCategoryIds: ['tumble-dryer'],
    compatibleBrands: ['Danube', 'Speed Queen', 'Domus', 'LG Commercial'],
    compatibleModelsText: 'Universal fit for 15kg - 35kg tumble dryers',
    compatibleMachineIds: ['speed-queen-st-055', 'danube-dd-silver-18', 'danube-dd-gold-35', 'lg-titan-pro-dryer-15'],
    stockStatus: 'In Stock',
    genuineOem: true,
    warranty: '6 Months Replacement',
    priceIndicator: 'In Stock',
    specifications: {
      Mesh: 'Fine woven stainless steel 80 mesh',
      Frame: 'Heat-resistant ABS frame with magnetic latch handle',
    },
    description: 'Ergonomic pull-out lint screen that traps over 98% of fabric lint, safeguarding exhaust ducting from fire hazards and clogs.',
    image: '/catalog/spare-parts-kit.jpg',
    images: [
      "/catalog/part-valve.jpg",
      "/catalog/spare-parts-kit.jpg",
      "/catalog/part-mechanical.jpg",
      "/catalog/part-electrical.jpg"
    ],
  },
  {
    id: 'part-steam-solenoid-valve',
    partNumber: 'STM-VAL-12',
    name: 'High Pressure Steam Solenoid Valve (1/2" & 3/4" BSP)',
    category: 'Heating & Steam',
    applicableCategoryIds: ['steam-press', 'flatwork-ironer', 'washer-extractor'],
    compatibleBrands: ['Danube', 'Fagor', 'SL-Tech Pro'],
    compatibleModelsText: 'Finishing press UP-42, form finishers, ironers, steam washers',
    compatibleMachineIds: ['sl-tech-press-up42', 'fagor-ff-shirt-pro', 'danube-polis-2000'],
    stockStatus: 'In Stock',
    genuineOem: true,
    warranty: '1 Year Warranty',
    priceIndicator: 'In Stock',
    specifications: {
      Pressure: 'Up to 10 Bar (145 PSI) steam pressure',
      Temperature: 'Up to 180°C saturated steam',
      Seal: 'PTFE Teflon seal with stainless steel piston',
    },
    description: 'Heavy forged brass steam solenoid valve designed specifically for instantaneous steam injection in presses, ironers, and commercial steam wash cycles.',
    image: '/catalog/spare-parts-kit.jpg',
    images: [
      "/catalog/part-valve.jpg",
      "/catalog/spare-parts-kit.jpg",
      "/catalog/part-mechanical.jpg",
      "/catalog/part-electrical.jpg"
    ],
  },

  // --- CONTROLS & PCB ---
  {
    id: 'part-nomex-belts-iron',
    partNumber: 'NMX-BLT-SET',
    name: 'High-Temperature Nomex Flatwork Ironing Belts',
    category: 'Mechanical & Drive',
    applicableCategoryIds: ['flatwork-ironer'],
    compatibleBrands: ['Danube', 'Girbau', 'Electrolux', 'Domus'],
    compatibleModelsText: 'Danube POLIS 2000, MICRA 1400, Girbau PB-3221',
    compatibleMachineIds: ['danube-polis-2000', 'danube-micra-1400', 'girbau-pb-3221'],
    stockStatus: 'In Stock',
    genuineOem: true,
    warranty: '1 Year Guarantee',
    priceIndicator: 'OEM Premium',
    specifications: {
      Material: '100% Pure Aramid Nomex fiber',
      HeatRating: 'Up to 240°C continuous ironing heat',
      Fastener: 'Stainless steel Clipper hook lacers included',
    },
    description: 'Premium heat-resistant Nomex feeding and ironing belts that provide smooth, mark-free linen transport across heated cylinders.',
    image: '/catalog/spare-parts-kit.jpg',
    images: [
      "/catalog/part-mechanical.jpg",
      "/catalog/spare-parts-kit.jpg",
      "/catalog/part-valve.jpg",
      "/catalog/part-electrical.jpg"
    ],
  },
  {
    id: 'part-ironer-guide-ribbon',
    partNumber: 'RBN-GUIDE-100M',
    name: 'Polyester & Nomex Guide Ribbon Roll (100 meters)',
    category: 'Mechanical & Drive',
    applicableCategoryIds: ['flatwork-ironer'],
    compatibleBrands: ['Danube', 'Girbau', 'Domus'],
    compatibleModelsText: 'Universal guide ribbon for all commercial flatwork ironers',
    compatibleMachineIds: ['danube-polis-2000', 'danube-micra-1400', 'girbau-pb-3221'],
    stockStatus: 'In Stock',
    genuineOem: true,
    warranty: 'Genuine Supply',
    priceIndicator: 'In Stock',
    specifications: {
      Width: '15 mm woven ribbon',
      Length: '100 meters per spool',
      Tension: 'Heat-stabilized against stretching',
    },
    description: 'Durable anti-stretch guide ribbons that ensure flat linen separates cleanly from the heated cylinder into the return table.',
    image: '/catalog/spare-parts-kit.jpg',
    images: [
      "/catalog/part-mechanical.jpg",
      "/catalog/spare-parts-kit.jpg",
      "/catalog/part-valve.jpg",
      "/catalog/part-electrical.jpg"
    ],
  },
  {
    id: 'part-ironer-gearbox-vfd',
    partNumber: 'GBX-IRN-VAR',
    name: 'Variable Speed Drive Motor & Planetary Gearbox Assembly',
    category: 'Mechanical & Drive',
    applicableCategoryIds: ['flatwork-ironer'],
    compatibleBrands: ['Danube', 'Girbau'],
    compatibleModelsText: 'Danube POLIS 2000, Girbau PB-3221',
    compatibleMachineIds: ['danube-polis-2000', 'girbau-pb-3221'],
    stockStatus: 'Fast Dispatch (24h)',
    genuineOem: true,
    warranty: '1 Year Warranty',
    priceIndicator: 'OEM Certified',
    specifications: {
      Ratio: 'High-torque reduction planetary gearbox',
      Motor: 'Inverter rated 1.5 kW 3-Phase',
    },
    description: 'Precision drive system allowing micro-speed adjustment from 1.5 to 8 meters/minute for optimal drying and ironing thickness.',
    image: '/catalog/spare-parts-kit.jpg',
    images: [
      "/catalog/part-mechanical.jpg",
      "/catalog/spare-parts-kit.jpg",
      "/catalog/part-valve.jpg",
      "/catalog/part-electrical.jpg"
    ],
  },
  {
    id: 'part-barrier-door-interlock',
    partNumber: 'INT-BAR-PNU',
    name: 'Cleanroom Dual Door Pneumatic Interlock Mechanism',
    category: 'Controls & PCB',
    applicableCategoryIds: ['barrier-washer'],
    compatibleBrands: ['Danube', 'Girbau'],
    compatibleModelsText: 'Danube ASEP-27, ASEP-50, Girbau BW series',
    compatibleMachineIds: ['danube-asep-27', 'danube-asep-50'],
    stockStatus: 'In Stock',
    genuineOem: true,
    warranty: '2 Years Warranty',
    priceIndicator: 'Hospital Grade',
    specifications: {
      Type: 'Pneumatic piston latch with redundant electrical microswitches',
      Safety: 'Fail-safe locking mechanism under air loss',
    },
    description: 'Certified medical-grade interlock ensuring that loading dirty doors and unloading clean doors can never unlock simultaneously.',
    image: '/catalog/spare-parts-kit.jpg',
    images: [
      "/catalog/part-electrical.jpg",
      "/catalog/spare-parts-kit.jpg",
      "/catalog/part-valve.jpg",
      "/catalog/part-mechanical.jpg"
    ],
  },
  {
    id: 'part-press-nomex-padding',
    partNumber: 'PAD-NOM-UP42',
    name: 'Utility Press Silicone Sponge & Nomex Cover Padding Set',
    category: 'Seals & Gaskets',
    applicableCategoryIds: ['steam-press'],
    compatibleBrands: ['Danube', 'Fagor', 'SL-Tech Pro'],
    compatibleModelsText: 'Universal utility press buck 42" x 19"',
    compatibleMachineIds: ['sl-tech-press-up42'],
    stockStatus: 'In Stock',
    genuineOem: true,
    warranty: '6 Months Replacement',
    priceIndicator: 'In Stock',
    specifications: {
      Includes: 'Perforated silicone foam pad, felt layer, Nomex cover with draw cord',
      Size: 'Standard 42-inch utility buck',
    },
    description: 'High-resilience steam-permeable padding set providing balanced steam distribution and wrinkle-free crease pressing.',
    image: '/catalog/spare-parts-kit.jpg',
    images: [
      "/catalog/part-mechanical.jpg",
      "/catalog/spare-parts-kit.jpg",
      "/catalog/part-valve.jpg",
      "/catalog/part-electrical.jpg"
    ],
  },
  {
    id: 'part-vacuum-motor-impeller',
    partNumber: 'VAC-MOT-075',
    name: 'Spotting Table & Press Vacuum Suction Blower Motor (0.75 kW)',
    category: 'Mechanical & Drive',
    applicableCategoryIds: ['steam-press'],
    compatibleBrands: ['Fagor', 'SL-Tech Pro'],
    compatibleModelsText: 'Press UP-42, Form finisher FF-PRO, spotting tables',
    compatibleMachineIds: ['sl-tech-press-up42', 'fagor-ff-shirt-pro'],
    stockStatus: 'In Stock',
    genuineOem: true,
    warranty: '1 Year Warranty',
    priceIndicator: 'In Stock',
    specifications: {
      Power: '0.75 kW (1.0 HP) 2,800 RPM',
      Voltage: '230V 1-Phase / 400V 3-Phase',
      Airflow: 'Instantaneous suction on foot pedal trigger',
    },
    description: 'Instant-start centrifugal vacuum motor that rapidly removes moisture and cools pressed garments to set the crease permanently.',
    image: '/catalog/spare-parts-kit.jpg',
    images: [
      "/catalog/part-mechanical.jpg",
      "/catalog/spare-parts-kit.jpg",
      "/catalog/part-valve.jpg",
      "/catalog/part-electrical.jpg"
    ],
  },
];
