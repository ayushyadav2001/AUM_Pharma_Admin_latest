import React, { useState } from 'react';

import axios from 'axios';

import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


const ItemType = 'ROW'; // Define the item type for drag and drop

// Single row component
const DraggableRow = ({ category, index, moveRow }: any) => {
  const [, refDrop] = useDrop({
    accept: ItemType,
    hover(item: any) {
      if (item.index !== index) {
        moveRow(item.index, index);
        item.index = index;
      }
    },
  });

  const [{ isDragging }, refDrag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.5 : 1;

  return (
    <div

      // ref={(node) => drag(ref(node))}


      style={{
        opacity,
        border: '2px dashed #ccc',
        padding: '10px',
        backgroundColor: 'white',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        cursor: '',
      }}
    >
      <i ref={(node) => {
        refDrag(node);
        refDrop(node);
      }} style={{ marginRight: '10px', cursor: 'move' }} className="ri-grid-fill"></i>

      <span>{category.category.name}</span>
    </div>
  );
};

const BannerCategoryIndexing = ({ tableData }: { tableData?: any[] }) => {
  const [categories, setCategories] = useState(tableData || []);

  // Function to handle moving the rows
  const moveRow = (fromIndex: number, toIndex: number) => {
    const updatedCategories = [...categories];
    const [movedItem] = updatedCategories.splice(fromIndex, 1);

    updatedCategories.splice(toIndex, 0, movedItem);


    const categoriesWithNewIndex = updatedCategories.map((category, index) => ({
      ...category,
      newIndex: index + 1, // Assign index starting from 1
    }));


    setCategories(updatedCategories);

    updateCategoryIndexes(categoriesWithNewIndex);
    console.log("categoriesWithNewIndex", categoriesWithNewIndex)
  };



  const updateCategoryIndexes = async (updatedCategories: any[]) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category/update-index-banner`, { categories: updatedCategories }, {
        withCredentials: true
      });
      console.log('Category indexes updated successfully');
    } catch (error) {
      console.error('Error updating category indexes:', error);
    }
  };

  // useEffect(() => {
  //   updateCategoryIndexes();
  // }, [categories]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h5> Change Listing Banner Categories Positions</h5>
        {categories.map((category, index) => (
          <DraggableRow
            key={category.index}
            category={category}
            index={index}
            moveRow={moveRow}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default BannerCategoryIndexing;
