import React, { useEffect, useState, Suspense } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
const MapFinder = React.lazy(() => import('./MapFinder'))
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

// const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        if (searchedQuery) {
            // Split the query by spaces to get individual filter terms
            const filterTerms = searchedQuery.toLowerCase().split(' ').filter(term => term.length > 0);
            
            const filteredJobs = allJobs.filter((job) => {
                // Check if any of the filter terms match job properties
                return filterTerms.some(term => 
                    job.title.toLowerCase().includes(term) ||
                    job.description.toLowerCase().includes(term) ||
                    job.location.toLowerCase().includes(term) ||
                    (job.requirements && job.requirements.some(req => req.toLowerCase().includes(term))) ||
                    (job.jobType && job.jobType.toLowerCase().includes(term)) ||
                    (job.experienceLevel && job.experienceLevel.toString().toLowerCase().includes(term))
                );
            });
            setFilterJobs(filteredJobs);
        } else {
            setFilterJobs(allJobs);
        }
    }, [allJobs, searchedQuery]);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5 px-4'>
                <div className='flex gap-5 flex-col md:flex-row'>
                    <div className='w-full md:w-1/4'>
                        <div className="mb-4">
                            {!showMap ? (
                                <div className="p-4 rounded border border-dashed border-gray-200 bg-white">
                                    <div className="text-sm text-gray-700 mb-2">Map Finder is available to locate nearby jobs.</div>
                                    <div className="flex gap-2">
                                        <button
                                            onMouseEnter={() => import('./MapFinder')}
                                            onClick={() => setShowMap(true)}
                                            className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                        >
                                            Open map tools
                                        </button>
                                        <button
                                            className="px-3 py-2 bg-gray-100 text-gray-800 rounded text-sm"
                                            onClick={() => { navigator.geolocation ? navigator.geolocation.getCurrentPosition(()=>{}) : null }}
                                        >
                                            Use my location
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Suspense fallback={<div className="p-3 rounded bg-gray-50 text-sm">Loading map tools…</div>}>
                                    <MapFinder />
                                </Suspense>
                            )}
                        </div>
                        <FilterCard />
                    </div>
                    {
                        filterJobs.length <= 0 ? <span>Job not found</span> : (
                            <div className='flex-1 h-auto md:h-[80vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}>
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>


        </div>
    )
}

export default Jobs