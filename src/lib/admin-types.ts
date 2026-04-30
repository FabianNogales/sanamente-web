export type AdminStatsResponse = {
  clients: {
    total: number;
    active: number;
    suspended: number;
    newThisMonth: number;
  };
  professionals: {
    total: number;
    active: number;
    inactive: number;
  };
  deposits: {
    pending: number;
    approvedToday: number;
    totalRevenue: number;
  };
  withdrawals: {
    pending: number;
  };
  activity: {
    messages: number;
  };
};

export type AdminUserRecord = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
  referralCode?: string | null;
  userProfile?: {
    userName?: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
  } | null;
  wallet?: { balance: number } | null;
};

export type AdminProfessionalRecord = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
  wallet?: { balance: number } | null;
  professionalProfile?: {
    username?: string;
    avatarUrl?: string | null;
    bio?: string | null;
    rateCredits?: number | null;
    isOnline?: boolean;
    idDocUrl?: string | null;
    reviewStatus?: "PENDING" | "APPROVED" | "REJECTED" | null;
    reviewNotes?: string | null;
    kycVideoUrl?: string | null;
    kycSelfieUrl?: string | null;
    matriculaUrl?: string | null;
    tituloProfesionalUrl?: string | null;
    kycFaceMatchScore?: number | null;
    kycFaceMatchStatus?: "PENDING" | "PASSED" | "FAILED" | "SKIPPED" | null;
  } | null;
};

export type AdminPaginated<T> = {
  data: T[];
  nextCursor: string | null;
};

export type AdminWithdrawalRecord = {
  id: string;
  credits: number;
  amountBs: number;
  soles?: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  notes?: string | null;
  rejectionReason?: string | null;
  receiptUrl?: string | null;
  bankName: string;
  accountNumber: string;
  accountHolderName?: string | null;
  professional: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    phoneNumber?: string;
    email?: string | null;
  };
  currentBalance?: number;
  createdAt: string;
  updatedAt?: string | null;
};

export type AdminDepositRecord = {
  id: string;
  userId: string;
  amountBs: number;
  creditsToDeliver: number;
  packageNameAtMoment?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string | null;
  createdAt: string;
  receiptUrl?: string | null;
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phoneNumber: string;
  };
};

export type AdminSpecialty = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PromotionalGrantRecord = {
  id: string;
  amount: number;
  reason: string | null;
  createdAt: string;
  admin: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
  recipient: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
  transactionId: string;
};

export type AdminReferralRecord = {
  id: string;
  status: "PENDING" | "QUALIFIED" | "REWARDED";
  codeUsed: string;
  rewardCredits: number;
  createdAt: string;
  qualifiedAt?: string | null;
  rewardedAt?: string | null;
  referrer: {
    id: string;
    fullName: string;
    email: string | null;
    referralCode: string | null;
  };
  referred: {
    id: string;
    fullName: string;
    email: string | null;
    createdAt: string;
  };
  rewardEvents?: Array<{
    id: string;
    rewardAmount: number;
    sourceTransactionId: string;
    createdAt: string;
    reversedAt?: string | null;
    reversalTransactionId?: string | null;
  }>;
};

export type AdminReferralsResponse = {
  data: AdminReferralRecord[];
  nextCursor: string | null;
  summary: {
    total: number;
    pending: number;
    qualified: number;
    rewarded: number;
    totalRewardCredits: number;
  };
};

export type AdminConfigPayload = {
  platformFeePercent?: number;
  creditValueBs?: number;
  creditToSolesRate?: number;
  minAppVersion?: string;
  referralPercentage?: number;
  referralRewardCredits?: number;
  referralMinDepositAmount?: number;
  referralEnabled?: boolean;
  paymentsEnabled?: boolean;
  withdrawalsEnabled?: boolean;
};

export type BonusTier = {
  id: string;
  label: string;
  minActiveReferrals: number;
  bonusPercent: number;
  isActive: boolean;
};

export type AdminPackage = {
  id: string;
  name: string;
  credits: number;
  price: number;
  isActive: boolean;
};
