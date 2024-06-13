import {connect} from 'react-redux';

import {getCurrentTeam} from 'mattermost-redux/selectors/entities/teams';

import {isEnabled} from 'selectors';

import RHSView from './rhs_view';

const mapStateToProps = (state) => ({
    enabled: isEnabled(state),
    team: getCurrentTeam(state),
});

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            // remove,
            // complete,
            // accept,
            // bump,
            list,
            openAddCard,
            closeAddCard,
            // openAssigneeModal,
            // telemetry,
            setVisible: setRhsVisible,
        }, dispatch),
    };
}



export default connect(mapStateToProps)(RHSView);
