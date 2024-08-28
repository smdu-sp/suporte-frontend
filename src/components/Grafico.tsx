'use client'
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { useTheme } from '@mui/joy';

const chartSetting = {
    yAxis: [
        {
            label: '',
        },
    ],
    series: [{ dataKey: 'seoul' }],
    height: 450,
    sx: {
        [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
            transform: 'translateX(-10px)',
        }
    },
};

export default function TickPlacementBars() {

    const theme = useTheme()

    const dataset = [
        {
            seoul: 41,
            nome: 'José',
        },
        {
            seoul: 73,
            nome: 'Sidney',
        },
        {
            seoul: 99,
            nome: 'Diego',
        },
        {
            seoul: 144,
            nome: 'Gustavo',
        },
        {
            seoul: 219,
            nome: 'Bruno',
        },
        {
            seoul: 319,
            nome: 'Guilherme',
        },
        {
            seoul: 362,
            nome: 'Fernando',
        }
    ];

    return (
        <div style={{ width: '100%', position: 'relative' }}>
            <BarChart
                dataset={dataset.reverse()}
                borderRadius={7}
                xAxis={[
                    {
                        scaleType: 'band',
                        dataKey: 'nome',
                    },
                ]}
                {...chartSetting}
                colors={[theme.palette.text.primary]}
            />
        </div>
    );
}