export interface Rating {
  rate: number;
  count: number;
}

export interface Category {
  id: number;
  name: string;
  typeImg: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: Category;
  price: number;
  images: string[];
  rating: Rating;
}

export interface CreateProductDTO
  extends Omit<Product, 'id' | 'category' | 'rating'> {
  categoryId: number;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {}
