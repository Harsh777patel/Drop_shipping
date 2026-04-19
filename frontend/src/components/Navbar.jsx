"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, User, Package, Zap } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [token, setToken] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();

  // Handle scroll effect & token
  useEffect(() => {
    setToken(localStorage.getItem("dropsync_token"));

    // Load cart count
    const loadCart = () => {
      const cart = JSON.parse(localStorage.getItem("dropsync_cart") || "[]");
      setCartCount(cart.reduce((sum, i) => sum + (i.qty || 1), 0));
    };
    loadCart();
    window.addEventListener("dropsync_cart_update", loadCart);

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("dropsync_cart_update", loadCart);
    };
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Suppliers", path: "/suppliers" },
  ];

  const renderAuthLinks = () => {
    if (token) {
      let dashLink = "/dashboard";
      if (typeof window !== "undefined") {
         const ustr = localStorage.getItem("dropsync_user");
         if (ustr) {
            const pUser = JSON.parse(ustr);
            if (pUser.role === 'admin' || pUser.role === 'supplier') {
                dashLink = `/${pUser.role}/dashboard`;
            }
         }
      }

      return (
        <div className="flex items-center gap-4">
          <Link href={dashLink} className="text-slate-300 hover:text-blue-400 transition-colors text-sm font-medium flex items-center gap-2">
             <User className="w-4 h-4" /> Dashboard
          </Link>
          <button 
            onClick={() => {
              localStorage.removeItem("dropsync_token");
              setToken(null);
              window.location.href = "/";
            }}
            className="px-4 py-2 rounded-xl text-sm font-bold border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
          >
            Logout
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
          Login
        </Link>
        <Link href="/signup" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
          <span>Sign Up</span>
        </Link>
      </div>
    );
  };

  return (
    <header 
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-slate-900/90 backdrop-blur-md border-b border-white/10 shadow-xl" : "bg-slate-950 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Drop<span className="text-blue-400">Sync</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6 bg-slate-800/50 backdrop-blur-md rounded-full px-6 py-2 border border-white/5">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link 
                  key={link.path} 
                  href={link.path}
                  className={`text-sm font-medium transition-all relative ${
                    isActive ? "text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div 
                      layoutId="navbar-indicator"
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-blue-500 rounded-full"
                      initial={false}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Desktop Auth/Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Cart Button */}
          <Link href="/cart" className="relative w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-600 text-white text-xs font-black rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>
          {renderAuthLinks()}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-slate-300 hover:text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-slate-900 border-b border-white/10 shadow-2xl md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-medium p-3 rounded-xl transition-colors ${
                    pathname === link.path 
                      ? "bg-blue-600/10 text-blue-400" 
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="h-px bg-white/10 my-2" />
              
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2 font-medium">
                  <ShoppingCart className="w-4 h-4" /> Cart
                </span>
                {cartCount > 0 && (
                  <span className="w-6 h-6 bg-blue-600 text-white text-xs font-black rounded-full flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
              
              <div className="h-px bg-white/10 my-2" />
              
              <div className="flex flex-col gap-3">
                {renderAuthLinks()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
