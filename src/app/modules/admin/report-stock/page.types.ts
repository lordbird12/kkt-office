export interface InventoryProduct
{
    id: string;
    category?: string;
    name: string;
    description?: string;
    tags?: string[];
    sku?: string | null;
    barcode?: string | null;
    brand?: string | null;
    vendor: string | null;
    stock: number;
    reserved: number;
    cost: number;
    basePrice: number;
    taxPercent: number;
    price: number;
    weight: number;
    thumbnail: string;
    images: string[];
    active: boolean;
}

export interface InventoryPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface InventoryCategory
{
    id: string;
    parentId: string;
    name: string;
    slug: string;
}

export interface InventoryBrand
{
    id: string;
    name: string;
    slug: string;
}

export interface InventoryTag
{
    id?: string;
    title?: string;
}

export interface InventoryVendor
{
    id: string;
    name: string;
    slug: string;
}

export interface Employee
{
    id: string;
    code: string,
    first_name: string,
    last_name: string,
    phone: string,
    email: string,
    birthday: string,
    position_id: string,
    username: string
}

export interface PageEmployee
{
    length: number;
    perPage: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
    sortBy: number;
}

// pick-list.model.ts
export interface OrderItem {
  order_id: string;
  quantity: number;
}

export interface ProductSummary {
  product_id: string;
  product_name: string;
  sku: string;
  total_quantity: number;
  unit: string;
  orders: OrderItem[];
}

export interface PickList {
  date: string;
  total_orders: number;
  product_summary: ProductSummary[];
}

