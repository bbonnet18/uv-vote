import './App.css';
import { Outlet, useSearchParams } from "react-router-dom";
import { Container} from "react-bootstrap";

function Actions(){

    return (
     <Container>
        <Outlet />
     </Container>
    )

}

export default Actions; 