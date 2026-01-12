'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { createMedicine } from '@/lib/actions/inventory'

export default function AddInventoryModal({ clinicId }: { clinicId: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsPending(true)
        const formData = new FormData(e.currentTarget)

        try {
            await createMedicine(formData)
            setIsOpen(false)
            // Optional: Reset form or show toast
        } catch (error) {
            console.error(error)
            alert('Failed to create item')
        } finally {
            setIsPending(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all shadow-sm active:scale-95"
            >
                <Plus size={18} /> Add New Item
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-xl font-bold text-slate-900">Add New Inventory Item</h3>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <input type="hidden" name="clinicId" value={clinicId} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-bold text-slate-900 border-b pb-2">Product Details</h4>

                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-slate-700">Medicine Name</label>
                                        <input
                                            required
                                            name="name"
                                            type="text"
                                            placeholder="e.g. Amoxicillin 500mg"
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-slate-700">Description (Optional)</label>
                                        <input
                                            name="description"
                                            type="text"
                                            placeholder="Dosage, form, etc."
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-slate-700">Cost Price ($)</label>
                                            <input
                                                name="costPrice"
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-slate-700">Sell Price ($)</label>
                                            <input
                                                name="salePrice"
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-bold text-slate-900 border-b pb-2">Initial Stock Levels</h4>

                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-slate-700">Central Stock (Upstairs)</label>
                                        <input
                                            name="centralStock"
                                            type="number"
                                            defaultValue={0}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                        />
                                        <p className="text-xs text-slate-400">Main storage area.</p>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-slate-700">Dispensing Stock (Clinic)</label>
                                        <input
                                            name="dispensingStock"
                                            type="number"
                                            defaultValue={0}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                        />
                                        <p className="text-xs text-slate-400">Available for immediate use.</p>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-slate-700">Low Stock Alert Level</label>
                                        <input
                                            name="lowStockLevel"
                                            type="number"
                                            defaultValue={5}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3 border-t border-slate-100 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={isPending}
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-md shadow-blue-500/20"
                                >
                                    {isPending ? 'Creating...' : 'Create Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
