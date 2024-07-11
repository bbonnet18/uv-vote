import Table from "react-bootstrap/Table";
import  Container  from "react-bootstrap/Container";

function VoteList (props){
   

    return (
        <Container fluid="md">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            { props.votes ? Object.keys(props.votes).map((itm,ind)=>{
              return <tr key={itm} className={props.votes[itm].link === 'completed' ? 'vote-completed' : ''}> 
              <td>{props.votes[itm].title}</td>
              <td>{props.votes[itm].link && props.votes[itm].link !== 'completed' ? (<a href={props.votes[itm].link} alt='Click to vote'>Vote</a>):(props.votes[itm].link === 'completed') ? <div ><img src='./check-square.svg' alt='vote completed'></img></div> : <span><button type='button' onClick={(e)=>{e.preventDefault(); props.register(props.votes[itm].surveyId)}} >register</button></span>}</td>
            </tr>
            }) : <></>}
          
          </tbody>
        </Table>
        </Container>
      );
}



export default VoteList