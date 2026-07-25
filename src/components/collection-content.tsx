"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, getLocalizedField } from "@/lib/i18n";
import type { Product, Category } from "@/lib/types";

interface CollectionContentProps {
  products: Product[];
  categories: Category[];
  initialGenre?: string;
  showGenreFilter?: boolean;
  title?: string;
}

const ITEMS_PER_PAGE = 8;

export function CollectionContent({
  products,
  categories,
  initialGenre,
  showGenreFilter = true,
}: CollectionContentProps) {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>(initialGenre || "all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const { locale } = useLanguage();
  const ar = locale === "ar";

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !search ||
        p.nom.toLowerCase().includes(search.toLowerCase()) ||
        (p.notes_olfactives && p.notes_olfactives.toLowerCase().includes(search.toLowerCase()));
      const matchesGenre = selectedGenre === "all" || p.genre === selectedGenre;
      const matchesCategory = selectedCategory === "all" || p.categorie_id === selectedCategory;
      return matchesSearch && matchesGenre && matchesCategory;
    });
  }, [products, search, selectedGenre, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
          <Input
            placeholder={getTranslation(locale, "collection.search")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 bg-surface-container-low"
          />
        </div>
      </div>

      {/* Genre Filter */}
      {showGenreFilter && (
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { value: "all", label: getTranslation(locale, "collection.all") },
            { value: "homme", label: getTranslation(locale, "collection.homme") },
            { value: "femme", label: getTranslation(locale, "collection.femme") },
            { value: "mixte", label: getTranslation(locale, "collection.mixte") },
          ].map((g) => (
            <Button
              key={g.value}
              variant={selectedGenre === g.value ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedGenre(g.value);
                setCurrentPage(1);
              }}
              className={cn(
                selectedGenre !== g.value && "border-outline-variant text-secondary hover:text-primary hover:border-primary/30"
              )}
            >
              {g.label}
            </Button>
          ))}
        </div>
      )}

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedCategory("all");
              setCurrentPage(1);
            }}
            className={cn(
              selectedCategory !== "all" && "border-outline-variant text-secondary hover:text-primary hover:border-primary/30"
            )}
            >
              {getTranslation(locale, "collection.allCategories")}
            </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentPage(1);
              }}
              className={cn(
                selectedCategory !== cat.id && "border-outline-variant text-secondary hover:text-primary hover:border-primary/30"
              )}
            >
              {cat.nom}
            </Button>
          ))}
        </div>
      )}

      {/* Results count */}
      <p className={`text-sm text-secondary mb-5 ${ar ? "font-arabic" : ""}`}>
        {getTranslation(locale, "collection.results").replace("{count}", String(filteredProducts.length))}
      </p>

      {/* Products Grid */}
      {paginatedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={getTranslation(locale, "collection.emptyTitle")}
          description={getTranslation(locale, "collection.emptyDesc")}
        />
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
