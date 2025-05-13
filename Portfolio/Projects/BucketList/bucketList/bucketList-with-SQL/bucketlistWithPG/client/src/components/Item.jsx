import { FaTrash } from 'react-icons/fa'

const Item = ({_id, description = "Retire",  isComplete = false, onDelete, onToggleComplete}) => {
  return (
    <li>
      <div className="list-item">
        <span className="item-title">{description}</span>
        <span 
          className="item-status" 
          onClick={() => onToggleComplete(_id)}
          style={{
            cursor: "pointer",
            color: isComplete ? "green" : "red"
          }}
        >
          { isComplete ? "Completed" : "Not Completed"}
        </span>
        <button className="delete-button" onClick={() => onDelete(_id)}>
          <FaTrash />
        </button>
      </div>
    </li>
  )
}

// Item.defaultProps ={
//   description: "Doggy Horse"
// }

export default Item


