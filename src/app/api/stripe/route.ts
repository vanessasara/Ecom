import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { client, UrlFor } from '@/lib/client';
import { CartItem } from '@/types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

const fetchProductDetails = async (productIds: string[]) => {
  const query = `*[_type == "product" && _id in $productIds]`;
  const params = { productIds };
  const products = await client.fetch(query, params);
  return products.map((product: any) => ({
    ...product,
    imageUrl: UrlFor(product.image),
  }));
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { cartItems }: { cartItems: CartItem[] } = req.body;
      const productIds = cartItems.map((item) => item.product_id);
      const products = await fetchProductDetails(productIds);

      const lineItems = cartItems.map((item) => {
        const product = products.find((p) => p._id === item.product_id);
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product?.name,
            },
            unit_amount: product?.price * 100, // Assuming price is in USD and in dollars
          },
          quantity: item.quantity,
        };
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/cancel`,
      });

      res.status(200).json({ id: session.id });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: 'Error creating checkout session' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
