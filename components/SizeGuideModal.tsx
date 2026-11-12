'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { X, Ruler } from 'lucide-react';

export default function SizeGuideModal() {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useShop();
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  if (!isSizeGuideOpen) return null;

  const sizeData = [
    { size: 'XS', bustIn: '32', waistIn: '26', hipIn: '35', bustCm: '81', waistCm: '66', hipCm: '89' },
    { size: 'S', bustIn: '34', waistIn: '28', hipIn: '37', bustCm: '86', waistCm: '71', hipCm: '94' },
    { size: 'M', bustIn: '36', waistIn: '30', hipIn: '39', bustCm: '91', waistCm: '76', hipCm: '99' },
    { size: 'L', bustIn: '38', waistIn: '32', hipIn: '41', bustCm: '96', waistCm: '81', hipCm: '104' },
    { size: 'XL', bustIn: '40', waistIn: '34', hipIn: '43', bustCm: '101', waistCm: '86', hipCm: '109' },
    { size: 'XXL', bustIn: '42', waistIn: '36', hipIn: '45', bustCm: '106', waistCm: '91', hipCm: '114' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-[#FFF6F7] border border-[#F0D3D9] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={() => setIsSizeGuideOpen(false)}
          aria-label="Close Size Guide"
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#8A6B74] hover:text-[#2E0C1B] hover:bg-[#FBE8EC]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Ruler className="w-5 h-5 text-[#7B1E45]" />
          <h2 className="font-playfair text-xl font-bold text-[#2E0C1B]">
            AURELLE Size Guide
          </h2>
        </div>
        <p className="text-xs text-[#8A6B74] mb-4">
          All measurements are standard garment proportions. For relaxed or tiered dresses, choose your true size.
        </p>

        {/* Unit Selector */}
        <div className="flex items-center justify-end mb-3">
          <div className="bg-white border border-[#F0D3D9] rounded-lg p-0.5 flex text-xs font-semibold">
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1 rounded-md transition-colors ${
                unit === 'in' ? 'bg-[#7B1E45] text-white shadow-2xs' : 'text-[#8A6B74] hover:text-[#2E0C1B]'
              }`}
            >
              Inches (&quot;)
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 rounded-md transition-colors ${
                unit === 'cm' ? 'bg-[#7B1E45] text-white shadow-2xs' : 'text-[#8A6B74] hover:text-[#2E0C1B]'
              }`}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="border border-[#F0D3D9] rounded-xl overflow-hidden bg-white text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#FBE8EC] text-[#2E0C1B] font-bold">
              <tr>
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Bust</th>
                <th className="py-2.5 px-3">Waist</th>
                <th className="py-2.5 px-3">Hip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0D3D9] text-[#2E0C1B]">
              {sizeData.map((row) => (
                <tr key={row.size} className="hover:bg-[#FFF6F7]">
                  <td className="py-2.5 px-3 font-bold text-[#7B1E45]">{row.size}</td>
                  <td className="py-2.5 px-3 tabular-nums">{unit === 'in' ? `${row.bustIn}"` : `${row.bustCm} cm`}</td>
                  <td className="py-2.5 px-3 tabular-nums">{unit === 'in' ? `${row.waistIn}"` : `${row.waistCm} cm`}</td>
                  <td className="py-2.5 px-3 tabular-nums">{unit === 'in' ? `${row.hipIn}"` : `${row.hipCm} cm`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={() => setIsSizeGuideOpen(false)}
          className="w-full mt-5 bg-[#7B1E45] hover:bg-[#4A1229] text-white py-2.5 rounded-[6px] text-xs font-semibold"
        >
          Got It, Back to Product
        </button>
      </div>
    </div>
  );
}
