import { FC } from "react";
import { Alert } from "react-bootstrap"

type Props = { 
  message?: string
}

export const Error: FC<Props> = ({ message } : Props) => {
  if (!message) {
    return null;
  }

  return (
    <Alert className="alert alert-danger">{message}</Alert>
  )
}