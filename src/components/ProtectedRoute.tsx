'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireStudent?: boolean;
  requirePayment?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false,
  requireStudent = false,
  requirePayment = false
}: ProtectedRouteProps) {
  const { user, loading, isAdmin, isStudent, paymentVerified } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // No autenticado
      if (!user) {
        router.push('/login');
        return;
      }

      // Requiere ser admin
      if (requireAdmin && !isAdmin) {
        router.push('/dashboard');
        return;
      }

      // Requiere ser estudiante
      if (requireStudent && !isStudent) {
        router.push('/admin/students');
        return;
      }

      // Requiere pago verificado
      if (requirePayment && isAdmin && !paymentVerified) {
        router.push('/payment/pending');
        return;
      }
    }
  }, [user, loading, isAdmin, isStudent, paymentVerified, requireAdmin, requireStudent, requirePayment, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requireAdmin && !isAdmin) {
    return null;
  }

  if (requireStudent && !isStudent) {
    return null;
  }

  if (requirePayment && isAdmin && !paymentVerified) {
    return null;
  }

  return <>{children}</>;
}   