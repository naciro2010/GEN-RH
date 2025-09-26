import type { defaultData } from '../data/defaultData';

export type AtlasData = typeof defaultData;
export type Employee = AtlasData['employees'][number];
export type Candidate = AtlasData['candidates'][number];
export type Offer = AtlasData['offers'][number];
export type AttendanceRow = AtlasData['attendance'][number];
export type LeaveRequest = AtlasData['leaves'][number];
