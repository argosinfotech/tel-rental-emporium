export type EditClientTab =
  | "client-info"
  | "contract"
  | "projects"
  | "shipping"
  | "brands"
  | "categories"
  | "products"
  | "kits"
  | "client-logins"
  | "payment"
  | "inventory";

export const EDIT_CLIENT_TABS: { id: EditClientTab; label: string }[] = [
  { id: "client-info", label: "Client Info" },
  { id: "contract", label: "Contract" },
  { id: "projects", label: "Projects" },
  { id: "shipping", label: "Shipping Addresses" },
  { id: "brands", label: "Brands" },
  { id: "categories", label: "Categories" },
  { id: "products", label: "Products" },
  { id: "kits", label: "Kits" },
  { id: "client-logins", label: "Client Logins" },
  { id: "payment", label: "Payment Setting" },
  { id: "inventory", label: "Inventory Update" },
];

export const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

export type ClientInfo = {
  id: string;
  companyName: string;
  onboardingFee: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  stateCode: string;
  zip: string;
  paymentRequired: boolean;
  approvalRequired: boolean;
  rewardPortal: string;
  active: string;
  notes: string;
  companyLogo: string;
};

export type JobType = {
  id: string;
  jobType: string;
  freePulls: string;
  additionalPrice: string;
  usedPull: string;
  freePullsUsed: string;
  pullsRemaining: string;
  returnShipping: boolean;
  sendToShipStation: boolean;
  notes: string;
};

export type ContractFee = {
  monthlyFee: string;
  duration: string;
  startDate: string;
  endDate: string;
  notes: string;
};

export type Project = {
  id: string;
  name: string;
  notes: string;
};

export type ShippingAddress = {
  id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  stateCode: string;
  zip: string;
  groupName: string;
};

export type Brand = { id: string; name: string };
export type Category = { id: string; name: string };

export type Product = {
  id: string;
  itemNumber: string;
  itemName: string;
  brand: string;
  category: string;
  description1: string;
  description2: string;
  weight: string;
  availableStock: string;
  thresholdQty: string;
  imageUrl: string;
  vendorName: string;
  categoryName: string;
  retailPrice: string;
  rewardPoint: string;
  openingStock: string;
};

export type Kit = {
  id: string;
  name: string;
  width: string;
  height: string;
  imageUrl: string;
  productCount: number;
};

export type ClientLogin = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userRole: string;
  brand: string;
  approver: string;
};

export type PaymentSetting = {
  publishableKey: string;
  secretKey: string;
};

export type ClientBundle = {
  info: ClientInfo;
  contract: ContractFee;
  jobTypes: JobType[];
  projects: Project[];
  shippingAddresses: ShippingAddress[];
  brands: Brand[];
  categories: Category[];
  products: Product[];
  kits: Kit[];
  logins: ClientLogin[];
  payment: PaymentSetting;
};

