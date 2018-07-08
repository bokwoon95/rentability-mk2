import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';

import Task from './Task.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
      shouldShowForm: false,
      searchBarText: '',
      currentuzer: '',
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(event);

    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Tasks.insert({
      text,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),           // _id of logged in user
      username: Meteor.user().username,  // username of logged in user
    });

    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  handleSubmitv2(event) {
    event.preventDefault();
    console.log(event);

    const item = ReactDOM.findDOMNode(this.refs.itemInput).value.trim();
    // const condition = ReactDOM.findDOMNode(this.refs.conditionInput).value.trim();
    const price = ReactDOM.findDOMNode(this.refs.priceInput).value.trim();
    const address = ReactDOM.findDOMNode(this.refs.addressInput).value.trim();

    Tasks.insert({
      item,
      price,
      address,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),           // _id of logged in user
      username: Meteor.user().username,  // username of logged in user
      name: Meteor.user().name,
    });

    // Clear form
    ReactDOM.findDOMNode(this.refs.itemInput).value = '';
    ReactDOM.findDOMNode(this.refs.priceInput).value = '';
    ReactDOM.findDOMNode(this.refs.addressInput).value = '';
  }

  // onInputChange(evt) {
  //   const fields = Object.assign({}, this.state.fields);
  //   fields[evt.target.name] = evt.target.value;
  //   this.setState({fields});
  // };

  toggleForm() {
    this.setState({
      shouldShowForm: !this.state.shouldShowForm,
    });
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    // if (this.state.hideCompleted) {
    //   filteredTasks = filteredTasks.filter(task => !task.checked);
    // }
    return filteredTasks.map((task) => (
      <Task key={task._id} task={task} cu={this.props.currentUser} />
    ));
  }

  onInputChange(evt) {
    event.preventDefault();
    console.log(evt.target.value);
    this.setState({
     searchBarText : evt.target.value,
    });
  }

  onNameEnter(evt) {
    event.preventDefault();
    let namajeff = ReactDOM.findDOMNode(this.refs.ownerName).value.trim();
    console.log(namajeff);
    console.log(Meteor.userId());
    Meteor.users.update(Meteor.userId(), {
      $set: {
        name: namajeff
      }
    });
  }

  render() {
    return (
      <div className="container">
        <header>
          {/*<h1>Todo List ({this.props.incompleteCount})</h1>*/}

          {/*
          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
          </label>
              */}

          <AccountsUIWrapper />

          {/*
          { this.props.currentUser ?
          <form className="new-task" onSubmit={this.onNameEnter.bind(this)}>
            <p>jeff:{this.currentuzer}</p>
            <input
              type="text"
              ref="ownerName"
              placeholder={this.currentuzer ? "kimi no namae wa" : "who are you?"}
            />
            <button>nama jeff</button>
          </form> : ''
          }
          <br />
          */}

          { this.props.currentUser ?
              this.state.shouldShowForm ?
              <div>
                <button onClick={this.toggleForm.bind(this)}>
                  Close Entry
                </button>
                {/*
                <form>
                  <input
                    type="text"
                    ref="searchBar"
                    placeholder="Search"
                    onChange={this.onInputChange.bind(this)}
                  />
                </form>
                */}
                <form onSubmit={this.handleSubmitv2.bind(this)}>
                  <input
                  type="text"
                  ref="itemInput"
                  placeholder="Item name"
                  />

                {/*
                  <input
                  type="text"
                  ref="conditionInput"
                  placeholder="Condition of item"
                  />
                  */}

                  <input
                  type="text"
                  ref="priceInput"
                  placeholder="Price"
                  />

                  <input
                  type="text"
                  ref="addressInput"
                  placeholder="Pickup Address"
                  />
                  <button>Submit</button>
                </form>
              </div>
               :
              <div>
              <button onClick={this.toggleForm.bind(this)}>
                New Entry
              </button>
              </div>
              :
            ''
          }
          {/*
          <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
            <input
              type="text"
              ref="textInput"
              placeholder="Type to add new tasks"
            />
          </form>
          */}
        </header>

        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    // refinedSearch: Tasks.find({ "item": new RegExp(searchBarText) }).fetch(),
    currentUser: Meteor.user(),
  };
})(App);
