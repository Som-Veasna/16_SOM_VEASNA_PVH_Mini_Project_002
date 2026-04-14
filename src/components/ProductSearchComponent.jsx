"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function ProductSearchComponent({ 
  products, 
  onFilterChange, 
  categories,
  searchTerm 
}) {
  const [priceRange, setPriceRange] = useState([300]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const availableCategories = categories || [...new Set(products?.map(p => p.categoryName || p.category?.name).filter(Boolean))];
  const maxPrice = Math.max(...products?.map(p => p.price || 0), 300);
  const minPrice = 0;

  const handlePriceChange = (value) => {
    const newRange = value;
    setPriceRange(newRange);
    applyFilters({ min: 0, max: newRange[0] }, selectedCategories, searchTerm);
  };

  const handleQuickSelect = (max) => {
    const newRange = [max];
    setPriceRange(newRange);
    applyFilters({ min: 0, max }, selectedCategories, searchTerm);
  };

  const handleCategoryToggle = (category) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newCategories);
    applyFilters({ min: 0, max: priceRange[0] }, newCategories, searchTerm);
  };

  const handleReset = () => {
    const resetRange = [maxPrice];
    setPriceRange(resetRange);
    setSelectedCategories([]);
    applyFilters({ min: 0, max: maxPrice }, [], searchTerm);
  };

  const applyFilters = (currentPriceRange, currentCategories, currentSearch) => {
    let filtered = products;

    // Apply price filter
    filtered = filtered.filter(product => {
      const price = product.price || 0;
      return price >= currentPriceRange.min && price <= currentPriceRange.max;
    });
    if (currentCategories.length > 0) {
      filtered = filtered.filter(product => {
        const productCategory = product.categoryName || product.category?.name;
        return currentCategories.includes(productCategory);
      });
    }

    if (currentSearch?.trim()) {
      const searchLower = currentSearch.toLowerCase();
      filtered = filtered.filter(product => {
        const productName = (product.name || product.productName || "").toLowerCase();
        const description = (product.description || "").toLowerCase();
        return productName.includes(searchLower) || description.includes(searchLower);
      });
    }

    onFilterChange(filtered);
  };

  const getCategoryCount = (category) => {
    return products?.filter(p => (p.categoryName || p.category?.name) === category).length || 0;
  };

  const quickSelectOptions = [
    { label: "Under $50", value: 50 },
    { label: "Under $100", value: 100 },
    { label: "Under $150", value: 150 },
    { label: "All prices", value: maxPrice },
  ];

  return (
    <div className="w-full lg:w-80 flex-shrink-0">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            onClick={handleReset}
            className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
          >
            Reset filters
          </button>
        </div>

        <div className="mb-6">
          <Label className="mb-3 block text-sm font-medium text-gray-700">
            Price Range
          </Label>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm text-gray-600">${minPrice}</span>
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={maxPrice}
              step={1}
              className="flex-1"
            />
            <span className="text-sm text-gray-600">${maxPrice}</span>
          </div>
          <p className="text-xs text-gray-500">
            Max price: ${priceRange[0]}
          </p>
        </div>

        {/* Quick Select */}
        <div className="mb-6">
          <Label className="mb-3 block text-sm font-medium text-gray-700">
            Quick Select
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {quickSelectOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleQuickSelect(option.value)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  priceRange[0] === option.value
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>


        <div>
          <Label className="mb-3 block text-sm font-medium text-gray-700">
            Categories
          </Label>
          <div className="space-y-3">
            {availableCategories.length > 0 ? (
              availableCategories.map((category) => (
                <div key={category} className="flex items-center space-x-3">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <Label 
                    htmlFor={`category-${category}`}
                    className="text-sm text-gray-700 cursor-pointer flex-1"
                  >
                    {category}
                    <span className="ml-2 text-xs text-gray-500">
                      ({getCategoryCount(category)})
                    </span>
                  </Label>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No categories available</p>
            )}
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Select none to include all categories.
          </p>
        </div>
      </div>
    </div>
  );
}
