import { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge';
import { CheckCircle2, XCircle, Download, Mail, Phone, Calendar, Wallet } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { Button } from '../ui/button';
import PaymentModal from '../payment/PaymentModal';

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const [applicationStatuses, setApplicationStatuses] = useState({});
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                setApplicationStatuses(prev => ({ ...prev, [id]: status.toLowerCase() }));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to update status');
        }
    }

    const getStatusBadge = (item) => {
        const currentStatus = applicationStatuses[item._id] || item.status;
        
        if (currentStatus === 'accepted') {
            return <Badge className="bg-green-100 text-green-800 border-green-300 hover:bg-green-200">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Accepted
            </Badge>;
        } else if (currentStatus === 'rejected') {
            return <Badge className="bg-red-100 text-red-800 border-red-300 hover:bg-red-200">
                <XCircle className="w-3 h-3 mr-1" />
                Rejected
            </Badge>;
        } else {
            return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200">
                ⏳ Pending
            </Badge>;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Job Applicants</h2>
                <p className="text-gray-600 mt-1">Review and manage applications for this position</p>
            </div>

            <Table>
                <TableCaption className="text-gray-500">
                    {applicants?.applications?.length > 0 
                        ? `Total ${applicants.applications.length} applicant(s) for this job` 
                        : 'No applications received yet'}
                </TableCaption>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">Candidate</TableHead>
                        <TableHead className="font-semibold">Contact Info</TableHead>
                        <TableHead className="font-semibold">Resume</TableHead>
                        <TableHead className="font-semibold">Applied Date</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants?.applications?.map((item) => {
                            const currentStatus = applicationStatuses[item._id] || item.status;
                            const isProcessed = currentStatus === 'accepted' || currentStatus === 'rejected';
                            
                            return (
                                <TableRow key={item._id} className="hover:bg-gray-50 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                                {item?.applicant?.fullname?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{item?.applicant?.fullname}</p>
                                                <p className="text-sm text-gray-500">{item?.applicant?.profile?.bio || 'No bio available'}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <span className="truncate max-w-[200px]">{item?.applicant?.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                <span>{item?.applicant?.phoneNumber}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {item.applicant?.profile?.resume ? (
                                            <a 
                                                href={item?.applicant?.profile?.resume} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors border border-blue-200"
                                            >
                                                <Download className="w-4 h-4" />
                                                <span className="font-medium">Download</span>
                                            </a>
                                        ) : (
                                            <Badge variant="outline" className="text-gray-500">No Resume</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span>{item?.createdAt?.split("T")[0]}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(item)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {!isProcessed ? (
                                                <>
                                                    <Button
                                                        onClick={() => statusHandler('accepted', item?._id)}
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4 mr-1" />
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        onClick={() => statusHandler('rejected', item?._id)}
                                                        size="sm"
                                                        variant="destructive"
                                                        className="shadow-sm"
                                                    >
                                                        <XCircle className="w-4 h-4 mr-1" />
                                                        Reject
                                                    </Button>
                                                </>
                                            ) : currentStatus === 'accepted' ? (
                                                <Button
                                                    onClick={() => {
                                                        setSelectedApplicant(item);
                                                        setPaymentModalOpen(true);
                                                    }}
                                                    size="sm"
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                                                >
                                                    <Wallet className="w-4 h-4 mr-1" />
                                                    Pay
                                                </Button>
                                            ) : (
                                                <Badge variant="outline" className="text-gray-500">
                                                    Processed
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    }
                </TableBody>
            </Table>

            {/* Payment Modal */}
            {selectedApplicant && (
                <PaymentModal
                    open={paymentModalOpen}
                    setOpen={setPaymentModalOpen}
                    worker={selectedApplicant.applicant}
                    job={{ _id: applicants._id, title: applicants.title, salary: applicants.salary }}
                    application={selectedApplicant}
                />
            )}
        </div>
    )
}

export default ApplicantsTable