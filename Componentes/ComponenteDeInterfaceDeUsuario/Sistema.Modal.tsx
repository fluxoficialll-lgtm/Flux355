
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

type TipoModal = 'alert' | 'confirm' | 'prompt' | 'options';

interface OpcaoModal {
    rotulo: string;
    valor: any;
    icone?: string;
    eDestrutivo?: boolean;
}

interface PropsModal {
    tipo: TipoModal;
    titulo: string;
    mensagem?: string;
    opcoes?: OpcaoModal[];
    placeholder?: string;
    textoConfirmacao?: string;
    textoCancelamento?: string;
    aoConfirmar: (valor?: any) => void;
    aoCancelar: () => void;
}

interface TipoContextoModal {
    mostrarAlerta: (titulo: string, mensagem?: string) => Promise<void>;
    mostrarConfirmacao: (titulo: string, mensagem?: string, textoConfirmacao?: string, textoCancelamento?: string) => Promise<boolean>;
    mostrarPrompt: (titulo: string, mensagem?: string, placeholder?: string) => Promise<string | null>;
    mostrarOpcoes: (titulo: string, opcoes: OpcaoModal[]) => Promise<any | null>;
}

const ContextoModal = createContext<TipoContextoModal | undefined>(undefined);

export const useModal = () => {
    const context = useContext(ContextoModal);
    if (!context) {
        throw new Error('useModal deve ser usado dentro de um ProvedorModal');
    }
    return context;
};

export const ProvedorModal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [modal, setModal] = useState<PropsModal | null>(null);
    const [valorInput, setValorInput] = useState('');
    const resolveRef = useRef<(valor: any) => void>(() => {});

    const fechar = () => {
        setModal(null);
        setValorInput('');
    };

    const mostrarAlerta = useCallback((titulo: string, mensagem?: string): Promise<void> => {
        return new Promise((resolve) => {
            resolveRef.current = resolve;
            setModal({
                tipo: 'alert',
                titulo,
                mensagem,
                textoConfirmacao: 'OK',
                aoConfirmar: () => {
                    fechar();
                    resolve();
                },
                aoCancelar: () => {
                    fechar();
                    resolve();
                }
            });
        });
    }, []);

    const mostrarConfirmacao = useCallback((titulo: string, mensagem?: string, textoConfirmacao = 'Confirmar', textoCancelamento = 'Cancelar'): Promise<boolean> => {
        return new Promise((resolve) => {
            resolveRef.current = resolve;
            setModal({
                tipo: 'confirm',
                titulo,
                mensagem,
                textoConfirmacao,
                textoCancelamento,
                aoConfirmar: () => {
                    fechar();
                    resolve(true);
                },
                aoCancelar: () => {
                    fechar();
                    resolve(false);
                }
            });
        });
    }, []);

    const mostrarPrompt = useCallback((titulo: string, mensagem?: string, placeholder = ''): Promise<string | null> => {
        return new Promise((resolve) => {
            resolveRef.current = resolve;
            setValorInput('');
            setModal({
                tipo: 'prompt',
                titulo,
                mensagem,
                placeholder,
                textoConfirmacao: 'Enviar',
                textoCancelamento: 'Cancelar',
                aoConfirmar: (val) => {
                    fechar();
                    resolve(val);
                },
                aoCancelar: () => {
                    fechar();
                    resolve(null);
                }
            });
        });
    }, []);

    const mostrarOpcoes = useCallback((titulo: string, opcoes: OpcaoModal[]): Promise<any | null> => {
        return new Promise((resolve) => {
            resolveRef.current = resolve;
            setModal({
                tipo: 'options',
                titulo,
                opcoes,
                textoCancelamento: 'Cancelar',
                aoConfirmar: (val) => {
                    fechar();
                    resolve(val);
                },
                aoCancelar: () => {
                    fechar();
                    resolve(null);
                }
            });
        });
    }, []);

    return (
        <ContextoModal.Provider value={{ mostrarAlerta, mostrarConfirmacao, mostrarPrompt, mostrarOpcoes }}>
            {children}
            {modal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-['Inter']">
                    <div className="w-full max-w-sm bg-[#1a1e26] border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)] overflow-hidden animate-pop-in transform transition-all">
                        
                        <div className="p-6 text-center">
                            {modal.tipo === 'alert' && <div className="mb-4 mx-auto w-12 h-12 rounded-full bg-[#00c2ff]/10 flex items-center justify-center text-[#00c2ff] text-2xl"><i className="fa-solid fa-circle-info"></i></div>}
                            {modal.tipo === 'confirm' && <div className="mb-4 mx-auto w-12 h-12 rounded-full bg-[#ffaa00]/10 flex items-center justify-center text-[#ffaa00] text-2xl"><i className="fa-solid fa-triangle-exclamation"></i></div>}
                            {modal.tipo === 'prompt' && <div className="mb-4 mx-auto w-12 h-12 rounded-full bg-[#00c2ff]/10 flex items-center justify-center text-[#00c2ff] text-2xl"><i className="fa-solid fa-pen"></i></div>}
                            
                            <h3 className="text-xl font-bold text-white mb-2">{modal.titulo}</h3>
                            {modal.mensagem && <p className="text-gray-400 text-sm leading-relaxed">{modal.mensagem}</p>}
                        
                            {modal.tipo === 'prompt' && (
                                <input 
                                    type="text" 
                                    autoFocus
                                    className="mt-4 w-full bg-[#0c0f14] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#00c2ff] transition-colors"
                                    placeholder={modal.placeholder}
                                    value={valorInput}
                                    onChange={(e) => setValorInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && modal.aoConfirmar(valorInput)}
                                />
                            )}

                            {modal.tipo === 'options' && modal.opcoes && (
                                <div className="mt-4 flex flex-col gap-2">
                                    {modal.opcoes.map((opt, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => modal.aoConfirmar(opt.valor)}
                                            className={`w-full p-3 rounded-xl flex items-center gap-3 transition-colors ${opt.eDestrutivo ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-white/5 text-white hover:bg-white/10'}`}
                                        >
                                            {opt.icone && <i className={`${opt.icone} w-5 text-center`}></i>}
                                            <span className="font-medium">{opt.rotulo}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {modal.tipo !== 'options' && (
                            <div className="flex border-t border-white/10">
                                {modal.tipo !== 'alert' && (
                                    <button 
                                        onClick={modal.aoCancelar}
                                        className="flex-1 p-4 text-gray-400 font-medium hover:bg-white/5 transition-colors text-sm"
                                    >
                                        {modal.textoCancelamento || 'Cancelar'}
                                    </button>
                                )}
                                <div className="w-[1px] bg-white/10"></div>
                                <button 
                                    onClick={() => modal.tipo === 'prompt' ? modal.aoConfirmar(valorInput) : modal.aoConfirmar()}
                                    className="flex-1 p-4 text-[#00c2ff] font-bold hover:bg-[#00c2ff]/10 transition-colors text-sm"
                                >
                                    {modal.textoConfirmacao || 'OK'}
                                </button>
                            </div>
                        )}
                        {modal.tipo === 'options' && (
                            <div className="p-2">
                                <button 
                                    onClick={modal.aoCancelar}
                                    className="w-full p-3 rounded-xl text-gray-500 hover:text-white font-medium transition-colors"
                                >
                                    {modal.textoCancelamento || 'Cancelar'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </ContextoModal.Provider>
    );
};
