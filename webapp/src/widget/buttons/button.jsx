// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React from 'react';

import './button.scss';
import {generateClassName} from '../../utils';



function Button(props){
    const classNames = {
        Button: true,
        active: Boolean(props.active),
        filled: Boolean(props.filled),
        danger: Boolean(props.danger),
    };

    classNames[`emphasis--${props.emphasis}`] = Boolean(props.emphasis);
    classNames[`size--${props.size}`] = Boolean(props.size);
    classNames[`${props.className}`] = Boolean(props.className);

    return (
        <button
            type={props.submit ? 'submit' : 'button'}
            onClick={props.onClick}
            className={generateClassName(classNames)}
            title={props.title}
            onBlur={props.onBlur}
        >
            {!props.rightIcon && props.icon}
            <span>{props.children}</span>
            {props.rightIcon && props.icon}
        </button>);
}

export default React.memo(Button);
