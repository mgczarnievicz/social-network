import React, { Component, ChangeEvent, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { runInThisContext } from "vm";
import { parentPort } from "worker_threads";
import { RootState } from "./redux/reducer";

interface BioState {
    showTextArea: boolean;
    draftBio: string;
}

interface BioProps {
    bio: string[];
    upDateBio?: Function;
}

// class BioEditor extends Component<BioProps, BioState> {
//     constructor(props: BioProps) {
//         super(props);
//         this.state = {
//             showTextArea: false,
//             draftBio: "",
//         };
//         this.toggleBioEditor = this.toggleBioEditor.bind(this);
//         this.handleBioChange = this.handleBioChange.bind(this);
//         this.submitBio = this.submitBio.bind(this);
//     }

//     // React.TextareaHTMLAttributes<HTMLTextAreaElement> ChangeEventHandler<HTMLTextAreaElement>
//     // DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>'
//     handleBioChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
//         this.setState(
//             {
//                 // Bc not all of the key are optional i always need to set them. So I deconstruct and set the one that i want
//                 ...this.state,
//                 draftBio: event.target.value,
//             },
//             () => console.log("this.state in handleBioChange:", this.state)
//         );
//     }

//     submitBio() {
//         console.log("U clicked Save Bio!");

//         fetch("/setBioInfo.json", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ data: this.state.draftBio }),
//         })
//             .then((resp) => resp.json())
//             .then((data) => {
//                 console.log("Data from update Bio", data);
//                 if (data.status === "Success") {
//                     this.props.upDateBio(data.bio);
//                     this.setState({
//                         showTextArea: false,
//                         draftBio: "",
//                     });
//                 }
//             });
//     }

//     toggleBioEditor() {
//         console.log("ToggleModal is running");
//         let setDraftBio = "";
//         console.log("this.props is toggle bioEditor", this.props);

//         if (this.props.bio) setDraftBio = this.props.bio.join("\n");
//         console.log("bio as string setDraftBio", setDraftBio);

//         this.setState({
//             showTextArea: !this.state.showTextArea,
//             draftBio: setDraftBio,
//         });
//     }

//     /* FIXME: when the user does enter, we don't display it! */
//     /* TODO. In server, Create an array of bio and then here in map through the array
//     const string = 'split-by-dash';

//     const usingSplit = string.split('-');
//     result =  [ 'split', 'by', 'dash' ]

//     */
//     render() {
//         return (
//             <div className="bio-container">
//                 {this.props.bio && !this.state.showTextArea && (
//                     <div className="bio-in-display">
//                         {this.props.bio &&
//                             this.props.bio.map(
//                                 (bioSentence: string, i: number) => {
//                                     console.log("Bio ", bioSentence);
//                                     return <h3 key={i}>{bioSentence}</h3>;
//                                 }
//                             )}

//                         {/* <h3>{this.props.bio}</h3> */}
//                         <button onClick={this.toggleBioEditor}>Edit Bio</button>
//                     </div>
//                 )}

//                 {!this.props.bio && !this.state.showTextArea && (
//                     <button onClick={this.toggleBioEditor}>Add Bio</button>
//                 )}

//                 {this.state.showTextArea && (
//                     <div className="bio-in-display">
//                         <textarea
//                             value={this.state.draftBio}
//                             onChange={this.handleBioChange}
//                             rows={5}
//                             cols={50}
//                         ></textarea>
//                         <button onClick={this.submitBio}>Save</button>
//                     </div>
//                 )}
//             </div>
//         );
//     }
// }

// export default BioEditor;

// --------------------------------------------------------------------------------------------------

interface BioState {
    showTextArea: boolean;
    draftBio: string;
}

interface BioProps {
    bio: string[];
    upDateBio?: Function;
}

function BioEditor(props: BioProps) {
    // constructor(props: BioProps) {
    //     super(props);
    //     this.state = {
    //         showTextArea: false,
    //         draftBio: "",
    //     };
    //     this.toggleBioEditor = this.toggleBioEditor.bind(this);
    //     this.handleBioChange = this.handleBioChange.bind(this);
    //     this.submitBio = this.submitBio.bind(this);
    // }

    const [draftBio, setDraftBio] = useState<string | null>("");
    const [showTextArea, setShowTextArea] = useState<boolean>(false);

    // This should came from the Global State
    // const bio = useSelector((state: RootState) => state.user.bio);
    const bio: Array<string> = ["I am not getting it"];

    // React.TextareaHTMLAttributes<HTMLTextAreaElement> ChangeEventHandler<HTMLTextAreaElement>
    // DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>'
    function handleBioChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setDraftBio(event.target.value);
    }

    function submitBio() {
        console.log("U clicked Save Bio!");

        fetch("/setBioInfo.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: draftBio }),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("Data from update Bio", data);
                if (data.status === "Success") {
                    // Set the draft in the Global State
                    // REVIEW.
                    setShowTextArea(false);
                    setDraftBio("");
                }
            });
    }

    function toggleBioEditor() {
        console.log("ToggleModal is running");
        let setDraftBio: string = "";
        console.log("this.props is toggle bioEditor", this.props);

        if (bio) setDraftBio = bio.join("\n");
        console.log("bio as string setDraftBio", setDraftBio);

        // this.setState({
        //     showTextArea: !this.state.showTextArea,
        //     draftBio: setDraftBio,
        // });
        setShowTextArea(!showTextArea);
        // setDraftBio(setDraftBio);
        // setDraftBio("Test");
    }

    /* FIXME: when the user does enter, we don't display it! */
    /* TODO. In server, Create an array of bio and then here in map through the array 
    const string = 'split-by-dash';

    const usingSplit = string.split('-');
    result =  [ 'split', 'by', 'dash' ]
    
    */

    return (
        <div className="bio-container">
            {this.props.bio && !showTextArea && (
                <div className="bio-in-display">
                    {this.props.bio &&
                        this.props.bio.map((bioSentence: string, i: number) => {
                            console.log("Bio ", bioSentence);
                            return <h3 key={i}>{bioSentence}</h3>;
                        })}

                    {/* <h3>{this.props.bio}</h3> */}
                    <button onClick={toggleBioEditor}>Edit Bio</button>
                </div>
            )}

            {!this.props.bio && !showTextArea && (
                <button onClick={toggleBioEditor}>Add Bio</button>
            )}

            {showTextArea && (
                <div className="bio-in-display">
                    <textarea
                        value={draftBio}
                        onChange={handleBioChange}
                        rows={5}
                        cols={50}
                    ></textarea>
                    <button onClick={submitBio}>Save</button>
                </div>
            )}
        </div>
    );
}

export default BioEditor;
