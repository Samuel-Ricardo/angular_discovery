export interface ImageUrls {
  thumbnail: string;
  owner: string;
  banner: string;
}

export interface MenuItem {
  name: string;
  price: number;
}

export interface Menu {
  lunch: MenuItem[];
  dinner: MenuItem[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Restaurant {
  name: string;
  slug: string;
  images: ImageUrls;
  menu: Menu;
  address: Address;
  _id: string;
}
