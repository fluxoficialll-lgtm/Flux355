
import React from 'react';
import { useModal } from '../../../../Componentes/ComponenteDeInterfaceDeUsuario/Sistema.Modal';

interface ModalFiltroDimensaoProps {
    onDimensionChange: (dimension: string) => void;
    currentDimension: string;
    onChartTypeChange: (chartType: string) => void;
    chartType: string;
    onPeriodChange: (period: string) => void;
    currentPeriod: string;
}

const dimensionLabels: { [key: string]: string } = {
    pais: 'País',
    provedor: 'Provedor',
    moeda: 'Moeda',
    metodo: 'Método de Pagamento',
};

const chartLabels: { [key: string]: string } = {
    bar: 'Gráfico de Barras',
    pie: 'Gráfico de Pizza',
    radar: 'Gráfico de Radar',
};

const periodLabels: { [key: string]: string } = {
    '1d': 'Hoje',
    '2d': 'Ontem',
    '30d': 'Últimos 30 dias',
    '60d': 'Últimos 60 dias',
    '90d': 'Últimos 90 dias',
    '180d': 'Últimos 180 dias',
};

export const ModalFiltroDimensao: React.FC<ModalFiltroDimensaoProps> = ({ 
    onDimensionChange, currentDimension, 
    onChartTypeChange, chartType, 
    onPeriodChange, currentPeriod 
}) => {
    const { showOptions } = useModal();

    const handleDimensionModal = async () => {
        const options = [
            { label: 'País', value: 'pais', icon: 'fa-solid fa-globe' },
            { label: 'Provedor', value: 'provedor', icon: 'fa-solid fa-server' },
            { label: 'Moeda', value: 'moeda', icon: 'fa-solid fa-coins' },
            { label: 'Método de Pagamento', value: 'metodo', icon: 'fa-solid fa-credit-card' },
        ];
        const selectedValue = await showOptions('Filtrar por Dimensão', options);
        if (selectedValue) onDimensionChange(selectedValue);
    };

    const handleChartTypeModal = async () => {
        const options = [
            { label: 'Gráfico de Barras', value: 'bar', icon: 'fa-solid fa-chart-bar' },
            { label: 'Gráfico de Pizza', value: 'pie', icon: 'fa-solid fa-chart-pie' },
            { label: 'Gráfico de Radar', value: 'radar', icon: 'fa-solid fa-chart-radar' },
        ];
        const selectedValue = await showOptions('Selecionar Tipo de Gráfico', options);
        if (selectedValue) onChartTypeChange(selectedValue);
    };

    const handlePeriodModal = async () => {
        const options = [
            { label: 'Hoje', value: '1d', icon: 'fa-solid fa-calendar-day' },
            { label: 'Ontem', value: '2d', icon: 'fa-solid fa-calendar-day' },
            { label: 'Últimos 30 dias', value: '30d', icon: 'fa-solid fa-calendar-alt' },
            { label: 'Últimos 60 dias', value: '60d', icon: 'fa-solid fa-calendar-alt' },
            { label: 'Últimos 90 dias', value: '90d', icon: 'fa-solid fa-calendar-alt' },
            { label: 'Últimos 180 dias', value: '180d', icon: 'fa-solid fa-calendar-alt' },
        ];
        const selectedValue = await showOptions('Selecionar Período', options);
        if (selectedValue) onPeriodChange(selectedValue);
    };

    return (
        <div className="col-span-1 md:col-span-3 bg-[#1a1e26] p-4 rounded-xl shadow-lg border border-white/10 flex flex-col sm:flex-row flex-wrap gap-4">
            {/* Period Filter */}
            <div className='flex-1 min-w-[150px]'>
                <div className="text-sm text-gray-400 mb-2 font-medium">Período</div>
                <button onClick={handlePeriodModal} className="w-full bg-[#0c0f14] text-white p-3 rounded-lg flex justify-between items-center hover:bg-white/5 transition-colors">
                    <span>{periodLabels[currentPeriod] || 'Selecionar'}</span>
                    <i className="fa-solid fa-chevron-down text-gray-500"></i>
                </button>
            </div>

            {/* Dimension Filter */}
            <div className='flex-1 min-w-[150px]'>
                <div className="text-sm text-gray-400 mb-2 font-medium">Dimensão</div>
                <button onClick={handleDimensionModal} className="w-full bg-[#0c0f14] text-white p-3 rounded-lg flex justify-between items-center hover:bg-white/5 transition-colors">
                    <span>{dimensionLabels[currentDimension] || 'Selecionar'}</span>
                    <i className="fa-solid fa-chevron-down text-gray-500"></i>
                </button>
            </div>

            {/* Chart Type Filter */}
            <div className='flex-1 min-w-[150px]'>
                <div className="text-sm text-gray-400 mb-2 font-medium">Tipo de Gráfico</div>
                <button onClick={handleChartTypeModal} className="w-full bg-[#0c0f14] text-white p-3 rounded-lg flex justify-between items-center hover:bg-white/5 transition-colors">
                    <span>{chartLabels[chartType] || 'Selecionar'}</span>
                    <i className="fa-solid fa-chevron-down text-gray-500"></i>
                </button>
            </div>
        </div>
    );
};
