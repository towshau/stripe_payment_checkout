import React, { useState, useEffect } from 'react';
import { products } from '../lib/products';
import { CreditCard, Building, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

type PaymentMethod = 'card_stripe' | 'bank_bex' | 'invoice' | '';

export default function ProductPaymentForm() {
  const [productId, setProductId] = useState<string>('');
  const [priceDollars, setPriceDollars] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('');
  
  const [bankDetails, setBankDetails] = useState({ bsb: '', accountNumber: '', accountName: '' });
  const [invoiceNotes, setInvoiceNotes] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  // Update price when product changes
  useEffect(() => {
    if (productId) {
      const product = products.find(p => p.id === productId);
      if (product) {
        setPriceDollars((product.defaultPriceCents / 100).toFixed(2));
      }
    }
  }, [productId]);

  const priceCents = Math.round(parseFloat(priceDollars || '0') * 100);

  const isValid = () => {
    if (!productId) return false;
    if (isNaN(priceCents) || priceCents < 50) return false;
    if (!paymentMethod) return false;
    
    if (paymentMethod === 'bank_bex') {
      if (!bankDetails.bsb || !bankDetails.accountNumber || !bankDetails.accountName) return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid()) return;
    
    setLoading(true);
    setStatus({ type: null, message: '' });
    
    const payload = {
      productId,
      priceCents,
      currency: 'AUD',
      paymentMethod,
      details: paymentMethod === 'bank_bex' ? bankDetails : paymentMethod === 'invoice' ? { notes: invoiceNotes } : {}
    };

    try {
      // Stub async function
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Payment initialized:', payload);
      setStatus({ type: 'success', message: 'Payment initialized successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to initialize payment.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]">
      <div className="p-6 sm:p-8 overflow-y-auto flex-1">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Complete Payment</h2>
        
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Product & Price */}
          <section>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">1. Order Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select 
                  value={productId} 
                  onChange={e => setProductId(e.target.value)}
                  className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                >
                  <option value="" disabled>Select a product</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (AUD)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0.50"
                    value={priceDollars}
                    onChange={e => setPriceDollars(e.target.value)}
                    className="w-full rounded-lg border-gray-300 border pl-7 p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
                {priceCents > 0 && priceCents < 50 && (
                  <p className="text-red-500 text-xs mt-1">Minimum amount is $0.50</p>
                )}
              </div>
            </div>
          </section>

          {/* Step 2: Payment Method */}
          <section>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">2. Payment Method</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card_stripe')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'card_stripe' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
              >
                <CreditCard className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('bank_bex')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'bank_bex' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
              >
                <Building className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">Bank</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('invoice')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'invoice' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
              >
                <FileText className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">Invoice</span>
              </button>
            </div>
          </section>

          {/* Step 3: Payment Details */}
          {paymentMethod && (
            <section className="animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">3. Payment Details</h3>
              
              {paymentMethod === 'card_stripe' && (
                <div className="p-4 border border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center min-h-[120px]">
                  <CreditCard className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-gray-500 text-sm text-center">
                    Stripe PaymentElement will mount here.<br/>
                    <span className="text-xs opacity-75">(Requires Stripe Elements provider)</span>
                  </p>
                </div>
              )}

              {paymentMethod === 'bank_bex' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                    <input 
                      type="text" 
                      value={bankDetails.accountName}
                      onChange={e => setBankDetails({...bankDetails, accountName: e.target.value})}
                      className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">BSB</label>
                      <input 
                        type="text" 
                        value={bankDetails.bsb}
                        onChange={e => setBankDetails({...bankDetails, bsb: e.target.value})}
                        className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        placeholder="000-000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                      <input 
                        type="text" 
                        value={bankDetails.accountNumber}
                        onChange={e => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                        className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        placeholder="12345678"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'invoice' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                  <textarea 
                    value={invoiceNotes}
                    onChange={e => setInvoiceNotes(e.target.value)}
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                    placeholder="E.g., Send to accounts payable"
                    rows={3}
                  />
                </div>
              )}
            </section>
          )}
          
          {status.message && (
            <div className={`p-4 rounded-xl flex items-start gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
              <p className="text-sm font-medium">{status.message}</p>
            </div>
          )}
        </form>
      </div>
      
      <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm sticky bottom-0 z-10">
        <button
          type="submit"
          form="payment-form"
          disabled={!isValid() || loading}
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Initialize Payment " + (priceCents > 0 && !isNaN(priceCents) ? `($${(priceCents / 100).toFixed(2)})` : '')
          )}
        </button>
      </div>
    </div>
  );
}
