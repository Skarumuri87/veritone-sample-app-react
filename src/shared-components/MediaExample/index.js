import React from 'react';
import { PropTypes } from 'helpers/react';
import { connect } from 'react-redux';

import Divider from 'material-ui/Divider';
import MediaUpload from 'shared-components/MediaUpload';
import MediaUploadState from 'shared-components/MediaUploadState';
import MediaUploadStates from 'shared-components/MediaUploadStates';
import RequestBar from 'shared-components/RequestBar';
import ExpandingContainer from 'shared-components/ExpandingContainer';

import { transcribeMedia } from 'modules/mediaExample';


const { bool } = PropTypes;


class MediaExample extends React.Component {

  state = {
    expanded: false
  };

  onFileLoad = (e, file) => {

    this.setState({
      expanded: true
    });

    this.props.transcribeMedia(file);
  };

  render() {
    const actions = this.props.actions;
    const payload = this.props.payload;

    const showResults = this.props.actions.getJob &&
                        this.props.actions.getJob.status === 'success';

    return (
      <div>
        <h4>Transcription Example</h4>
        <RequestBar
          id={1}
          description='Upload a media file to begin transcription'
          expanded={this.state.expanded}
          button={
            <MediaUpload onFileLoad={this.onFileLoad}/>
          }
        >
          <Divider style={{ marginTop: '20px'}} />
          <MediaUploadStates actions={this.props.actions} />
          <Divider />
          {showResults &&
            <MediaUploadState action='Results' />
          }
          {showResults &&
            <div className='requestBar__payload'>
              <pre>{JSON.stringify(payload, null, 2)}</pre>
            </div>
          }
        </RequestBar>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    actions: state.mediaExample.actions,
    payload: state.mediaExample.result
  }
}

const mapDispatchToProps = { transcribeMedia }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MediaExample)

