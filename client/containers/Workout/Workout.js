import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import cookie from 'react-cookie';
import React, { Component } from 'react';
import { reset } from 'redux-form';

import WorkoutWizard from 'components/WorkoutWizard';
import SelectorWizard from 'components/SelectorWizard';

import { gatherFormData, postWorkoutData } from 'actions/workout_actions';
import { fetchWorkout } from 'actions/selector_actions';

class WorkoutContainer extends Component {

  renderComponent() {
    const user = cookie.load('user');
    console.log(jwtDecode(user));
    
    if (!this.props.selectedWorkout) {
      return (
        <SelectorWizard {...this.props} />
      );
    } else {
      return (
        <WorkoutWizard {...this.props} />
      );
    }
  }

  render() {
    return (<div>
      <Helmet title="Workout" />
      {this.renderComponent()}
    </div>);
  }
}

const mapStateToProps = (state) => ({
  selectedWorkout: state.selector.selectedWorkout,
});

const mapDispatchToProps = (dispatch) => ({
  gatherFormData:     (exerciseName) => dispatch(gatherFormData(exerciseName)),
  postWorkoutData:    (data) => dispatch(postWorkoutData(data)),
  reset:              () => dispatch(reset('workout')),
  fetchWorkout:       () => dispatch(fetchWorkout()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WorkoutContainer);
