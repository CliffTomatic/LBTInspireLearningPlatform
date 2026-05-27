/**
 * Props for the DetailRow component.
 */
type DetailRowProps = {
    // Label shown on the left side of the row.
    label: string;

    // Value shown on the right side of the row.
    value: string;
};

/**
 * Displays one label/value row inside a details panel.
 */
export default function DetailRow({ label, value }: DetailRowProps) {
    return (
        <div className="admin-details__row">
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    );
}
