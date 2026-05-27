import { useMemo, useState } from 'react';

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import './AdminLineGraph.css';

/**
 * Mock data, will be deleted once hooked up to API.
 */
const websiteViewGraphData = [
    { date: '2026-05-01', views: 124 },
    { date: '2026-05-02', views: 181 },
    { date: '2026-05-03', views: 142 },
    { date: '2026-05-04', views: 203 },
    { date: '2026-05-05', views: 265 },
    { date: '2026-05-06', views: 241 },
    { date: '2026-05-07', views: 318 },
    { date: '2026-05-08', views: 290 },
    { date: '2026-05-09', views: 354 },
    { date: '2026-05-10', views: 410 },
    { date: '2026-05-11', views: 386 },
    { date: '2026-05-12', views: 437 },
    { date: '2026-05-13', views: 492 },
    { date: '2026-05-14', views: 455 },
    { date: '2026-05-15', views: 521 },
    { date: '2026-05-16', views: 578 },
    { date: '2026-05-17', views: 544 },
    { date: '2026-05-18', views: 601 },
    { date: '2026-05-19', views: 638 },
    { date: '2026-05-20', views: 590 },
    { date: '2026-05-21', views: 671 },
    { date: '2026-05-22', views: 720 },
    { date: '2026-05-23', views: 694 },
    { date: '2026-05-24', views: 748 },
    { date: '2026-05-25', views: 801 },
    { date: '2026-05-26', views: 834 },
];

/**
 * Formats a date string into a short readable label.
 *
 * @param dateValue - Date string in YYYY-MM-DD format.
 * @returns Short formatted date label.
 */
function formatDateLabel(dateValue: string) {
    const date = new Date(`${dateValue}T00:00:00`);

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Displays a reusable admin line graph for website views.
 *
 * @returns The admin line graph component.
 */
export default function AdminLineGraph() {
    const earliestDate = websiteViewGraphData[0].date;
    const latestDate =
        websiteViewGraphData[websiteViewGraphData.length - 1].date;

    const [startDate, setStartDate] = useState(earliestDate);
    const [endDate, setEndDate] = useState(latestDate);

    const filteredGraphData = useMemo(() => {
        return websiteViewGraphData.filter((point) => {
            return point.date >= startDate && point.date <= endDate;
        });
    }, [startDate, endDate]);

    const totalViews = useMemo(() => {
        return filteredGraphData.reduce((total, point) => {
            return total + point.views;
        }, 0);
    }, [filteredGraphData]);

    const averageViews = useMemo(() => {
        if (filteredGraphData.length === 0) {
            return 0;
        }

        return Math.round(totalViews / filteredGraphData.length);
    }, [filteredGraphData.length, totalViews]);

    return (
        <section className="admin-line-graph">
            <div className="admin-line-graph__header">
                <div>
                    <p className="admin-line-graph__eyebrow">
                        Website Analytics
                    </p>

                    <h2 className="admin-line-graph__title">Website Views</h2>

                    <p className="admin-line-graph__subtitle">
                        Daily website traffic filtered by date range.
                    </p>
                </div>

                <div className="admin-line-graph__stats">
                    <div className="admin-line-graph__stat-card">
                        <span className="admin-line-graph__stat-label">
                            Total Views
                        </span>
                        <strong className="admin-line-graph__stat-value">
                            {totalViews.toLocaleString()}
                        </strong>
                    </div>

                    <div className="admin-line-graph__stat-card">
                        <span className="admin-line-graph__stat-label">
                            Daily Average
                        </span>
                        <strong className="admin-line-graph__stat-value">
                            {averageViews.toLocaleString()}
                        </strong>
                    </div>
                </div>
            </div>

            <div className="admin-line-graph__filters">
                <label className="admin-line-graph__field">
                    <span className="admin-line-graph__field-label">
                        Start Date
                    </span>

                    <input
                        className="admin-line-graph__date-input"
                        type="date"
                        min={earliestDate}
                        max={endDate}
                        value={startDate}
                        onChange={(event) => {
                            setStartDate(event.target.value);
                        }}
                    />
                </label>

                <label className="admin-line-graph__field">
                    <span className="admin-line-graph__field-label">
                        End Date
                    </span>

                    <input
                        className="admin-line-graph__date-input"
                        type="date"
                        min={startDate}
                        max={latestDate}
                        value={endDate}
                        onChange={(event) => {
                            setEndDate(event.target.value);
                        }}
                    />
                </label>
            </div>

            <div className="admin-line-graph__body">
                {filteredGraphData.length === 0 ? (
                    <div className="admin-line-graph__empty">
                        No website view data found for this date range.
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={320}>
                        <LineChart
                            data={filteredGraphData}
                            margin={{
                                top: 20,
                                right: 24,
                                bottom: 8,
                                left: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="4 4" />

                            <XAxis
                                dataKey="date"
                                tickFormatter={formatDateLabel}
                                tickMargin={10}
                            />

                            <YAxis allowDecimals={false} tickMargin={10} />

                            <Tooltip
                                labelFormatter={(label) =>
                                    formatDateLabel(String(label))
                                }
                                formatter={(value) => [
                                    Number(value).toLocaleString(),
                                    'Views',
                                ]}
                            />

                            <Line
                                type="monotone"
                                dataKey="views"
                                strokeWidth={3}
                                dot={{
                                    r: 4,
                                }}
                                activeDot={{
                                    r: 7,
                                }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </section>
    );
}
