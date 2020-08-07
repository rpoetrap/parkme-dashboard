import React, { Component } from 'react';
import GenericError from '../components/GenericError';

interface Props {

}

class Error extends Component<Props> {

  render() {
    return <GenericError />
  }
}

export default Error;
