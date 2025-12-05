import React from 'react';
import Header from './Header';
import Footer from './Footer';

const UserPageLayout = ({ title, children }) => {
  return (
    <>
      <Header />
      <main className="min-h-[80vh] bg-stone-50 pt-40 pb-20 flex flex-col">
        <div className="container mx-auto px-4 lg:px-20 flex-1">
          {title && (
            <div className="mb-10">
              <h1 className="text-4xl font-serif font-bold text-stone-800 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                {title}
              </h1>
              <div className="w-75 h-1.5 bg-yellow-500 rounded-full"></div>
            </div>
          )}
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default UserPageLayout;
