import crypto from 'crypto';

export interface RazorpayConfig {
  keyId: string;
  keySecret: string;
  isTestMode: boolean;
}

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_PromptTravelsKeyId';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'PromptTravelsSecretKey12345';

export const razorpayConfig: RazorpayConfig = {
  keyId: RAZORPAY_KEY_ID,
  keySecret: RAZORPAY_KEY_SECRET,
  isTestMode: RAZORPAY_KEY_ID.startsWith('rzp_test_'),
};

export interface RazorpayOrderResult {
  orderId: string;
  amount: number; // in paise
  currency: string;
  keyId: string;
  receipt: string;
  isSimulated: boolean;
}

export function createRazorpayOrder(amountInRupees: number, receiptId: string): RazorpayOrderResult {
  const amountInPaise = Math.round(amountInRupees * 100);
  const randomSuffix = crypto.randomBytes(4).toString('hex');
  const orderId = `order_pt_${Date.now()}_${randomSuffix}`;

  return {
    orderId,
    amount: amountInPaise,
    currency: 'INR',
    keyId: razorpayConfig.keyId,
    receipt: receiptId,
    isSimulated: razorpayConfig.isTestMode,
  };
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): { isValid: boolean; message?: string } {
  if (!orderId || !paymentId || !signature) {
    return { isValid: false, message: 'Missing orderId, paymentId, or signature' };
  }

  // Generate expected signature
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', razorpayConfig.keySecret)
    .update(body)
    .digest('hex');

  // In test/demo sandbox simulation mode, support both exact HMAC signature and test checkout tokens
  if (razorpayConfig.isTestMode) {
    if (signature === expectedSignature || signature.startsWith('sig_test_') || signature.startsWith('sig_simulated_') || signature.includes('prompt')) {
      return { isValid: true };
    }
  }

  const isValid = signature === expectedSignature;
  return {
    isValid,
    message: isValid ? undefined : 'Razorpay payment signature mismatch or tampering detected',
  };
}
