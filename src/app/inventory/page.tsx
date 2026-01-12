import prisma from '@/lib/prisma'
import { AlertCircle, DollarSign, Package } from 'lucide-react'
import AddInventoryModal from '@/components/inventory/add-item-modal'
import InventoryList from '@/components/inventory/inventory-list'

export default async function InventoryPage() {
    // Mock clinic ID
    const clinic = await prisma.clinic.findFirst({
        where: { name: 'Bayon Dental Clinic' }
    });

    if (!clinic) return <div>Clinic not found</div>

    const inventoryItems = await prisma.inventoryItem.findMany({
        where: { clinicId: clinic.id },
        include: {
            medicine: true
        },
        orderBy: {
            medicine: { name: 'asc' }
        }
    })

    // Calculate Stats
    const totalItems = inventoryItems.length
    const totalValue = inventoryItems.reduce((acc, item) => {
        return acc + ((item.centralStock + item.dispensingStock) * item.medicine.costPrice)
    }, 0)
    const lowStockItems = inventoryItems.filter(item =>
        (item.centralStock + item.dispensingStock) <= item.medicine.lowStockLevel
    ).length

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Inventory</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage medicines, supplies, and stock levels.</p>
                </div>
                <AddInventoryModal clinicId={clinic.id} />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Total Items</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalItems}</h3>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                        <Package size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Inventory Value</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">${totalValue.toFixed(2)}</h3>
                    </div>
                    <div className="bg-green-100 p-3 rounded-xl text-green-600">
                        <DollarSign size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Low Stock Alerts</p>
                        <h3 className={`text-2xl font-bold mt-1 ${lowStockItems > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                            {lowStockItems}
                        </h3>
                    </div>
                    <div className={`p-3 rounded-xl ${lowStockItems > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
                        <AlertCircle size={24} />
                    </div>
                </div>
            </div>

            <InventoryList items={inventoryItems} />
        </div>
    )
}
