'use client';
import { LayoutGrid, Plus, Trash2, Search } from 'lucide-react';

export default function Categories() {
    return (
        <div className="p-8 bg-white rounded-2xl border border-gray-100">
            <div className="flex justify-between mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <LayoutGrid className="text-[#d4af37]" />
                    Collection Management
                </h2>
                <button className="flex items-center gap-2 bg-[#d4af37] text-white px-6 py-3 rounded-xl font-semibold">
                    <Plus size={18} />
                    New Collection
                </button>
            </div>
            
            <div className="p-20 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                <LayoutGrid size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400">Collections are currently managed automatically based on product categories.</p>
                <p className="text-sm text-gray-300">Advanced hierarchy management coming soon.</p>
            </div>
        </div>
    );
}
