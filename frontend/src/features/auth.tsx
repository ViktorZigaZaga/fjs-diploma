import { useGetCurrentUserQuery } from "../store/services/auth"

export const Auth = ({children}: {children: JSX.Element}) => {

    const {isLoading} = useGetCurrentUserQuery();
    if(isLoading){ 
        return <span>Загрузка...</span>
    }

    return children;
} 