import './LearnSectionControls.css';

type LearnSectionControlsProps = {
    isCompleted: boolean;
    hasPreviousSection: boolean;
    hasNextSection: boolean;
    onPreviousSection: () => void;
    onNextSection: () => void;
    onCompleteSection: () => void;
};

export default function LearnSectionControls({
    isCompleted,
    hasPreviousSection,
    hasNextSection,
    onPreviousSection,
    onNextSection,
    onCompleteSection,
}: LearnSectionControlsProps) {
    return (
        <section className="learn-section-controls">
            <div className="learn-section-controls__navigation">
                <button
                    className="learn-section-controls__button learn-section-controls__button--secondary"
                    type="button"
                    onClick={onPreviousSection}
                    disabled={!hasPreviousSection}
                >
                    ← Previous section
                </button>

                <button
                    className="learn-section-controls__button learn-section-controls__button--secondary"
                    type="button"
                    onClick={onNextSection}
                    disabled={!hasNextSection}
                >
                    Next section →
                </button>
            </div>

            <button
                className={`learn-section-controls__button learn-section-controls__button--complete ${
                    isCompleted
                        ? 'learn-section-controls__button--completed'
                        : ''
                }`}
                type="button"
                onClick={onCompleteSection}
                disabled={isCompleted}
            >
                {isCompleted ? '✓ Section completed' : 'Complete section'}
            </button>
        </section>
    );
}
