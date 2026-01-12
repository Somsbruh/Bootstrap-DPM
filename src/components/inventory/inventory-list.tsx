import { AlertTriangle, Package } from 'lucide-react'

export default function InventoryList({ items }: { items: any[] }) {
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                    <Package size={32} />
                </div>
                <p className="text-slate-500 font-medium">No items found</p>
                <p className="text-slate-400 text-sm">Add your first medicine or supply item.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                            <th className="px-6 py-4">Item Name</th>
                            <th className="px-6 py-4 text-center">Central Stock</th>
                            <th className="px-6 py-4 text-center">Dispensing</th>
                            <th className="px-6 py-4 text-right">Cost / Sell</th>
                            <th className="px-6 py-4 text-right">Total Value</th>
                            <th className="px-6 py-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {items.map((item) => {
                            const totalStock = item.centralStock + item.dispensingStock
                            const isLowStock = totalStock <= item.medicine.lowStockLevel
                            const totalValue = totalStock * item.medicine.costPrice

                            return (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-semibold text-slate-900">{item.medicine.name}</p>
                                            {item.medicine.description && (
                                                <p className="text-xs text-slate-500">{item.medicine.description}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-600">
                                        <span className="bg-slate-100 px-2 py-1 rounded text-xs font-semibold">
                                            {item.centralStock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-600">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                                            {item.dispensingStock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-slate-900 font-medium">${item.medicine.salePrice.toFixed(2)}</span>
                                            <span className="text-slate-400 text-xs">${item.medicine.costPrice.toFixed(2)} cost</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-600 font-medium">
                                        ${totalValue.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {isLowStock ? (
                                            <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-bold">
                                                <AlertTriangle size={12} /> Low Stock
                                            </span>
                                        ) : (
                                            <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold">
                                                In Stock
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
