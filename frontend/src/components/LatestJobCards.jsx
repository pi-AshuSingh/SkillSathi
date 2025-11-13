import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { IndianRupee } from 'lucide-react'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    return (
        <div onClick={()=> navigate(`/description/${job._id}`)} className='p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer hover:shadow-2xl transition-shadow'>
            <div>
                <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                <p className='text-sm text-gray-500'>India</p>
            </div>
            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>
            
            {/* Advance Payment Badge */}
            {job?.company?.advancePayment > 0 && (
                <div className='mt-3'>
                    <Badge className='bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 flex items-center gap-1 w-fit'>
                        <IndianRupee className="w-3 h-3" />
                        <span className='font-semibold'>{job?.company?.advancePayment.toLocaleString('en-IN')}</span>
                        <span className='font-normal'>Advance</span>
                    </Badge>
                </div>
            )}
            
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary}Rs</Badge>
            </div>

        </div>
    )
}

export default LatestJobCards