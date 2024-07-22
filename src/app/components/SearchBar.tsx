

'use client';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useState, ChangeEvent, useEffect, useRef } from "react";
import { AiOutlineSearch, AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDebouncedCallback } from 'use-debounce';
import { client, UrlFor } from '@/lib/client';
import Image from "next/image";

interface ProductType {
  _id: string;
  name: string;
  slug: { current: string };
  image: { asset: { _ref: string } }[];
}

export const SearchBar = ({ placeholder }: { placeholder: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace, push } = useRouter();
  const [isSearching, startTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<ProductType[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams?.get('query')?.toString() || '');
  const searchRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = async (term: string) => {
    if (term) {
      const products = await client.fetch(
        `*[_type == "product" && name match "${term}*"]{
          _id,
          name,
          slug,
          image
        }`
      );
      setSuggestions(products);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
    fetchSuggestions(term);
  }, 300);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handleSearch(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      push(`/list?query=${searchTerm}`);
      setSuggestions([]); // Hide suggestions on enter
    }
  };

  const handleSuggestionClick = (slug: string) => {
    push(`/product/${slug}`);
    setSuggestions([]); // Hide suggestions on selection
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
      setSuggestions([]); // Hide suggestions when clicking outside
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full h-14 flex flex-col bg-white" ref={searchRef}>
      <div className="relative h-14 z-10 rounded-md">
        <Input
          placeholder={placeholder}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          defaultValue={searchTerm}
        />
        <Button
          disabled={isSearching}
          className="absolute right-0 inset-y-0 h-md rounded-l-none"
        >
          {isSearching ? <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" /> : <AiOutlineSearch className="h-6 w-6" />}
        </Button>
      </div>
      {suggestions.length > 0 && (
        <div className="absolute top-14 w-full bg-white shadow-lg rounded-md z-20">
          {suggestions.map((product) => (
            <div
              key={product._id}
              className="flex items-center p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSuggestionClick(product.slug.current)}
            >
              <Image
                src={UrlFor(product.image[0]).url()}
                height={50}
                width={50}
                alt={product.name}
                className="object-cover mr-2"
              />
              <span>{product.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
