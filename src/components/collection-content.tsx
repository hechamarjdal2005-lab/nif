"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <Input
            placeholder="Rechercher un parfum..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 bg-dark-50"
          />
        </div>
      </div>

      {/* Genre Filter */}
      {showGenreFilter && (
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { value: "all", label: "Tout" },
            { value: "homme", label: "Homme" },
            { value: "femme", label: "Femme" },
            { value: "mixte", label: "Mixte" },
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
                selectedGenre !== g.value && "border-dark-200 text-dark-500 hover:text-gold hover:border-gold/30"
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
              selectedCategory !== "all" && "border-dark-200 text-dark-500 hover:text-gold hover:border-gold/30"
            )}
          >
            Toutes catégories
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
                selectedCategory !== cat.id && "border-dark-200 text-dark-500 hover:text-gold hover:border-gold/30"
              )}
            >
              {cat.nom}
            </Button>
          ))}
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-dark-500 mb-5">
        {filteredProducts.length} produit{filteredProducts.length !== 1 ? "s" : ""} trouvé{filteredProducts.length !== 1 ? "s" : ""}
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
          title="Aucun produit trouvé"
          description="Essayez de modifier vos filtres de recherche."
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
