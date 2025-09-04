import React from 'react'

export const FooterComponent = () => {
  return (
    <nav className="navbar shadow"
    style={{
        "backgroundColor" : "var(--bs-primary)",
        zIndex : "-100"}}>
        <div class="container-fluid d-flex justify-content-between align-items-center text-white">
            <span>©2025 CanchApp</span>
            <div className='d-flex gap-3'>
                <a className="navbar-brand" href="#">
                    <img src="/icons8-instagram-32.png" alt="Instagram" />
                </a>
                <a className="navbar-brand" href="#">
                    <img src="/icons8-facebook-nuevo-32.png" alt="facebook" />
                </a>
                <a className="navbar-brand" href="#">
                    <img src="/icons8-x-32.png" alt="x" />
                </a>
            </div>
        </div>
    </nav>
  )
}
