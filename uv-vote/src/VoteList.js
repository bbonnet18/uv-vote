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
              return <tr key={itm}> 
              <td>{props.votes[itm].title}</td>
              <td>{props.votes[itm].link && props.votes[itm].link !== "no link available" ? (<a href={props.votes[itm].link} alt='link to vote'>Vote</a>):<span>{props.votes[itm].link}</span>}</td>
            </tr>
            }) : <></>}
          
          </tbody>
        </Table>
        </Container>
      );
}



export default VoteList