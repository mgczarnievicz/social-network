import React, { Component, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { runInThisContext } from "vm";
import { parentPort } from "worker_threads";

interface BioState {
    showTextArea: boolean;
    draftBio: string;
}

interface BioProps {
    bio: string;
    upDateBio?: Function;
}

class BioEditor extends Component<BioProps, BioState> {
    constructor(props: BioProps) {
        super(props);
        this.state = {
            showTextArea: false,
            draftBio: "",
        };
        this.toggleBioEditor = this.toggleBioEditor.bind(this);
        this.handleBioChange = this.handleBioChange.bind(this);
        this.submitBio = this.submitBio.bind(this);
        this.editBio = this.editBio.bind(this);
    }

    // React.TextareaHTMLAttributes<HTMLTextAreaElement> ChangeEventHandler<HTMLTextAreaElement>
    // DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>'
    handleBioChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState(
            {
                // Bc not all of the key are optional i always need to set them. So I deconstruct and set the one that i want
                ...this.state,
                draftBio: event.target.value,
            },
            () => console.log("this.state in handleBioChange:", this.state)
        );
    }

    submitBio() {
        console.log("U clicked Save Bio!");

        /* TODO: When user press submit:
     1. we want to do a post request to the server to save the new bio.
     2. after the draft was successfully inserted into the db, make sure
     */

        fetch("/setBioInfo.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: this.state.draftBio }),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("Data from update Bio", data);
                if (data.status === "Success") {
                    this.props.upDateBio(data.bio);
                    this.setState({
                        showTextArea: false,
                        draftBio: "",
                    });
                }
            });
    }

    toggleBioEditor() {
        console.log("ToggleModal is running");
        this.setState({
            showTextArea: !this.state.showTextArea,
        });
    }
    editBio() {
        this.setState({
            showTextArea: true,
            draftBio: this.props.bio,
        });
    }
    render() {
        return (
            <div className="bio">
                <h1>Hi I am the Bio Editor</h1>

                {this.props.bio && !this.state.showTextArea && (
                    <div>
                        <p>{this.props.bio}</p>
                        <a onClick={this.editBio}>Edit Bio</a>
                    </div>
                )}

                {!this.props.bio && !this.state.showTextArea && (
                    <button onClick={this.toggleBioEditor}>Add Bio</button>
                )}

                {this.state.showTextArea && (
                    <div>
                        <textarea
                            value={this.state.draftBio}
                            onChange={this.handleBioChange}
                            rows={10}
                            cols={100}
                        ></textarea>
                        <button onClick={this.submitBio}>Save Changes</button>
                    </div>
                )}
            </div>
        );
    }
}

export default BioEditor;
