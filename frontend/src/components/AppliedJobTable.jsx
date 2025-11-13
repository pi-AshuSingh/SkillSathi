import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'
import { CheckCircle2, XCircle, Clock, Building2, MapPin, Calendar, IndianRupee } from 'lucide-react'

const AppliedJobTable = () => {
    const {allAppliedJobs} = useSelector(store=>store.job);
    
    const getStatusBadge = (status) => {
        switch(status.toLowerCase()) {
            case 'accepted':
                return (
                    <Badge className="bg-green-100 text-green-800 border-green-300 hover:bg-green-200 px-3 py-1">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Accepted
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge className="bg-red-100 text-red-800 border-red-300 hover:bg-red-200 px-3 py-1">
                        <XCircle className="w-4 h-4 mr-1" />
                        Rejected
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200 px-3 py-1">
                        <Clock className="w-4 h-4 mr-1" />
                        Pending Review
                    </Badge>
                );
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Applications</h2>
                <p className="text-gray-600 mt-1">Track your job application status</p>
            </div>

            <Table>
                <TableCaption className="text-gray-500">
                    {allAppliedJobs.length > 0 
                        ? `You have applied to ${allAppliedJobs.length} job(s)` 
                        : 'Start applying to jobs to track your applications here'}
                </TableCaption>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">Applied Date</TableHead>
                        <TableHead className="font-semibold">Job Details</TableHead>
                        <TableHead className="font-semibold">Company</TableHead>
                        <TableHead className="font-semibold">Salary</TableHead>
                        <TableHead className="text-right font-semibold">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        allAppliedJobs.length <= 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12">
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <Building2 className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-lg font-medium">No Applications Yet</p>
                                        <p className="text-sm mt-1">Start applying to jobs to see them here</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : allAppliedJobs.map((appliedJob) => (
                            <TableRow key={appliedJob._id} className="hover:bg-gray-50 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="font-medium text-gray-700">
                                            {appliedJob?.createdAt?.split("T")[0]}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <p className="font-semibold text-gray-900">{appliedJob.job?.title}</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <MapPin className="w-3 h-3" />
                                            <span>{appliedJob.job?.location}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center text-white text-xs font-bold">
                                            {appliedJob.job?.company?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-gray-900">
                                            {appliedJob.job?.company?.name}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                                        <IndianRupee className="w-4 h-4 text-gray-500" />
                                        <span>{appliedJob.job?.salary} Rs</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    {getStatusBadge(appliedJob?.status)}
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable