import { useState } from 'react';
import { GoldRatesManager } from './GoldRatesManager';
import { OrdersManager } from './OrdersManager';
import { InventoryManager } from './InventoryManager';
import { AppointmentsManager } from './AppointmentsManager';

type AdminSection =
  | 'orders'
  | 'inventory'
  | 'rates'
  | 'appointments';

export const AdminDashboard = () => {
  const [section, setSection] =
    useState<AdminSection>('rates');

  const renderContent = () => {
    if (section === 'orders') {
      return <OrdersManager />;
    }

    if (section === 'inventory') {
      return <InventoryManager />;
    }

    if (section === 'appointments') {
      return <AppointmentsManager />;
    }

    return <GoldRatesManager />;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-bj-charcoal text-white p-6 shrink-0">
        <h2 className="font-serif text-2xl text-bj-gold mb-10 italic">
          BJ Admin
        </h2>

        <nav className="space-y-2">
          <button
            type="button"
            onClick={() => setSection('orders')}
            className={`w-full text-left block px-3 py-2 transition ${
              section === 'orders'
                ? 'text-bj-gold'
                : 'hover:text-bj-gold'
            }`}
          >
            Orders
          </button>

          <button
            type="button"
            onClick={() => setSection('inventory')}
            className={`w-full text-left block px-3 py-2 transition ${
              section === 'inventory'
                ? 'text-bj-gold'
                : 'hover:text-bj-gold'
            }`}
          >
            Inventory
          </button>

          <button
            type="button"
            onClick={() => setSection('rates')}
            className={`w-full text-left block px-3 py-2 transition ${
              section === 'rates'
                ? 'text-bj-gold'
                : 'hover:text-bj-gold'
            }`}
          >
            Gold Rates
          </button>

          <button
            type="button"
            onClick={() =>
              setSection('appointments')
            }
            className={`w-full text-left block px-3 py-2 transition ${
              section === 'appointments'
                ? 'text-bj-gold'
                : 'hover:text-bj-gold'
            }`}
          >
            Appointments
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-serif text-bj-charcoal">
            {section === 'orders' &&
              'Order Management'}

            {section === 'inventory' &&
              'Inventory Management'}

            {section === 'rates' &&
              'Daily Rates Management'}

            {section === 'appointments' &&
              'Appointment Management'}
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            {section === 'orders' &&
              'View and manage customer orders.'}

            {section === 'inventory' &&
              'Manage your jewellery inventory.'}

            {section === 'rates' &&
              'Manage live gold and silver prices for your store.'}

            {section === 'appointments' &&
              'Manage customer appointments.'}
          </p>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};