import React from "react"
import Login from "../Login"
import { render } from "react-dom"
import axios from 'axios';

            
var Headline = React.createClass ({
        
    getInitialState: function() {
      

      return {
      session: '',
      type: 'initial'
      };

            
    
    },
    componentWillMount:function(){

      var _this=this;
      var type;
      var session;
      axios.get('/checkSession/').then(function(result) {    
              console.log(result)
              console.log(result.data.type)
              console.log(result.data.username)
              type=result.data.type
              session=result.data.username
              console.log(type)
              console.log(session)
              _this.setState({session: session, type:type})
             } );
      

    },

      
      getUrl:function(){
        //var url=("/profile/").concat(this.state.session);
        //console.log(url);
        var url=("/profile/")
        document.getElementById('urlForm').setAttribute('action', url);
      },

       updateState:function(arg) {
        var _this = this;
        this.setState({session: arg})
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
         var qs = require('qs');
        
            

            _this.setState({
              type: 'initial',
              session: ''
            });
            axios.  post('/logout/' ,qs.stringify({username: this.state.session})).then(function(result) {    
              console.log(result)
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
      


      render:function() {
          
          if(this.state.session!=''){
            //console.log("return statement");

            console.log(this.state.session);

            return (
              <div>
                <h1>User logged in= {this.state.session}</h1>

                <button onClick={this.homefun}>Home</button>

                
                <button onClick={this.logoutfun}>Log-Out</button>
                
                <form id="urlForm" method="POST" action="#" onSubmit={this.getUrl}>
                < button type="submit">Profile</button>
                </form>
              
              </div>
            );

          }
            else{

            return (
          	<div>
              <button onClick={this.homefun1}>Home</button>

              <form method="get" action="/signup">
              < button type="submit">Sign-Up</button>
              </form>
              <button  onClick={this.loginfun} >Login</button>
              <Login type={this.state.type} updateStateProp = {this.updateState}/> 
            	<h1>session in headline={this.state.session}</h1>

          	</div>
            );
          }
      }
});
export default Headline;
