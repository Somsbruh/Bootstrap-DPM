import { FileText, CheckCircle2 } from 'lucide-react'

export default function TreatmentTimeline({ transactions }: { transactions: any[] }) {
    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                    <FileText size={32} />
                </div>
                <p className="text-slate-500 font-medium">No treatment history</p>
                <p className="text-slate-400 text-sm">New treatments will appear here.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {transactions.map((tx) => (
                <div key={tx.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <CheckCircle2 size={16} />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900">
                                    Visit on {new Date(tx.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {new Date(tx.createdAt).toLocaleTimeString()} • Dr. Mock Doctor
                                </p>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tx.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                            {tx.status}
                        </span>
                    </div>

                    <div className="p-4">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-slate-500 border-b border-slate-100">
                                    <th className="text-left py-2 font-medium">Description</th>
                                    <th className="text-center py-2 font-medium">Qty</th>
                                    <th className="text-right py-2 font-medium">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {tx.items.length > 0 ? tx.items.map((item: any) => (
                                    <tr key={item.id}>
                                        <td className="py-3 text-slate-700">
                                            {item.treatment?.name || item.medicine?.name || 'Unknown Item'}
                                        </td>
                                        <td className="py-3 text-center text-slate-600">{item.quantity}</td>
                                        <td className="py-3 text-right text-slate-900 font-medium">
                                            ${item.subtotal.toFixed(2)}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="py-3 text-center text-slate-400 italic">
                                            No items recorded
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr className="border-t border-slate-100">
                                    <td colSpan={2} className="py-3 text-right font-bold text-slate-700">Total</td>
                                    <td className="py-3 text-right font-bold text-blue-600 text-lg">
                                        ${tx.totalAmount.toFixed(2)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    )
}
