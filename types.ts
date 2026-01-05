
export interface Question {
  id: number;
  text: string;
  category: 'economic' | 'social' | 'national';
}

export interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
  likes: number;
  isLiked?: boolean;
  stance: 'agree' | 'disagree';
}

export interface AgendaItem {
  id: number;
  title: string;
  category: string;
  participants: number;
  description: string;
  agreeCount: number;
  disagreeCount: number;
  status: 'active' | 'closed';
  endDate: string;
  comments: Comment[];
}

export interface PoliticianProfile {
  id: number;
  name: string;
  slogan: string;
  imageUrl: string;
  age: number;
  job: string;
  career: string[];
  promises: string[];
}

export interface Candidate {
  number: number;
  party: string;
  name: string;
  slogan: string;
  color: string;
  age?: number;
  job?: string;
  imageUrl?: string;
  career?: string[];
  promises?: string[];
}

export interface RegionStats {
  regionName: string;
  turnout: number;
  candidates: Candidate[];
  generationData: { name: string; value: number }[];
  partySupportData: { name: string; value: number; fill?: string }[];
  trendData: { month: string; A: number; B: number; C: number }[];
  insight: string;
}

export interface CityData {
  id: string;
  name: string;
  districts: RegionStats[];
}

// User Profile and History
export interface ParticipationHistory {
  id: string;
  type: 'vote_agenda' | 'vote_region' | 'comment' | 'test';
  title: string;
  detail: string;
  date: string;
}

export interface UserProfile {
  nickname: string;
  cityId: string; // 'seoul'
  districtName: string; // '종로구'
  hasVotedRegional: boolean;
  politicalType?: string; // '실용적 중도개혁가' 등
  history: ParticipationHistory[];
}
