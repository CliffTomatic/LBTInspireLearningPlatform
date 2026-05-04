import type { EbookBlock } from '../../../types/Course';

import './EbookViewer.css';

type EbookViewerProps = {
    content: EbookBlock[];
};

function EbookViewer({ content }: EbookViewerProps) {
    return (
        <article className="ebook-viewer">
            {content.map((block, index) => {
                if (block.type === 'heading') {
                    return (
                        <h2 className="ebook-viewer__heading" key={index}>
                            {block.text}
                        </h2>
                    );
                }

                if (block.type === 'paragraph') {
                    return (
                        <p className="ebook-viewer__paragraph" key={index}>
                            {block.text}
                        </p>
                    );
                }

                if (block.type === 'list') {
                    return (
                        <ul className="ebook-viewer__list" key={index}>
                            {block.items.map((item, itemIndex) => (
                                <li key={itemIndex}>{item}</li>
                            ))}
                        </ul>
                    );
                }

                if (block.type === 'callout') {
                    return (
                        <aside className="ebook-viewer__callout" key={index}>
                            {block.text}
                        </aside>
                    );
                }

                return null;
            })}
        </article>
    );
}

export default EbookViewer;
