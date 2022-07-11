import React from "react";
import { Component } from "react";

// Function
interface UploaderProps {
    methodInApp?: (a: boolean) => void;
    // methodInApp?: Function;
}

export default class Uploader extends Component<UploaderProps> {
    constructor(props: UploaderProps) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        console.log("Uploader just mount");
    }
    methodInUploader() {
        // Here we want to call the method of my parent. That live in props.
        //  this.props.methodInApp(true);
    }
    render() {
        return (
            <div>
                <h1>I am the Uploader!</h1>
                <h2 onClick={() => this.methodInUploader}>Click me!</h2>
            </div>
        );
    }
}
