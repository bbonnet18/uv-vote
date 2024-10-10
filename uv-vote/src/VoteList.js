import { useState, useEffect } from 'react';
import Table from "react-bootstrap/Table";
import  { Container, Spinner}   from "react-bootstrap";

function VoteList (props){
  
    const [loadingIds,setLoadingIds] = useState({});
    const [groups,setGroups] = useState([]); // holds the voting groups
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
      setLoadingIds({});
      let voteGroups = {};
      if(props.votes && props.votes.length){
        setLoading(false);
        // create an array within the vote group if one doesn't exist
        props.votes.map((vote)=>{
          if(voteGroups[vote.group]){
            voteGroups[vote.group].push(vote);
          }else{
            voteGroups[vote.group]=[];
            voteGroups[vote.group].push(vote);
          }
        });
      }
      setGroups(voteGroups)
    },[props.votes])

    return (
        <Container fluid="md">
          {loading ? (<Spinner animation="border" role="status" className='loading-spinner'> <span className="visually-hidden">Loading...</span></Spinner>) : (<></>)}
          {(loading === false && groups) ? Object.keys(groups).map((itm,ind)=>{
           return (
            <Table striped bordered hover>   
              <>
              <thead>
                <tr>
                  <th>{itm} <img src={itm+".png"} alt={itm} title={itm} className='table-group-img'></img></th>
                  <th className='table-link-col'>Link</th>
                </tr></thead>
              <tbody>
              {
                groups[itm] ? groups[itm].map((itm,ind)=>{
                  return (<tr key={itm} className={itm.link === 'completed' ? 'vote-completed' : ''}> 
                  <td><img src={itm.description.trim()+"_sm.png"} alt={itm.description + " type vote"} title={itm.description + " type vote"}></img> {itm.title} - {itm.description}</td>
                  <td className='table-link-col'>{ loadingIds && loadingIds[itm.surveyId] ? (
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>):(itm.link && itm.link !== 'completed' ? (<a href={itm.link} alt='click or tap to vote' title='click or tap to vote'>Vote</a>):(itm.link === 'completed') ? <div ><img src='./check-square.svg' alt='vote completed' title='vote completed'></img></div> : <span><button type='button' onClick={(e)=>{
                    e.preventDefault();
                    let myLid = {...loadingIds};
                    myLid[itm.surveyId] = 'loading';
                    setLoadingIds(myLid)
                    props.register(itm.surveyId)}
                  } alt='click or tap to register' title='click or tap to register' >register</button></span>)}</td>
                </tr>)
              }) : (<></>)}
              </tbody>
              </>
              </Table>
            )
          }):(<></>)}
        </Container>
      );
}



export default VoteList