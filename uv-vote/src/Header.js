import './App.css';
import { Container } from 'react-bootstrap';
import {useLocation} from "react-router-dom";

export default function Header() {
    const location = useLocation();
    const {pathname} = location;

    // useEffect(()=>{
    //     console.log('key: ',key);
    // })
    console.log('pathname: ',pathname);

  return (
    <Container>
      <div class="icon-brand"><div className='container'><a><img src='vote_draft_icon.png' ></img></a><div className='alpha-mark'>0.1 ALPHA</div></div></div>
    </Container>
  );
}
