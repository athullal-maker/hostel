import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, hostelId, roomType, guestName, guestEmail } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid booking amount" },
        { status: 400 }
      );
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    // Check if live Razorpay keys are configured
    if (key_id && key_secret && key_id !== "rzp_test_placeholder") {
      const razorpay = new Razorpay({
        key_id,
        key_secret,
      });

      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100), // Amount in paise
        currency: "INR",
        receipt: `rcpt_${Date.now().toString().slice(-8)}`,
        notes: {
          hostelId,
          roomType,
          guestName,
          guestEmail,
        },
      });

      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      });
    }

    // Development/Test fallback order
    const mockOrderId = `order_kerala_${Date.now()}`;
    return NextResponse.json({
      success: true,
      orderId: mockOrderId,
      amount: amount * 100,
      currency: "INR",
      isDemo: true,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to initialize order",
      },
      { status: 500 }
    );
  }
}
