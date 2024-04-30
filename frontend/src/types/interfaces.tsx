export interface UserData {
  _id: string,
  name: string,
  email: string,
  password: string;
  role: string,
  contactPhone?: string,
  token: string
  limit: number,
  offset: number
}

export interface HotelData {
  _id: string;
  title: string;
  description: string;
  // images?: string[],
  limit: number,
  offset: number
}

export interface HotelRoomData {
  _id: string,
  description: string,
  images: string[],
  isEnabled: boolean,
  hotelId: string,
}

export interface ReservationData {
  _id: string,
  dateStart?: Date,
  dateEnd?: Date,
  userId: string,
  hotelId: string,
  roomId: string
}

export interface SupportRequestData {
  _id: string,
  user: string,
  createdAt: Date,
  messages?: string[],
  isActive?: boolean
  offset: number;
  limit: number;
}

export interface MessageData {
  _id: string,
  author: string,
  sentAt: Date,
  text: string,
  readAt: Date,
}

export interface ErrorWithMessage {
  status: number;
  data: {
    message: string;
  }
}