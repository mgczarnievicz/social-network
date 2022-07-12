import React from "react";
import { Component } from "react";

// Function
interface UploaderProps {
    methodInApp?: (a: string) => void;
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
    methodInUploader(event: React.SyntheticEvent) {
        console.log("I am clicking accept!");
        event.preventDefault();
        // /upload.json

        fetch("/upload.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(event.target),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("Data received POST load.json", data);

                if (data.status === "Success") {
                    // Call function form parent with the argument as the url.
                    this.props.methodInApp(data.imageUrl);
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
            <div>
                <h1>I am the Uploader!</h1>
                <form
                    encType="multipart/form-data"
                    onSubmit={(e) => {
                        this.methodInUploader(e);
                    }}
                >
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
