import React, { useCallback, useRef, useState } from "react";
import { Button, CloseButton, Container, Figure, Form } from "react-bootstrap";
import { Error } from '../Error/Error';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCreateHotelAdminMutation } from "../../store/services/hotels";
import { useNavigate } from "react-router-dom";
import { isErrorWithMessage } from "../../utils/isErrorWithMessage";
import { useCreateRoomAdminMutation } from "../../store/services/hotelRooms";

export default function CreateHotelPage() {

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('');
  const [preview, setPreview] = useState<string[]>([])
  const [images, setImages] = useState<File[]>([]);
  const [progress, setProgress] = useState({started: false, pc: 0});
  const [errorMsg, setErrorMsg] =useState('');
  const inputRef = useRef<any>(null);
  const navigate = useNavigate();

  const hotelId ='dfgfhjg'

    const [createHotelRoom] = useCreateRoomAdminMutation();

    const createRoom = async () => {
      try {

        if(!images) {
          setErrorMsg('Файлы(фото) не выбраны')
          return;
        }
    
        console.log(images)
    
        const formData = new FormData();
        // formData.append('title', title);
        formData.append('hotelId', hotelId)
        formData.append('description', description);
        if(images && images.length > 0) {
          for( let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
          }
        } 

        // setErrorMsg("Загрузка...")
        // setProgress(prev => {
        //   return {
        //     ...prev,
        //     started: true,
        //   }
        // })

        const resultHotel = await createHotelRoom(formData).unwrap();
        toast.success(`Гостиница ${resultHotel.id} успешно добавлена`);
        navigate('/hotels')
      } catch (err) {
        const maybeError = isErrorWithMessage(err);
        if(maybeError) {
          setErrorMsg(err.data.message)
          toast.error(`Ошибка: ${err.status}`)
        } else {
          setErrorMsg("Неизвестная ошибка");
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
      console.log(files)
      setImages(files)
  
      let data = [];
      for (let i = 0; i < files.length; i++) {
        data.push(URL.createObjectURL(files[i]));
        setPreview([...data]);
      }
    } catch (eer) {
      console.log(eer)
    } finally {

    }
    
  }, [])

  const onChooseFile = () => {
    inputRef.current?.click();
  }

  return (
    <Container className="shadow-sm rounded bg-white p-4">
      <Form onSubmit={createRoom}>
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
                <CloseButton className="d-flex" onClick={() => setPreview(preview.filter((e) => e !== item))} style={{position: "relative", top: 5, right: 30 }}
              />
              </Figure>
          )}
          <Button variant="light" onClick={onChooseFile}>
            <i className="bi bi-plus-lg" style={{ fontSize: '50px', color: "#808080"}}></i>
          </Button>
        </Container>
        <Form.Group className="mb-3">
          <Form.Label className="d-flex align-items-start">Название отеля:</Form.Label>
          <Form.Control type="text" className="mb-3" onChange={(e) => setTitle(e.target.value)} minLength={5} required />
          <Form.Control.Feedback type="invalid">Необходимо указать Ваш email</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="d-flex align-items-start">Описание отеля: (необязательно)</Form.Label>
          <Form.Control as="textarea" rows={5} className="mb-3" maxLength={5000} minLength={100} onChange={(e) => setDescription(e.target.value) } />
          <Form.Control.Feedback type="invalid">Необходимо указать Ваш email</Form.Control.Feedback>
        </Form.Group>
          {progress.started && <progress max='100' value={progress.pc}></progress> }
          {/* {isError && <Error message={errorMsg} /> } */}
        <Form.Group className="d-flex">
          <Button 
            className="d-flex justify-content-start mx-3"
            type="submit" 
            variant={(preview.length === 0) ? "secondary" : "success"}
            disabled={false}
            // {(preview.length === 0) ? true : false}
            // {
            //   isLoading
            //   &&  <Spinner
            //           as="span"
            //           animation="border"
            //           size="sm"
            //           role="status"
            //           aria-hidden="true"
            //       />
            // }
          >
            Сохранить
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