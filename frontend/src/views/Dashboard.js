import React, { useState, useEffect } from "react";
import ChartistGraph from "react-chartist";

const moment = require("moment");

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

// Global Vars
var resDataElecCurrent = 0;
var resDataElecCurrentYield = 0;
var resDataGasLastDay = 0;
var resDataElecLastDay = 0;
var resDataElecLastDayYield = 0;
var resLastUpdateTime = 0;

// Table arrays
var elecUsage  = [];
var elecYield  = [];
var gasUsage   = [];
var axisDate = [];

function Dashboard() {

  const [loadedMeasurements, setLoadedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(function () {
    async function fetchData() {
      setIsLoading(true);

      try {
        // Fetching the first data for head Dashboard
        const reponseElecCurrent      = await fetch("https://meter-api.veldscholten.tech/measurements/electric/current");
        const reponseElecCurrentYield = await fetch("https://meter-api.veldscholten.tech/measurements/electric/currentYield");
        const reponseGasCurrent       = await fetch("https://meter-api.veldscholten.tech/measurements/gas");
        const reponseElecLastDay      = await fetch("https://meter-api.veldscholten.tech/measurements/electric/lowhigh/consumption");
        const reponseElecLastDayYield = await fetch("https://meter-api.veldscholten.tech/measurements/electric/lowhigh/yield");

        // Fetching the tables
        const reponseElecTable       = await fetch("https://meter-api.veldscholten.tech/measurements/electric/all/consumption");
        const reponseElecYieldTable  = await fetch("https://meter-api.veldscholten.tech/measurements/electric/all/yield");
        const reponseGasTable        = await fetch("https://meter-api.veldscholten.tech/measurements/gas/all");

        // Fetching the last time
        const responselastUpdateTime = await fetch("https://meter-api.veldscholten.tech/measurements/time");

        resDataElecCurrent      = await reponseElecCurrent.json();
        resDataElecCurrentYield = await reponseElecCurrentYield.json();
        resDataGasLastDay       = await reponseGasCurrent.json();
        resDataElecLastDay      = await reponseElecLastDay.json();
        resDataElecLastDayYield = await reponseElecLastDayYield.json();
        resLastUpdateTime       = await responselastUpdateTime.json();


        var resDataElecTable      = await reponseElecTable.json();
        var resDataElecYieldTable = await reponseElecYieldTable.json();
        var resDataGasTable       = await reponseGasTable.json();
        
        const timestamp = Number(new Date(resLastUpdateTime[0]['logTimeStamp']));
        resLastUpdateTime = moment(timestamp).format("DD-MM-YYYY HH:mm");

        // Getting values for Consumption Table
        var counter = 0;
        for(var e in resDataElecTable) {

          if(counter == 1){
            var oldVal = resDataElecTable[e].electricConsumptionLow + resDataElecTable[e].electricConsumptionHigh;
            counter = 0;
          }
          else{
              var newVal = resDataElecTable[e].electricConsumptionLow + resDataElecTable[e].electricConsumptionHigh;
          }
          var total = oldVal - newVal;
          if(total > 0 && total < 1000){
            elecUsage.push(total);
          }
          counter++;
        }

        // Getting values for Yield Table
        var counter = 0;
        for(var e in resDataElecYieldTable) {

          if(counter == 1){
            var oldVal = resDataElecYieldTable[e].electricYieldLow + resDataElecYieldTable[e].electricYieldHigh;
            counter = 0;
          }
          else{
            var newVal = resDataElecYieldTable[e].electricYieldLow + resDataElecYieldTable[e].electricYieldHigh ;
          }
          var total = oldVal - newVal;
          if(total > 0 && total < 1000){
            elecYield.push(total);
          }
          counter++;
        }

        // Getting Values for Gas table
        var counter = 0;
        for(var e in resDataGasTable) {

          if(counter == 1){
            var oldVal = resDataGasTable[e].gasConsumption;
            counter = 0;
          }
          else{
            var newVal = resDataGasTable[e].gasConsumption;
          }
          var total = oldVal - newVal;
          if(total > 0 && total < 1000){
            gasUsage.push(total);
          }

          counter++;
        }

        console.log(elecUsage.length);
        // Delete some random values for cleaner visability
        for(var i = 0 ; i < elecUsage.length + 100; i++){
          // Delete random values to clean up table. Later this function will be enhanced.
          console.log(i);
          if (i % 2 == 0){
            console.log("even");
            elecUsage.splice(i, 1);
            elecYield.splice(i, 1);
            gasUsage.splice(i, 1);
          }

        }


      var date = new Date();
      for (let i = 0; i < 10; i++) {
        date.setDate(date.getDate() - 5);
        axisDate.push(moment(date).format("DD-MM"));
      }
      
      axisDate.reverse(); // The list needs to be reversed in orde to get it right.
      
      
      // Debug logging
      console.log(resDataElecCurrent);
      console.log(resDataElecCurrentYield);
      console.log(resDataGasLastDay);
      console.log(resDataElecLastDay);
      console.log(axisDate);
      console.log("ElecConsum " + elecUsage);
      console.log("ElecYield " + elecYield);
      console.log("GasConsum " + gasUsage);
      if (!reponseElecCurrent.ok) {
        throw new Error(resData.message || "Fetched Data for Dashboard");
      }

      setLoadedData(resData);
      } catch (err) {
        setError(
          err.message ||
            "Error fetching Data - the server responsed with an error."
        );
      }
      setIsLoading(false);
    }

    fetchData();
  }, []);



  return (
    <>
      <Container fluid>
        <Row>
        <Col lg="2" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-danger">
                      <i className="fas fa-tachometer-alt text-danger"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Verbruik</p>
                      <Card.Title as="h4"><b>{resDataElecCurrent} Kwh</b></Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-clock mr-1"></i>
                   Updated: {resLastUpdateTime}
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="2" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-success">
                      <i className="fas fa-tachometer-alt text-success"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Teruggave</p>
                      <Card.Title as="h4"><b>{resDataElecCurrentYield} Kwh</b></Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-clock mr-1"></i>
                   Updated: {resLastUpdateTime}
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="2" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="fas fa-fire text-warning"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Gas verbruik </p>
                      <Card.Title as="h4"><b>{resDataGasLastDay} m3</b></Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-clock mr-1"></i>
                   Updated: {resLastUpdateTime}
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-danger">
                      <i className="fas fa-lightbulb text-danger"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Verbruik Dal & Piek<br></br> <i>(afgelopen 24 uur)</i></p>
                      <Card.Title as="h4">{resDataElecLastDay} Kwh</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-clock mr-1"></i>
                   Updated: {resLastUpdateTime}
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-success">
                      <i className="fas fa-leaf text-success"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Teruggave Dal & Piek <i>(afgelopen 24 uur)</i></p>
                      <Card.Title as="h4"><b>{resDataElecLastDayYield} Kwh</b></Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-clock mr-1"></i>
                   Updated: {resLastUpdateTime}
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="8">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Afgelopen maand</Card.Title>
                <p className="card-category">Verbruik & Teruggrave</p>
              </Card.Header>
              <Card.Body>
                <div className="ct-chart" id="chartHours">
                  <ChartistGraph
                    data={{
                      labels: axisDate,
                      series: [
                        elecYield,
                        elecUsage,
                        gasUsage,
                      ],
                    }}
                    type="Line"
                    options={{
                      low: Math.min(gasUsage) - 100,
                      high: Math.max(elecUsage) + 100,
                      showArea:- false,
                      height: "245px",
                      axisX: {
                        showGrid: false,
                      },
                      lineSmooth: true,
                      showLine: true,
                      showPoint: false,
                      fullWidth: true,
                      chartPadding: {
                        right: 50,
                      },
                    }}
                    responsiveOptions={[
                      [
                        "screen and (max-width: 640px)",
                        {
                          axisX: {
                            labelInterpolationFnc: function (value) {
                              return value[0];
                            },
                          },
                        },
                      ],
                    ]}
                  />
                </div>
              </Card.Body>
              <Card.Footer>
                <div className="legend">
                  <i className="fas fa-circle text-danger"></i> Elektrisch
                  Verbruik
                  <i className="fas fa-circle text-info"></i> Elektrisch
                  Teruggave
                  <i className="fas fa-circle text-warning"></i> Gas verbruik
                </div>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-history"></i>
                  Laatste update 13:00 21-06-2021
                </div>
              </Card.Footer>
            </Card>
          </Col>

          <Col md="4">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Verglijking</Card.Title>
                <p className="card-category">Verbruik & Teruggave</p>
              </Card.Header>
              <Card.Body>
                <div
                  className="ct-chart ct-perfect-fourth"
                  id="chartPreferences"
                >
                  <ChartistGraph
                    data={{
                      labels: ["80%", "20%"],
                      series: [80, 20],
                    }}
                    type="Pie"
                  />
                </div>
                <div className="legend">
                  <i className="fas fa-circle text-danger"></i>Verbruik
                  <i className="fas fa-circle text-info"></i>Teruggave
                </div>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-clock"></i>
                  Laatste update 13:00 21-06-2021
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Jaar overzicht</Card.Title>
                <p className="card-category">Jaar overzicht verbruik</p>
              </Card.Header>
              <Card.Body>
                <div className="ct-chart" id="chartActivity">
                  <ChartistGraph
                    data={{
                      labels: [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "Mai",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ],
                      series: [
                        [
                          542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756,
                          895,
                        ],
                        [
                          412, 243, 280, 580, 453, 353, 300, 364, 368, 410, 636,
                          695,
                        ],
                        [
                          512, 243, 42, 580, 453, 353, 300, 364, 368, 410, 636,
                          695,
                        ],
                      ],
                    }}
                    type="Bar"
                    options={{
                      seriesBarDistance: 10,
                      axisX: {
                        showGrid: false,
                      },
                      height: "245px",
                    }}
                    responsiveOptions={[
                      [
                        "screen and (max-width: 640px)",
                        {
                          seriesBarDistance: 5,
                          axisX: {
                            labelInterpolationFnc: function (value) {
                              return value[0];
                            },
                          },
                        },
                      ],
                    ]}
                  />
                </div>
              </Card.Body>
              <Card.Footer>
                <div className="legend">
                  <i className="fas fa-circle text-info"></i> Energie Verbruik
                  <i className="fas fa-circle text-danger"></i> Energie
                  Teruggave
                  <i className="fas fa-circle text-warning"></i> Gas verbruik
                </div>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-check"></i>
                  Data information certified
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
