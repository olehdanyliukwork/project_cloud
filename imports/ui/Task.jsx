import React, { Component, PropTypes } from 'react';
import { Tasks } from '../api/tasks.js';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

const fadeo = el => () =>
  $( el ).fadeOut( "slow", ()=>{});

const toggle = (state, props) => ({show: !state.show});

const Togglable = props => (
  props.show ? <div className="row col-md-12">{props.children}</div> : null
);

const download = (filename, text) => {
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const DataTable = props => (
  <table className = "table" onClick={()=>download(props.filename+".csv",
      (typeof props.data=="object") ?
          props.data
          .reduce((a,b)=>a.concat(b))
          .map(row => 
            row.join(", "))
          .join("\n") :
          props.data
    )}>
    <tbody>
      {
        (typeof props.data=="object") ?
          props.data.reduce((a,b)=>a.concat(b)).map((row,i) => 
            <tr key={i}>{row.map((el,j)=>
              <td key={j}>{el.toFixed(2)}</td>)}
            </tr>) :
          <tr><td>{props.data}</td></tr>
      }
    </tbody>
  </table>
);

// Task component - represents a single todo item
export default class Task extends Component {
    constructor(){
      super();
      this.state = {show: false};     
    }
    toggleChecked() {
        // Set the checked property to the opposite of its current value    
        Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
    }

    deleteThisTask() {
        Meteor.call('tasks.remove', this.props.task._id);
    }
    togglePrivate() {
        Meteor.call('tasks.setPrivate', this.props.task._id, !this.props.task.private);
    }
    toggleDescription() {
      this.setState(toggle);
    }
    edit() {
      this.props.go("edit", [this.props.task._id, this.props.task.name, this.props.task.description]);
    }
    render() {
        // Give tasks a different className when they are checked off,
        // so that we can style them nicely in CSS

        const taskClassName = classnames({
            checked: this.props.task.checked,
            private: this.props.task.private,
        });
        return (
           <li className={taskClassName + " navbar navbar-inverse color-white"} style = {{margin:"1%"}}>    


              <div className="row col-md-12" style={{color:"white"}}> 

                <div className="col-md-6">
                  <div>Task {this.props.task.name} created by {this.props.task.username}</div>
                </div>
                <div className="col-md-6">
                  <button className="btn btn-primary" style={{float:"right"}} onClick={this.toggleDescription.bind(this)}>Description</button>
                  <button className="btn btn-danger" style={{float:"right"}} onClick={this.deleteThisTask.bind(this)}>Delete</button>
                  <button className="btn btn-success" style={{float:"right"}} onClick = {this.toggleChecked.bind(this)}>Recalculate</button>
                  <button className="btn btn-info" style={{float:"right"}} onClick = {this.edit.bind(this)}>Edit</button>
                </div>
              </div>

              
              <Togglable show={this.state.show}>
              <div className="row col-md-12" >
                <div className = "col-md-1"></div>
                <p className = "row text-justify col-md-10">{this.props.task.description}</p>
                <div className = "col-md-1"></div>
              </div>
              <div className="col-md-12">
                <div className="col-md-6">
                  <div className="row text-center">
                    Algorithm
                  </div>
                  <div className="border-block">
                      <pre>{this.props.task.algorithm}</pre>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row text-center">
                    Data
                  </div>
                  <div className="border-block">
                    <DataTable data={this.props.task.data} filename="data" />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="row text-center">
                    Output
                  </div>
                  <div className="border-block">
                    <DataTable data={this.props.task.output} filename="output" />
                  </div>
                </div>
              </div>
              </Togglable>


    </li>
          
       

        );
    }
}

Task.propTypes = {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    task: PropTypes.object.isRequired,
    showPrivateButton: React.PropTypes.bool.isRequired,
};
