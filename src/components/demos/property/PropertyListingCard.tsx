import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, MapPin, Maximize2 } from "lucide-react";
import type { PropertyListing } from "@/lib/demo-sites/property-data";

export default function PropertyListingCard({
  listing,
  basePath,
}: {
  listing: PropertyListing;
  basePath: string;
}) {
  return (
    <Link
      href={`${basePath}/properties/${listing.slug}`}
      className="group overflow-hidden rounded-2xl border border-[#92400E]/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={listing.image}
          alt={listing.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <span className="absolute left-3 top-3 rounded-full bg-[#92400E] px-3 py-1 text-xs font-medium text-[#FFFBEB]">
          {listing.type}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-1.5 text-xs text-[#92400E]">
          <MapPin className="h-3.5 w-3.5" />
          {listing.district}
        </div>
        <h3 className="mt-2 font-serif text-lg font-semibold text-[#1C1917] group-hover:text-[#92400E]">
          {listing.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-[#57534E]">{listing.summary}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#78716C]">
          {listing.beds > 0 && (
            <span className="inline-flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" />
              {listing.beds} 房
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" />
            {listing.baths} 廁
          </span>
          <span className="inline-flex items-center gap-1">
            <Maximize2 className="h-3.5 w-3.5" />
            {listing.area.toLocaleString()} 呎
          </span>
        </div>
        <p className="mt-4 text-xl font-bold text-[#92400E]">{listing.priceLabel}</p>
      </div>
    </Link>
  );
}
