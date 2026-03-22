
import React, { useState, useRef, useEffect } from 'react';
import type { PropsModalCortarImagem } from '@/tipos/CompleteProfile.types';

export const ModalCorteImagem: React.FC<PropsModalCortarImagem> = ({ aberto, imagemSrc, aoFechar, aoSalvar }) => {
    const [escala, setEscala] = useState(1);
    const [posicao, setPosicao] = useState({ x: 0, y: 0 });
    const [arrastando, setArrastando] = useState(false);
    const [inicioArrasto, setInicioArrasto] = useState({ x: 0, y: 0 });
    
    const containerRef = useRef<HTMLDivElement>(null);
    const imagemRef = useRef<HTMLImageElement>(null);

    // Resetar estado ao abrir nova imagem
    useEffect(() => {
        if (aberto) {
            setEscala(1);
            setPosicao({ x: 0, y: 0 });
        }
    }, [aberto, imagemSrc]);

    if (!aberto) return null;

    const aoPressionarMouse = (e: React.MouseEvent | React.TouchEvent) => {
        setArrastando(true);
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        setInicioArrasto({ x: clientX - posicao.x, y: clientY - posicao.y });
    };

    const aoMoverMouse = (e: React.MouseEvent | React.TouchEvent) => {
        if (!arrastando) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        setPosicao({
            x: clientX - inicioArrasto.x,
            y: clientY - inicioArrasto.y
        });
    };

    const aoSoltarMouse = () => setArrastando(false);

    const aoAplicar = () => {
        if (!imagemRef.current) return;

        const canvas = document.createElement('canvas');
        const size = 400; // Tamanho padrão para avatar
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            const img = imagemRef.current;
            const displayWidth = img.width * escala;
            const displayHeight = img.height * escala;
            
            const ratio = size / 280;
            
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, size, size);

            const offsetX = (posicao.x * ratio) + (size / 2) - (displayWidth * ratio / 2);
            const offsetY = (posicao.y * ratio) + (size / 2) - (displayHeight * ratio / 2);

            ctx.drawImage(
                img, 
                offsetX, 
                offsetY, 
                displayWidth * ratio, 
                displayHeight * ratio
            );

            aoSalvar(canvas.toDataURL('image/jpeg', 0.9));
            aoFechar();
        }
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col animate-fade-in touch-none">
            <style>{`
                .crop-mask {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    background: radial-gradient(circle 140px at center, transparent 100%, rgba(0,0,0,0.7) 100%);
                    border: 2px solid rgba(0, 194, 255, 0.3);
                    border-radius: 50%;
                    width: 280px;
                    height: 280px;
                    margin: auto;
                    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.8);
                }
                .image-container {
                    flex: 1;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #050505;
                }
                .draggable-img {
                    max-width: none;
                    cursor: move;
                    user-select: none;
                    touch-action: none;
                }
                .crop-footer {
                    background: #0c0f14;
                    padding: 30px 20px;
                    border-top: 1px solid rgba(255,255,255,0.1);
                }
                .zoom-slider {
                    width: 100%;
                    height: 6px;
                    -webkit-appearance: none;
                    background: #1e2531;
                    border-radius: 3px;
                    outline: none;
                    margin-bottom: 25px;
                }
                .zoom-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 24px;
                    height: 24px;
                    background: #00c2ff;
                    border-radius: 50%;
                    cursor: pointer;
                }
            `}</style>

            <header className="flex justify-between items-center p-5 bg-[#0c0f14] border-b border-white/10">
                <button onClick={aoFechar} className="text-white text-sm font-bold uppercase tracking-widest opacity-70">Cancelar</button>
                <h2 className="text-white font-bold">Ajustar Foto</h2>
                <button onClick={aoAplicar} className="text-[#00c2ff] text-sm font-bold uppercase tracking-widest">Concluir</button>
            </header>

            <div 
                className="image-container"
                ref={containerRef}
                onMouseDown={aoPressionarMouse}
                onMouseMove={aoMoverMouse}
                onMouseUp={aoSoltarMouse}
                onMouseLeave={aoSoltarMouse}
                onTouchStart={aoPressionarMouse}
                onTouchMove={aoMoverMouse}
                onTouchEnd={aoSoltarMouse}
            >
                <img 
                    ref={imagemRef}
                    src={imagemSrc!} 
                    className="draggable-img"
                    draggable={false}
                    style={{
                        transform: `translate(${posicao.x}px, ${posicao.y}px) scale(${escala})`,
                        transition: arrastando ? 'none' : 'transform 0.1s ease-out'
                    }}
                    alt="Para cortar"
                />
                <div className="crop-mask"></div>
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 text-[10px] uppercase font-bold tracking-widest pointer-events-none">
                    Arraste para enquadrar
                </div>
            </div>

            <div className="crop-footer">
                <div className="flex items-center gap-4 mb-4">
                    <i className="fa-solid fa-minus text-gray-500 text-xs"></i>
                    <input 
                        type="range" 
                        min="1" 
                        max="3" 
                        step="0.01" 
                        value={escala} 
                        onChange={(e) => setEscala(parseFloat(e.target.value))} 
                        className="zoom-slider"
                    />
                    <i className="fa-solid fa-plus text-gray-500 text-xs"></i>
                </div>
                <div className="flex justify-center gap-8">
                    <button onClick={() => setPosicao({x: 0, y: 0})} className="text-gray-400 text-xs flex flex-col items-center gap-1">
                        <i className="fa-solid fa-arrows-to-dot"></i> Centralizar
                    </button>
                    <button onClick={() => setEscala(1)} className="text-gray-400 text-xs flex flex-col items-center gap-1">
                        <i className="fa-solid fa-maximize"></i> Resetar Zoom
                    </button>
                </div>
            </div>
        </div>
    );
};
