/**
 * School type definition
 */
export interface School {
  id?: number | null;
  name?: string | null;
  imageUrl?: string | null;
  createTimestamp?: number | null;
  dispatchingAlgo?: string | null;
  pricingInfo?: PricingInfo | null;
  paymentInfo?: PaymentInfo | null;
}

/**
 * PricingInfo type definition
 */
export interface PricingInfo {
  expressLessonPrice?: number | null;
  privateLessonPrice?: number | null;
  testLessonPrice?: number | null;
  testCarRentalLessonPrice?: number | null;
  testMileagePrice?: number | null;
  referralCommissionPercentage?: number | null;
  bdeCoursePrice?: number | null;
}

/**
 * PaymentInfo type definition
 */
export interface PaymentInfo {
  token?: string | null;
  url?: string | null;
  isConfirmed?: boolean | null;
}

