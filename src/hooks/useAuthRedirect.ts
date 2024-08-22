// hooks/useAuthRedirect.ts

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

const useAuthRedirect = () => {
  const router = useRouter()

  useEffect(() => {
    const token = sessionStorage.getItem('token')

    if (!token) {
      router.push('/en/login')
    }
  }, [router])
}

export default useAuthRedirect
