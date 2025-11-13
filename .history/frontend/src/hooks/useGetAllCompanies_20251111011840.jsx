import { setCompanies} from '@/redux/companySlice'
import { COMPANY_API_END_POINT} from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllCompanies = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchCompanies = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/get`,{withCredentials:true});
                console.log('useGetAllCompanies - fetched', res?.data?.companies?.length ?? 0);
                if(res.data.success){
                    dispatch(setCompanies(res.data.companies));
                } else {
                    console.warn('useGetAllCompanies - unexpected response', res.data);
                }
            } catch (error) {
                if (error?.response) {
                    console.error('useGetAllCompanies - server responded with', error.response.status, error.response.data);
                } else if (error?.request) {
                    console.error('useGetAllCompanies - no response received, request:', error.request);
                } else {
                    console.error('useGetAllCompanies - error', error.message);
                }
            }
        }
        fetchCompanies();
    },[dispatch])
}

export default useGetAllCompanies