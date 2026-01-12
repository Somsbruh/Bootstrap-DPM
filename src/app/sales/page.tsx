import prisma from '@/lib/prisma'
import { DollarSign, FileText, TrendingUp } from 'lucide-react'
import CreateInvoiceModal from '@/components/sales/create-invoice-modal'
import SalesList from '@/components/sales/sales-list'

export default async function SalesPage() {
    // Mock clinic ID
    const clinic = await prisma.clinic.findFirst({
        where: { name: 'Bayon Dental Clinic' }
    });

    if (!clinic) return <div>Clinic not found</div>

    // Fetch Transactions
    const transactions = await prisma.transaction.findMany({
        where: { clinicId: clinic.id },
        include: {
            patient: true,
            payments: true,
            items: true
        },
        orderBy: { createdAt: 'desc' }
    })

    // Fetch Resources for Modal
    const patients = await prisma.patient.findMany({
        where: { clinicId: clinic.id },
        select: { id: true, name: true }
    })
    const treatments = await prisma.treatment.findMany({
        where: { clinicId: clinic.id }
    })
    const medicines = await prisma.medicine.findMany({
        where: { clinicId: clinic.id }
    })

    // Calculate Stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todaysTransactions = transactions.filter(tx => new Date(tx.createdAt) >= today)
    const dailyRevenue = todaysTransactions.reduce((acc, tx) => acc + tx.totalAmount, 0)

    const unpaidInvoices = transactions.filter(tx => {
        const paid = tx.payments.reduce((sum, p) => sum + p.amount, 0)
        return paid < tx.totalAmount
    }).length

    const totalCollected = transactions.reduce((acc, tx) =>
        acc + tx.payments.reduce((sum, p) => sum + p.amount, 0), 0
    )


    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Financials</h1>
                    <p className="text-slate-500 text-sm mt-1">Track revenue, manage invoices, and record payments.</p>
                </div>
                <CreateInvoiceModal
                    clinicId={clinic.id}
                    patients={patients}
                    treatments={treatments}
                    medicines={medicines}
                />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Revenue Today</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">${dailyRevenue.toFixed(2)}</h3>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                        <TrendingUp size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Total Collected</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">${totalCollected.toFixed(2)}</h3>
                    </div>
                    <div className="bg-green-100 p-3 rounded-xl text-green-600">
                        <DollarSign size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Unpaid Invoices</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">{unpaidInvoices}</h3>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
                        <FileText size={24} />
                    </div>
                </div>
            </div>

            <SalesList transactions={transactions} />
        </div>
    )
}
