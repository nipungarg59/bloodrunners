import React from "react"
import Login from "../Login"
import { render } from "react-dom"
import axios from 'axios';
import firebase from 'firebase';

import React_map from "../React_map"


import {OverlayTrigger, Popover, Tooltip,Modal, Clearfix, ButtonToolbar, Button, ButtonGroup, DropdownButton, MenuItem, SplitButton} from "react-bootstrap"
import {Pager , Pagination, Row, Col, Tabs, Tab, Breadcrumb, FormGroup,FormControl, Nav, NavItem, NavDropdown, Navbar} from "react-bootstrap"
import {Well , Accordion, Panel, Table, ListGroup, ListGroupItem, Grid, Jumbotron, PageHeader} from "react-bootstrap"
import {Form,Glyphicon,  InputGroup,  Checkbox, Radio, ControlLabel,HelpBlock } from "react-bootstrap"
import {Media, Carousel, ResponsiveEmbed, Thumbnail,  Image} from "react-bootstrap"
import {bootstrapUtils,addStyle,  Fade, Collapse, ProgressBar, Alert, Badge, Label} from "react-bootstrap"
      
var Headline = React.createClass ({

    

        
    getInitialState: function() {
      return {
      session: '',
      type: 'initial',
      user:'',
      value: 'notloggedin',
      password: '',
      email: '',
      notif:'',
      userType:''
      };
    },

    componentWillMount:function(){
      var _this=this;
      var type;
      var session;
      var userType;
      axios.get('/checkSession/').then(function(result) {    
              // console.log(result)
              // console.log(result.data.type)
              // console.log(result.data.username)
              type=result.data.type;
              session=result.data.username;
              userType=result.data.userType;
              console.log(type);
              console.log(session);
              console.log(userType);
              _this.setState({session: session, type:type , userType:userType})
             } );
    },

    componentDidMount:function(){
      this.stateChange();
    },

      getUrl:function(){
        var url=("/profile/").concat(this.state.session) + '/';
        //console.log(url);
        // var url=("/profile/")
        top.location.href = url;
        //document.getElementById('urlForm').setAttribute('action', url);
      },

       updateState:function(arg,loginEmail,loginPassword,userType1) {
        // var _this = this;
        this.setState({
          session: arg,
          email: loginEmail,
          password: loginPassword,
          userType:userType1
          },function firebaseSignIn(){
                // console.log("headline.jsx",loginEmail,loginPassword);
              this.signIN(loginEmail,loginPassword);
              this.updateUserType();
          });
        },

        closeProp:function() {
        // var _this = this;
        this.setState({
          type:"initial"
          })
        },

        updateUserType:function(){
          console.log(("72").concat(this.state.type));
          var url=("/getUserType/?type=").concat(this.state.type);
          url=(url).concat("&username=");
          url=(url).concat(this.state.session);
          console.log(url);
          axios.get(url).then(function(result){
            console.log(result.data.userType);
            this.setState({userType:result.data.userType})
          }.bind(this));
        },
       
       loginfun:function() {
         var _this = this;
        
            _this.setState({
              type: 'login'
            })
        },
        signupfun:function() {
         var _this = this;
        
            _this.setState({
              type: 'signup'
            })
        },
        logoutfun:function() {
         var _this = this;
         _this.logOUT();
         var qs = require('qs');
        
            

            _this.setState({
              type: 'initial',
              session: ''
            });
            axios.post('/logout/' ,qs.stringify({username: this.state.session})).then(function(result) {    
              console.log(result);
              _this.logOUT();
              console.log("logout fire done");
            });
            
            
        },
        homefun:function() {
         var _this = this;
         var qs = require('qs');
         var ses=_this.state.session;
         var typ=_this.state.type;
          if(_this.state.type=='login'){
            _this.setState({
              type: 'login',
              session: ses
            }); 
          }
            
        },

        homefun1:function() {
         var _this = this;
        
            _this.setState({
              type: 'initial'
            })
        },

        signIN:function(loginEmail,loginPassword) {
          this.setState({
            email: loginEmail,
            password: loginPassword
          },function changeNewEmail(){
              // console.log("headline.jsx 2 ",loginEmail,loginPassword);
              const auth=firebase.auth();
              const promise = auth.signInWithEmailAndPassword(loginEmail, loginPassword);
              promise.catch(e => console.log(e.message)); 
              this.stateChange();
            });
          

        },

        addAccepted:function(hosp,user){
          console.log("dekhoo");
          var url3=("/letsWait/?username=").concat(hosp);
          console.log(url3);
          console.log(hosp,user);
          var url = ('accepted/').concat(hosp);
          const rootRef= firebase.database().ref().child(url);
          
            rootRef.push({
            username: user,
          });
          // var url2 = ('waiting/').concat(user);
          // const rootRef1= firebase.database().ref().child(url2);
          
          //   rootRef1.push({
          //   username: hosp,
          // });
          
          // document.getElementById('notificationsList').setAttribute('action', url3);
          top.location.href = url3; 

        },

        addHospitalAccepted:function(user,otherUsers){
          var url = ('hospitalAccepted/').concat(user);
          var url3=("/letsWait/?username=").concat(user);
          console.log(url3);
          // console.log(otherUsers);
          const rootRef= firebase.database().ref().child(url);
            
            rootRef.push({
            status: 'true',
            hospUsername: this.state.session,
          });
          for(var key in otherUsers){
            if(otherUsers[key].username!=user)
            {
              var url2 = ('hospitalAccepted/').concat(otherUsers[key].username);
              const rootRef2= firebase.database().ref().child(url);
                // console.log(otherUsers[key].username,url2)
                rootRef2.push({
                status: 'false',
                hospUsername: this.state.session,
              });
            }
          }
          
          // document.getElementById('notificationsListhosp').setAttribute('action', url3);
          top.location.href = url3;
        },

        notif_check:function(){
          console.log("====in notif check====");
          console.log(this.state.userType);
          if(this.state.userType=='hospital')
          {
            console.log("hosp");
            var url = ('accepted/').concat(this.state.session);
            const rootRef= firebase.database().ref().child(url);
            rootRef.on('value', function(snapshot){
                console.log(snapshot.val());
                var objectReturned=snapshot.val();
                var notifications = [];
                //notifications.push(<ListGroup>);
                for(var key in objectReturned){
                  //console.log("===== "+objectReturned[key].username+" =====");
                  notifications.push(
                    <ListGroup>
                    <ListGroupItem>
                    Request From :  {objectReturned[key].username}
                    </ListGroupItem> 
                    <ListGroupItem>
                    <Button onClick={this.addHospitalAccepted.bind(this,objectReturned[key].username,objectReturned)}>
                    Accept
                    </Button>
                    <Button>
                    Decline
                    </Button>
                    </ListGroupItem>
                    </ListGroup>
                    )
                }
                //notifications.push(</ListGroup>);
                
                // notifications.push(</div>);
                this.setState({
                  notif: notifications
                });     
            }.bind(this));
          }
          else if(this.state.userType=='donor')
          {
            console.log("user");
            var url=('userHospNotif/').concat(this.state.session);
            const rootRef= firebase.database().ref().child(url);
            rootRef.on('value', function(snapshot){
                console.log("=======got the donor notification========");
                console.log(snapshot.val());
                var objectReturned=snapshot.val();
                // var notifications = objectReturned.map(function(obj){
                //   console.log("===== "+obj[hospUsername]+" =====");
                // });
                var notifications = [];
                //notifications.push(<ListGroup>);
                
                for(var key in objectReturned){
                  //console.log("===== "+objectReturned[key].hospUsername+" =====");
                  notifications.push(
                    <ListGroup>
                    <ListGroupItem>
                    Request From :  {objectReturned[key].hospUsername}
                    </ListGroupItem> 
                    <ListGroupItem>
                    <Button onClick={this.addAccepted.bind(this,objectReturned[key].hospUsername,this.state.session)}>
                    Accept
                    </Button>
                    <Button>
                    Decline
                    </Button>
                    </ListGroupItem>
                    </ListGroup>
                    )
                }
                //notifications.push(</ListGroup>);
                
                this.setState({
                  notif: notifications
                });
            }.bind(this));
          }
        },

        logOUT:function() {
        const auth=firebase.auth().signOut();
        this.stateChange();
        },

        PING:function(userRecieve){
          var url = ('userHospNotif/').concat(userRecieve);
          const rootRef= firebase.database().ref().child(url);
          
          rootRef.push({
          hospUsername: this.state.session,
          read: 'False'
          });
        },

        MainPing:function(){
          var qs = require('qs');
          axios.post('/getNearUsers/',qs.stringify({hospital: this.state.session})).then(function(result){
            console.log(result);
            var numberOfRecievers = result.data.count;
            // console.log(numberOfRecievers);
            // console.log(result.data.users[0]);
            for (var i = 0; i < numberOfRecievers; i++) {
              console.log(result.data.users[i]);
              this.PING(result.data.users[i]);
            }
          }.bind(this));
        },

        stateChange:function(){
        firebase.auth().onAuthStateChanged(firebaseUser=>{
          if(firebaseUser){
            console.log(firebaseUser);
            this.setState({
              user:firebaseUser.email,
              value:"loggedin"
            }, function afterStateChange (){
              this.notif_check();
            });
          }
          else{
           console.log("not logged in stateChange");
           console.log(this.state.value); 
           this.setState({
              value:"notloggedin",
              user:"",
              notif:""
            }); 
          }
        });

      },
      popoverBottom:function (){
                      return (
                        <Popover id="popover-positioned-bottom" title="">
                        <strong>
                          <div>
                            {this.state.notif}
                          </div>
                        </strong>
                      </Popover>
                      )
      },
       


      render:function() {

        //var divStyle = {color: 'black' };
          
          if(this.state.session!=''){
            //console.log("return statement");

            console.log(this.state.session);

            if(this.state.userType=='donor')
            {
              return (
                <div >
                  <Navbar inverse collapseOnSelect>
                      <Navbar.Header>
                        <Navbar.Brand>
                          <a href="/home">BLOOD-RUNNERS</a>
                        </Navbar.Brand>
                        <Image src={require('./logo.png')} style={{width: '50px',height: '50px'}} rounded responsive/>
                        <Navbar.Toggle />
                      </Navbar.Header>
                  
                     <Navbar.Collapse>
                        <Nav pullRight>
                        <Navbar.Brand>
                          <a eventKey={1} href="/home">Home</a>
                        </Navbar.Brand>
                          

                        
                          <a eventKey={3} >
                          <OverlayTrigger trigger="click" placement="bottom" overlay={this.popoverBottom()}>
                            <Navbar.Brand>
                            Notifications
                            </Navbar.Brand>
                          </OverlayTrigger>
                          </a>


                      <Navbar.Brand> 
                        <a eventKey={4}  href={("/profile/").concat(this.state.session) + '/'}>User : {this.state.session} </a>
                      </Navbar.Brand>

                      <Navbar.Brand>  
                        <a eventKey={5} style={Style1} href="/home" onClick={this.logoutfun} >Logout</a>
                      </Navbar.Brand>  
                      
                      
                      </Nav>
                    </Navbar.Collapse>
                
                   </Navbar>

                  

                  <React_map />
                </div>
              );
            }

            else //for hospital
            {
              return (


                <div>
                  <Navbar inverse collapseOnSelect>
                    <Navbar.Header>
                      <Navbar.Brand>
                        <a href="/home">BLOOD-RUNNERS</a>
                      </Navbar.Brand>
                      <Image src={require('./logo.png')} style={{width: '50px',height: '50px'}} rounded responsive/>
                      <Navbar.Toggle />
                    </Navbar.Header>
                  
                    <Navbar.Collapse>
                        <Nav pullRight>
                        <Navbar.Brand>
                          <a eventKey={1} href="/home">Home</a>
                        </Navbar.Brand>
                          
                        
                          <a eventKey={3} >
                          <OverlayTrigger trigger="click" placement="bottom" overlay={this.popoverBottom()}>
                            <Navbar.Brand>
                            Notifications
                            </Navbar.Brand>
                          </OverlayTrigger>
                          </a>

                      <Navbar.Brand> 
                        <a eventKey={4}  href={("/profile/").concat(this.state.session) + '/'}>Hospital : {this.state.session} </a>
                      </Navbar.Brand>
                      
                      <Navbar.Brand> 
                        <a eventKey={5} href="/request/">Request</a>
                      </Navbar.Brand>
                      

                      <Navbar.Brand>  
                        <a eventKey={6} style={Style1} href="/home" onClick={this.logoutfun} >Logout</a>
                      </Navbar.Brand>  
                      
                      
                      </Nav>
                    </Navbar.Collapse>
                
                  </Navbar>

                  

                  <React_map />
                </div>
              );
            }


          }
          else{
            return (
            <div style={{backgroundColor: 'Black'}}>
            <Navbar inverse collapseOnSelect>
              <Navbar.Header>
                <Navbar.Brand>
                  <a href="/home">BLOOD-RUNNERS</a>
                </Navbar.Brand>
                  <Image src={require('./logo.png')} style={{width: '50px',height: '50px'}} rounded responsive/>
                <Navbar.Toggle />
              </Navbar.Header>
              
              <Navbar.Collapse>
                <Nav pullRight>
                <Navbar.Brand>
                  <a eventKey={1} href="/home">Home</a>
                </Navbar.Brand>
                <Navbar.Brand>  
                  <a eventKey={3} onClick={this.loginfun} >Login</a>
                </Navbar.Brand>  
                <Navbar.Brand> 
                  <a eventKey={4} href="/signup" style={Style1}>Sign-Up</a>
                </Navbar.Brand>  
                </Nav>
              </Navbar.Collapse>
            
            </Navbar>
                <div className="container">
                <div className="row">
                <div className="col-sm-12">
                  <Jumbotron style={{backgroundColor: '#e60000'}}>
                  <h1 style={{display: 'flex', justifyContent: 'center', color: 'white'}}>""You dont have to be a doctor""</h1>
                  <h1 style={{display: 'flex', justifyContent: 'center' , color: 'white'}}>****TO SAVE A LIFE****</h1>
                  </Jumbotron>
                </div>
                </div>
                </div>

            <Login type={this.state.type} showModal={true} updateStateProp = {this.updateState} closeProp={this.closeProp} /> 
           
            <React_map />
            <Jumbotron style={{backgroundColor: 'Black'}} responsive>
                <div  style={{backgroundColor: 'Black'}}>
                <h1 style={{ display: 'flex', justifyContent: 'center',color:'White'}}>We are the developers</h1>
                <Table  style={{display: 'flex', justifyContent: 'center',backgroundColor: 'Black'}}>
                 <tbody>
                  <tr>
                  <td>
                    <Image src={require('./nippo.jpg')} style={{ display: 'flex', justifyContent: 'center',width: '320px',height: '400px'}} rounded  responsive/>
                    <h3 style={{display: 'flex', justifyContent: 'center',color: 'white'}}>Nipun Garg</h3>
                  </td>
                  <td>
                    <Image src={require('./arjun.jpg')} style={{display: 'flex', justifyContent: 'center', width: '320px',height: '400px'}} rounded responsive/>
                    <h3 style={{display: 'flex', justifyContent: 'center',color: 'white'}}>Arjun Gupta</h3>
                  </td>
                  <td>
                    <Image src={require('./rrj.jpg')} style={{ display: 'flex', justifyContent: 'center',width: '320px',height: '400px'}} rounded responsive/>
                    <h3 style={{display: 'flex', justifyContent: 'center',color: 'white'}}>Rishabh Raj Jain</h3>
                  </td>
                   </tr>
                 </tbody>
                </Table>

              </div>
            </Jumbotron>
            </div>

            
            );
            
          }
      }
});


// const styles = StyleSheet.create({
//     button: {
//         padding: 10,
//         borderColor: 'blue',
//         borderWidth: 1,
//         borderRadius: 5,
//         borderColor: '#000066',
//         backgroundColor: '#000066',
//         borderWidth: 1,
//         },
// });

var Style1 = {
    paddingRight: "50px",
    
  };
var Style2 = {
    paddingRight: "50%",
    paddingLeft: "50%",
    
  };  

export default Headline;
