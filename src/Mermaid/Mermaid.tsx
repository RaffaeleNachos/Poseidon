import * as React from 'react';
import * as mermaid from 'mermaid';

// We need to disable mermaids start on load, because it is otherwise going to override the html
// generated by react.
mermaid.mermaidAPI.initialize({
    startOnLoad: false
});

export interface MermaidState {
    diagram?: string;
}

export interface MermaidProps {
    name?: string | null;
    onSetRef?: (ref: HTMLDivElement | null) => void;
    style?: React.CSSProperties;
    children: string;
}

export class Mermaid extends React.Component<MermaidProps, MermaidState> {
    static _validId = 0;
    state: MermaidState = {};

    componentWillReceiveProps(next: MermaidProps) {
        this.renderDiagram(next.children);
    }

    componentDidMount() {
        this.renderDiagram(this.props.children);
    }

    renderDiagram(content: string) {
        try {
            mermaid.mermaidAPI.parse(content);
        } catch (e) {
            this.setState({ diagram: e.str });
        }

        mermaid.mermaidAPI.render(
            'mmm_react_' + Mermaid._validId++,
            content,
            (html: string) => this.setState({ diagram: html })
        );
    }

    render() {
        const { onSetRef, style } = this.props;
        return this.state.diagram
            ? <div
                className='mermaid'
                style={{ overflow: 'scroll', ...style }}
                dangerouslySetInnerHTML={{ __html: this.state.diagram }}
                ref={r => onSetRef && onSetRef(r)}
              />
            : null;
    }
}