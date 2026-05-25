import { clampNumber } from '../../../../utils/admin/analytics/adminAnalyticsFormatters';

/**
 * Props for the ProgressBar component.
 */
type ProgressBarProps = {
    /**
     * Progress percentage value.
     * Expected range is 0–100, but the component safely clamps bad values.
     */
    value: number;
};

/**
 * Displays a horizontal progress bar with a percentage label.
 */
export default function ProgressBar({ value }: ProgressBarProps) {
    const safeValue = clampNumber(value, 0, 100);

    return (
        <div className="admin-progress">
            <div
                className="admin-progress__fill"
                style={{ width: `${safeValue}%` }}
            />
            <span>{safeValue}%</span>
        </div>
    );
}
