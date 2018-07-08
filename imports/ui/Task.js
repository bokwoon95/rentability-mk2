import React, { Component } from 'react';

import { Tasks } from '../api/tasks.js';

// Task component - represents a single todo item
export default class Task extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDetails: false,
    };
  }

  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Tasks.update(this.props.task._id, {
      $set: { checked: !this.props.task.checked },
    });
  }

  deleteThisTask() {
    Tasks.remove(this.props.task._id);
  }

  showThisTask() {
    this.setState({
      showDetails: true
    });
  }

  hideThisTask() {
    this.setState({
      showDetails: false
    });
  }

  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const taskClassName = this.props.task.checked ? 'checked' : '';

    return (
      <li className={taskClassName}>
        { this.props.cu ?
        <button className="delete" onClick={this.deleteThisTask.bind(this)}>
          delete
        </button> : ''
        }

        {this.state.showDetails ?
        <button className="delete" onClick={this.hideThisTask.bind(this)}>
          hide
        </button>
          :
        <button className="delete" onClick={this.showThisTask.bind(this)}>
          show
        </button>
        }
        {/*
        <input
          type="checkbox"
          readOnly
          checked={!!this.props.task.checked}
          onClick={this.toggleChecked.bind(this)}
        />
        */}

        {!this.state.showDetails ?
          <span className="text">
            <strong>{this.props.task.username}</strong>: {this.props.task.item}
          </span>
            :
          <span className="text">
            <strong>{this.props.task.username}</strong>: {this.props.task.item}
            <p>Price: {this.props.task.price}</p>
            <p>Address: {this.props.task.address}</p>
          </span>
        }
      </li>
    );
  }
}
