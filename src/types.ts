export type LoanType = 'personal' | 'business' | 'home' | 'education';

export interface LoanRequest {
  id?: string;
  name: string;
  email: string;
  phone: string;
  loanType: LoanType;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt: any;
}

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: any;
}

export interface AdminUser {
  uid: string;
  email: string;
  role: 'admin';
}
