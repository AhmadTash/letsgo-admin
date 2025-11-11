/**
 * Job type definition
 */
export interface Job {
  id?: number | null;
  trainerId?: number | null;
  customerId?: number | null;
  type?: string | null;
  customerNote?: string | null;
  trainerNote?: string | null;
  durationInHours?: string | null;
  currentStatus?: string | null;
  pricing?: Pricing | null;
  statusHistory?: StatusHistoryItem[] | null;
  offeredTrainers?: number[] | null;
  subJobs?: SubJob[] | null;
  timing?: Timing | null;
  paymentInfo?: PaymentInfo | null;
  paymentTransfers?: PaymentTransfer[] | null;
}

/**
 * Pricing information
 */
export interface Pricing {
  basePrice?: number | null;
  totalPrice?: number | null;
  taxPercentage?: number | null;
  taxPrice?: number | null;
  platformCommissionBasePrice?: number | null;
  platformCommissionPercentage?: number | null;
  trainerBaseIncome?: number | null;
  trainerIncomeTax?: number | null;
  trainerTotalIncome?: number | null;
  platformCommissionTaxPrice?: number | null;
  platformCommissionTotalPrice?: number | null;
  referralCommssionBasePrice?: number | null;
  referralCommssionPercentage?: number | null;
  referralCommissionTaxPrice?: number | null;
  referralCommissionTotalPrice?: number | null;
  paymentGatewayFee?: number | null;
  referralCode?: string | null;
}

/**
 * Status history item
 */
export interface StatusHistoryItem {
  status?: string | null;
  timestamp?: number | null;
  initiatorType?: string | null;
}

/**
 * Sub job information
 */
export interface SubJob {
  durationInHours?: number | null;
  startTimestamp?: number | null;
  endTimestamp?: number | null;
  status?: string | null;
}

/**
 * Timing information
 */
export interface Timing {
  createTimestamp?: number | null;
  startTimestamp?: number | null;
  completionTimestamp?: number | null;
  paymentConfirmationTimestamp?: number | null;
}

/**
 * Payment information
 */
export interface PaymentInfo {
  intentStatus?: string | null;
  token?: string | null;
  createTimestamp?: number | null;
  amount?: number | null;
  id?: string | null;
  refundDetails?: RefundDetails | null;
}

/**
 * Refund details
 */
export interface RefundDetails {
  isRefundRequested?: boolean | null;
  refundStatus?: string | null;
  refundType?: string | null;
  partialRefundAmount?: number | null;
  isTestPayment?: boolean | null;
}

/**
 * Payment transfer information
 */
export interface PaymentTransfer {
  transferId?: number | null;
  transferType?: string | null;
  transferStatus?: string | null;
  amount?: number | null;
  reversedAmount?: number | null;
  transactionId?: string | null;
  destination?: string | null;
  destinationPayment?: string | null;
  balanceTransactio?: string | null;
  sourceTransaction?: string | null;
  transferGroup?: string | null;
  sourceType?: string | null;
  createTimestamp?: number | null;
  updateTimestamp?: number | null;
}

