'use client';

import { X, CreditCard, Wallet, Building2, Smartphone, Shield, ChevronRight } from 'lucide-react';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMethod: (method: string) => void;
}

export default function PaymentMethodModal({ isOpen, onClose, onSelectMethod }: PaymentMethodModalProps) {
  if (!isOpen) return null;

  const paymentMethods = [
    {
      id: 'mercadopago',
      name: 'Mercado Pago',
      icon: Wallet,
      description: 'Tarjetas de crédito/débito, PagoFácil, Redpagos',
      badge: 'Recomendado',
      popular: true
    },
    {
      id: 'credit_card',
      name: 'Tarjeta de Crédito',
      icon: CreditCard,
      description: 'Visa, Mastercard, American Express',
      badge: null,
      popular: false
    },
    {
      id: 'bank_transfer',
      name: 'Transferencia Bancaria',
      icon: Building2,
      description: 'Transferencia directa desde tu banco',
      badge: null,
      popular: false
    },
    {
      id: 'abitab',
      name: 'Abitab/Red Pagos',
      icon: Smartphone,
      description: 'Paga en efectivo en locales físicos',
      badge: null,
      popular: false
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Método de pago</h2>
              <p className="text-gray-600 mt-1 text-sm">Seleccione su forma de pago preferida</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-lg transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="p-8 space-y-3 overflow-y-auto flex-1">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                onClick={() => onSelectMethod(method.id)}
                className="w-full bg-white border-2 border-gray-200 hover:border-blue-500 rounded-lg p-5 transition-all group relative overflow-hidden"
              >
                {method.popular && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
                    {method.badge}
                  </div>
                )}
                
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 group-hover:bg-blue-50 p-3 rounded-lg transition-colors">
                    <Icon className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900 text-base">{method.name}</h3>
                    <p className="text-gray-600 text-sm mt-0.5">{method.description}</p>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-8 py-5 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-5 h-5 text-green-600" />
              <span>Pago seguro y encriptado</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Monto total</p>
              <p className="text-lg font-semibold text-gray-900">$1000 UYU</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}