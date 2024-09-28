import { useState, useEffect } from 'react';
import Table from "react-bootstrap/Table";
import  { Container, Spinner}   from "react-bootstrap";

function VoteList (props){
  
    const [loadingIds,setLoadingIds] = useState({});
    const [groups,setGroups] = useState([]); // holds the voting groups

    useEffect(()=>{
      console.log('votes changed');
      setLoadingIds({});
      let voteGroups = {};
      if(props.votes && props.votes.length){
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
       
          {groups ? Object.keys(groups).map((itm,ind)=>{
           return (
            <Table striped bordered hover>   
              <>
              <thead>
                <tr>
                  <th>{itm}</th>
                  <th className='table-link-col'>Link</th>
                </tr></thead>
              <tbody>
              {
                groups[itm] ? groups[itm].map((itm,ind)=>{
                  return (<tr key={itm} className={itm.link === 'completed' ? 'vote-completed' : ''}> 
                  <td>{itm.title}</td>
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
           <Table striped bordered hover>
          <thead>
            <tr>
              <th>Vote Title</th>
              <th className='table-link-col'>Link</th>
            </tr>
          </thead>
          <tbody>
            { props.votes ? Object.keys(props.votes).map((itm,ind)=>{
              return <tr key={itm} className={props.votes[itm].link === 'completed' ? 'vote-completed' : ''}> 
              <td>{props.votes[itm].title}</td>
              <td className='table-link-col'>{ loadingIds && loadingIds[props.votes[itm].surveyId] ? (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>):(props.votes[itm].link && props.votes[itm].link !== 'completed' ? (<a href={props.votes[itm].link} alt='click or tap to vote' title='click or tap to vote'>Vote</a>):(props.votes[itm].link === 'completed') ? <div ><img src='./check-square.svg' alt='vote completed' title='vote completed'></img></div> : <span><button type='button' onClick={(e)=>{
                e.preventDefault();
                let myLid = {...loadingIds};
                myLid[props.votes[itm].surveyId] = 'loading';
                setLoadingIds(myLid)
                props.register(props.votes[itm].surveyId)}
              } alt='click or tap to register' title='click or tap to register' >register</button></span>)}</td>
            </tr>
            }) : <></>}
          
          </tbody>
        </Table>
        </Container>
      );
}



export default VoteList