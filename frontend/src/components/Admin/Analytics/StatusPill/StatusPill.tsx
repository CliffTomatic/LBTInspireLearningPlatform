/**
 * Props for the StatusPill component.
 */
type StatusPillProps = {
    /**
     * Current status label.
     * Examples: Active, Inactive, Stale, Ended.
     */
    status: string;
};

/**
 * Displays a small colored status pill for user/session state.
 */
export default function StatusPill({ status }: StatusPillProps) {
    const normalizedStatus = status.trim().toLowerCase() || 'inactive';

    return (
        <span className={`admin-status admin-status--${normalizedStatus}`}>
            {status || 'Inactive'}
        </span>
    );
}
