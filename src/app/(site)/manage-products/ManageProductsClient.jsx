"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createProduct, updateProduct, deleteProduct } from "../../service/service";
import { Button } from "@heroui/react";
import { useCart } from "../../context/CartContext";

function StarsDisplay({ rating = 0 }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`h-3 w-3 ${i < full || (i === full && half) ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-100"}`}
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
  const [items, setItems] = useState(initialProducts);
  const [sorted, setSorted] = useState(initialProducts);
  const [sortBy, setSortBy] = useState("name-asc");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const [fields, setFields] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    imageUrl: "",
    colors: ["Blue", "Red", "Gray"],
    sizes: ["S", "M", "L", "XL"],
  });

  useEffect(() => {
    let copy = [...items];
    if (sortBy === "name-asc") copy.sort((a, b) => (a.name || a.productName || "").localeCompare(b.name || b.productName || ""));
    if (sortBy === "name-desc") copy.sort((a, b) => (b.name || b.productName || "").localeCompare(a.name || a.productName || ""));
    if (sortBy === "price-asc") copy.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortBy === "price-desc") copy.sort((a, b) => (b.price || 0) - (a.price || 0));
    setSorted(copy);
  }, [items, sortBy]);

  useEffect(() => {
    const close = (e) => {
      if (openMenu && !e.target.closest(".menu-wrap")) setOpenMenu(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [openMenu]);

  const openAdd = () => {
    setEditing(null);
    setFields({ name: "", description: "", price: "", categoryId: categories[0]?.categoryId || "", imageUrl: "", colors: ["blue", "red", "gray"], sizes: ["s", "m", "l", "xl"] });
    setModalOpen(true);
  };

  const openEdit = (prod) => {
    setEditing(prod);
    setFields({
      name: prod.name || prod.productName || "",
      description: prod.description || "",
      price: prod.price || "",
      categoryId: prod.categoryId || "",
      imageUrl: prod.imageUrl || "",
      colors: prod.colors || ["blue", "red", "gray"],
      sizes: prod.sizes || ["s", "m", "l", "xl"],
    });
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFields((prev) => {
        const arr = prev[name] || [];
        return { ...prev, [name]: checked ? [...arr, value] : arr.filter((x) => x !== value) };
      });
    } else {
      setFields((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        name: fields.name,
        description: fields.description,
        price: parseFloat(fields.price),
        categoryId: fields.categoryId,
        imageUrl: fields.imageUrl,
        colors: fields.colors,
        sizes: fields.sizes,
      };

      if (editing) {
        await updateProduct(editing.productId || editing.id, body, accessToken);
        setItems((prev) => prev.map((p) => (p.productId || p.id) === (editing.productId || editing.id) ? { ...p, ...body } : p));
      } else {
        const res = await createProduct(body, accessToken);
        if (res?.payload) setItems((prev) => [...prev, res.payload]);
      }
      closeModal();
    } catch (err) {
      alert(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (pid) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(pid, accessToken);
      setItems((prev) => prev.filter((p) => (p.productId || p.id) !== pid));
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  const quickAdd = (prod, e) => {
    e.stopPropagation();
    addToCart({ productId: prod.productId || prod.id, productName: prod.name || prod.productName, price: prod.price, imageUrl: prod.imageUrl });
  };

  const getCatName = (cid) => {
    const found = categories.find((c) => c.categoryId === cid || c.id === cid);
    return found?.name || found?.categoryName || "Uncategorized";
  };

  return (
    <div className="mx-auto w-full max-w-7xl py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <p className="mt-1 text-gray-400">Create, edit and delete products (local state only).</p>
      </div>

      <div className="mb-6 flex items-center justify-end gap-3">
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none rounded-full border border-gray-200 bg-gray-50 px-4 py-2 pr-10 text-sm text-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
          >
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-violet-500"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New product
        </button>
      </div>

      {sorted.length > 0 ? (
        <div className="grid grid-cols-3 gap-6">
          {sorted.map((prod) => {
            const pid = prod.productId || prod.id;
            const pname = prod.name || prod.productName;
            const stars = prod.star || prod.rating || 4.0;

            return (
              <div key={pid} className="group relative rounded-xl bg-white">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
                  {prod.imageUrl ? (
                    <Image src={prod.imageUrl} alt={pname} fill className="object-cover" sizes="33vw" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-300">
                      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  <div className="menu-wrap absolute right-2 top-2">
                    <button
                      onClick={() => setOpenMenu(openMenu === pid ? null : pid)}
                      className="rounded-full bg-white/90 p-1.5 text-gray-500 shadow-sm hover:bg-white"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="6" r="2" />
                        <circle cx="12" cy="12" r="2" />
                        <circle cx="12" cy="18" r="2" />
                      </svg>
                    </button>
                    {openMenu === pid && (
                      <div className="absolute right-0 top-full z-10 mt-1 w-32 rounded-xl border border-gray-100 bg-white py-1 shadow-xl">
                        <button
                          onClick={() => { openEdit(prod); setOpenMenu(null); }}
                          className="flex w-full items-center px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => { onDelete(pid); setOpenMenu(null); }}
                          className="flex w-full items-center px-3 py-2 text-left text-sm text-rose-500 hover:bg-rose-50"
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

                <div className="mt-3 px-1">
                  <StarsDisplay rating={stars} />
                  <div className="flex items-center justify-between mt-1">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{pname}</h3>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-900">${prod.price}</p>
                    <button
                      onClick={(e) => quickAdd(prod, e)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-white shadow-sm hover:bg-violet-500 transition-colors"
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
          <p className="text-gray-400">No products yet.</p>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{editing ? "Edit product" : "New product"}</h2>
                <p className="text-sm text-gray-400">Local state only — resets on refresh.</p>
              </div>
              <button onClick={closeModal} className="rounded-full p-1 text-gray-300 hover:bg-gray-100 hover:text-gray-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">Name</label>
                  <input type="text" name="name" value={fields.name} onChange={onChange} required placeholder="Product name" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 focus:border-violet-500 focus:bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">Price</label>
                  <input type="number" name="price" value={fields.price} onChange={onChange} required min="0" step="0.01" placeholder="0.00" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 focus:border-violet-500 focus:bg-white focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">Category</label>
                  <select name="categoryId" value={fields.categoryId} onChange={onChange} required className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 focus:border-violet-500 focus:bg-white focus:outline-none appearance-none">
                    <option value="">Select...</option>
                    {categories.map((c) => (
                      <option key={c.categoryId || c.id} value={c.categoryId || c.id}>{c.name || c.categoryName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">Image URL</label>
                  <input type="url" name="imageUrl" value={fields.imageUrl} onChange={onChange} placeholder="https://..." className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 focus:border-violet-500 focus:bg-white focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-700">Colors</label>
                <div className="flex flex-wrap gap-2">
                  {["green", "gray", "red", "blue", "white"].map((c) => (
                    <label key={c} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" name="colors" value={c} checked={fields.colors.includes(c)} onChange={onChange} className="h-4 w-4 rounded border-gray-200 text-violet-600 focus:ring-violet-400" />
                      <span className="text-sm text-gray-700 capitalize">{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-700">Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {["s", "m", "l", "xl", "xxl", "xxxl"].map((s) => (
                    <label key={s} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" name="sizes" value={s} checked={fields.sizes.includes(s)} onChange={onChange} className="h-4 w-4 rounded border-gray-200 text-violet-600 focus:ring-violet-400" />
                      <span className="text-sm text-gray-700 uppercase">{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-700">Description</label>
                <textarea name="description" value={fields.description} onChange={onChange} rows={4} placeholder="Short product description..." className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 focus:border-violet-500 focus:bg-white focus:outline-none resize-none" />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 rounded-full border border-gray-200 px-6 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 rounded-full bg-violet-600 px-6 py-3 text-sm font-bold text-white hover:bg-violet-500 disabled:opacity-50">
                  {saving ? "Saving..." : editing ? "Save changes" : "Create product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}