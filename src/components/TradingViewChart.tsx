/* // src/components/TradingViewChart.tsx
import React, { useRef, useEffect } from 'react';
import { createChart } from 'lightweight-charts';

// Datos de ejemplo
const sampleData = [
    {
        close: 108.997,
        high: 121.209,
        low: 96.653,
        open: 104.561,
        time: { year: 2018, month: 9, day: 22 },
    },
    {
        close: 115.345,
        high: 125.409,
        low: 105.153,
        open: 108.997,
        time: { year: 2018, month: 9, day: 23 },
    },
    {
        close: 120.456,
        high: 130.567,
        low: 110.234,
        open: 115.345,
        time: { year: 2018, month: 9, day: 24 },
    },
    {
        close: 112.987,
        high: 122.999,
        low: 109.567,
        open: 120.456,
        time: { year: 2018, month: 9, day: 25 },
    },
    {
        close: 125.765,
        high: 135.876,
        low: 120.123,
        open: 112.987,
        time: { year: 2018, month: 9, day: 26 },
    },
];

const TradingViewChart = () => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<any>(null);

    useEffect(() => {
        if (chartContainerRef.current) {
            const chartOptions = {
                width: 600,
                height: 300,
                layout: {
                    backgroundColor: '#ffffff',
                    textColor: '#333',
                },
                rightPriceScale: {
                    visible: true,
                },
                timeScale: {
                    visible: true,
                },
            };

            const chart = createChart(chartContainerRef.current, chartOptions);
            chartRef.current = chart;

            const candlestickSeries = chart.addCandlestickSeries({
                upColor: '#26a69a',
                downColor: '#ef5350',
                borderVisible: false,
                wickUpColor: '#26a69a',
                wickDownColor: '#ef5350',
            });

            candlestickSeries.setData(sampleData);
            chart.timeScale().fitContent();
        }

        return () => {
            if (chartRef.current) {
                chartRef.current.remove();
            }
        };
    }, []);

    return <div ref={chartContainerRef} className="tradingview-chart-container" />;
};

export default TradingViewChart; */