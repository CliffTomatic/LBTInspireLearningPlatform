type SummaryCardProps = {
    label: string;
    value: string;
};

export default function SummaryCard({ label, value }: SummaryCardProps) {
    return (
        <article className="admin-summary-card">
            <p className="admin-summary-card__label">{label}</p>
            <strong className="admin-summary-card__value">{value}</strong>
        </article>
    );
}
