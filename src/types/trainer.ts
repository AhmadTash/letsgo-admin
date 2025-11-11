/**
 * Trainer type definition
 */
export interface Trainer {
  id?: number | null;
  firstName?: string | null;
  lastName?: string | null;
  mobileNumber?: string | null;
  age?: number | null;
  email?: string | null;
  joiningTimestamp?: number | null;
  locationCoordinate?: string | null;
  locationDetails?: string | null;
  gender?: string | null;
  createTimestamp?: number | null;
  assignedSchools?: number[] | null;
  paymentInfo?: PaymentInfo | null;
}

/**
 * PaymentInfo type definition
 */
export interface PaymentInfo {
  token?: string | null;
  createTimestamp?: number | null;
  url?: string | null;
  urlRefreshCount?: number | null;
  confirmed?: boolean | null;
}
