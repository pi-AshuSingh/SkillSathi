import { setSingleCompany } from '@/redux/companySlice'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetCompanyById = (companyId) => {
    const dispatch = useDispatch();
    useEffect(()=>{
        if (!companyId) {
            // nothing to fetch
            return;
        }

        const fetchSingleCompany = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`,{withCredentials:true});
                console.log('useGetCompanyById - company:', res.data.company);
                if(res.data.success){
                    dispatch(setSingleCompany(res.data.company));
                } else {
                    console.warn('useGetCompanyById - unexpected response', res.data);
                }
            } catch (error) {
                // Log axios error details to help debug 401/403 issues
                if (error?.response) {
                    console.error('useGetCompanyById - server responded with', error.response.status, error.response.data);
                } else if (error?.request) {
                    console.error('useGetCompanyById - no response received, request:', error.request);
                } else {
                    console.error('useGetCompanyById - error', error.message);
                }
            }
        }
        fetchSingleCompany();
    },[companyId, dispatch])
}

export default useGetCompanyById