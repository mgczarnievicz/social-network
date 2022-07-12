import React from "react";
import { Component } from "react";

// Function
interface UploaderProps {
    upDatingPhoto?: (a: string) => void;
    // methodInApp?: Function;
}

export default class Uploader extends Component<UploaderProps> {
    constructor(props: UploaderProps) {
        super(props);
        this.state = {};

        this.setNewPhoto = this.setNewPhoto.bind(this);
    }
    componentDidMount() {
        console.log("Uploader just mount");
    }
    // HTMLFormElement HTMLFormElement React.SyntheticEvent
    setNewPhoto(event: React.ChangeEvent<HTMLFormElement>) {
        console.log("I am clicking accept!");
        event.preventDefault();
        // /upload.json
        console.log("event target in setNewPhoto:", event.target);

        fetch("/upload.json", {
            method: "POST",
            body: new FormData(event.target),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("Data received POST load.json", data);

                if (data.status === "Success") {
                    // Call function form parent with the argument as the url.
                    this.props.upDatingPhoto(data.photourl);
                } else {
                    this.setState({
                        error: true,
                    });
                }
                console.log("this.state:", this.state);
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
                <h1>Update your Photo</h1>
                <form encType="multipart/form-data" onSubmit={this.setNewPhoto}>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        ref="file"
                        id="inputTag"
                    />
                    <button type="submit">Accept</button>
                </form>
            </div>
        );
    }
}
