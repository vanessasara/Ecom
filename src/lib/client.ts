import { createClient } from 'next-sanity'
import  imageUrlBuilder  from '@sanity/image-url';
import { apiVersion, dataset, projectId, useCdn } from '../../sanity/env'
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion:'2024-06-14',
  useCdn:true,
  perspective: 'published',
  token:process.env.NEXT_PUBLIC_SANITY_TOKEN
})



const builder = imageUrlBuilder(client);

export const UrlFor =(source:SanityImageSource) => builder.image(source);