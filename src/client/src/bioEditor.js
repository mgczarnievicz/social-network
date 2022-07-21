"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
function BioEditor(props) {
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
    var _a = (0, react_1.useState)(""), draftBio = _a[0], setDraftBio = _a[1];
    var _b = (0, react_1.useState)(false), showTextArea = _b[0], setShowTextArea = _b[1];
    // This should came from the Global State
    // const bio = useSelector((state: RootState) => state.user.bio);
    var bio = ["I am not getting it"];
    // React.TextareaHTMLAttributes<HTMLTextAreaElement> ChangeEventHandler<HTMLTextAreaElement>
    // DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>'
    function handleBioChange(event) {
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
            .then(function (resp) { return resp.json(); })
            .then(function (data) {
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
        var setDraftBio = "";
        console.log("this.props is toggle bioEditor", this.props);
        if (bio)
            setDraftBio = bio.join("\n");
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
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "bio-container" }, { children: [this.props.bio && !showTextArea && ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "bio-in-display" }, { children: [this.props.bio &&
                        this.props.bio.map(function (bioSentence, i) {
                            console.log("Bio ", bioSentence);
                            return (0, jsx_runtime_1.jsx)("h3", { children: bioSentence }, i);
                        }), (0, jsx_runtime_1.jsx)("button", __assign({ onClick: toggleBioEditor }, { children: "Edit Bio" }))] }))), !this.props.bio && !showTextArea && ((0, jsx_runtime_1.jsx)("button", __assign({ onClick: toggleBioEditor }, { children: "Add Bio" }))), showTextArea && ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "bio-in-display" }, { children: [(0, jsx_runtime_1.jsx)("textarea", { value: draftBio, onChange: handleBioChange, rows: 5, cols: 50 }), (0, jsx_runtime_1.jsx)("button", __assign({ onClick: submitBio }, { children: "Save" }))] })))] })));
}
exports.default = BioEditor;
