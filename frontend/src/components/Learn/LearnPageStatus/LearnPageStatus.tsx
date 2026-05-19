import './LearnPageStatus.css';

type LearnPageStatusProps = {
    title?: string;
    message?: string;
};
/**
 *
 * @param title default value: Something went wrong.
 * @param message detailed error message
 * @returns Custom Component
 */
export default function LearnPageStatus({
    title = 'Something went wrong',
    message,
}: LearnPageStatusProps) {
    return (
        <section className="learn-page-status">
            <div className="learn-page-status__card">
                <div className="learn-page-status__brand">
                    <span className="learn-page-status__brand-main">Pulse</span>
                    <span className="learn-page-status__brand-sub">
                        by LearnBasicTech
                    </span>
                </div>

                <div className="learn-page-status__divider" />

                <h1 className="learn-page-status__title">{title}</h1>

                {message && (
                    <p className="learn-page-status__message">{message}</p>
                )}
            </div>
        </section>
    );
}
