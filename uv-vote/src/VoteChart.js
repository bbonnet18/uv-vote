import './App.css';
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { useEffect, useState } from 'react';
import {csv} from 'd3-fetch';
import config from './config';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );




function VoteChart(props){

    const [voteCharts,setVoteCharts] = useState([]);// will be used to hold the actual data
    useEffect(()=>{
        const checkData = async ()=>{
            if(props && props.surveyId)
            await getCSVData(props.surveyId);
        }
        checkData();
    },[])

    const getCSVData = async (surveyId) => {
        try{
           let csvData = await csv(`${config.apiBaseUrl}/${surveyId}Stats.csv`);
           processData(csvData);
        } catch (error) {
            console.error("Error loading CSV data:", error);
        }
    }

    // grab just the questions, they will be after the summary
    const getQuestions =  (data)=> {
        let questions = [];
        let isQuestion = false;
        let isAnswer = false; 
        let questionsObj = {};
        let count = 0; 
        data.forEach(row => {
            // Extract headings or process each row as needed
          
                if(isQuestion){
                    let questionObj = {
                        question:row.answer,
                        labels:Object.keys(row),
                        data:[]
                    }
                    questionsObj[`question${count}`] = questionObj;
                    isAnswer = true;
                    isQuestion = false;
                    count++;
                }
                if(checkForSummary(row)){
                    isQuestion = true;
                    isAnswer = false;
                }

                if(isAnswer && checkForData(row)){
                    questionsObj[`question${count-1}`].data.push(row); 
                }
                
        }
        )

        return questionsObj; 

    }
    // looks at a row and determines if it's a data row
    const checkForData = (row) => {
        let isData = false;
        if(row.percentage.indexOf('%') > -1){
            isData = true;
        }else{
            let count = row.count;
            let num = parseInt(count); 
            if(count){
                isData = true; 
            }
        }
        return isData; 
    }

    const checkForSummary = (row) => {
        let isSummary = false;
        if(row.answer.indexOf('Summary') > -1){
            isSummary = true;
        }
        return isSummary; 
    }
    // return data with correct column names
    const treatData = (data) => {
        let keyLabels = ["count","answer","percentage"];
        let treatedData = data.map((itm,ind)=>{
                let retObj = {};
                let mKeys = Object.keys(itm);
                for(let mKey in mKeys){
                    retObj[keyLabels[mKey]] = itm[mKeys[mKey]];
                }
                return retObj;
        })

        return treatedData;
    }

    const processData2 = (data) => {
        let filtered = [];
        try{
            filtered  = data.filter((itm,ind)=>{
                let curr = {...itm};
                let newObj = {
                    answer:curr[1],
                    count: curr[0],
                    percentage: curr[2]
                }
                if(newObj && newObj[0] && newObj[1] && newObj[2]){
                    return newObj
                }
            })
           
        }catch (err){
            console.log('error on it')
        }
    }
    // this will process the CSV data to extract relevant information
    const processData = (data) => {
        try{
            if(Array.isArray(data)) {

                let filtered = processData2(data);
                console.log('filtered: ',filtered)
                // Process the data here
                let treated = treatData(data); 
                let questions = getQuestions(treated);
                //extract the actual data and labels
                let votingCharts = [...voteCharts]
                let questionKeys = Object.keys(questions);
                for(let qKey in questionKeys){
                    if(questions[questionKeys[qKey]]){
                        let chartData = {}
                        let labels = [];
                        let count = [];
                        
                        questions[questionKeys[qKey]].data.map((itm)=>{
                            labels.push(itm.answer);
                            count.push(parseInt(itm.count));
                        })
                        let label = questions[questionKeys[qKey]].question
                        chartData = {
                            labels,
                            datasets: [
                                {
                                  label: label,
                                  data: count,
                                  borderColor: 'rgb(255, 99, 132)',
                                  backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                }
                              ]
    
                        };
                        
                        votingCharts.push(chartData)
                    }
                }
                
                setVoteCharts(votingCharts);
            }
        } catch (error) {
            console.error("Error processing data:", error);
        }
    }



    return(
        <Container>
            <Row>
                {voteCharts && voteCharts.length ?  (
                    voteCharts.map((voteChart) => {
                        return(<Bar data={voteChart} />)
                    })) : (<span>No votes</span>)
                }
            </Row>
        </Container>
    );
}

export default VoteChart;