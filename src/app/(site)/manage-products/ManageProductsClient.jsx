"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createProduct, updateProduct, deleteProduct } from "../../service/service";
import { Button } from "@heroui/react";
import { useCart } from "../../context/CartContext";

function StarRating({ rating = 0 }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`h-3 w-3 ${
            i < fullStars || (i === fullStars && hasHalfStar)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ManageProductsClient({ initialProducts, categories, accessToken }) {
  const { addToCart } = useCart();
  const [products, setProducts] = useState(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [sortOption, setSortOption] = useState("name-asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    imageUrl: "",
    colors: ["Blue", "Red", "Gray"],
    sizes: ["S", "M", "L", "XL"],
  });

  // Sort products
  useEffect(() => {
    let sorted = [...products];
    
    switch (sortOption) {
      case "name-asc":
        sorted.sort((a, b) => (a.name || a.productName || "").localeCompare(b.name || b.productName || ""));
        break;
      case "name-desc":
        sorted.sort((a, b) => (b.name || b.productName || "").localeCompare(a.name || a.productName || ""));
        break;
      case "price-asc":
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-desc":
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default:
        break;
    }
    
    setFilteredProducts(sorted);
  }, [products, sortOption]);

  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showOptionsMenu && !event.target.closest('.options-menu-container')) {
        setShowOptionsMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showOptionsMenu]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      categoryId: categories[0]?.categoryId || "",
      imageUrl: "",
      colors: ["blue", "red", "gray"],
      sizes: ["s", "m", "l", "xl"],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || product.productName || "",
      description: product.description || "",
      price: product.price || "",
      categoryId: product.categoryId || "",
      imageUrl: product.imageUrl || "",
      colors: product.colors || ["blue", "red", "gray"],
      sizes: product.sizes || ["s", "m", "l", "xl"],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      // Handle checkbox arrays for colors and sizes
      setFormData((prev) => {
        const currentArray = prev[name] || [];
        if (checked) {
          return { ...prev, [name]: [...currentArray, value] };
        } else {
          return { ...prev, [name]: currentArray.filter((item) => item !== value) };
        }
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        categoryId: formData.categoryId,
        imageUrl: formData.imageUrl,
        colors: formData.colors,
        sizes: formData.sizes,
      };

      if (editingProduct) {
        await updateProduct(
          editingProduct.productId || editingProduct.id,
          productData,
          accessToken
        );
        
        setProducts((prev) =>
          prev.map((p) =>
            (p.productId || p.id) === (editingProduct.productId || editingProduct.id)
              ? { ...p, ...productData }
              : p
          )
        );
      } else {
        const result = await createProduct(productData, accessToken);
        if (result?.payload) {
          setProducts((prev) => [...prev, result.payload]);
        }
      }

      closeModal();
    } catch (error) {
      console.error("Failed to save product:", error);
      alert(error.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await deleteProduct(productId, accessToken);
      setProducts((prev) => prev.filter((p) => (p.productId || p.id) !== productId));
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert(error.message || "Failed to delete product");
    }
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    const productToAdd = {
      productId: product.productId || product.id,
      productName: product.name || product.productName,
      price: product.price,
      imageUrl: product.imageUrl,
    };
    addToCart(productToAdd);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.categoryId === categoryId || c.id === categoryId);
    return category?.name || category?.categoryName || "Uncategorized";
  };

  return (
    <div className="mx-auto w-full max-w-7xl py-10 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Manage Products</h1>
        <p className="mt-2 text-gray-600">Create, update, and delete products in this demo (local state only).</p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex items-center justify-end">
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Sort</span>
            <div className="relative">
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="appearance-none rounded-full border border-gray-200 bg-gray-50 px-4 py-2 pr-10 text-sm text-gray-700 focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-200"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-lime-300"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create product
          </button>
        </div>
      </div>

      {/* Products Section */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Products</h2>
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => {
              const productId = product.productId || product.id;
              const productName = product.name || product.productName;
              const rating = product.star || product.rating || Math.random() * 2 + 3; // Random rating between 3-5 if not set
              
              return (
                <div
                  key={productId}
                  className="group relative rounded-xl bg-white transition"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={productName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* 3 Dots Menu Button */}
                    <div className="options-menu-container absolute right-3 top-3">
                      <button
                        onClick={() => setShowOptionsMenu(showOptionsMenu === productId ? null : productId)}
                        className="rounded-full bg-white/90 p-1.5 text-gray-600 shadow-sm backdrop-blur-sm hover:bg-white"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="6" r="2" />
                          <circle cx="12" cy="12" r="2" />
                          <circle cx="12" cy="18" r="2" />
                        </svg>
                      </button>
                      
                      {/* Options Dropdown */}
                      {showOptionsMenu === productId && (
                        <div className="absolute right-0 top-full z-10 mt-1 w-32 rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
                          <button
                            onClick={() => {
                              openEditModal(product);
                              setShowOptionsMenu(null);
                            }}
                            className="flex w-full items-center px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              handleDelete(productId);
                              setShowOptionsMenu(null);
                            }}
                            className="flex w-full items-center px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                          >
                            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="mt-3 px-1">
                    {/* Star Rating */}
                    <div className="mb-1">
                      <StarRating rating={rating} />
                    </div>
                    
                    {/* Name and Price Row */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{productName}</h3>
                    </div>
                    
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">${product.price}</p>
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-lime-500 text-white shadow-sm hover:bg-lime-600 transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500">No products found.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingProduct ? "Edit product" : "Create product"}
                </h2>
                <p className="text-sm text-gray-500">Demo CRUD only (local state). Refresh resets changes.</p>
              </div>
              <button
                onClick={closeModal}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:border-lime-500 focus:bg-white focus:outline-none"
                    placeholder="e.g. Tea-Trica BHA Foam"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:border-lime-500 focus:bg-white focus:outline-none"
                    placeholder="e.g. 62"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 focus:border-lime-500 focus:bg-white focus:outline-none appearance-none"
                  >
                    <option value="">Select...</option>
                    {categories.map((category) => (
                      <option 
                        key={category.categoryId || category.id} 
                        value={category.categoryId || category.id}
                      >
                        {category.name || category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Image URL (optional)</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:border-lime-500 focus:bg-white focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Colors</label>
                <div className="flex flex-wrap gap-2">
                  {["green", "gray", "red", "blue", "white"].map((color) => (
                    <label key={color} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        name="colors"
                        value={color}
                        checked={formData.colors.includes(color)}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300 text-lime-500 focus:ring-lime-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">{color}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {["s", "m", "l", "xl", "xxl", "xxxl"].map((size) => (
                    <label key={size} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        name="sizes"
                        value={size}
                        checked={formData.sizes.includes(size)}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300 text-lime-500 focus:ring-lime-500"
                      />
                      <span className="text-sm text-gray-700 uppercase">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:border-lime-500 focus:bg-white focus:outline-none resize-none"
                  placeholder="Short description shown on the product card..."
                />
              </div>

              <div className="mt-8 flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-full bg-lime-400 px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-lime-300 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingProduct ? "Save changes" : "Create product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
