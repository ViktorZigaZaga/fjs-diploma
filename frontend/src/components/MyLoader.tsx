import { Spinner } from "react-bootstrap"

export const MyLoader = () => {
    return (
        <>
            <Spinner animation="border" variant="primary" />
            <span className="fs-1 fw-semibold"> Идет загрузка...</span>
        </> 
    )
}