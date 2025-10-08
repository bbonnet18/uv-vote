import './App.css';
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import {csv} from 'd3-fetch';

function Chart(){

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

        return questions; 

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
                //console.log('questions: ',data); 
                // data.forEach(row => {
                //     // Extract headings or process each row as needed
                //     if(row['Number of records in this query:']){
                //         if(row['Number of records in this query:'].indexOf('Summary') !== -1){
                //             isData = true;
                //             isQuestion = true;
                //         }
                //     }
                //     if(isData && isQuestion){
                //            headings[`Q${qCount}`] = {question: row['Number of records in this query:']};
                //            isQuestion = false;
                //            qCount++;
                //     }else if(isData && !isQuestion){
                //         let keys = Object.keys(row);
                //         // Process the data rows here using keys
                //         // check for labels
                //         if(row[keys[0]]==='Count' && row[keys[1]] === 'Answer' && row[keys[2]] === 'Percentage') {
                //             // Additional processing can be done here
                //             headings[`Q${qCount - 1}`].labels = ['Count','Answer','Percentage'];
                //             headings[`Q${qCount - 1}`].data = [];
                //         }else{
                //             headings[`Q${qCount - 1}`].data.push({
                //                 count: row[keys[0]],
                //                 answer: row[keys[1]],
                //                 percentage: row[keys[2]]
                //             });
                //         }
                //     }


                //});
            }
        } catch (error) {
            console.error("Error processing data:", error);
        }
    }

    getCSVData();

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
        </Container>
    );
}

export default Chart;