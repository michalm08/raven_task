export interface ParkingArea {
  id: string;
  name: string;
  rate1: number;
  rate2: number;
  discount: number;
}

export interface NewParkingArea {
  name: string;
  rate1: number | null;
  rate2: number | null;
  discount: number | null;
}

export interface SendFormData extends FormData {
  areas: ParkingArea[];
}

export interface FormData {
  selectedArea: string;
  startTime: string;
  endTime: string;
  parkingDate: string;
}

export interface ParkingFee {
  totalTime: number;
  totalPrice: number;
}
