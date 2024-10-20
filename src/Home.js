import React, { useState, useEffect, useRef, useCallback } from "react";

const initialColumns = {
  pending: { id: "pending", title: "Pending", items: [] },
  inProgress: { id: "inProgress", title: "In Progress", items: [] },
  completed: { id: "completed", title: "Completed", items: [] },
};

const Page = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [newItemText, setNewItemText] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [dragging, setDragging] = useState(null);
  const dragItem = useRef(null);
  const dragNode = useRef(null);

  // Load saved columns from localStorage when the page loads

  useEffect(() => {
    const savedItem = localStorage.getItem("todoColumn")
    if(savedItem) {
        try {
            setColumns(JSON.parse(savedItem))
        } catch (error) {
            console.log("Can't get items saved",error)
        }
    }
},[])

useEffect(() => {
try {
    localStorage.setItem("todoColumn",JSON.stringify(columns))
    
} catch (error) {
    console.log("Error occured tring to save items", error)
}
return() => {
    localStorage.removeItem("todoColumn")
}
},[columns])

  const handleDragStart = useCallback((e, item, columnId) => {
      dragItem.current = { item, columnId };
      dragNode.current = e.target;
    //   console.log(dragNode.current)
    dragNode.current.addEventListener("dragend", handleDragEnd);
    setTimeout(() => {
      setDragging(item);
    }, 0);
  }, []);

  const handleDragEnter = useCallback((e, targetColumnId) => {
    setColumns((prevColumns) => {
      const newColumns = { ...prevColumns };
      const sourceColumnId = dragItem.current?.columnId;

      const sourceColumn = newColumns[sourceColumnId];
      const targetColumn = newColumns[targetColumnId];

      sourceColumn.items = sourceColumn.items.filter(
        (item) => item.id !== dragItem.current.item.id
      );
      targetColumn.items.push(dragItem.current.item);

      dragItem.current = { ...dragItem.current, columnId: targetColumnId };
      return newColumns;
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragging(null);
    if (dragNode.current) {
      dragNode.current.removeEventListener("dragend", handleDragEnd);
    }
    dragItem.current = null;
    dragNode.current = null;
  }, []);

  const addNewItem = useCallback(() => {
    if (newItemText.trim() !== "") {
      const newItem = {
        id: crypto.randomUUID(),
        content: newItemText,
      };
      setColumns((prevColumns) => ({
        ...prevColumns,
        pending: {
          ...prevColumns.pending,
          items: [...prevColumns.pending.items, newItem],
        },
      }));
      setNewItemText("");
    }
  }, [newItemText]);

  const startEditing = useCallback((item) => {
    setEditingItemId(item.id);
    setEditingText(item.content);
  }, []);

  const saveEditedItem = useCallback(
    (item, columnId) => {
      setColumns((prevColumns) => {
        const newColumns = { ...prevColumns };
        const column = newColumns[columnId];
        const itemIndex = column.items.findIndex((i) => i.id === item.id);
        column.items[itemIndex].content = editingText;
        return newColumns;
      });
      setEditingItemId(null);
    },
    [editingText]
  );

  const deleteItem = useCallback((item, columnId) => {
    setColumns((prevColumns) => {
      const newColumns = { ...prevColumns };
      const column = newColumns[columnId];
      column.items = column.items.filter((i) => i.id !== item.id);
      return newColumns;
    });
  }, []);

  const getItemStyles = useCallback(
    (item) => {
      if (dragging && item && dragging.id === item.id) {
        return "bg-gray-300 opacity-50 p-2 mb-2 rounded shadow cursor-move";
      }
      return "bg-white p-2 mb-2 rounded shadow cursor-move text-black";
    },
    [dragging]
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Mini Trello Board</h1>
      <div className="mb-4">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          className="border p-2 mr-2 text-black"
          placeholder="New item"
        />
        <button
          onClick={addNewItem}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Item
        </button>
      </div>
      <div className="flex space-x-4">
        {Object.values(columns).map((column) => (
          <div
            key={column.id}
            className="bg-gray-100 p-4 rounded-lg w-64"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDragEnter(e, column.id)}
          >
            <h2 className="font-bold mb-2 text-gray-600">{column.title}</h2>
            <ul>
              {column.items.map((item) => (
                <li
                  key={item.id}
                  draggable
                  ref={dragItem}
                  onDragStart={(e) => handleDragStart(e, item, column.id)}
                  className={getItemStyles(item)}
                >
                  {editingItemId === item.id ? (
                    <div>
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="border p-2 mb-2 text-black"
                      />
                      <button
                        onClick={() => saveEditedItem(item, column.id)}
                        className="bg-green-500 text-white px-2 py-1 mr-2 rounded"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span>{item.content}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditing(item)}
                          className="text-blue-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteItem(item, column.id)}
                          className="text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
