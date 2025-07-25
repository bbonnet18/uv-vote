import { useState, useEffect } from 'react';
import Table from "react-bootstrap/Table";
import  { Button, Container, OverlayTrigger, Tab, Tabs, Tooltip, Spinner}   from "react-bootstrap";

function VoteList (props){
  
    const [loadingIds,setLoadingIds] = useState({});
    const [groups,setGroups] = useState([]); // holds the voting groups
    const [loading,setLoading] = useState(false);
    const [groupLabels,setGroupLabels] = useState({});// holds the currently selected group

    useEffect(()=>{
      setLoadingIds({});
      let voteGroups = {
        Local:[],
        State:[],
        National:[]

      };
      if(props.votes && props.votes.length){
        let groupLabelsObj = {};
        // create an array within the vote group if one doesn't exist
        props.votes.map((vote)=>{
          if(voteGroups[vote.category]){
            voteGroups[vote.category].push(vote);
            if(!groupLabelsObj[vote.category]){
              groupLabelsObj[vote.category] = vote.group;
            }
          }
        });
        setGroupLabels(groupLabelsObj); 
        
      }
      
      setGroups(voteGroups);
      setLoading(false);
    },[props.votes])

    return (
        <Container fluid="md">
          <Tabs>
  {loading ? (<Spinner animation="border" role="status" className='loading-spinner'> <span className="visually-hidden">Loading...</span></Spinner>) : (<></>)}
          {(loading === false && groups) ? Object.keys(groups).map((itm,ind)=>{
           return (
              <Tab eventKey={itm} title={itm} key={ind}> 
                <Table key={ind} striped bordered hover>   
              <>
              <thead>
                <tr>
                  <th>{groupLabels[itm]} <img src={groupLabels[itm]+".png"} alt={groupLabels[itm]} title={groupLabels[itm]} className='table-group-img'></img></th>
                  <th className='table-link-col'>Link</th>
                </tr></thead>
              <tbody>
              {
               groups[itm] && groups[itm].length ? groups[itm].map((itm,ind)=>{
                  return (<tr key={itm.surveyId} className={itm.link === 'completed' ? 'vote-completed' : ''}> 
                  <td className='table-info-col'><img src={(itm.description && itm.description.length ? itm.description.trim():"ballot")+"_sm.png"} alt={itm.description + " type vote"} title={itm.description + " type vote"}></img> {itm.title}</td>
                  <td className='table-link-col'>{ loadingIds && loadingIds[itm.surveyId] ? (
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>):(itm.link && itm.link !== 'completed' ? (<Button className="vote-buttons" variant="success" onClick={(e)=>{
                      if(itm && itm.link){
                        window.location=itm.link;
                      }
                    }}><img src='../play-fill.svg' className='button-icon' alt='vote on this issue' title='vote on this issue' /><div>Vote</div></Button> ):(itm.link === 'completed') ? (<OverlayTrigger overlay={<Tooltip id={`tooltip${ind}`}>You Voted</Tooltip>}><div className='vote-buttons vote-completed-img'><img src='../check-square.svg' alt='vote completed' title='vote completed'></img><div>Done</div></div></OverlayTrigger>) : (<Button className="vote-buttons" variant="primary" onClick={(e)=>{
                    e.preventDefault();
                    let myLid = {...loadingIds};
                    myLid[itm.surveyId] = 'loading';
                    setLoadingIds(myLid)
                    props.register(itm.surveyId)}
                  } alt='click or tap to register' title='click or tap to register' ><img src='../play-empty.svg' className='button-icon' alt='register for this issue' title='register for this issue' /><div>Start</div></Button>))}</td>
                </tr>)
              }) : (<tr><td className='no-votes'><img src='./emoji-frown.svg' alt='no votes available' />No votes available - check back soon!</td><td></td></tr>)}
              </tbody>
              </>
              </Table>
              </Tab>
            )
          }):(<></>)}
          
          </Tabs>
        </Container>
      );
}



export default VoteList


/**
 * <Table key={ind} striped bordered hover>   
              <>
              <thead>
                <tr>
                  <th>{itm} <img src={itm+".png"} alt={itm} title={itm} className='table-group-img'></img></th>
                  <th className='table-link-col'>Link</th>
                </tr></thead>
              <tbody>
              {
                groups[itm] ? groups[itm].map((itm,ind)=>{
                  return (<tr key={itm.surveyId} className={itm.link === 'completed' ? 'vote-completed' : ''}> 
                  <td><img src={(itm.description && itm.description.length ? itm.description.trim():"ballot")+"_sm.png"} alt={itm.description + " type vote"} title={itm.description + " type vote"}></img> {itm.title}</td>
                  <td className='table-link-col'>{ loadingIds && loadingIds[itm.surveyId] ? (
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>):(itm.link && itm.link !== 'completed' ? (<Button variant="success" onClick={(e)=>{
                      if(itm && itm.link){
                        window.location=itm.link;
                      }
                    }}>Vote</Button> ):(itm.link === 'completed') ? <div ><img src='./check-square.svg' alt='vote completed' title='vote completed'></img></div> : <span><Button variant="primary" onClick={(e)=>{
                    e.preventDefault();
                    let myLid = {...loadingIds};
                    myLid[itm.surveyId] = 'loading';
                    setLoadingIds(myLid)
                    props.register(itm.surveyId)}
                  } alt='click or tap to register' title='click or tap to register' >Register</Button></span>)}</td>
                </tr>)
              }) : (<></>)}
              </tbody>
              </>
              </Table>
 */