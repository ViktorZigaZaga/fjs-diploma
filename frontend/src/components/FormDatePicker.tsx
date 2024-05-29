import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Container } from 'react-bootstrap';

interface DateSearchProps {
    filter: {
        dateStart: dayjs.Dayjs | null,
        dateEnd: dayjs.Dayjs | null
    },
    setFilter: CallableFunction
}

export const FormDatePicker: React.FC<DateSearchProps> = ({ filter, setFilter }) => {

    return (
        <Container className='d-flex justify-content-between mb-4'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker', 'DatePicker']}>
                    <DatePicker
                        label="Дата заезда"
                        slotProps={{
                          textField: {
                            helperText: 'MM-DD-YYYY',
                          },
                        }}
                        format="DD-MM-YYYY"
                        onChange={(newValue) => setFilter({...filter, dateStart: newValue})}
                    />
                </DemoContainer>
            </LocalizationProvider>
            <span> <br/> - </span>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker', 'DatePicker']}>
                    <DatePicker
                        label="Дата выезда"
                        slotProps={{
                            textField: {
                              helperText: 'MM-DD-YYYY',
                            },
                          }}
                        format="DD-MM-YYYY"
                        onChange={(newValue) => setFilter({...filter, dateEnd: newValue})}
                    />
                </DemoContainer>
            </LocalizationProvider>
        </Container>
    );
}