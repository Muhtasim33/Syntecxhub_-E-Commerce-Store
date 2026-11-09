'use client';

import React, { useState } from 'react';
import { Users, Shield, Lock, Unlock, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function AdminCustomersPage() {
  const [users, setUsers] = useState([
    {
      id: 'usr-1',
      name: 'Lady Genevieve Vance',
      email: 'genevieve.vance@luxurymail.com',
      role: 'customer',
      acquisitionsCount: 6,
      spentTotal: '$14,200',
      isBlocked: false,
      joined: '2025-10-12',
    },
    {
      id: 'usr-2',
      name: 'Arthur Pendleton',
      email: 'arthur.pendleton@estateholdings.com',
      role: 'customer',
      acquisitionsCount: 2,
      spentTotal: '$2,850',
      isBlocked: false,
      joined: '2026-01-04',
    },
    {
      id: 'usr-3',
      name: 'Maison Master Admin',
      email: 'admin@aurelia.com',
      role: 'admin',
      acquisitionsCount: 0,
      spentTotal: '$0',
      isBlocked: false,
      joined: '2025-01-01',
    },
  ]);

  const toggleBlock = (id: string) => {
    setUsers(
      users.map((u) => (u.id === id ? { ...u, isBlocked: !u.isBlocked } : u))
    );
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#e2d7bb] pb-4">
        <h1 className="font-serif text-2xl text-[#02110c]">Clientele Directory</h1>
        <p className="text-xs text-[#4a5a50] mt-1">
          Review VIP accounts, verified sovereign buyers, and security permissions.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#e2d7bb] overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#f3ebd6]/60 border-b border-[#e2d7bb] text-[#02110c] uppercase tracking-wider font-semibold">
            <tr>
              <th className="p-4">Client Name</th>
              <th className="p-4">Email Address</th>
              <th className="p-4">Role</th>
              <th className="p-4">Acquisitions</th>
              <th className="p-4">Lifetime Spent</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2d7bb]">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-[#f3ebd6]/20 transition-colors">
                <td className="p-4 font-semibold text-[#02110c]">{user.name}</td>
                <td className="p-4 text-[#4a5a50]">{user.email}</td>
                <td className="p-4">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      user.role === 'admin'
                        ? 'bg-[#02110c] text-[#c9a96e]'
                        : 'bg-[#1a422f]/10 text-[#1a422f]'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-4 font-semibold text-[#02110c]">
                  {user.acquisitionsCount} orders
                </td>
                <td className="p-4 font-bold text-[#1a422f]">{user.spentTotal}</td>
                <td className="p-4">
                  <Badge variant={user.isBlocked ? 'danger' : 'success'}>
                    {user.isBlocked ? 'Locked' : 'Active'}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => toggleBlock(user.id)}
                      className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                        user.isBlocked
                          ? 'border-[#2f7d4f] text-[#2f7d4f] hover:bg-emerald-50'
                          : 'border-red-300 text-red-700 hover:bg-red-50'
                      }`}
                    >
                      {user.isBlocked ? 'Unlock' : 'Lock Account'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
