import {z} from 'zod';

export const customerListSchema = z.object({
  sponsorId: z
    .string()
    .min(5, {message: 'Sponsor ID must be at least 5 characters'}),
});

enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export const updateProfileSchema = z.object({
  phoneNumber: z.string().optional(),
  password: z.string().optional(),
  fullname: z.string().optional(),
  dob: z.string().optional(),
  gender: z.nativeEnum(Gender).optional(),
  email: z.string().email().optional(),
  pinCode: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  aadharNo: z.string().optional(),
  panNo: z.string().optional(),
  upiId: z.string().optional(),
  landMark: z.string().optional(),
  flatNo: z.string().optional(),
  areaName: z.string().optional(),
  bankName: z.string().optional(),
  bankAccNo: z.string().min(1, {message: 'Bank account number is required'}).optional(),
  bankIFSC: z
    .string()
    .length(11, {message: 'Bank IFSC code must be exactly 11 characters'})
    .optional(),
  bankBranch: z.string().min(1, {message: 'Bank branch is required'}).optional(),
  sponsorId: z.string().optional(),
  crn: z.string().optional(),
});
