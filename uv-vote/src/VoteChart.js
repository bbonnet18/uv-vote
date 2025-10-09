import './App.css';
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { useEffect, useState } from 'react';
import {csv} from 'd3-fetch';
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




function VoteChart(){

    const [voteChart,setVoteChart] = useState({});// will be used to hold the actual data


    const getCSVData = async () => {
        try{
           let csvData = await csv('http://localhost:8000/testStats.csv');
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
                }

                if(checkForData(row)){
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
    // this will process the CSV data to extract relevant information
    const processData = (data) => {
        try{
            if(Array.isArray(data)) {
                // Process the data here
                let headings = {};// this will hold the questions
                let isData = false;//this is a flag that will be used to know when we're hitting data
                let isQuestion = false
                let qCount = 0;
                let treated = treatData(data); 
                let questions = getQuestions(treated);
                //extract the actual data and labels
            
                if(questions['question0']){
                    let chartData = {}
                    let labels = [];
                    let count = [];
                    console.log('q0',questions['question0']);
                    
                    questions['question0'].data.map((itm)=>{
                        labels.push(itm.answer);
                        count.push(parseInt(itm.count));
                    })
                    chartData = {
                        labels,
                        datasets: [
                            {
                              label: 'Dataset 2',
                              data: count,
                              borderColor: 'rgb(255, 99, 132)',
                              backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            }
                          ]

                    };
                    console.log('chartData: ', chartData);
                    
                    setVoteChart(chartData);
                }
                
            }
        } catch (error) {
            console.error("Error processing data:", error);
        }
    }

    getCSVData();
     const labels = ['answer','count','percentage'];

const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: labels.map(() => 100),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };
    return(
        <Container>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Chart Title</Card.Title>
                            <Card.Text>
                                Chart content goes here.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Bar data={data} />
            </Row>
            <Row>
                {voteChart && voteChart.datasets ?  (<Bar data={voteChart} />):(<span>'nothing'</span>)}
            </Row>
        </Container>
    );
}

export default VoteChart;