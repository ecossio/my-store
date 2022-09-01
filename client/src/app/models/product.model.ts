export interface Rating {
  rate: number;
  count: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  categories: Category[];
  price: number;
  images: string[];
  rating: Rating;
}

export interface CreateProductDTO
  extends Omit<Product, 'id' | 'categories' | 'rating'> {
  categoryId: number;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {}
