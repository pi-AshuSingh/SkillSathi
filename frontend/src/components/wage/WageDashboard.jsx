import { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { IndianRupee, Calendar, Briefcase, TrendingUp, Wallet, Clock, CreditCard, Building2 } from 'lucide-react'
import axios from 'axios'
import { WAGE_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import Navbar from '../shared/Navbar'
import { useNavigate } from 'react-router-dom'

const WageDashboard = () => {
    const [wageRecords, setWageRecords] = useState([])
    const [summary, setSummary] = useState({
        totalEarned: 0,
        totalPaid: 0,
        totalRemaining: 0
    })
    const [loading, setLoading] = useState(true)
    const { user } = useSelector(store => store.auth)
    const isWorker = user?.role === 'student'
    const navigate = useNavigate()

    useEffect(() => {
        fetchWageRecords()
    }, [])

    const fetchWageRecords = async () => {
        try {
            const endpoint = isWorker ? '/worker' : '/employer'
            const response = await axios.get(`${WAGE_API_END_POINT}${endpoint}`, {
                withCredentials: true
            })

            if (response.data.success) {
                setWageRecords(response.data.wageRecords)
                setSummary(response.data.summary)
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || 'Failed to fetch wage records')
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { className: 'bg-yellow-500 text-white', text: 'Pending' },
            partially_paid: { className: 'bg-blue-500 text-white', text: 'Partially Paid' },
            fully_paid: { className: 'bg-green-500 text-white', text: 'Fully Paid' },
            overdue: { className: 'bg-red-500 text-white', text: 'Overdue' }
        }

        const config = statusConfig[status] || statusConfig.pending
        return <Badge className={config.className}>{config.text}</Badge>
    }

    const getWageTypeText = (type) => {
        const types = {
            daily: 'Daily',
            monthly: 'Monthly',
            hourly: 'Hourly',
            project: 'Project-based'
        }
        return types[type] || type
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="max-w-7xl mx-auto my-10 px-4">
                    <h1 className="text-2xl font-bold">Loading wage records...</h1>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto my-10 px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Wage Dashboard</h1>
                        <p className="text-gray-600 mt-1">
                            {isWorker ? 'Track your earnings and payments' : 'Manage worker wages and payments'}
                        </p>
                    </div>
                    {isWorker && (
                        <Button 
                            onClick={() => navigate('/bank-upi-setup')}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        >
                            <Building2 className="w-4 h-4 mr-2" />
                            Setup Bank/UPI
                        </Button>
                    )}
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Earned</p>
                                <div className="flex items-center gap-1">
                                    <IndianRupee className="w-6 h-6 text-blue-700" />
                                    <p className="text-3xl font-bold text-blue-700">{summary.totalEarned}</p>
                                </div>
                            </div>
                            <TrendingUp className="w-12 h-12 text-blue-600 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                                <div className="flex items-center gap-1">
                                    <IndianRupee className="w-6 h-6 text-green-700" />
                                    <p className="text-3xl font-bold text-green-700">{summary.totalPaid}</p>
                                </div>
                            </div>
                            <CreditCard className="w-12 h-12 text-green-600 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg border border-orange-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Remaining Balance</p>
                                <div className="flex items-center gap-1">
                                    <IndianRupee className="w-6 h-6 text-orange-700" />
                                    <p className="text-3xl font-bold text-orange-700">{summary.totalRemaining}</p>
                                </div>
                            </div>
                            <Wallet className="w-12 h-12 text-orange-600 opacity-20" />
                        </div>
                    </div>
                </div>

                {/* Wage Records Table */}
                {wageRecords.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                        <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Wage Records Yet</h3>
                        <p className="text-gray-500">
                            {isWorker 
                                ? 'No wage records have been created for you yet' 
                                : 'You haven\'t created any wage records yet'}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        <Table>
                            <TableCaption>
                                A list of all wage records
                            </TableCaption>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="font-semibold">{isWorker ? 'Employer' : 'Worker'}</TableHead>
                                    <TableHead className="font-semibold">Job</TableHead>
                                    <TableHead className="font-semibold">Period</TableHead>
                                    <TableHead className="font-semibold">Wage Type</TableHead>
                                    <TableHead className="font-semibold">Days/Hours</TableHead>
                                    <TableHead className="font-semibold">Total Earned</TableHead>
                                    <TableHead className="font-semibold">Paid</TableHead>
                                    <TableHead className="font-semibold">Remaining</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="text-right font-semibold">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {wageRecords.map((record) => (
                                    <TableRow key={record._id} className="hover:bg-gray-50">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                                                    {isWorker 
                                                        ? record.employer?.fullname?.charAt(0).toUpperCase()
                                                        : record.worker?.fullname?.charAt(0).toUpperCase()
                                                    }
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {isWorker ? record.employer?.fullname : record.worker?.fullname}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {isWorker ? record.employer?.email : record.worker?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Briefcase className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm">{record.job?.title}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                <Calendar className="w-3 h-3" />
                                                <span>{formatDate(record.periodStart)}</span>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                to {formatDate(record.periodEnd)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                                {getWageTypeText(record.wageType)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {record.wageType === 'daily' && `${record.daysWorked} days`}
                                                {record.wageType === 'hourly' && `${record.hoursWorked} hrs`}
                                                {record.wageType === 'monthly' && 'Monthly'}
                                                {record.wageType === 'project' && 'Project'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 font-semibold text-blue-700">
                                                <IndianRupee className="w-4 h-4" />
                                                <span>{record.totalEarned}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 font-semibold text-green-700">
                                                <IndianRupee className="w-4 h-4" />
                                                <span>{record.totalPaid}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 font-semibold text-orange-700">
                                                <IndianRupee className="w-4 h-4" />
                                                <span>{record.remainingBalance}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => navigate(`/wage/${record._id}`)}
                                                className="hover:bg-indigo-50"
                                            >
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default WageDashboard
