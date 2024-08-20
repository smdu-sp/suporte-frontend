'use client'
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { Option, Select, useTheme } from '@mui/joy';
import { useEffect, useState } from 'react';

const chartSetting = {
    yAxis: [],
    series: [{ dataKey: 'seoul' }],
    height: 450,
    sx: {
        [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
            transform: 'translateX(-10px)',
        }
    },
};

export default function TickPlacementBars() {
    const { palette } = useTheme();
    const [tipo, setTipo] = useState(0);

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
            nome: 'Guilherme Filho',
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
                colors={[palette.text.primary]}
            />
        </div>
    );
}