import { Button } from 'react-bootstrap'

function BotonEliminar({ onClick }) {
  return (
    <Button variant={null} size="sm" className="btn-eliminar" onClick={onClick}>
      Eliminar
    </Button>
  )
}

export default BotonEliminar
