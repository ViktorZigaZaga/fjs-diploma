import { Container } from "react-bootstrap"


export default function Error() {


  return (
    <Container className="shadow-sm rounded p-2 bg-white">
        <Container className="pb-4">
            <h2 className="p-3">Вы перешли на несуществующую страницу</h2>
        </Container >
    </Container >
  )
}