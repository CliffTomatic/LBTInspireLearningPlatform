import './Playground.css';

import AdminLineGraph from '../Graphs/AdminLineGraph/AdminLineGraph';
/**
 * Defines how a summary value should be displayed.
 */
type SummaryValueType = 'number' | 'percent' | 'seconds' | 'minutes' | 'hours';

/**
 * Defines one summary card shown in the grid.
 */
type SummaryGridItem = {
    id: string;
    title: string;
    value: number;
    type: SummaryValueType;
};

/**
 * Defines one bar chart row.
 */
type OverviewChartItem = {
    id: string;
    label: string;
    value: number;
    type: SummaryValueType;
};

/**
 * List of summary items displayed in the overview playground.
 */
const OVERVIEW_SUMMARY_ITEMS: SummaryGridItem[] = [
    {
        id: 'total-users',
        title: 'Total Users',
        value: 3,
        type: 'number',
    },
    {
        id: 'total-courses',
        title: 'Total Courses',
        value: 1,
        type: 'number',
    },
    {
        id: 'average-course-progress',
        title: 'Avg. Course Progress',
        value: 11,
        type: 'percent',
    },
    {
        id: 'active-watch-time',
        title: 'Active Watch Time',
        value: 287,
        type: 'seconds',
    },
];

/**
 * Temporary chart data for the playground.
 * Later this should come from the backend/admin dashboard API.
 */
const COURSE_ENGAGEMENT_ITEMS: OverviewChartItem[] = [
    {
        id: 'wifi-basics',
        label: 'WiFi Basics',
        value: 287,
        type: 'seconds',
    },
    {
        id: 'youtube-basics',
        label: 'YouTube Basics',
        value: 145,
        type: 'seconds',
    },
    {
        id: 'data-privacy',
        label: 'Data Privacy',
        value: 78,
        type: 'seconds',
    },
];

export default function Playground() {
    return (
        <section className="playground-summary">
            <header className="playground-summary__header">
                <p className="playground-summary__eyebrow">Admin Playground</p>
                <h1 className="playground-summary__title">Overview Summary</h1>
                <p className="playground-summary__subtitle">
                    Test reusable admin dashboard cards and graphs before moving
                    them into the real dashboard.
                </p>
            </header>

            <SummaryGrid items={OVERVIEW_SUMMARY_ITEMS} />

            <OverviewBarChart
                title="Course Engagement"
                subtitle="Total active watch time by course."
                items={COURSE_ENGAGEMENT_ITEMS}
            />

            <AdminLineGraph />
        </section>
    );
}

/**
 * Props for the SummaryGrid component.
 */
type SummaryGridProps = {
    items: SummaryGridItem[];
};

/**
 * Displays a reusable grid of summary cards.
 */
function SummaryGrid({ items }: SummaryGridProps) {
    return (
        <div className="summary-grid">
            {items.map((item) => (
                <SummaryGridCard key={item.id} item={item} />
            ))}
        </div>
    );
}

/**
 * Props for the SummaryGridCard component.
 */
type SummaryGridCardProps = {
    item: SummaryGridItem;
};

/**
 * Displays one summary metric card.
 */
function SummaryGridCard({ item }: SummaryGridCardProps) {
    const { title, value, type } = item;

    return (
        <article className="summary-grid__card">
            <p className="summary-grid__card-title">{title}</p>
            <p className="summary-grid__card-value">
                {formatSummaryValue(value, type)}
            </p>
        </article>
    );
}

/**
 * Props for the OverviewBarChart component.
 */
type OverviewBarChartProps = {
    title: string;
    subtitle: string;
    items: OverviewChartItem[];
};

/**
 * Displays a simple horizontal bar chart for overview analytics.
 */
function OverviewBarChart({ title, subtitle, items }: OverviewBarChartProps) {
    const maxValue = Math.max(...items.map((item) => item.value), 1);

    return (
        <section className="overview-chart">
            <header className="overview-chart__header">
                <div>
                    <h2 className="overview-chart__title">{title}</h2>
                    <p className="overview-chart__subtitle">{subtitle}</p>
                </div>
            </header>

            <div className="overview-chart__body">
                {items.map((item) => {
                    const widthPercent = Math.max(
                        (item.value / maxValue) * 100,
                        4,
                    );

                    return (
                        <div className="overview-chart__row" key={item.id}>
                            <div className="overview-chart__row-header">
                                <span className="overview-chart__label">
                                    {item.label}
                                </span>
                                <span className="overview-chart__value">
                                    {formatSummaryValue(item.value, item.type)}
                                </span>
                            </div>

                            <div className="overview-chart__track">
                                <div
                                    className="overview-chart__bar"
                                    style={{ width: `${widthPercent}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

// * Helper Functions
/**
 * Formats a summary value based on its display type.
 */
function formatSummaryValue(value: number, type: SummaryValueType) {
    const safeValue = Math.max(Number(value) || 0, 0);

    if (type === 'percent') {
        return `${Math.round(safeValue)}%`;
    }

    if (type === 'seconds') {
        return formatSeconds(safeValue);
    }

    if (type === 'minutes') {
        return `${Math.round(safeValue)}m`;
    }

    if (type === 'hours') {
        return `${Math.round(safeValue)}h`;
    }

    return Math.round(safeValue).toLocaleString();
}

/**
 * Converts seconds into a readable hour/minute format.
 */
function formatSeconds(totalSeconds: number) {
    const safeSeconds = Math.max(Number(totalSeconds) || 0, 0);

    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const seconds = Math.floor(safeSeconds % 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }

    if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    }

    return `${seconds}s`;
}
