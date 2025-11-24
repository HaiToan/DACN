// pages/Menu.jsx

import React, { useState, useMemo } from "react";
import { Search, ShoppingCart, Filter, ChevronDown, Star, Plus } from "lucide-react";
import { Link } from "react-router-dom";

// --- LƯU Ý: Mở lại các dòng import này trong dự án thực tế của bạn ---
import Header from "../components/Header";
 import Footer from "../components/Footer";

// --- 1. DANH MỤC (Theo yêu cầu của bạn) ---
const CATEGORIES = [
  { id: "ALL", name: "TẤT CẢ", link: "/menu" },
  { id: "khai-vi", name: "KHAI VỊ", link: "/menu/khai-vi" },
  { id: "salad", name: "SALAD", link: "/menu/salad" },
  { id: "sup", name: "SÚP", link: "/menu/sup" },
  { id: "hai-san", name: "HẢI SẢN", link: "/menu/hai-san" },
  { id: "thit-bo", name: "THỊT BÒ", link: "/menu/thit-bo" },
  { id: "thit-heo", name: "THỊT HEO", link: "/menu/thit-heo" },
  { id: "spaghetti", name: "MÌ Ý", link: "/menu/spaghetti" },
  { id: "pizza", name: "PIZZA", link: "/menu/pizza" },
  { id: "trang-mieng", name: "TRÁNG MIỆNG", link: "/menu/trang-mieng" },
  { id: "do-uong", name: "ĐỒ UỐNG", link: "/menu/do-uong" },
];

