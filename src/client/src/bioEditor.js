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
var react_redux_1 = require("react-redux");
var slice_1 = require("./redux/user/slice");
function BioEditor(props) {
    var dispatch = (0, react_redux_1.useDispatch)();
    var _a = (0, react_1.useState)(""), draftBio = _a[0], setDraftBio = _a[1];
    var _b = (0, react_1.useState)(false), showTextArea = _b[0], setShowTextArea = _b[1];
    var bio = (0, react_redux_1.useSelector)(function (state) { return state.user.bio; });
    // useEffect(() => {
    //     let abort = false;
    //     if (bio){
    //         setDraftBio = bio.join("\n");
    //     }
    // }, []);
    // React.TextareaHTMLAttributes<HTMLTextAreaElement> ChangeEventHandler<HTMLTextAreaElement>
    // DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>'
    function handleBioChange(event) {
        setDraftBio(event.target.value);
    }
    function submitBio() {
        // console.log("U clicked Save Bio!");
        fetch("/setBioInfo.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: draftBio }),
        })
            .then(function (resp) { return resp.json(); })
            .then(function (data) {
            // console.log("Data from update Bio", data);
            if (data.status === "Success") {
                setShowTextArea(false);
                setDraftBio("");
                dispatch((0, slice_1.userUpdateBio)(data.bio));
            }
        });
    }
    function toggleBioEditor() {
        var stringDraftBio = "";
        if (bio)
            stringDraftBio = bio.join("\n");
        setShowTextArea(!showTextArea);
        setDraftBio(stringDraftBio);
    }
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "bio-container" }, { children: [bio && !showTextArea && ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "bio-in-display" }, { children: [bio &&
                        bio.map(function (bioSentence, i) {
                            // console.log("Bio ", bioSentence);
                            return ((0, jsx_runtime_1.jsx)("h3", __assign({ className: "bio-text" }, { children: bioSentence }), i));
                        }), (0, jsx_runtime_1.jsx)("button", __assign({ onClick: toggleBioEditor }, { children: "Edit Bio" }))] }))), !bio && !showTextArea && ((0, jsx_runtime_1.jsx)("button", __assign({ onClick: toggleBioEditor }, { children: "Add Bio" }))), showTextArea && ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "bio-in-display" }, { children: [(0, jsx_runtime_1.jsx)("textarea", { value: draftBio, onChange: handleBioChange, rows: 5, cols: 50 }), (0, jsx_runtime_1.jsx)("button", __assign({ onClick: submitBio }, { children: "Save" }))] })))] })));
}
exports.default = BioEditor;
