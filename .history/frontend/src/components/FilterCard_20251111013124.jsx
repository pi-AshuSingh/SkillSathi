import React, { useEffect, useState } from 'react'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { Checkbox } from './ui/checkbox'
import { Button } from './ui/button'
import { X } from 'lucide-react'

const filterData = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
  },
  {
    filterType: "Skill Category",
    array: ["Daily Wage Laborer", "Construction Worker", "Electrician", "Plumber", "Carpenter"]
  },
  {
    filterType: "Availability",
    array: ["Full-time", "Part-time", "Daily basis", "Seasonal"]
  },
  {
    filterType: "Experience Level",
    array: ["Beginner", "Intermediate", "Expert"]
  }
]

const FilterCard = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [openSections, setOpenSections] = useState(() => filterData.reduce((acc, cur) => ({ ...acc, [cur.filterType]: true }), {}));
  const dispatch = useDispatch();

  const handleCheckboxChange = (value, isChecked) => {
    if (isChecked) {
      setSelectedFilters(prev => [...prev, value]);
    } else {
      setSelectedFilters(prev => prev.filter(item => item !== value));
    }
  }

  const clearAllFilters = () => {
    setSelectedFilters([]);
  }

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  }

  const removeFilter = (value) => {
    setSelectedFilters(prev => prev.filter(item => item !== value));
  }

  useEffect(() => {
    // Join all selected filters into a single search query
    const query = selectedFilters.join(' ');
    dispatch(setSearchedQuery(query));
  }, [selectedFilters, dispatch]);

  return (
    // Make sidebar sticky so filters stay visible while scrolling
    <aside className='w-full bg-white p-3 rounded-md sticky top-24'>
      <div className='flex items-center justify-between mb-3'>
        <div>
          <h1 className='font-bold text-lg'>Filter Jobs</h1>
          <p className='text-xs text-gray-500'>Refine results by location, skills and availability</p>
        </div>
        <div className='flex items-center gap-2'>
          {selectedFilters.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>
      <hr className='mb-3' />
      {
        filterData.map((data, index) => (
          <div key={index} className='mb-4'>
            <button
              type='button'
              aria-expanded={openSections[data.filterType]}
              onClick={() => toggleSection(data.filterType)}
              className='w-full flex items-center justify-between'
            >
              <h2 className='font-semibold text-md mb-2 text-left'>{data.filterType}</h2>
              <span className='text-sm text-gray-500'>{openSections[data.filterType] ? '−' : '+'}</span>
            </button>

            {openSections[data.filterType] && (
              <div className='mt-2'>
                {data.array.map((item, idx) => {
                  const itemId = `filter-${index}-${idx}`;
                  const isChecked = selectedFilters.includes(item);

                  return (
                    <div className='flex items-center space-x-2 my-2' key={itemId}>
                      <Checkbox 
                        id={itemId}
                        checked={isChecked}
                        onCheckedChange={(checked) => handleCheckboxChange(item, checked)}
                      />
                      <Label 
                        htmlFor={itemId}
                        className="cursor-pointer text-sm font-normal"
                      >
                        {item}
                      </Label>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))
      }
      {selectedFilters.length > 0 && (
        <div className='mt-4 p-2 bg-gray-100 rounded-md'>
          <p className='text-xs font-semibold mb-2'>Active Filters</p>
          <div className='flex flex-wrap gap-2'>
            {selectedFilters.map((filter, idx) => (
              <button
                key={idx}
                onClick={() => removeFilter(filter)}
                className='flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-200'
                aria-label={`Remove filter ${filter}`}
              >
                <span>{filter}</span>
                <X className='w-3 h-3' />
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}

export default FilterCard;
