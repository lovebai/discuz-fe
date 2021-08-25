import React, { Component } from 'react';

export default class PluginComponent extends Component {

    constructor(props) {
        super(props);
    }

    componentDidCatch(err) {
        console.error(err);
    }

    render() {
        const {_pluginInfo} = this.props;
        return React.cloneElement(_pluginInfo.Component, this.props);
    }
}