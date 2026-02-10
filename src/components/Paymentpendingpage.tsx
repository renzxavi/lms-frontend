'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Clock, Loader2, Mail, ArrowRight } from 'lucide-react';

export default function PaymentPendingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const status = searchParams.get('status');
    const paymentId = searchParams.get('payment_id');
    
    console.log('Payment Pending:', { status, paymentId });
  }, [searchParams]);

  const handleCheckStatus = () => {
    setChecking(true);
    // Aquí podrías hacer una llamada al backend para verificar el estado
    setTimeout(() => {
      setChecking(false);
      router.push('/login');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100/30 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-12 h-12 text-yellow-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Pago Pendiente
          </h1>
          
          <p className="text-gray-600 mb-6">
            Tu pago está siendo procesado. Esto puede tomar algunos minutos.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-yellow-700 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-semibold text-yellow-900 mb-1">
                  Te notificaremos por correo
                </p>
                <p className="text-sm text-yellow-800">
                  Recibirás un email cuando tu pago sea confirmado y tu cuenta esté activa.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-blue-900 mb-2">
              Métodos de pago que pueden tardar:
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Transferencia bancaria (hasta 24-48hs)</li>
              <li>• Pago en efectivo (hasta 24hs)</li>
              <li>• Débito automático (hasta 48hs)</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleCheckStatus}
              disabled={checking}
              className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {checking ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  Verificar Estado
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <button
              onClick={() => router.push('/')}
              className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-all"
            >
              Volver al Inicio
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Estado actual: <span className="font-semibold text-yellow-700">Pendiente de confirmación</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}