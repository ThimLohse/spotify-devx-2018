import React from 'react';
import PropTypes from 'prop-types';



class OpenModal extends React.Component {

  constructor(props){
    super(props);

  }
  state = {
    show : false;
  }

  close = () => this.setState({ show: false });

  render() {

    return (
        
    );
  }
}


  export default OpenModal;
