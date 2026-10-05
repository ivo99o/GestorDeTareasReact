import { Button } from 'react-bootstrap'

function BotonEditar({ onClick }) {
  return (
    <Button variant={null} size="sm" className="btn-editar" onClick={onClick}>
      Editar
    </Button>
  )
}

export default BotonEditar