const EVENT_LOUNGE: ClientBundle = {
  info: {
    id: "1",
    companyName: "The Event Lounge",
    onboardingFee: "250",
    firstName: "Alison",
    lastName: "Clem",
    email: "noreply@yopmail.com",
    phone: "(435) 678-8787",
    address1: "4425 Plano Parkway",
    address2: "",
    city: "Carrollton",
    stateCode: "TX",
    zip: "75010",
    paymentRequired: true,
    approvalRequired: true,
    rewardPortal: "Yes",
    active: "Yes",
    notes: "",
    companyLogo: "logo.png",
  },
  contract: {
    monthlyFee: "1900",
    duration: "1 Year",
    startDate: "2026-07-11",
    endDate: "07/10/2027",
    notes: "Test 2",
  },
  jobTypes: [
    {
      id: "jt1",
      jobType: "Pallet",
      freePulls: "100",
      additionalPrice: "90.00",
      usedPull: "5",
      freePullsUsed: "5",
      pullsRemaining: "95",
      returnShipping: true,
      sendToShipStation: true,
      notes: "",
    },
    {
      id: "jt2",
      jobType: "Flat Boxes",
      freePulls: "20",
      additionalPrice: "100.00",
      usedPull: "7",
      freePullsUsed: "7",
      pullsRemaining: "13",
      returnShipping: false,
      sendToShipStation: true,
      notes: "",
    },
    {
      id: "jt3",
      jobType: "Customize",
      freePulls: "10",
      additionalPrice: "200.00",
      usedPull: "0",
      freePullsUsed: "0",
      pullsRemaining: "10",
      returnShipping: false,
      sendToShipStation: false,
      notes: "",
    },
    {
      id: "jt4",
      jobType: "Pallet 2",
      freePulls: "100",
      additionalPrice: "90.00",
      usedPull: "0",
      freePullsUsed: "0",
      pullsRemaining: "100",
      returnShipping: true,
      sendToShipStation: true,
      notes: "Test",
    },
  ],
  projects: [{ id: "p1", name: "Window Type", notes: "" }],
  shippingAddresses: [
    {
      id: "s1",
      firstName: "James",
      lastName: "Parker",
      companyName: "",
      phone: "(214) 258-7896",
      address1: "4425 Plano Parkway Suite 904",
      address2: "",
      city: "Carrollton",
      stateCode: "TX",
      zip: "75010",
      groupName: "",
    },
  ],
  brands: [
    { id: "b1", name: "Promo 1" },
    { id: "b2", name: "Promo 2" },
    { id: "b3", name: "Promo 3" },
  ],
  categories: [{ id: "c1", name: "Promotional Items" }],
  products: [
    {
      id: "pr1",
      itemNumber: "EL01",
      itemName: "Metal Straw 2.5",
      brand: "Promo 1",
      category: "Promotional Items",
      description1: "Metal straw with lid",
      description2: "",
      weight: "0.00",
      availableStock: "981",
      thresholdQty: "0",
      imageUrl: "",
      vendorName: "",
      categoryName: "",
      retailPrice: "0",
      rewardPoint: "0",
      openingStock: "0",
    },
    {
      id: "pr2",
      itemNumber: "EL02",
      itemName: "Metal Shaker",
      brand: "Promo 2",
      category: "Promotional Items",
      description1: "Metal shaker bottle",
      description2: "",
      weight: "30.00",
      availableStock: "995",
      thresholdQty: "1",
      imageUrl: "",
      vendorName: "",
      categoryName: "",
      retailPrice: "0",
      rewardPoint: "0",
      openingStock: "0",
    },
  ],
  kits: [
    {
      id: "k1",
      name: "sample kit",
      width: "10",
      height: "12",
      imageUrl: "",
      productCount: 2,
    },
  ],
  logins: [
    {
      id: "l1",
      firstName: "Jason",
      lastName: "Black",
      email: "jasonblackus@gmail.com",
      userRole: "Full Access",
      brand: "",
      approver: "",
    },
    {
      id: "l2",
      firstName: "Eden",
      lastName: "Parker",
      email: "eden@yopmail.com",
      userRole: "Single Brand Only",
      brand: "Promo 1",
      approver: "No",
    },
    {
      id: "l3",
      firstName: "Kelvin",
      lastName: "Parker",
      email: "kelvin@yopmail.com",
      userRole: "Single Brand - selected item only",
      brand: "Promo 1",
      approver: "No",
    },
  ],
  payment: {
    publishableKey: "",
    secretKey: "",
  },
};

const EMPTY_CLIENT: ClientBundle = {
  info: {
    id: "new",
    companyName: "",
    onboardingFee: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    stateCode: "",
    zip: "",
    paymentRequired: true,
    approvalRequired: true,
    rewardPortal: "Yes",
    active: "Yes",
    notes: "",
    companyLogo: "",
  },
  contract: {
    monthlyFee: "",
    duration: "1 Year",
    startDate: "",
    endDate: "",
    notes: "",
  },
  jobTypes: [],
  projects: [],
  shippingAddresses: [],
  brands: [],
  categories: [],
  products: [],
  kits: [],
  logins: [],
  payment: { publishableKey: "", secretKey: "" },
};

/** Stable ids used by Active Clients list rows */
export const ACTIVE_CLIENT_IDS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
] as const;

export function getClientBundle(clientId: string): ClientBundle {
  if (clientId === "new") {
    return structuredClone(EMPTY_CLIENT);
  }
  if (clientId === "1") {
    return structuredClone(EVENT_LOUNGE);
  }
  // Other list rows: clone Event Lounge template with id overridden
  const clone = structuredClone(EVENT_LOUNGE);
  clone.info.id = clientId;
  return clone;
}

export function isValidTab(value: string | undefined): value is EditClientTab {
  return EDIT_CLIENT_TABS.some((t) => t.id === value);
}
