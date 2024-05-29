import React, { useCallback, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, CloseButton, Container, Figure, Form, Spinner } from "react-bootstrap";
import { Error } from '../Error/Error';
import { isErrorWithMessage } from "../../utils/isErrorWithMessage";
import { useCreateRoomAdminMutation } from "../../store/services/hotelRooms";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateRoomPage() {

  const [description, setDescription] = useState('');
  const [preview, setPreview] = useState<string[]>([])
  const [images, setImages] = useState<File[]>([]);
  // const [progress, setProgress] = useState({started: false, pc: 0});
  const [errorMsg, setErrorMsg] =useState('');
  const inputRef = useRef<any>(null);
  const navigate = useNavigate();

  let { id } = useParams();
  if(!id) return;

  const [createRoomAdmin, {isLoading, isError}] = useCreateRoomAdminMutation();

  const createRoom = async (e: React.FormEvent) => {
    try {
      e.preventDefault()
      if(!images) {
        setErrorMsg('Файлы(фото) не выбраны')
        return;
      }

      let formData = new FormData();
      formData.append('hotel', id)
      formData.append('description', description);
      if(images && images.length > 0) {
        for( let i = 0; i < images.length; i++) {
          const image = images[i];
          formData.append('images', image);
        }
      } 

      // setErrorMsg("Загрузка...")
      // setProgress(prev => {
      //   return {
      //     ...prev,
      //     started: true,
      //   }
      // })

      const resultHotelRoom = await createRoomAdmin({data: formData}).unwrap();
      toast.success(`Гостиница ${resultHotelRoom.id} успешно добавлена`);
      navigate(`/hotels/${id}`)
    } catch (err) {
      const maybeError = isErrorWithMessage(err);
      if(maybeError) {
        setErrorMsg(err.data.message)
        toast.error(`Ошибка: ${err.status}`)
      } else {
        setErrorMsg("Неизвестная ошибка");
        toast.error("Неизвестная ошибка")
      }
    }
  }
  

  const handlerOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    try{
      const target = e.target as HTMLInputElement & {
        files: FileList;
      };
  
      if(target.files.length > 10) {
        toast.warning("Кол-во фото не должно превышать 10шт и 10Mb памяти")
      }
  
      const files = Array.from(target.files || []).slice(0, 10);
      setImages(files)
  
      let data = [];
      for (let i = 0; i < files.length; i++) {
        data.push(URL.createObjectURL(files[i]));
        setPreview([...data]);
      }
    } catch (err) {
      const maybeError = isErrorWithMessage(err);
      if(maybeError) {
        setErrorMsg(err.data.message)
        toast.error(`Ошибка: ${err.status}`)
      } else {
        setErrorMsg("Неизвестная ошибка");
        toast.error("Неизвестная ошибка")
      }
    }
    
  }, [])

  const onChooseFile = () => {
    inputRef.current?.click();
  }

  return (
    <Container className="shadow-sm rounded bg-white p-4">
      <Form onSubmit={(e) => createRoom(e)}>
      <Form.Group className="mb-3">
        <Form.Control
          type="file" 
          multiple
          // disabled={(preview?.length && preview.length >= 10) ? true : false}
          accept="image/*,.png, .jpg, .jpeg, .webp"
          ref={inputRef}
          onChange={(e: any) => handlerOnChange(e)}
          style={{display: "none"}}
        />
        <ToastContainer theme="dark" position="top-center" />
      </Form.Group>  
        <Container className="d-flex flex-wrap align-items-center mb-3"> 
          {preview && preview.length !== 0 && 
            preview.map((item, i) => 
              <Figure  
                key={i}
                className="d-flex align-self-stretch mb-3"
              >
                <Figure.Image
                  className="rounded img-thumbnail"
                  width={200}
                  height={200}
                  alt=''
                  src={item}
                />
                <CloseButton 
                  className="d-flex" 
                  onClick={() => setPreview(preview.filter((e) => e !== item))} 
                  style={{position: "relative", top: 5, right: 30 }}
                />
              </Figure>
          )}
          <Button variant="light" onClick={onChooseFile}>
            <i className="bi bi-plus-lg" style={{ fontSize: '50px', color: "#808080"}}></i>
          </Button>
        </Container>
        <Form.Group className="mb-3">
          <Form.Label className="d-flex align-items-start">Описание комнаты:</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={5} 
            className="mb-3" 
            maxLength={5000} 
            minLength={100} 
            onChange={ (e) => setDescription(e.target.value) }
          />
          <Form.Control.Feedback type="invalid">Необходимо указать описание отеля</Form.Control.Feedback>
        </Form.Group>
        {/* {progress.started && <progress max='100' value={progress.pc}></progress> } */}
        {isError && <Error message={errorMsg} /> }
        <Form.Group className="d-flex">
          <Button 
            className="d-flex justify-content-start mx-3"
            type="submit" 
            variant={(preview.length === 0) ? "secondary" : "success"}
            disabled={(preview.length === 0) ? true : false}
          >
            Сохранить
            {isLoading
              &&  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
            }
          </Button>{' '}
          <Button 
            className="d-flex justify-content-start mx-3"
            variant="danger" 
            type="reset"
          >
            Отменить
          </Button>
        </Form.Group>
      </Form>
    </Container>
  )
}