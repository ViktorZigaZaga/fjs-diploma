import { ObjectId } from "mongoose";

export interface ResponseRegisterDto {
    id: ObjectId;
    email: string;
    name: string;
  }