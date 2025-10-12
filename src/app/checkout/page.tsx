'use client'

import { useCheckout } from '@/lib/hooks/useCart'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function CheckoutPage() {
  const { setShippingAddress, setPaymentMethod, completeOrder, getOrderSummary } = useCheckout()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const summary = getOrderSummary()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const order = await completeOrder()
      router.push(`/order-success?order_id=${order.id}`)
    } catch (error) {
      console.error('Checkout failed:', error)
      alert(error instanceof Error ? error.message : 'Checkout failed')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Shipping Form */}
      <div className="bg-white p-6 rounded-lg mb-4">
        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
        {/* Add form fields here */}
      </div>

      {/* Payment Method */}
      <div className="bg-white p-6 rounded-lg mb-4">
        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
        {/* Add payment options here */}
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${summary.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>${summary.shipping.toFixed(2)}</span>
          </div>
          {summary.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-${summary.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t pt-2 flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>${summary.total.toFixed(2)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-primary text-white py-4 rounded-full font-semibold mt-6"
        >
          {isProcessing ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </form>
  )
}
