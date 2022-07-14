"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var BioEditor = /** @class */ (function (_super) {
    __extends(BioEditor, _super);
    function BioEditor(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            showTextArea: false,
            draftBio: "",
        };
        _this.toggleBioEditor = _this.toggleBioEditor.bind(_this);
        _this.handleBioChange = _this.handleBioChange.bind(_this);
        _this.submitBio = _this.submitBio.bind(_this);
        return _this;
    }
    // React.TextareaHTMLAttributes<HTMLTextAreaElement> ChangeEventHandler<HTMLTextAreaElement>
    // DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>'
    BioEditor.prototype.handleBioChange = function (event) {
        var _this = this;
        this.setState(__assign(__assign({}, this.state), { draftBio: event.target.value }), function () { return console.log("this.state in handleBioChange:", _this.state); });
    };
    BioEditor.prototype.submitBio = function () {
        var _this = this;
        console.log("U clicked Save Bio!");
        fetch("/setBioInfo.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: this.state.draftBio }),
        })
            .then(function (resp) { return resp.json(); })
            .then(function (data) {
            console.log("Data from update Bio", data);
            if (data.status === "Success") {
                _this.props.upDateBio(data.bio);
                _this.setState({
                    showTextArea: false,
                    draftBio: "",
                });
            }
        });
    };
    BioEditor.prototype.toggleBioEditor = function () {
        console.log("ToggleModal is running");
        var setDraftBio = "";
        console.log("this.props is toggle bioEditor", this.props);
        if (this.props.bio)
            setDraftBio = this.props.bio.join("\n");
        console.log("bio as string setDraftBio", setDraftBio);
        this.setState({
            showTextArea: !this.state.showTextArea,
            draftBio: setDraftBio,
        });
    };
    /* FIXME: when the user does enter, we don't display it! */
    /* TODO. In server, Create an array of bio and then here in map through the array
    const string = 'split-by-dash';

    const usingSplit = string.split('-');
    result =  [ 'split', 'by', 'dash' ]
    
    */
    BioEditor.prototype.render = function () {
        return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "bio-container" }, { children: [this.props.bio && !this.state.showTextArea && ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "bio-in-display" }, { children: [this.props.bio &&
                            this.props.bio.map(function (bioSentence, i) {
                                console.log("Bio ", bioSentence);
                                return (0, jsx_runtime_1.jsx)("h3", { children: bioSentence }, i);
                            }), (0, jsx_runtime_1.jsx)("button", __assign({ onClick: this.toggleBioEditor }, { children: "Edit Bio" }))] }))), !this.props.bio && !this.state.showTextArea && ((0, jsx_runtime_1.jsx)("button", __assign({ onClick: this.toggleBioEditor }, { children: "Add Bio" }))), this.state.showTextArea && ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "bio-in-display" }, { children: [(0, jsx_runtime_1.jsx)("textarea", { value: this.state.draftBio, onChange: this.handleBioChange, rows: 5, cols: 50 }), (0, jsx_runtime_1.jsx)("button", __assign({ onClick: this.submitBio }, { children: "Save Changes" }))] })))] })));
    };
    return BioEditor;
}(react_1.Component));
exports.default = BioEditor;
