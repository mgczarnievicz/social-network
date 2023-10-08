import React from "react";
import { Component } from "react";

// Function
interface UploaderProps {
    upDatingPhoto?: (a: string) => void;
    toggleUploader: Function;
    // methodInApp?: Function;
}

export default class Uploader extends Component<UploaderProps> {
    constructor(props: UploaderProps) {
        super(props);
        this.state = {};

        this.setNewPhoto = this.setNewPhoto.bind(this);
    }
    componentDidMount() {
        console.log("Uploader just mount this.props", this.props);
    }
    // HTMLFormElement HTMLFormElement React.SyntheticEvent
    setNewPhoto(event: React.ChangeEvent<HTMLFormElement>) {
        
        event.preventDefault();

        fetch("/upload.json", {
            method: "POST",
            body: new FormData(event.target),
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.status === "Success") {
                    // Call function form parent with the argument as the url.
                    this.props.upDatingPhoto(data.photourl);
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch(() => {
                // this.setState(
                //     {
                //         error: true,
                //     },
                //     () => console.log("this.state:", this.state)
                // );
            });

        // Here we want to call the method of my parent. That live in props.
        //  this.props.methodInApp(true);
    }
    render() {
        return (
            <div className="uploader">
                <h2
                    onClick={() => {
                        this.props.toggleUploader();
                    }}
                >
                    X
                </h2>
                <form encType="multipart/form-data" onSubmit={this.setNewPhoto}>
                    <div className="select-img">
                        <label htmlFor="inputTag">
                            <i className="fa fa-2x fa-camera"></i>
                            <br /> Select Image
                            <input
                                type="file"
                                className="hidden"
                                name="image"
                                accept="image/*"
                                ref="file"
                                id="inputTag"
                            />
                            <br />
                            <span id="imageName"></span>
                        </label>
                    </div>

                    <button type="submit">Accept</button>
                </form>
            </div>
        );
    }
}
