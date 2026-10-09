import React from 'react'
import { Link } from 'react-router-dom'

export const SportFieldReservationCardComponent = ({
    sportField,
    reservations= [],
    slots= [],
    handleCancelReservation,
    getRowClass
}) => {
  return (
    <div className='card shadow-sm mb-4'>
        {/* HEADER */}
        <div className='card-header text-center'
        style={{ backgroundColor: "var(--bs-primary)",
                color: "white"
        }}>
            <h3 className='mb-0'>
                {sportField.name}
            </h3>
            
        </div>

        <div className='card-body'>
            {/*  RESERVATIONS */}
            <section className='mb-4'>
                <h4>
                    Reservas
                </h4>

                {reservations.length === 0 ? (
                    <div className='alert alert-light text-center mb-0'>
                        No hay Reservas todavia...
                    </div>
                ): (
                    <div className="table-responsive">
                            <table className="table table-striped table-hover align-middle mb-0">

                                <thead>
                                    <tr>
                                        <th className="text-center">
                                            Hora de entrada
                                        </th>

                                        <th className="text-center">
                                            Hora de finalización
                                        </th>

                                        <th className="text-center">
                                            Usuario
                                        </th>

                                        <th className="text-center">
                                            Estado
                                        </th>

                                        <th className="text-center">
                                            Acción
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {reservations.map((reservation) => (

                                        <tr
                                            key={reservation.id}
                                            className={getRowClass(
                                                reservation.reservationStatus
                                            )}
                                        >

                                            <td className="text-center">
                                                {reservation.beginingHour}
                                            </td>

                                            <td className="text-center">
                                                {reservation.finishingHour}
                                            </td>

                                            <td className="text-center">
                                                {reservation.userName}
                                            </td>

                                            <td className="text-center">
                                                {reservation.reservationStatus}
                                            </td>

                                            <td className="text-center">

                                                {reservation.reservationStatus === "CONFIRMED" && (

                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() =>
                                                            handleCancelReservation(reservation)
                                                        }
                                                    >
                                                        Cancelar
                                                    </button>

                                                )}

                                            </td>

                                        </tr>
                ))}
                                </tbody>

                            </table>
                        </div>
                        

                    )}
                    
            </section>

             {/* Turnos libres */}
                <section>

                    <h4 className="mb-3">
                        Turnos libres
                    </h4>

                    {slots.length === 0 ? (
                        <>
                        
                            <div className="alert alert-light text-center mb-0">
                                No hay turnos libres para este día.
                                
                            </div>
                            <div className='text-center mt-4'>
                            <Link to={`/administracion/canchas/editar/${sportField.id}/crear_reservas`}>
                                <button className='btn btn-primary btn-lg'>
                                        Agregar Turnos
                                    </button>
                            </Link>
                            </div>
                            
                        </>

                    ) : (

                        <div className="table-responsive">
                            <table className="table table-striped table-hover align-middle mb-0">

                                <thead>
                                    <tr>
                                        <th className="text-center">
                                            Hora de entrada
                                        </th>

                                        <th className="text-center">
                                            Hora de finalización
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {slots.map((slot) => (

                                        <tr key={slot.id}>

                                            <td className="text-center">
                                                {slot.startTime}
                                            </td>

                                            <td className="text-center">
                                                {slot.finishTime}
                                            </td>

                                        </tr>

                                    ))}
                                </tbody>

                            </table>
                            
                            <div className='text-center mt-4'>
                            <Link to={`/administracion/canchas/editar/${sportField.id}/crear_reservas`}>
                                <button className='btn btn-primary btn-lg'>
                                        Agregar Turnos
                                    </button>
                            </Link>
                            </div>
                        </div>

                    )}

                </section>
        </div> 


    </div>
  )
}
