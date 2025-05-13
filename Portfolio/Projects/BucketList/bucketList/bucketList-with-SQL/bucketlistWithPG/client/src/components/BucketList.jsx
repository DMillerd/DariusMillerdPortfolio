import Item from './Item';

const BucketList = ({ list, onDelete, onToggleComplete }) => {

  if(!list || list.length == 0){
    return <p>No Bucket List Items Yet!</p>
  }

  //Iterate over our array of objects and call our item component for each one and pass its data down.
  const renderListItems = list.map(item => {
    return <Item key={item._id} {...item} onDelete={onDelete} onToggleComplete={onToggleComplete} />
  })

  return (
    <div className="item-content">
      <ol>
        {renderListItems}
      </ol>
    </div>
  )
}

export default BucketList