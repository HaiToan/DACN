// src/pages/Menu.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Search, Filter, ChevronDown, Star, Plus, Loader, AlertTriangle } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog"; // Assuming this path

import Header from "../components/Header";
import Footer from "../components/Footer";
import Toast from "../components/Toast";

const Menu = () => {
  const { addItem } = useCart(); 

  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);


  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  
  const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false }); 
  const [selectedMenuItem, setSelectedMenuItem] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [menuRes, catRes] = await Promise.all([
          fetch('http://localhost:3001/api/menu'),
          fetch('http://localhost:3001/api/menu/categories')
        ]);

        if (!menuRes.ok || !catRes.ok) throw new Error(`HTTP error!`);
        
        const menuData = await menuRes.json();
        const catData = await catRes.json();

        // 👇 3. GIỮ NGUYÊN TÊN TRƯỜNG DỮ LIỆU TỪ BACKEND
        const formattedMenu = menuData.map(item => ({
          ...item,
          gia: parseFloat(item.gia), 
        }));
        setMenuItems(formattedMenu);
        setCategories([{ maloai: "ALL", tenloai: "TẤT CẢ" }, ...catData]);

      } catch (e) {
        setToast({ message: `Lỗi khi tải dữ liệu: ${e.message}`, type: 'error', isVisible: true });
        console.error("Lỗi khi lấy dữ liệu:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setActiveCategory(parseInt(categoryFromUrl, 10));
    }
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const filteredItems = useMemo(() => {
    let items = menuItems;

    if (activeCategory !== "ALL") {
      items = items.filter(item => item.maloai === activeCategory);
    }

    if (searchTerm) {
      items = items.filter(item => 
        item.tenmon.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOption === "price-asc") {
      items = [...items].sort((a, b) => a.gia - b.gia);
    } else if (sortOption === "price-desc") {
      items = [...items].sort((a, b) => b.gia - a.gia);
    }

    return items;
  }, [menuItems, activeCategory, searchTerm, sortOption]);

  // CẬP NHẬT HÀM ĐỂ GỌI CONTEXT VÀ HIỂN THỊ THÔNG BÁO
  const handleAddToCart = async (item, quantity = 1) => {
    console.log('Attempting to add item to cart:', item.mamon, 'quantity:', quantity);
    const result = await addItem(item.mamon, quantity);
    console.log('addItem result:', result);
    if (result.success) {
      setToast({ message: `Đã thêm "${item.tenmon}" vào giỏ hàng!`, type: 'success', isVisible: true });
      setIsModalOpen(false); // Close modal after adding to cart
    } else {
      setToast({ message: `Lỗi: ${result.message || 'Có lỗi khi thêm sản phẩm vào giỏ hàng.'}`, type: 'error', isVisible: true });
      // Do not close modal automatically on error, let user see the message
    }
  };

  useEffect(() => {
    if (toast.isVisible) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, isVisible: false }));
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [toast.isVisible]);

  const openItemModal = (item) => {
    setSelectedMenuItem(item);
    setIsModalOpen(true);
  };

  const closeItemModal = () => {
    setSelectedMenuItem(null);
    setIsModalOpen(false);
  };


  const renderContent = () => {
    if (loading) return ( <div className="flex flex-col items-center justify-center py-20 text-center"><Loader size={48} className="text-yellow-500 animate-spin mb-4" /><h3 className="text-xl font-bold text-stone-600">Đang tải thực đơn...</h3><p className="text-stone-400">Vui lòng chờ trong giây lát.</p></div> );
    if (toast.type === 'error' && toast.isVisible) return ( <div className="flex flex-col items-center justify-center py-20 text-center bg-red-50 p-6 rounded-lg"><AlertTriangle size={48} className="text-red-500 mb-4" /><h3 className="text-xl font-bold text-red-700">Không thể tải thực đơn</h3><p className="text-red-500">Đã có lỗi xảy ra. Vui lòng thử lại sau.</p><p className="text-xs text-stone-500 mt-2">Chi tiết: {toast.message}</p></div> );
    if (filteredItems.length === 0) return ( <div className="flex flex-col items-center justify-center py-20 text-center"><div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-4"><Search size={32} className="text-stone-400"/></div><h3 className="text-xl font-bold text-stone-600">Không tìm thấy món ăn</h3><p className="text-stone-400">Thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc.</p></div> );

    // --- HIỂN THỊ MENU GRID ---
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.mamon} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-stone-100 transition-all duration-300 flex flex-col cursor-pointer"
            onClick={() => openItemModal(item)} // Open modal on item click
          >
            <div className="h-56 overflow-hidden relative bg-stone-200">
              <img 
                src={item.hinhanh} 
                alt={item.tenmon} 
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop"; }}
              />
              <button 
                onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }} // Prevent modal from opening
                className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-stone-800 hover:bg-yellow-500 hover:text-white transition transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300 z-10"
                title="Thêm vào giỏ"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-serif font-bold text-xl text-stone-800 group-hover:text-yellow-600 transition line-clamp-1" title={item.tenmon}>
                  {item.tenmon}
                </h3>
              </div>
              <p className="text-stone-500 text-sm font-light mb-4 line-clamp-2 flex-1">
                {item.mota}
              </p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
                <span className="text-lg font-bold text-stone-800">
                  {formatCurrency(item.gia)}
                </span>
                <button 
                   onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }}
                   className="text-xs font-bold uppercase tracking-wider text-yellow-600 hover:text-yellow-700 border-b border-yellow-600 pb-0.5 transition"
                >
                  Thêm món +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <>
      <Header />
      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
        />
      )}

      {/* Item Detail Modal */}
      {selectedMenuItem && (
        <Dialog open={isModalOpen} onOpenChange={closeItemModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedMenuItem.tenmon}</DialogTitle>
              <DialogDescription>
                Chi tiết món ăn và thêm vào giỏ hàng
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <img 
                src={selectedMenuItem.hinhanh} 
                alt={selectedMenuItem.tenmon} 
                className="w-full h-48 object-cover rounded-md mb-4"
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop"; }}
              />
              <p className="text-sm text-gray-500">{selectedMenuItem.mota}</p>
              <p className="text-lg font-bold text-stone-800">
                Giá: {formatCurrency(selectedMenuItem.gia)}
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => handleAddToCart(selectedMenuItem)}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition"
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden mt-16 bg-stone-900">
        <div className="absolute inset-0 z-0">
          <img src="/lobby3.jpg" alt="Menu Background" className="w-full h-full object-cover opacity-40" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1974&auto=format&fit=crop"; }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-stone-900/90"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <span className="text-yellow-500 font-bold tracking-widest uppercase text-sm mb-2 block">Taste of Luxury</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Thực Đơn</h1>
        </div>
      </section>

      <section className="py-16 bg-stone-50 min-h-screen">
        <div className="container mx-auto px-4 lg:px-10">
          <div className="flex flex-col lg:flex-row gap-10">
            <aside className="w-full lg:w-1/4 lg:shrink-0">
              <div className="sticky top-24 bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                <h3 className="font-serif font-bold text-xl text-stone-800 mb-6 flex items-center gap-2"><Filter size={20} className="text-yellow-600"/> Danh Mục</h3>
                <ul className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-3 pb-2 lg:pb-0 snap-x">
                  {categories.map((cat) => (
                    <li key={cat.maloai} className="snap-start shrink-0">
                      <button
                        onClick={() => setActiveCategory(cat.maloai)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-between group ${activeCategory === cat.maloai ? "bg-stone-900 text-white shadow-md" : "hover:bg-yellow-50 text-stone-600 hover:text-yellow-700"}`}
                      >
                        <span className="font-bold text-sm uppercase tracking-wide whitespace-nowrap">{cat.tenloai}</span>
                        {activeCategory === cat.maloai && <Star size={14} fill="currentColor" className="text-yellow-500"/>}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                <div className="relative w-full md:w-96">
                  <input type="text" placeholder="Tìm món ăn..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition text-stone-700"/>
                  <Search className="absolute left-3 top-3 text-stone-400" size={18} />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <span className="text-stone-500 text-sm font-medium whitespace-nowrap">Sắp xếp:</span>
                  <div className="relative w-full md:w-48">
                    <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="w-full appearance-none px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 text-stone-700 cursor-pointer pr-10">
                      <option value="default">Mặc định</option>
                      <option value="price-asc">Giá: Thấp đến Cao</option>
                      <option value="price-desc">Giá: Cao đến Thấp</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 text-stone-400 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>

              {renderContent()}

            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Menu;
