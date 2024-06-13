import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../../widget/buttons/button';
import CompassIcon from '../icons/compassIcons';
import { Form, Input, Modal, Popover, Select, Table, notification } from 'antd';
import StaffView from './staff_view';


const RHSView = (props) => {
    const [viewIndex, setViewIndex] = useState(0);

    return (
        <div>
            <StaffView />
        </div>
    );
}

const style = {
    rhs: {
        padding: '10px',
    },
    table: {
        marginTop: '10px',
    },
};


export default RHSView;