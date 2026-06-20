export interface WordResult {
  id: number;
  original: string;
  candidates: string[];
  selectedIndex: number;
  converted: boolean;
  display: string;
}

export interface CaretState {
  start: number;
  end: number;
}