import {useRef, useEffect, useState}from 'react'
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  TelegramShareButton,
  ThreadsShareButton,
  FacebookIcon,
  WhatsappIcon,
  XIcon,
  TelegramIcon,
  ThreadsIcon
} from 'react-share'

export const ShareComponent = ({stablishment, onClose}) => {

    const ref = useRef(null)

    const shareUrl = `${window.location.origin}/establecimientos/${stablishment.id}`
    const shareText = `Mirá las canchas que encontré en CanchApp: ${stablishment.name}`
    const [copied, setCopied] = useState(false)
    const handleCopy = async () => {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 1500)
    }
  
    useEffect(() => {
        const handleClickOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
            onClose()
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose])

    return (
        <div
        className="position-absolute"
        ref={ref}
        style={{
            top: "40px",
            left: "10px",
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            zIndex: 10,
            display: "flex",
            gap: "8px",
        }}>
            <h5>Compartir por:</h5>
            <WhatsappShareButton url={shareUrl} title={shareText}>
                <WhatsappIcon size={32} round/>
            </WhatsappShareButton>

            {/* Placeholder for Instagram */}
            <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="Compartí en Instagram"
            >
                <img
                src="/icons8-instagram-32.png"
                alt="Instagram"
                style={{ borderRadius: "50%" }}
                />
            </a>

            <FacebookShareButton url={shareUrl} quote={shareText}>
                <FacebookIcon size={32} round/>
            </FacebookShareButton>

            <TwitterShareButton url={shareUrl} title={shareText}>
                <XIcon size={32} round />
            </TwitterShareButton>

            <TelegramShareButton url={shareUrl} title={shareText}>
                <TelegramIcon size={32} round />
            </TelegramShareButton>

            <ThreadsShareButton url={shareUrl} title={shareText}>
                <ThreadsIcon size={32} round/>
            </ThreadsShareButton>

            {/*Copy Link button*/}
            <button
                onClick={handleCopy}
                style={{
                    border: "none",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                title="Copiar enlace"
            >
                <img src="/icons8-copiar-enlace-40.png" alt="copiar enlace" />
            </button>
            {copied && <span style={{ fontSize: "0.8rem", color: "green" }}>¡Copiado!</span>}
        </div>
  )
}
