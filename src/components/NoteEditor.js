import React, { useRef } from "react";
import { Editor, EditorState, RichUtils } from "draft-js";
import styled from "styled-components";
import DialogTitle from "./widget_component/DiaglogTitle";

const EditorWrapper = styled.div`
    border: 1px solid rgb(255, 255, 255);
    font-family: "Inter", sans-serif;
`;

const EditorControls = styled.div`
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-start;
    font-size: 14px;
    
`;

const ContentEditor = styled.div`
    min-height: 300px;
    padding: 15px;
    border-top: 1px solid #ddd;
    background-color: white;
    white-space: pre-wrap;
    outline: none;
    overflow: auto;
`;

const StyleButton = styled.button`
    padding: 5px 10px;
    font-size: 14px;
    cursor: pointer;
    background-color: ${(props) => (props.active ? "#fff" : "#fff")};
    color: ${(props) => (props.active ? "#e77f23" : "#666")};
    font-weight: ${(props) => (props.active ? "bold" : "normal")};
    &:hover{
        background-color: #fff;
        
    }
`;
const EditorControllers = styled.div`
    //position: absolute;

`
const RichEditor = ({ editorState, setEditorState ,title}) => {
    const editorRef = useRef(null);

    const focus = () => {
        if (editorRef.current) {
            editorRef.current.focus();
        }
    };

    const handleChange = (newEditorState) => {
        setEditorState(newEditorState);
    };

    const toggleBlockType = (blockType) => {
        const blockTypes = {
            H1: "header-one",
            H2: "header-two",
            H3: "header-three",
            UL: "unordered-list-item",
            OL: "ordered-list-item",
            Blockquote: "blockquote",
            "code-block": "code-block",
        };
        setEditorState(RichUtils.toggleBlockType(editorState, blockTypes[blockType]));
    };

    const toggleInlineStyle = (style) => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, style));
    };

    return (
        <EditorWrapper>
            <EditorControllers>
                <DialogTitle>{title}</DialogTitle>
                <EditorControls>
                    {["H1", "H2", "H3", "Blockquote", "UL", "OL", "code-block"].map((blockType) => (
                        <StyleButton
                            key={blockType}
                            active={
                                editorState
                                    .getCurrentContent()
                                    .getBlockForKey(editorState.getSelection().getStartKey())
                                    .getType() === blockType.toLowerCase()
                            }
                            onClick={() => toggleBlockType(blockType)}
                        >
                            {blockType}
                        </StyleButton>
                    ))}
                </EditorControls>
                <EditorControls>
                    {["BOLD", "ITALIC", "UNDERLINE", "CODE"].map((inlineStyle) => (
                        <StyleButton
                            key={inlineStyle}
                            active={editorState.getCurrentInlineStyle().has(inlineStyle)}
                            onClick={() => toggleInlineStyle(inlineStyle)}
                        >
                            {inlineStyle}
                        </StyleButton>
                    ))}
                </EditorControls>
            </EditorControllers>
            <ContentEditor onClick={focus} >
                <Editor
                    ref={editorRef}
                    editorState={editorState}
                    onChange={handleChange}
                    placeholder="Start typing here..."
                    spellCheck={true}
                />
            </ContentEditor>
        </EditorWrapper>
    );
};

export default RichEditor;
