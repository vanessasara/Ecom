import { type SchemaTypeDefinition } from 'sanity'
import product from './product'
import banner from './banner'
import { category } from './category'
import productcategory from './productcategory'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, banner,category,productcategory],
}
