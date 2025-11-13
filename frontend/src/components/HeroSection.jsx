import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search, Briefcase, Users, TrendingUp, Award, Shield, Sparkles } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    if(query.trim()) {
      dispatch(setSearchedQuery(query));
      navigate("/browse");
    }
  }

  return (
    <div className='relative text-center overflow-hidden'>
      {/* Animated Background */}
      <div className='absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100'>
        <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]'></div>
      </div>

      <div className='relative flex flex-col gap-6 py-20 max-w-7xl mx-auto px-4'>
        {/* Floating Badge with Animation */}
        <div className='animate-bounce'>
          <span className='inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg border-2 border-white/20 backdrop-blur-sm'>
            <Sparkles className='h-4 w-4' />
            <span>Empowering Skilled Laborers</span>
            <Sparkles className='h-4 w-4' />
          </span>
        </div>
        
        {/* Main Heading with Gradient */}
        <h1 className='text-6xl md:text-7xl font-extrabold leading-tight animate-fade-in'>
          <span className='bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 bg-clip-text text-transparent'>
            Empowering
          </span>{' '}
          <span className='bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
            Skilled Laborers
          </span>
          <br /> 
          <span className='bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent'>
            Through
          </span>{' '}
          <span className='bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent'>
            Fair Employment
          </span>
        </h1>
        
        <p className='text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium'>
          SkillSathi bridges the skill-to-job gap for millions of informal and daily wage workers. 
          <br className='hidden md:block' />
          <span className='text-indigo-600 font-semibold'>Find timely, reliable, and suitable employment opportunities</span> with transparency and fairness.
        </p>

        {/* Stats Section */}
        <div className='flex flex-wrap justify-center gap-8 my-6'>
          <div className='flex flex-col items-center p-4'>
            <div className='text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>10K+</div>
            <div className='text-sm text-gray-600 font-medium'>Active Workers</div>
          </div>
          <div className='flex flex-col items-center p-4'>
            <div className='text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>500+</div>
            <div className='text-sm text-gray-600 font-medium'>Companies</div>
          </div>
          <div className='flex flex-col items-center p-4'>
            <div className='text-4xl font-bold bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent'>98%</div>
            <div className='text-sm text-gray-600 font-medium'>Success Rate</div>
          </div>
        </div>

        {/* Search Box with Enhanced Design */}
        <div className='relative w-full md:w-[70%] mx-auto mt-8 group'>
          <div className='absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000'></div>
          <div className='relative flex shadow-2xl border-2 border-white pl-6 rounded-full items-center gap-4 bg-white'>
            <Search className='h-6 w-6 text-indigo-600' />
            <input
              type="text"
              placeholder='Search by skill, location, or job type...'
              onChange={(e) => setQuery(e.target.value)}
              className='outline-none border-none w-full py-5 text-gray-700 placeholder:text-gray-400 text-lg'
              value={query}
            />
            <Button 
              onClick={searchJobHandler} 
              className="rounded-r-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-10 py-7 text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Search className='h-5 w-5 mr-2' />
              Search Jobs
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto'>
          <div className='group p-6 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer'>
            <div className='w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
              <Briefcase className='h-7 w-7 text-white' />
            </div>
            <h3 className='text-lg font-bold text-gray-800 mb-2'>Real-time Matching</h3>
            <p className='text-sm text-gray-600'>AI-powered job matching connects you with the perfect opportunities instantly</p>
          </div>

          <div className='group p-6 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer'>
            <div className='w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
              <Shield className='h-7 w-7 text-white' />
            </div>
            <h3 className='text-lg font-bold text-gray-800 mb-2'>Transparent Hiring</h3>
            <p className='text-sm text-gray-600'>Complete visibility in hiring process with fair wage calculations and reviews</p>
          </div>

          <div className='group p-6 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer'>
            <div className='w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
              <TrendingUp className='h-7 w-7 text-white' />
            </div>
            <h3 className='text-lg font-bold text-gray-800 mb-2'>Economic Empowerment</h3>
            <p className='text-sm text-gray-600'>Track wages, receive payments securely, and build your professional profile</p>
          </div>
        </div>

        {/* Mission Statement with Enhanced Design */}
        <div className='mt-12 p-8 bg-gradient-to-r from-white to-indigo-50 rounded-3xl shadow-xl border-2 border-indigo-200 max-w-4xl mx-auto backdrop-blur-sm'>
          <div className='flex items-center gap-3 mb-4'>
            <Award className='h-8 w-8 text-indigo-600' />
            <h3 className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>Our Mission</h3>
          </div>
          <p className='text-base text-gray-700 leading-relaxed'>
            Connecting skilled laborers and employers through a <span className='font-semibold text-indigo-600'>user-friendly, inclusive digital marketplace</span> 
            {' '}that promotes fairness, transparency, and economic empowerment for the informal workforce. We believe every worker deserves 
            <span className='font-semibold text-purple-600'> dignified employment</span> and <span className='font-semibold text-pink-600'>fair compensation</span>.
          </p>
          <div className='flex items-center gap-4 mt-6 justify-center'>
            <div className='flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full'>
              <Users className='h-4 w-4 text-indigo-600' />
              <span className='text-sm font-medium text-indigo-700'>Community First</span>
            </div>
            <div className='flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full'>
              <Shield className='h-4 w-4 text-purple-600' />
              <span className='text-sm font-medium text-purple-700'>100% Secure</span>
            </div>
            <div className='flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-full'>
              <Award className='h-4 w-4 text-pink-600' />
              <span className='text-sm font-medium text-pink-700'>Award Winning</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection;
