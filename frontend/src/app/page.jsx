"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, ShieldCheck, Zap, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Script from "next/script";

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleBuyNow = async (product) => {
    router.push(`/checkout/${product._id}?qty=1`);
  };

  return (
   
    <div className="w-full relative z-10 flex flex-col items-center min-h-screen">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Toaster position="top-center" />

      {/* Hero Section */}
      <div className="w-full relative flex flex-col items-center justify-center min-h-[60vh] text-center px-4 overflow-hidden pt-20">
        <div className="absolute top-[20%] right-[15%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-[20%] left-[15%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-500/30 text-blue-400 mb-6 font-medium text-sm">
            <ShieldCheck className="w-5 h-5" /> Module 1-15 Live Integration
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
            The <span className="text-gradient">Smartest</span> Way To <br /> Drop Ship Worldwide
          </h1>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover trending products, checkout seamlessly with Razorpay, and manage orders instantly all in one place.
          </p>
        </motion.div>
      </div>
      

      {/* Featured Products Section */}
      <div className="w-full max-w-7xl mx-auto px-6 py-10 mb-20">
        <div className="flex items-center justify-between mb-10 border-b border-slate-800 pb-4">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Zap className="text-yellow-400 w-8 h-8" /> Trending Products
          </h2>
          <button
            onClick={() => router.push("/products")}
            className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 group"
          >
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-20"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent flex rounded-full animate-spin"></div></div>
        ) : products.length === 0 ? (
          <div className="glass p-10 rounded-2xl text-center border border-slate-700/50">
            <p className="text-slate-400">No products configured yet. Login as an Admin to add products.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, idx) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => router.push(`/product/${product._id}`)}
                className="glass rounded-2xl overflow-hidden border border-slate-700/50 hover:border-slate-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all flex flex-col group cursor-pointer"
              >
                {/* Product Image Placeholder (Beautiful gradient box) */}
                <div className="h-48 w-full bg-slate-800 relative overflow-hidden flex items-center justify-center">
                  {/* Decorative background or Image */}
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 group-hover:scale-110 transition-transform duration-700"></div>
                  )}
                  {!product.imageUrl && <ShoppingCart className="w-16 h-16 text-slate-700 z-10" />}

                  <div className="absolute top-3 right-3 bg-slate-900/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-white border border-slate-700/50 flex items-center gap-1 z-20">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> 4.8
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 bg-slate-900/40">
                  <span className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2 block">{product.category}</span>
                  <h3 className="text-white font-bold text-lg leading-tight mb-2 line-clamp-2">{product.title}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-4 flex-1">{product.description}</p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
                    <div>
                      <span className="text-slate-500 text-xs line-through block"> ${(product.price * 1.2).toFixed(2)}</span>
                      <span className="text-green-400 font-black text-xl">${product.price.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleBuyNow(product); }}
                      className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
                      title="Buy Now with Razorpay"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
    
  );
}
