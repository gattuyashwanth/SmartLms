import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const AppLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      {/* Sidebar */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: window.innerWidth > 900 ? '260px' : 0,
          minHeight: '100vh',
          width: window.innerWidth > 900 ? 'calc(100% - 260px)' : '100%',
        }}
        className="main-content-wrapper"
      >
        <Topbar onMenuClick={() => setIsMobileSidebarOpen(true)} />

        <main style={{ flex: 1, padding: '1.5rem', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .main-content-wrapper {
            margin-left: 0 !important;
            width: 100% !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
        @media (min-width: 901px) {
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
