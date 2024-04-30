import { FC } from "react";
import { Form, Container } from "react-bootstrap";

interface SearchProps {
    filter: string,
    setFilter: CallableFunction,
    placeholder: string
}

export const MySearch: FC<SearchProps> = ({ filter, setFilter, placeholder }) => {

    const handlerSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFilter(e.target.value)
    }
  
    return (
        <Container>
            <Form.Control 
                className="mb-3"
                placeholder={placeholder}
                aria-label={placeholder} 
                value={filter}
                onChange={(e) => handlerSearch(e)} 
            />
      </Container>
    );
}