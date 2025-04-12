import './App.css';
import { Container, Row, Col, Button } from 'react-bootstrap';

export default function CookieNotice({setAgree}){



    return (
    <Container fluid className='cookies'>
        <Row>
        <Col lg={{span:8,offset:2}}>
        <h4 class="cookie-title"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cookie" viewBox="0 0 20 20">
  <path d="M6 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m4.5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m-.5 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
  <path d="M8 0a7.96 7.96 0 0 0-4.075 1.114q-.245.102-.437.28A8 8 0 1 0 8 0m3.25 14.201a1.5 1.5 0 0 0-2.13.71A7 7 0 0 1 8 15a6.97 6.97 0 0 1-3.845-1.15 1.5 1.5 0 1 0-2.005-2.005A6.97 6.97 0 0 1 1 8c0-1.953.8-3.719 2.09-4.989a1.5 1.5 0 1 0 2.469-1.574A7 7 0 0 1 8 1c1.42 0 2.742.423 3.845 1.15a1.5 1.5 0 1 0 2.005 2.005A6.97 6.97 0 0 1 15 8c0 .596-.074 1.174-.214 1.727a1.5 1.5 0 1 0-1.025 2.25 7 7 0 0 1-2.51 2.224Z"/>
</svg> Cookies</h4>
            <p>This site uses cookies to handle your experience. We don't share any data with third parties and we don't allow cookies from untrusted sources or for marketing or advertising purposes. We only use cookies to make the system work. </p>
            <div class="cookie-action"><Button title='accept cookies' onClick={(e)=> setAgree("accepts","yes")}>accept cookies</Button></div>
        </Col>
        </Row>
    </Container>)

}