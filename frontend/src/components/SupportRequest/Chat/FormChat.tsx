import { FC, useState } from "react";
import { Button, Form } from "react-bootstrap";

interface FormChatProps {
  handleSendMessage: Function;
}

export const FormChat: FC<FormChatProps> = ({ handleSendMessage }) => {
  const [text, setText] = useState<string>();

  return (
    <Form>
      <Form.Control
        className="mb-2"
        placeholder="Введите сообщение"
        aria-label="Введите сообщение"
        onChange={(e) => setText(e.target.value)}
        required
      />
      <Button className="d-flex my-3" onClick={() => handleSendMessage(text)} type="reset">
        Отправить
      </Button>
    </Form>
  )
}
