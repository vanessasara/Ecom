import Filter from "@/app/components/Filter";
import { Skeleton } from "@/app/components/ui/skeleton";
import { client, UrlFor } from "@/lib/client";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

const ListPage = async ({ searchParams }: { searchParams: any }) => {
  const query = searchParams.query || '';
  const categoryQuery = searchParams.cat || "all-products";

  const productsQuery = query
    ? `*[_type == "product" && name match "${query}*"]`
    : '*[_type == "product"]';

  const products = await client.fetch(productsQuery);
  const category = await client.fetch(`*[_type == "category" && slug.current == "${categoryQuery}"]`);

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
      {/* CAMPAIGN */}
      <div className="hidden bg-pink-50 px-4 sm:flex justify-between h-64">
        <div className="w-2/3 flex flex-col items-center justify-center gap-8">
          <h1 className="text-4xl font-semibold leading-[48px] text-gray-700">
            Grab up to 50% off on
            <br /> Selected Products
          </h1>
          <button className="rounded-3xl bg-lama text-white w-max py-3 px-5 text-sm">
            Buy Now
          </button>
        </div>
        <div className="relative w-1/3">
          <Image
            src="/woman.png"
            height={400}
            width={255}
            alt=""
            className="object-contain" />
        </div>
      </div>
      {/* FILTER */}
      <Filter />
      {/* PRODUCTS */}
      <h1 className="mt-12 text-xl font-semibold">{category[0]?.name} For You!</h1>
      <Suspense fallback={<Skeleton />}>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {products.length === 0 ? (
            <div>No products available</div>
          ) : (
            products.map((product: any) => {
              const imageUrl = product.image && product.image[0] ? UrlFor(product.image[0]).url() : '';

              return (
                <Link
                  href={`/product/${product.slug.current}`}
                  key={product._id}
                >
                  <div className="product-card flex flex-col items-center">
                    {imageUrl && (
                      <Image
                        height={300}
                        width={500}
                        src={imageUrl}
                        className="max-h-[250px] max-w-[500px] object-contain rounded-xl mb-4"
                        alt={product.name}
                      />
                    )}
                    <p className="product-name">{product.name}</p>
                    <p className="product-price">${product.price}</p>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </Suspense>
    </div>
  );
};

export default ListPage;
