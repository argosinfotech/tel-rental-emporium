export type EditClientTab =
  | "client-info"
  | "projects"
  | "shipping"
  | "brands"
  | "categories"
  | "products"
  | "kits"
  | "client-logins"
  | "inventory";

export const EDIT_CLIENT_TABS: { id: EditClientTab; label: string }[] = [
  { id: "client-info", label: "Client Info" },
  { id: "projects", label: "Projects" },
  { id: "shipping", label: "Shipping Addresses" },
  { id: "brands", label: "Brands" },
  { id: "categories", label: "Categories" },
  { id: "products", label: "Products" },
  { id: "kits", label: "Kits" },
  { id: "client-logins", label: "Client Logins" },
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
  costPrice: string;
  openingStock: string;
  availableForRent: boolean;
  rentalPrice: string;
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
};

export type ClientBundle = {
  info: ClientInfo;
  projects: Project[];
  shippingAddresses: ShippingAddress[];
  brands: Brand[];
  categories: Category[];
  products: Product[];
  kits: Kit[];
  logins: ClientLogin[];
};

const EVENT_LOUNGE: ClientBundle = {
  info: {
    id: "1",
    companyName: "The Event Lounge",
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
    notes: "",
  },
  projects: [
    { id: "p1", name: "AWS", notes: "" },
    { id: "p2", name: "Cloud Integration", notes: "" },
  ],
  shippingAddresses: [
    {
      id: "s1",
      firstName: "Alison",
      lastName: "Clem",
      companyName: "The Event Lounge",
      phone: "(435) 678-8787",
      address1: "4425 Plano Parkway",
      address2: "Suite 100",
      city: "Carrollton",
      stateCode: "TX",
      zip: "75010",
      groupName: "",
    },
  ],
  brands: [
    { id: "b1", name: "Apple" },
    { id: "b2", name: "MartrixCare" },
    { id: "b3", name: "Samsung" },
  ],
  categories: [
    { id: "c1", name: "Event Promotion" },
    { id: "c2", name: "Office Supplies" },
  ],
  products: [
    {
      id: "pr1",
      itemNumber: "0021",
      itemName: "iPhoneX",
      brand: "Apple",
      category: "Event Promotion",
      description1: "Fountain Pen",
      description2: "",
      weight: "0.50",
      availableStock: "5000",
      thresholdQty: "0",
      imageUrl: "",
      vendorName: "",
      categoryName: "",
      retailPrice: "0",
      costPrice: "0",
      openingStock: "5000",
      availableForRent: false,
      rentalPrice: "",
    },
    {
      id: "pr2",
      itemNumber: "0203",
      itemName: "Apple Laptops",
      brand: "Apple",
      category: "Office Supplies",
      description1: "iphone 14",
      description2: "",
      weight: "3.00",
      availableStock: "5200",
      thresholdQty: "1",
      imageUrl: "",
      vendorName: "",
      categoryName: "",
      retailPrice: "0",
      costPrice: "0",
      openingStock: "5200",
      availableForRent: false,
      rentalPrice: "",
    },
  ],
  kits: [
    {
      id: "k1",
      name: "Event - Company",
      width: "50",
      height: "70",
      imageUrl: "",
      productCount: 2,
    },
  ],
  logins: [
    {
      id: "l1",
      firstName: "Alison",
      lastName: "Clem",
      email: "alison@yopmail.com",
      userRole: "Full Access",
      brand: "",
    },
  ],
};

const EMPTY_CLIENT: ClientBundle = {
  info: {
    id: "new",
    companyName: "",
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
    notes: "",
  },
  projects: [],
  shippingAddresses: [],
  brands: [],
  categories: [],
  products: [],
  kits: [],
  logins: [],
};

export function getClientBundle(clientId: string): ClientBundle {
  if (clientId === "new") {
    return structuredClone(EMPTY_CLIENT);
  }
  if (clientId === "1") {
    return structuredClone(EVENT_LOUNGE);
  }
  const clone = structuredClone(EVENT_LOUNGE);
  clone.info.id = clientId;
  return clone;
}

export function isValidTab(value: string | undefined): value is EditClientTab {
  return EDIT_CLIENT_TABS.some((t) => t.id === value);
}
