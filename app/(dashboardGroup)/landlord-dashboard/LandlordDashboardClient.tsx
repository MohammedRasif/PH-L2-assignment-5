"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getPropertiesAction,
  getCategoriesAction,
  createPropertyAction,
  updatePropertyAction,
  deletePropertyAction,
} from "@/app/actions/propertyActions";
import {
  Building2,
  Clock,
  CheckCircle2,
  User,
  RefreshCw,
  PlusCircle,
  Upload,
  Image as ImageIcon,
  Edit2,
  Trash2,
  MapPin,
  X,
  AlertCircle,
  Check,
  ToggleLeft,
  ToggleRight,
  Link as LinkIcon,
} from "lucide-react";

interface LandlordDashboardClientProps {
  user: any;
}

export default function LandlordDashboardClient({ user }: LandlordDashboardClientProps) {
  // Landlord Properties state
  const [myProperties, setMyProperties] = useState<any[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(null);

  // Upload / Edit Property Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [submittingProperty, setSubmittingProperty] = useState(false);
  const [modalError, setModalError] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [location, setLocation] = useState("");
  const [bedrooms, setBedrooms] = useState<number | "">("");
  const [bathrooms, setBathrooms] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState("");
  const [amenitiesInput, setAmenitiesInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [uploadedImageDataUrl, setUploadedImageDataUrl] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  const fetchMyProperties = async () => {
    setLoadingProperties(true);
    try {
      const res = await getPropertiesAction();
      if (res.success && Array.isArray(res.data)) {
        const landlordProps = res.data.filter(
          (p: any) => p.ownerId === user.id || p.owner?.id === user.id
        );
        setMyProperties(landlordProps.length > 0 ? landlordProps : res.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load properties.");
    } finally {
      setLoadingProperties(false);
    }
  };

  // 2. Fetch Categories
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await getCategoriesAction();
      if (res.success && Array.isArray(res.data)) {
        setCategories(res.data);
        if (res.data.length > 0 && !categoryId) {
          setCategoryId(res.data[0].id);
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load categories.");
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
    fetchCategories();
  }, []);

  const handleOpenAddModal = () => {
    setEditingPropertyId(null);
    setTitle("");
    setDescription("");
    setPrice("");
    setLocation("");
    setBedrooms("");
    setBathrooms("");
    setAmenitiesInput("");
    setImageUrlInput("");
    setUploadedImageDataUrl("");
    setIsAvailable(true);
    setModalError("");
    if (categories.length > 0) {
      setCategoryId(categories[0].id);
    }
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (property: any) => {
    setEditingPropertyId(property.id);
    setTitle(property.title || "");
    setDescription(property.description || "");
    setPrice(property.price || "");
    setLocation(property.location || "");
    setBedrooms(property.bedrooms || "");
    setBathrooms(property.bathrooms || "");
    setCategoryId(property.categoryId || property.category?.id || (categories[0]?.id || ""));
    setAmenitiesInput(
      Array.isArray(property.amenities) ? property.amenities.join(", ") : ""
    );
    const existingImg = Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : "";
    if (existingImg.startsWith("data:")) {
      setUploadedImageDataUrl(existingImg);
      setImageUrlInput("");
    } else {
      setImageUrlInput(existingImg);
      setUploadedImageDataUrl("");
    }
    setIsAvailable(property.isAvailable ?? true);
    setModalError("");
    setIsModalOpen(true);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImageDataUrl(reader.result as string);
        setImageUrlInput("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteProperty = async (propertyId: string, propertyTitle: string) => {
    if (!confirm(`Are you sure you want to delete property "${propertyTitle}"?`)) {
      return;
    }

    setDeletingPropertyId(propertyId);

    try {
      const res = await deletePropertyAction(propertyId);
      if (res?.success) {
        toast.success(res.message || `Property "${propertyTitle}" deleted successfully!`);
        setMyProperties((prev) => prev.filter((p) => p.id !== propertyId));
      } else {
        const rawMsg = res?.message || "";
        if (
          rawMsg.includes("violates RESTRICT setting") ||
          rawMsg.includes("foreign key constraint") ||
          rawMsg.includes("rental_requests_propertyId_fkey")
        ) {
          toast.error(
            `Cannot delete "${propertyTitle}" because active rental requests exist for it. Remove associated requests first!`
          );
        } else {
          toast.error(rawMsg || "Failed to delete property.");
        }
      }
    } catch (err: any) {
      const errStr = err.message || "";
      if (errStr.includes("foreign key constraint") || errStr.includes("violates RESTRICT")) {
        toast.error("Cannot delete property: rental requests exist for this property.");
      } else {
        toast.error(errStr || "An error occurred while deleting property.");
      }
    } finally {
      setDeletingPropertyId(null);
    }
  };

  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingProperty(true);
    setModalError("");

    if (!title || !description || price === "" || !location || !categoryId) {
      setModalError("Please fill in all required fields.");
      setSubmittingProperty(false);
      return;
    }

    const amenities = amenitiesInput
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const images: string[] = [];
    if (uploadedImageDataUrl) {
      images.push(uploadedImageDataUrl);
    } else if (imageUrlInput.trim()) {
      images.push(imageUrlInput.trim());
    } else {
      images.push("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80");
    }

    const payload = {
      title,
      description,
      price: Number(price),
      location,
      bedrooms: Number(bedrooms) || 1,
      bathrooms: Number(bathrooms) || 1,
      categoryId,
      amenities,
      images,
      isAvailable: isAvailable,
    };

    try {
      let res: any;
      if (editingPropertyId) {
        // PUT /api/properties/:id
        res = await updatePropertyAction(editingPropertyId, payload);
      } else {
        // POST /api/properties
        res = await createPropertyAction(payload);
      }

      if (res?.success) {
        const successText = res.message || (editingPropertyId ? "Property updated successfully!" : "Property uploaded successfully!");
        toast.success(successText);
        setIsModalOpen(false);
        fetchMyProperties();
      } else {
        setModalError(res?.message || "Failed to save property.");
        toast.error(res?.message || "Failed to save property.");
      }
    } catch (err: any) {
      setModalError(err.message || "An error occurred while saving property.");
      toast.error(err.message || "An error occurred while saving property.");
    } finally {
      setSubmittingProperty(false);
    }
  };

  const myPropertiesCount = myProperties.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Property Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, edit, toggle availability, and remove your rental listings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload Property</span>
          </button> */}

          {/* <button
            onClick={fetchMyProperties}
            disabled={loadingProperties}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingProperties ? "animate-spin" : ""}`} />
            <span>Refresh List</span>
          </button> */}
        </div>
      </div>

      {/* Summary Stat Banner */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
            <Building2 className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Managed Properties</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{myPropertiesCount}</h3>
          </div>
        </div>
        <div className="text-right text-xs font-semibold text-slate-500">
          <span className="text-emerald-600 font-extrabold">{myProperties.filter((p) => p.isAvailable).length} Available</span> •{" "}
          <span className="text-rose-600 font-extrabold">{myProperties.filter((p) => !p.isAvailable).length} Occupied</span>
        </div>
      </div>

      {/* Listed Properties Cards Grid */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">My Property Listings</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage, update details, or remove properties from the market</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="px-3.5 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add New</span>
          </button>
        </div>

        {loadingProperties ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : myProperties.length === 0 ? (
          <div className="text-center py-16 px-4">
            <span className="text-5xl block mb-3">🏡</span>
            <h3 className="text-lg font-bold text-slate-800">No Properties Listed Yet</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
              You haven't added any properties. Click "Upload Property" to list your first rental home.
            </p>
            <button
              onClick={handleOpenAddModal}
              className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl text-xs transition-all shadow-sm cursor-pointer"
            >
              Upload Property
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {myProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                      {prop.category?.name || "Home"}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                        prop.isAvailable ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {prop.isAvailable ? "Available" : "Occupied"}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">{prop.title}</h3>

                  <p className="text-xs text-slate-500 line-clamp-2">{prop.description}</p>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" /> {prop.location}
                    </span>
                    <span className="font-extrabold text-slate-900">৳ {prop.price?.toLocaleString()}</span>
                  </div>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEditModal(prop)}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title="Edit Property"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDeleteProperty(prop.id, prop.title)}
                    disabled={deletingPropertyId === prop.id}
                    className="p-2 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
                    title="Delete Property"
                  >
                    {deletingPropertyId === prop.id ? (
                      <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent text-rose-600 rounded-full"></span>
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload / Edit Property Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-fadeIn my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                  {editingPropertyId ? <Edit2 className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {editingPropertyId ? "Edit Property Listing" : "Upload New Property"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingPropertyId ? "Update property details and availability below" : "Enter property details to list a new rental"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProperty} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {modalError && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              {/* Title & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Modern Apartment in Gulshan"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  {loadingCategories ? (
                    <div className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-sm animate-pulse">
                      Loading categories from API...
                    </div>
                  ) : (
                    <select
                      required
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium bg-white cursor-pointer"
                    >
                      <option value="" disabled>Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter property description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                />
              </div>

              {/* Price & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Price (BDT / Month) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 45000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gulshan 2, Dhaka"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Bedrooms & Bathrooms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Bedrooms *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="e.g. 3"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value ? Number(e.target.value) : "")}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Bathrooms *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="e.g. 2"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value ? Number(e.target.value) : "")}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Amenities (Comma Separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. WiFi, Parking, Elevator, Generator"
                  value={amenitiesInput}
                  onChange={(e) => setAmenitiesInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                />
              </div>

              {/* UI for Image URL Uploads & Device Upload */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Property Images (Image URL or Device Upload)
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Option A: Image URL Upload */}
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
                      <LinkIcon className="w-3.5 h-3.5 text-blue-600" /> Image URL
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. https://images.unsplash.com/..."
                      value={imageUrlInput}
                      onChange={(e) => {
                        setImageUrlInput(e.target.value);
                        setUploadedImageDataUrl("");
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
                    />
                  </div>

                  {/* Option B: Device Upload */}
                  
                </div>

                {uploadedImageDataUrl && (
                  <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold">
                    <span>🖼️ Attached Image File</span>
                    <button
                      type="button"
                      onClick={() => setUploadedImageDataUrl("")}
                      className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Availability Toggle UI */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <label className="block text-xs font-extrabold text-slate-900">
                    Property Availability Status
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Toggle whether this property is currently available for rent
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAvailable(!isAvailable)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    isAvailable
                      ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                      : "bg-rose-500 text-white shadow-sm shadow-rose-500/20"
                  }`}
                >
                  {isAvailable ? (
                    <>
                      <ToggleRight className="w-5 h-5" />
                      <span>Available</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5" />
                      <span>Occupied</span>
                    </>
                  )}
                </button>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingProperty}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submittingProperty ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent text-white rounded-full"></span>
                      <span>Saving Property...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>{editingPropertyId ? "Update Property" : "Upload Property"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