// --- 2. DỮ LIỆU MÓN ĂN (Mock Data chi tiết) ---
const MENU_ITEMS = [
  // Khai Vị
  { id: 1, name: "Gan Ngỗng Áp Chảo", category: "khai-vi", price: 450000, image: "/menu/ngongapchao.jpg", desc: "Gan ngỗng Pháp béo ngậy ăn kèm sốt dâu tằm và bánh mì Brioche." },
  { id: 2, name: "Carpaccio Bò Úc", category: "khai-vi", price: 320000, image: "/menu/carpaccio_bouc.jpg", desc: "Thịt bò sống thái lát mỏng, dầu oliu, phô mai Parmesan và nấm Truffle." },
  
  // Salad
  { id: 3, name: "Ceasar Salad Cá Hồi", category: "salad", price: 220000, image: "/menu/saladcahoi.jpg", desc: "Rau Roman tươi, cá hồi xông khói, croutons và sốt Ceasar truyền thống." },
  // Súp
  { id: 4, name: "Súp Bí Đỏ Hokkaido", category: "sup", price: 150000, image: "/menu/supbido.jpg", desc: "Bí đỏ Nhật Bản ngọt dịu, kem tươi và hạt bí rang thơm." },

  // Hải Sản
  { id: 5, name: "Tôm Hùm Alaska Nướng", category: "hai-san", price: 1850000, image: "/menu/tomalaskanuong.jpg", desc: "Nửa con tôm hùm nướng phô mai hoặc bơ tỏi, kèm khoai tây nghiền." },
  { id: 6, name: "Cá Hồi Sốt Cam", category: "hai-san", price: 420000, image: "/ca_hoi_sot_cam.jpg", desc: "Cá hồi áp chảo giòn da, sốt cam và rượu vang." },

  // Thịt Bò (Signature)
  { id: 7, name: "Wagyu A5 Nướng Đá ", category: "thit-bo", price: 3500000, image: "/bowagyua5nuongda.jpg", desc: "Món 'Best Seller' - Bò Wagyu A5, vân mỡ hoàn hảo, mềm tan." },
  { id: 8, name: "Beef Wellington", category: "thit-bo", price: 890000, image: "/info_hero.jpg", desc: "Thăn nội bò bọc nấm Duxelles, giăm bông Parma và vỏ bánh ngàn lớp." },

  // Thịt Heo
  { id: 9, name: "Sườn Heo Iberico Nướng", category: "thit-heo", price: 550000, image: "/menu/suonheonuong.jpg", desc: "Sườn heo đen Tây Ban Nha nướng sốt BBQ vị khói đặc trưng." },

  // Mì Ý
  { id: 10, name: "Spaghetti Carbonara", category: "spaghetti", price: 250000, image: "/menu/spaghetti_carbonara.jpg", desc: "Mì Ý sốt kem trứng, thịt heo muối Guanciale và phô mai Pecorino." },

  // Pizza
  { id: 11, name: "Pizza 4 Cheese", category: "pizza", price: 280000, image: "/menu/pz4cheese.jpg", desc: "Sự kết hợp của Mozzarella, Gorgonzola, Parmesan và Emmental, kèm mật ong." },

  // Tráng Miệng
  { id: 12, name: "Creme Brulee", category: "trang-mieng", price: 110000, image: "/menu/creme.jpg", desc: "Kem trứng nướng kiểu Pháp với lớp đường khò giòn tan." },

  // Đồ Uống
  { id: 13, name: "Vang Đỏ Cabernet Sauvignon", category: "do-uong", price: 1200000, image: "/menu/vang.jpg", desc: "Chai vang đỏ đậm đà từ thung lũng Napa, California." },
  { id: 14, name: "Mojito Chanh Tươi", category: "do-uong", price: 95000, image: "/menu/chanhtuoi.jpg", desc: "Rum, chanh tươi, lá bạc hà và soda mát lạnh." },
];

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default"); // default, price-asc, price-desc

  // Hàm format tiền
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // --- LOGIC LỌC VÀ SẮP XẾP ---
  const filteredItems = useMemo(() => {
    let items = MENU_ITEMS;

    // 1. Lọc theo danh mục
    if (activeCategory !== "ALL") {
      items = items.filter(item => item.category === activeCategory);
    }

    // 2. Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 3. Sắp xếp theo giá
    if (sortOption === "price-asc") {
      items = [...items].sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      items = [...items].sort((a, b) => b.price - a.price);
    }

    return items;
  }, [activeCategory, searchTerm, sortOption]);

  // Xử lý thêm vào giỏ (Giả lập)
  const handleAddToCart = (itemName) => {
    alert(`Đã thêm "${itemName}" vào giỏ hàng!`);
    // Trong thực tế: dispatch action hoặc update context
  };

  return (
    <>
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden mt-16 bg-stone-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/lobby3.jpg"
            alt="Menu Background"
            className="w-full h-full object-cover opacity-40"
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1974&auto=format&fit=crop"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-stone-900/90"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <span className="text-yellow-500 font-bold tracking-widest uppercase text-sm mb-2 block">
            Taste of Luxury
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Thực Đơn
          </h1>
        </div>
      </section>

      {/* 2. MAIN MENU CONTENT */}
      <section className="py-16 bg-stone-50 min-h-screen">
        <div className="container mx-auto px-4 lg:px-10">
          
          <div className="flex flex-col lg:flex-row gap-10">

            {/* --- LEFT SIDEBAR: CATEGORIES --- */}
            <aside className="w-full lg:w-1/4 lg:shrink-0">
              <div className="sticky top-24 bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                <h3 className="font-serif font-bold text-xl text-stone-800 mb-6 flex items-center gap-2">
                  <Filter size={20} className="text-yellow-600"/> Danh Mục
                </h3>
                
                {/* Danh sách danh mục (Desktop: Dọc, Mobile: Ngang scroll) */}
                <ul className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-3 pb-2 lg:pb-0 snap-x">
                  {CATEGORIES.map((cat) => (
                    <li key={cat.id} className="snap-start shrink-0">
                      <button
                        onClick={() => setActiveCategory(cat.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-between group
                          ${activeCategory === cat.id 
                            ? "bg-stone-900 text-white shadow-md" 
                            : "hover:bg-yellow-50 text-stone-600 hover:text-yellow-700"
                          }`}
                      >
                        <span className="font-bold text-sm uppercase tracking-wide whitespace-nowrap">{cat.name}</span>
                        {activeCategory === cat.id && <Star size={14} fill="currentColor" className="text-yellow-500"/>}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* --- RIGHT CONTENT: FILTERS & GRID --- */}
            <div className="flex-1">
              
              {/* Toolbar: Search & Sort */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                
                {/* Search Box */}
                <div className="relative w-full md:w-96">
                  <input 
                    type="text" 
                    placeholder="Tìm món ăn..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition text-stone-700"
                  />
                  <Search className="absolute left-3 top-3 text-stone-400" size={18} />
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <span className="text-stone-500 text-sm font-medium whitespace-nowrap">Sắp xếp:</span>
                  <div className="relative w-full md:w-48">
                    <select 
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="w-full appearance-none px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 text-stone-700 cursor-pointer pr-10"
                    >
                      <option value="default">Mặc định</option>
                      <option value="price-asc">Giá: Thấp đến Cao</option>
                      <option value="price-desc">Giá: Cao đến Thấp</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 text-stone-400 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>

              {/* --- MENU GRID --- */}
              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-stone-100 transition-all duration-300 flex flex-col">
                      
                      {/* Image Area */}
                      <div className="h-56 overflow-hidden relative bg-stone-200">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop"; }}
                        />
                        {/* Nút Add to cart nổi lên khi hover */}
                        <button 
                          onClick={() => handleAddToCart(item.name)}
                          className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-stone-800 hover:bg-yellow-500 hover:text-white transition transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300 z-10"
                          title="Thêm vào giỏ"
                        >
                          <Plus size={20} />
                        </button>
                      </div>

                      {/* Content Area */}
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-serif font-bold text-xl text-stone-800 group-hover:text-yellow-600 transition line-clamp-1" title={item.name}>
                            {item.name}
                          </h3>
                        </div>
                        
                        <p className="text-stone-500 text-sm font-light mb-4 line-clamp-2 flex-1">
                          {item.desc}
                        </p>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
                          <span className="text-lg font-bold text-stone-800">
                            {formatCurrency(item.price)}
                          </span>
                          <button 
                             onClick={() => handleAddToCart(item.name)}
                             className="text-xs font-bold uppercase tracking-wider text-yellow-600 hover:text-yellow-700 border-b border-yellow-600 pb-0.5 transition"
                          >
                            Thêm món +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State khi không tìm thấy món */
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                    <Search size={32} className="text-stone-400"/>
                  </div>
                  <h3 className="text-xl font-bold text-stone-600">Không tìm thấy món ăn</h3>
                  <p className="text-stone-400">Thử tìm kiếm với từ khóa khác hoặc chọn danh mục "Tất Cả".</p>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Menu;