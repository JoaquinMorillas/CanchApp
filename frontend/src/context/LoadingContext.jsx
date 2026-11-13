import {  createContext, useEffect, useState } from "react";

export const LoadingContext = createContext()

export const LoadingProvider = ({children}) =>{

    const [loading, setLoading] = useState(false)

    const TRAIL = 6;

    const startLoading = () => {
        setLoading(true)
    }

    const stopLoading = () => {
        setLoading(false)
    }

    const BallPair = ({ index }) => (
        <div
            aria-hidden="true"
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
            opacity: 1 - index * (0.85 / TRAIL),
            animation: "loading-orbit 2.4s infinite",
            animationDelay: `${index * 0.035}s`,
            filter: index > 0 ? `blur(${index * 0.35}px)` : "none",
            }}
        >
            <span className="loading-ball" style={{ left: 0 }}>⚽</span>
            <span className="loading-ball" style={{ right: 0 }}>⚽</span>
        </div>
        );

    useEffect(() => {
        document.body.style.cursor = loading ? "wait" : "default"
        document.body.style.overflow = loading ? "hidden" : ""
        return () =>{
            document.body.style.cursor = "default"
            document.body.style.overflow = ""
        } 
    },[loading])

    return (
        <LoadingContext.Provider value={{loading, startLoading, stopLoading}}>
            {children}
            {loading && (
                <div
                role="status"
                aria-live="polite"
                aria-label="Cargando"
                className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.45)", zIndex: 9999 }}
                >
                <style>{`
                    /* Giro irregular: tramos rápidos, lentos y casi pausas */
                    @keyframes loading-orbit {
                    0%   { transform: rotate(0deg);   animation-timing-function: cubic-bezier(.2,.8,.3,1); }
                    28%  { transform: rotate(230deg); animation-timing-function: ease-in-out; }
                    40%  { transform: rotate(250deg); animation-timing-function: cubic-bezier(.6,0,.4,1); }
                    70%  { transform: rotate(560deg); animation-timing-function: ease-out; }
                    82%  { transform: rotate(590deg); animation-timing-function: cubic-bezier(.5,0,.2,1); }
                    100% { transform: rotate(720deg); }
                    }
                    .loading-ball {
                    position: absolute;
                    top: calc(50% - 14px);
                    font-size: 28px;
                    line-height: 1;
                    }
                `}</style>

                {/* Eje común: contenedor de 90px, las pelotas quedan en extremos opuestos */}
                <div className="position-relative" style={{ width: 90, height: 90 }}>
                    {/* Se dibujan de la más tenue a la más nítida para que la principal quede arriba */}
                    {Array.from({ length: TRAIL }, (_, i) => TRAIL - 1 - i).map((i) => (
                    <BallPair key={i} index={i} />
                    ))}
                </div>
                </div>
            )}
        </LoadingContext.Provider>
    )
}